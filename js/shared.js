const sharedDiv = document.getElementById('shared-recipe');

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function loadShared() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    sharedDiv.innerHTML = `<p class="hint">${t('shared.notFound')}</p>`;
    return;
  }

  const { data, error } = await supabaseClient.rpc('get_shared_recipe', { recipe_id_input: parseInt(id, 10) });

  if (error || !data) {
    sharedDiv.innerHTML = `<p class="hint">${t('shared.notFound')}</p>`;
    return;
  }

  const r = data;
  const ings = (r.ingredients || []).map(ri => {
    const amt = [ri.amount, ri.unit].filter(Boolean).join(' ');
    return `<li>${amt ? `<strong>${escapeHtml(amt)}</strong> ` : ''}${escapeHtml(ri.name || '')}</li>`;
  }).join('');

  sharedDiv.innerHTML = `
    <article class="recipe">
      <div class="recipe-header">
        <h3>${escapeHtml(r.title)}</h3>
      </div>
      <p class="recipe-meta">
        ${t('list.serves')} ${r.servings || '?'}
        ${r.cook_time_minutes ? ` · ⏱️ ${r.cook_time_minutes} ${t('list.minutes')}` : ''}
      </p>
      <h4>${t('list.ingredients')}</h4>
      <ul>${ings}</ul>
      ${r.steps ? `<h4>${t('list.stepsLabel')}</h4><pre class="steps">${escapeHtml(r.steps)}</pre>` : ''}
      <button id="add-shared-btn" style="margin-top:1rem;">${t('shared.addBtn')}</button>
      <p id="add-shared-message" style="margin-top:0.5rem;"></p>
    </article>
  `;

  document.getElementById('add-shared-btn').addEventListener('click', () => addToMyRecipes(r));
}

async function addToMyRecipes(recipe) {
  const msgEl = document.getElementById('add-shared-message');
  const btn = document.getElementById('add-shared-btn');
  btn.disabled = true;
  msgEl.textContent = t('shared.adding');
  msgEl.style.color = '#10b981';

  const { data: userData } = await supabaseClient.auth.getUser();
  const userId = userData.user.id;

  // Insert recipe
  const { data: newRec, error: e1 } = await supabaseClient
    .from('recipes')
    .insert({
      user_id: userId,
      title: recipe.title,
      servings: recipe.servings,
      cook_time_minutes: recipe.cook_time_minutes,
      steps: recipe.steps
    })
    .select()
    .single();

  if (e1) {
    msgEl.textContent = e1.message;
    msgEl.style.color = '#d63031';
    btn.disabled = false;
    return;
  }

  // Insert each ingredient (using upsert-style logic)
  const ingredients = recipe.ingredients || [];
  for (let i = 0; i < ingredients.length; i++) {
    const ing = ingredients[i];
    const name = (ing.name || '').trim().toLowerCase();
    if (!name) continue;

    let { data: existing } = await supabaseClient
      .from('ingredients')
      .select('id')
      .eq('name', name)
      .maybeSingle();

    let ingredientId;
    if (existing) {
      ingredientId = existing.id;
    } else {
      const { data: newIng, error: ne } = await supabaseClient
        .from('ingredients')
        .insert({ name })
        .select('id')
        .single();
      if (ne) continue;
      ingredientId = newIng.id;
    }

    await supabaseClient.from('recipe_ingredients').insert({
      recipe_id: newRec.id,
      ingredient_id: ingredientId,
      amount: ing.amount || null,
      unit: ing.unit || null,
      position: i
    });
  }

  msgEl.innerHTML = `${t('shared.added')} <a href="app.html">${t('shared.viewMine')}</a>`;
}

setTimeout(loadShared, 300);
