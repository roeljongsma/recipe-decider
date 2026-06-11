const pickerDiv = document.getElementById('recipe-picker');
const listCard = document.getElementById('list-card');
const outputDiv = document.getElementById('shopping-output');
const generateBtn = document.getElementById('generate-btn');
const selectAllBtn = document.getElementById('select-all-btn');
const deselectAllBtn = document.getElementById('deselect-all-btn');
const copyBtn = document.getElementById('copy-list-btn');
const printBtn = document.getElementById('print-list-btn');
const copyFeedback = document.getElementById('copy-feedback');

let allRecipes = [];
let selectedRecipeIds = new Set();

const CATEGORY_ORDER = ['carbs', 'protein', 'vegetable', 'fruit', 'dairy', 'spice', 'condiment', 'other'];

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Try to compute a total when all entries use the same unit and have parseable numeric amounts.
// Otherwise just join with " + ".
function computeAmountsText(entries) {
  // Build the parts list, e.g. ["500 g", "200 g"]
  const parts = entries
    .map(e => [e.amount, e.unit].filter(Boolean).join(' ').trim())
    .filter(Boolean);

  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];

  // Try to total: all entries must have the same (lowercased) unit and a numeric amount
  const unit = (entries[0].unit || '').trim().toLowerCase();
  let canTotal = true;
  let total = 0;

  for (const e of entries) {
    const u = (e.unit || '').trim().toLowerCase();
    if (u !== unit) { canTotal = false; break; }
    const num = parseAmount(e.amount);
    if (num === null) { canTotal = false; break; }
    total += num;
  }

  const joined = parts.join(' + ');
  if (canTotal && total > 0) {
    // Format total nicely: drop trailing zeros
    const totalStr = formatNumber(total) + (unit ? ' ' + entries[0].unit : '');
    return `${joined} (= ${totalStr})`;
  }
  return joined;
}

function parseAmount(amount) {
  if (!amount) return null;
  const s = String(amount).trim().replace(',', '.');
  // Handle simple fractions like "1/2"
  if (/^\d+\/\d+$/.test(s)) {
    const [a, b] = s.split('/').map(Number);
    return b ? a / b : null;
  }
  // Handle mixed numbers like "1 1/2"
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    return parseInt(mixed[1], 10) + parseInt(mixed[2], 10) / parseInt(mixed[3], 10);
  }
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function formatNumber(n) {
  // Round to 2 decimals, strip trailing zeros
  return parseFloat(n.toFixed(2)).toString();
}

async function loadRecipes() {
  const { data, error } = await supabaseClient
    .from('recipes')
    .select(`
      id, title, servings, cook_time_minutes,
      recipe_ingredients (
        amount, unit, position,
        ingredients ( id, name, category )
      )
    `)
    .order('title');

  if (error) {
    pickerDiv.innerHTML = 'Error: ' + error.message;
    return;
  }
  allRecipes = data || [];
  renderPicker();
}

function renderPicker() {
  if (allRecipes.length === 0) {
    pickerDiv.innerHTML = `<p class="hint">${t('shopping.noRecipes')}</p>`;
    return;
  }

  pickerDiv.innerHTML = `
    <div class="recipe-picker-grid">
      ${allRecipes.map(r => `
        <label class="picker-card ${selectedRecipeIds.has(r.id) ? 'picker-on' : ''}">
          <input type="checkbox" data-id="${r.id}" ${selectedRecipeIds.has(r.id) ? 'checked' : ''} />
          <div class="picker-info">
            <strong>${escapeHtml(r.title)}</strong>
            <span class="picker-meta">
              ${t('list.serves')} ${r.servings || '?'}
              ${r.cook_time_minutes ? ` · ⏱️ ${r.cook_time_minutes} ${t('list.minutes')}` : ''}
            </span>
          </div>
        </label>
      `).join('')}
    </div>
  `;

  pickerDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = +cb.dataset.id;
      if (cb.checked) selectedRecipeIds.add(id);
      else selectedRecipeIds.delete(id);
      cb.closest('.picker-card').classList.toggle('picker-on', cb.checked);
    });
  });
}

selectAllBtn.addEventListener('click', () => {
  allRecipes.forEach(r => selectedRecipeIds.add(r.id));
  renderPicker();
});
deselectAllBtn.addEventListener('click', () => {
  selectedRecipeIds.clear();
  renderPicker();
});

generateBtn.addEventListener('click', () => {
  if (selectedRecipeIds.size === 0) {
    listCard.style.display = 'block';
    outputDiv.innerHTML = `<p class="hint">${t('shopping.empty')}</p>`;
    return;
  }
  buildList();
});

function buildList() {
  const map = new Map();
  const selected = allRecipes.filter(r => selectedRecipeIds.has(r.id));

  selected.forEach(r => {
    (r.recipe_ingredients || []).forEach(ri => {
      const ing = ri.ingredients;
      if (!ing) return;
      const key = ing.name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: ing.name,
          category: ing.category || 'other',
          entries: []
        });
      }
      map.get(key).entries.push({
        amount: ri.amount,
        unit: ri.unit,
        recipeTitle: r.title
      });
    });
  });

  const grouped = {};
  for (const item of map.values()) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  Object.values(grouped).forEach(arr => arr.sort((a,b) => a.name.localeCompare(b.name)));

  const cats = [
    ...CATEGORY_ORDER.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !CATEGORY_ORDER.includes(c))
  ];

  listCard.style.display = 'block';
  outputDiv.innerHTML = cats.map(cat => `
    <div class="shopping-group">
      <h3>${t('cat.' + cat) || cat}</h3>
      <ul class="shopping-list">
        ${grouped[cat].map(item => {
const amountsText = computeAmountsText(item.entries);
          const recipeNames = [...new Set(item.entries.map(e => e.recipeTitle))].join(', ');
          return `
            <li>
              <label class="shopping-item">
                <input type="checkbox" />
                <span class="shopping-name">${escapeHtml(item.name)}</span>
                ${amountsText ? `<span class="shopping-amounts">${escapeHtml(amountsText)}</span>` : ''}
                <span class="shopping-from">${t('shopping.fromRecipes')}: ${escapeHtml(recipeNames)}</span>
              </label>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
  `).join('');

  listCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

copyBtn.addEventListener('click', async () => {
  const groups = outputDiv.querySelectorAll('.shopping-group');
  let text = '';
  groups.forEach(g => {
    const heading = g.querySelector('h3').textContent;
    text += heading + '\n';
    g.querySelectorAll('.shopping-item').forEach(li => {
      const name = li.querySelector('.shopping-name').textContent;
      const amounts = li.querySelector('.shopping-amounts')?.textContent || '';
      text += '  - ' + name + (amounts ? ' (' + amounts + ')' : '') + '\n';
    });
    text += '\n';
  });

  try {
    await navigator.clipboard.writeText(text.trim());
    copyFeedback.textContent = t('shopping.copied');
    copyFeedback.style.color = '#10b981';
  } catch (err) {
    copyFeedback.textContent = 'Copy failed.';
    copyFeedback.style.color = '#d63031';
  }
});

printBtn.addEventListener('click', () => {
  window.print();
});

window.addEventListener('langChanged', () => {
  renderPicker();
  if (selectedRecipeIds.size > 0 && listCard.style.display !== 'none') {
    buildList();
  }
});

setTimeout(loadRecipes, 300);
