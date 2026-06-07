const filtersDiv = document.getElementById('filters');
const resultsDiv = document.getElementById('results');
const matchCountEl = document.getElementById('match-count');
const randomBtn = document.getElementById('random-btn');
const clearBtn = document.getElementById('clear-filters-btn');
const modal = document.getElementById('random-modal');
const modalClose = document.getElementById('modal-close');
const randomContent = document.getElementById('random-recipe-content');

let allRecipes = [];          // user's recipes with ingredients
let allIngredients = [];      // unique ingredients used in user's recipes (with category)
let selectedIngredientIds = new Set();

const CATEGORY_LABELS = {
  carbs: '🍞 Carbs',
  protein: '🥩 Protein',
  vegetable: '🥦 Vegetables',
  fruit: '🍎 Fruits',
  dairy: '🥛 Dairy',
  spice: '🌶️ Herbs & Spices',
  condiment: '🫙 Sauces & Condiments',
  other: '📦 Other'
};

const CATEGORY_ORDER = ['carbs', 'protein', 'vegetable', 'fruit', 'dairy', 'spice', 'condiment', 'other'];

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ===== LOAD DATA =====
async function loadData() {
  const { data, error } = await supabaseClient
    .from('recipes')
    .select(`
      id, title, servings, steps, created_at,
      recipe_ingredients (
        amount, unit, position,
        ingredients ( id, name, category )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    filtersDiv.innerHTML = 'Error: ' + error.message;
    return;
  }
  allRecipes = data || [];

  // Build unique ingredient list from user's recipes
  const seen = new Map();
  allRecipes.forEach(r => {
    (r.recipe_ingredients || []).forEach(ri => {
      const ing = ri.ingredients;
      if (ing && !seen.has(ing.id)) {
        seen.set(ing.id, ing);
      }
    });
  });
  allIngredients = Array.from(seen.values());

  renderFilters();
  applyFilters();
}

// ===== RENDER FILTERS =====
function renderFilters() {
  if (allIngredients.length === 0) {
    filtersDiv.innerHTML = '<p class="hint">No ingredients yet. <a href="app.html">Add some recipes</a> first!</p>';
    return;
  }

  // Group by category
  const grouped = {};
  allIngredients.forEach(ing => {
    const cat = ing.category || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(ing);
  });

  // Sort within each group alphabetically
  Object.values(grouped).forEach(arr => arr.sort((a,b) => a.name.localeCompare(b.name)));

  // Render in defined order, then any unknown categories last
  const cats = [...CATEGORY_ORDER.filter(c => grouped[c]), ...Object.keys(grouped).filter(c => !CATEGORY_ORDER.includes(c))];

  filtersDiv.innerHTML = cats.map(cat => `
    <div class="filter-group">
      <h3>${CATEGORY_LABELS[cat] || cat}</h3>
      <div class="filter-chips">
        ${grouped[cat].map(ing => `
          <label class="chip ${selectedIngredientIds.has(ing.id) ? 'chip-on' : ''}">
            <input type="checkbox" data-id="${ing.id}" ${selectedIngredientIds.has(ing.id) ? 'checked' : ''} />
            ${escapeHtml(ing.name)}
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Wire up checkboxes
  filtersDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = +cb.dataset.id;
      if (cb.checked) selectedIngredientIds.add(id);
      else selectedIngredientIds.delete(id);
      // Toggle visual state
      cb.closest('.chip').classList.toggle('chip-on', cb.checked);
      applyFilters();
    });
  });
}

// ===== APPLY FILTERS =====
function applyFilters() {
  let matching = allRecipes;
  if (selectedIngredientIds.size > 0) {
    matching = allRecipes.filter(r => {
      const recipeIngIds = new Set((r.recipe_ingredients || []).map(ri => ri.ingredients?.id).filter(Boolean));
      // ALL selected ingredients must be present in recipe
      for (const id of selectedIngredientIds) {
        if (!recipeIngIds.has(id)) return false;
      }
      return true;
    });
  }
  renderResults(matching);
}

// ===== RENDER RESULTS =====
function renderResults(recipes) {
  matchCountEl.textContent = recipes.length;
  if (recipes.length === 0) {
    resultsDiv.innerHTML = '<p class="hint">No recipes match these filters.</p>';
    return;
  }
  resultsDiv.innerHTML = recipes.map(r => `
    <article class="recipe">
      <div class="recipe-header">
        <h3>${escapeHtml(r.title)}</h3>
      </div>
      <p class="recipe-meta">Serves ${r.servings || '?'} · ${(r.recipe_ingredients || []).length} ingredients</p>
      <details>
        <summary>Ingredients</summary>
        <ul>
          ${(r.recipe_ingredients || [])
            .sort((a,b) => (a.position||0) - (b.position||0))
            .map(ri => {
              const amt = [ri.amount, ri.unit].filter(Boolean).join(' ');
              return `<li>${amt ? `<strong>${escapeHtml(amt)}</strong> ` : ''}${escapeHtml(ri.ingredients?.name || '')}</li>`;
            }).join('')}
        </ul>
      </details>
      ${r.steps ? `<details><summary>Steps</summary><pre class="steps">${escapeHtml(r.steps)}</pre></details>` : ''}
    </article>
  `).join('');
}

// ===== RANDOMIZER =====
randomBtn.addEventListener('click', () => {
  // Pick random from currently filtered set, or from all if no filters active
  let pool = allRecipes;
  if (selectedIngredientIds.size > 0) {
    pool = allRecipes.filter(r => {
      const recipeIngIds = new Set((r.recipe_ingredients || []).map(ri => ri.ingredients?.id).filter(Boolean));
      for (const id of selectedIngredientIds) {
        if (!recipeIngIds.has(id)) return false;
      }
      return true;
    });
  }
  if (pool.length === 0) {
    alert('No recipes to pick from! Add some recipes or clear your filters.');
    return;
  }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  showRandomRecipe(pick);
});

function showRandomRecipe(r) {
  const ings = (r.recipe_ingredients || [])
    .sort((a,b) => (a.position||0) - (b.position||0))
    .map(ri => {
      const amt = [ri.amount, ri.unit].filter(Boolean).join(' ');
      return `<li>${amt ? `<strong>${escapeHtml(amt)}</strong> ` : ''}${escapeHtml(ri.ingredients?.name || '')}</li>`;
    }).join('');

  randomContent.innerHTML = `
    <h2>🎲 Tonight you're cooking…</h2>
    <h3 class="random-title">${escapeHtml(r.title)}</h3>
    <p class="recipe-meta">Serves ${r.servings || '?'}</p>
    <h4>Ingredients</h4>
    <ul>${ings}</ul>
    ${r.steps ? `<h4>Steps</h4><pre class="steps">${escapeHtml(r.steps)}</pre>` : ''}
    <button id="reroll-btn" class="btn-secondary" style="margin-top:1rem;">🎲 Try another</button>
  `;
  modal.classList.remove('hidden');
  document.getElementById('reroll-btn').addEventListener('click', () => randomBtn.click());
}

modalClose.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

// ===== CLEAR FILTERS =====
clearBtn.addEventListener('click', () => {
  selectedIngredientIds.clear();
  renderFilters();
  applyFilters();
});

// Wait for session check, then load
setTimeout(loadData, 300);
