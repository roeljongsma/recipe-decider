const recipeForm = document.getElementById('recipe-form');
const titleInput = document.getElementById('recipe-title');
const servingsInput = document.getElementById('recipe-servings');
const stepsInput = document.getElementById('recipe-steps');
const pasteArea = document.getElementById('ingredients-paste');
const parseBtn = document.getElementById('parse-btn');
const parsedDiv = document.getElementById('parsed-ingredients');
const messageEl = document.getElementById('recipe-message');
const recipesList = document.getElementById('recipes-list');

let parsedIngredients = [];

function parseLine(line) {
  line = line.trim();
  if (!line) return null;
  const match = line.match(/^([\d./]+)\s*([a-zA-Z]*)\s+(.*)$/);
  if (match) {
    const [, amount, unit, rest] = match;
    const knownUnits = ['g','kg','ml','l','tsp','tbsp','cup','cups','clove','cloves','slice','slices','piece','pieces','can','cans','pinch','oz','lb','teentje','teentjes','snufje','plak','plakken','blik','blikken'];
    if (knownUnits.includes(unit.toLowerCase())) {
      return { amount, unit, name: rest.trim() };
    } else {
      return { amount, unit: '', name: (unit + ' ' + rest).trim() };
    }
  }
  return { amount: '', unit: '', name: line };
}

parseBtn.addEventListener('click', () => {
  const lines = pasteArea.value.split('\n');
  parsedIngredients = lines.map(parseLine).filter(Boolean);
  renderParsed();
});

function renderParsed() {
  if (parsedIngredients.length === 0) {
    parsedDiv.innerHTML = `<p class="hint">${t('parsed.empty')}</p>`;
    return;
  }
  parsedDiv.innerHTML = `
    <table class="ingredients-table">
      <thead><tr>
        <th>${t('parsed.amount')}</th>
        <th>${t('parsed.unit')}</th>
        <th>${t('parsed.name')}</th>
        <th></th>
      </tr></thead>
      <tbody>
        ${parsedIngredients.map((ing, i) => `
          <tr>
            <td><input type="text" value="${escapeHtml(ing.amount)}" data-i="${i}" data-field="amount" /></td>
            <td><input type="text" value="${escapeHtml(ing.unit)}" data-i="${i}" data-field="unit" /></td>
            <td><input type="text" value="${escapeHtml(ing.name)}" data-i="${i}" data-field="name" /></td>
            <td><button type="button" class="btn-tiny" data-remove="${i}">✕</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <button type="button" class="btn-secondary" id="add-ingredient-btn">${t('parsed.addIngredient')}</button>
  `;

  parsedDiv.querySelectorAll('input[data-i]').forEach(inp => {
    inp.addEventListener('input', e => {
      const i = +e.target.dataset.i;
      const f = e.target.dataset.field;
      parsedIngredients[i][f] = e.target.value;
    });
  });
  parsedDiv.querySelectorAll('button[data-remove]').forEach(btn => {
    btn.addEventListener('click', e => {
      const i = +e.target.dataset.remove;
      parsedIngredients.splice(i, 1);
      renderParsed();
    });
  });
  document.getElementById('add-ingredient-btn').addEventListener('click', () => {
    parsedIngredients.push({ amount: '', unit: '', name: '' });
    renderParsed();
  });
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function showMessage(text, isError = true) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? '#b00' : '#2d7a46';
}

recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const servings = parseInt(servingsInput.value, 10);
  const steps = stepsInput.value.trim();

  if (!title) { showMessage(t('recipe.titleMissing')); return; }

  if (pasteArea.value.trim() !== '' && parsedIngredients.length === 0) {
    showMessage(t('recipe.unparsed'));
    return;
  }

  const ingredientsToSave = parsedIngredients.filter(i => i.name && i.name.trim() !== '');

  if (ingredientsToSave.length === 0) {
    showMessage(t('recipe.noIngredients'));
    return;
  }

  showMessage(t('recipe.saving'), false);

  const { data: userData } = await supabaseClient.auth.getUser();
  const userId = userData.user.id;

  const { data: recipeData, error: recipeError } = await supabaseClient
    .from('recipes')
    .insert({ user_id: userId, title, servings, steps })
    .select()
    .single();

  if (recipeError) { showMessage(recipeError.message); return; }
  const recipeId = recipeData.id;

  for (let i = 0; i < ingredientsToSave.length; i++) {
    const ing = ingredientsToSave[i];
    const name = ing.name.trim().toLowerCase();

    let { data: existing } = await supabaseClient
      .from('ingredients')
      .select('id')
      .eq('name', name)
      .maybeSingle();

    let ingredientId;
    if (existing) {
      ingredientId = existing.id;
    } else {
      const { data: newIng, error: newErr } = await supabaseClient
        .from('ingredients')
        .insert({ name })
        .select('id')
        .single();
      if (newErr) { showMessage('Ingredient error: ' + newErr.message); return; }
      ingredientId = newIng.id;
    }

    await supabaseClient.from('recipe_ingredients').insert({
      recipe_id: recipeId,
      ingredient_id: ingredientId,
      amount: ing.amount || null,
      unit: ing.unit || null,
      position: i
    });
  }

  showMessage(t('recipe.saved'), false);
  recipeForm.reset();
  servingsInput.value = 2;
  parsedIngredients = [];
  parsedDiv.innerHTML = '';
  loadRecipes();
});

async function loadRecipes() {
  recipesList.innerHTML = t('list.loading');

  const { data: recipes, error } = await supabaseClient
    .from('recipes')
    .select(`
      id, title, servings, steps, created_at,
      recipe_ingredients (
        amount, unit, position,
        ingredients ( name, category )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) { recipesList.innerHTML = 'Error: ' + error.message; return; }
  if (!recipes || recipes.length === 0) {
    recipesList.innerHTML = `<p class="hint">${t('list.empty')}</p>`;
    return;
  }

  recipesList.innerHTML = recipes.map(r => {
    const ings = (r.recipe_ingredients || [])
      .sort((a,b) => (a.position||0) - (b.position||0))
      .map(ri => {
        const amt = [ri.amount, ri.unit].filter(Boolean).join(' ');
        return `<li>${amt ? `<strong>${escapeHtml(amt)}</strong> ` : ''}${escapeHtml(ri.ingredients?.name || '')}</li>`;
      }).join('');
    return `
      <article class="recipe">
        <div class="recipe-header">
          <h3>${escapeHtml(r.title)}</h3>
          <button class="btn-tiny" data-delete="${r.id}">${t('list.delete')}</button>
        </div>
        <p class="recipe-meta">${t('list.serves')} ${r.servings || '?'}</p>
        <details>
          <summary>${t('list.ingredients')} (${(r.recipe_ingredients || []).length})</summary>
          <ul>${ings}</ul>
        </details>
        ${r.steps ? `<details><summary>${t('list.stepsLabel')}</summary><pre class="steps">${escapeHtml(r.steps)}</pre></details>` : ''}
      </article>
    `;
  }).join('');

  recipesList.querySelectorAll('button[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm(t('list.confirmDelete'))) return;
      const id = btn.dataset.delete;
      const { error } = await supabaseClient.from('recipes').delete().eq('id', id);
      if (error) alert('Error: ' + error.message);
      else loadRecipes();
    });
  });
}

// Re-render dynamic content when language changes
window.addEventListener('langChanged', () => {
  if (parsedIngredients.length > 0 || parsedDiv.innerHTML) renderParsed();
  loadRecipes();
});

setTimeout(loadRecipes, 300);
