// ============================================
// I18N – Translations & language switching
// ============================================

const translations = {
  en: {
    // Top bar / general
    'app.title': '🍴 Munchoice',
    'app.tagline': 'Pick what to munch — from your own recipe stash.',
    'btn.logout': 'Logout',

    // Auth (index.html)
    'auth.heading': 'Login or Sign up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login': 'Login',
    'auth.signup': 'Sign up',
    'auth.fillFields': 'Please enter email and password.',
    'auth.signingUp': 'Signing up…',
    'auth.loggingIn': 'Logging in…',
    'auth.created': 'Account created! Check your email to confirm, then log in.',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetHeading': 'Reset your password',
    'auth.resetEmailLabel': 'Enter your email — we\'ll send a reset link.',
    'auth.sendReset': 'Send reset link',
    'auth.resetSent': 'Reset link sent! Check your email.',
    'auth.backToLogin': '← Back to login',
    'auth.newPasswordHeading': 'Set a new password',
    'auth.newPassword': 'New password',
    'auth.confirmPassword': 'Confirm new password',
    'auth.updatePassword': 'Update password',
    'auth.passwordMismatch': 'Passwords don\'t match.',
    'auth.passwordUpdated': 'Password updated! Redirecting…',
    'auth.passwordTooShort': 'Password must be at least 6 characters.',
    'auth.invalidResetLink': 'This reset link is invalid or expired. Please request a new one.',

    // Subnav
    'nav.recipes': '📚 My recipes',
    'nav.decide': '🎲 Decide what to eat',

    // Recipe form (app.html)
    'recipe.addHeading': '➕ Add a new recipe',
    'recipe.title': 'Title',
    'recipe.titlePlaceholder': 'e.g. Spaghetti Bolognese',
    'recipe.servings': 'For how many people',
    'recipe.cookTime': 'Total cooking time (minutes)',
    'recipe.cookTimePlaceholder': 'e.g. 30',
    'list.minutes': 'min',
    'recipe.pasteLabel': 'Paste ingredients (one per line)',
    'recipe.pastePlaceholder': 'e.g.\n500g pasta\n2 cloves garlic\n1 onion\nolive oil\nsalt and pepper',
    'recipe.parseBtn': 'Parse ingredients ↓',
    'recipe.steps': 'Steps to cook',
    'recipe.stepsPlaceholder': 'Step 1...\nStep 2...',
    'recipe.save': '💾 Save recipe',
    'recipe.titleMissing': 'Please enter a title.',
    'recipe.unparsed': 'You have unparsed ingredients. Click "Parse ingredients ↓" first.',
    'recipe.noIngredients': 'Please add at least one ingredient before saving.',
    'recipe.saving': 'Saving…',
    'recipe.saved': 'Recipe saved! ✅',

    // Parsed table
    'parsed.amount': 'Amount',
    'parsed.unit': 'Unit',
    'parsed.name': 'Name',
    'parsed.addIngredient': '+ Add ingredient',
    'parsed.empty': 'Paste some ingredients above and click Parse.',

    // Recipe list
    'list.heading': '📚 My recipes',
    'list.loading': 'Loading…',
    'list.empty': 'No recipes yet. Add your first one above!',
    'list.serves': 'Serves',
    'list.ingredients': 'Ingredients',
    'list.stepsLabel': 'Steps',
    'list.delete': '🗑️ Delete',
    'list.confirmDelete': 'Delete this recipe?',
    'list.searchPlaceholder': 'Search recipes or ingredients...',
    'list.noResults': 'No recipes match your search.',
    'list.edit': '✏️ Edit',
    'list.cancel': 'Cancel',
    'list.update': '💾 Update recipe',
    'list.updating': 'Updating…',
    'list.updated': 'Recipe updated! ✅',
    'list.editingHeading': '✏️ Editing recipe',

    // Decide page
    'decide.heading': "What's for dinner?",
    'decide.surpriseBtn': '🎲 Surprise me!',
    'decide.clearFilters': 'Clear filters',
    'decide.hint': 'Select ingredients you have (or want to use). Recipes that contain all selected ingredients will be shown.',
    'decide.loadingIngredients': 'Loading ingredients…',
    'decide.matchingHeading': 'Matching recipes',
    'decide.noMatches': 'No recipes match these filters.',
    'decide.noPool': 'No recipes to pick from! Add some recipes or clear your filters.',
    'decide.noIngredients': 'No ingredients yet.',
    'decide.addRecipesFirst': 'Add some recipes',
    'decide.first': 'first!',
    'decide.tonight': "🎲 Tonight you're cooking…",
    'decide.tryAnother': '🎲 Try another',

    // Categories
    'cat.carbs': '🍞 Carbs',
    'cat.protein': '🥩 Protein',
    'cat.vegetable': '🥦 Vegetables',
    'cat.fruit': '🍎 Fruits',
    'cat.dairy': '🥛 Dairy',
    'cat.spice': '🌶️ Herbs & Spices',
    'cat.condiment': '🫙 Sauces & Condiments',
    'cat.other': '📦 Other',
  },

  nl: {
    'app.title': '🍴 Munchoice',
    'app.tagline': 'Kies wat je gaat eten — uit je eigen receptenstash.',
    'btn.logout': 'Uitloggen',

    'auth.heading': 'Inloggen of registreren',
    'auth.email': 'E-mailadres',
    'auth.password': 'Wachtwoord',
    'auth.login': 'Inloggen',
    'auth.signup': 'Registreren',
    'auth.fillFields': 'Vul e-mail en wachtwoord in.',
    'auth.signingUp': 'Bezig met registreren…',
    'auth.loggingIn': 'Bezig met inloggen…',
    'auth.created': 'Account aangemaakt! Bevestig je e-mail en log dan in.',
    'auth.forgotPassword': 'Wachtwoord vergeten?',
    'auth.resetHeading': 'Wachtwoord opnieuw instellen',
    'auth.resetEmailLabel': 'Vul je e-mail in — we sturen een resetlink.',
    'auth.sendReset': 'Stuur resetlink',
    'auth.resetSent': 'Resetlink verzonden! Bekijk je e-mail.',
    'auth.backToLogin': '← Terug naar inloggen',
    'auth.newPasswordHeading': 'Stel een nieuw wachtwoord in',
    'auth.newPassword': 'Nieuw wachtwoord',
    'auth.confirmPassword': 'Bevestig nieuw wachtwoord',
    'auth.updatePassword': 'Wachtwoord bijwerken',
    'auth.passwordMismatch': 'Wachtwoorden komen niet overeen.',
    'auth.passwordUpdated': 'Wachtwoord bijgewerkt! Doorverwijzen…',
    'auth.passwordTooShort': 'Wachtwoord moet minstens 6 tekens zijn.',
    'auth.invalidResetLink': 'Deze resetlink is ongeldig of verlopen. Vraag een nieuwe aan.',

    'nav.recipes': '📚 Mijn recepten',
    'nav.decide': '🎲 Wat eten we vanavond?',

    'recipe.addHeading': '➕ Nieuw recept toevoegen',
    'recipe.title': 'Titel',
    'recipe.titlePlaceholder': 'bijv. Spaghetti Bolognese',
    'recipe.servings': 'Voor hoeveel personen',
    'recipe.cookTime': 'Totale bereidingstijd (minuten)',
    'recipe.cookTimePlaceholder': 'bijv. 30',
    'list.minutes': 'min',
    'recipe.pasteLabel': 'Plak ingrediënten (één per regel)',
    'recipe.pastePlaceholder': 'bijv.\n500g pasta\n2 teentjes knoflook\n1 ui\nolijfolie\nzout en peper',
    'recipe.parseBtn': 'Ingrediënten verwerken ↓',
    'recipe.steps': 'Bereidingswijze',
    'recipe.stepsPlaceholder': 'Stap 1...\nStap 2...',
    'recipe.save': '💾 Recept opslaan',
    'recipe.titleMissing': 'Vul een titel in.',
    'recipe.unparsed': 'Je hebt onverwerkte ingrediënten. Klik eerst op "Ingrediënten verwerken ↓".',
    'recipe.noIngredients': 'Voeg minstens één ingrediënt toe voordat je opslaat.',
    'recipe.saving': 'Opslaan…',
    'recipe.saved': 'Recept opgeslagen! ✅',

    'parsed.amount': 'Hoeveelheid',
    'parsed.unit': 'Eenheid',
    'parsed.name': 'Naam',
    'parsed.addIngredient': '+ Ingrediënt toevoegen',
    'parsed.empty': 'Plak hierboven ingrediënten en klik op Verwerken.',

    'list.heading': '📚 Mijn recepten',
    'list.loading': 'Laden…',
    'list.empty': 'Nog geen recepten. Voeg er hierboven één toe!',
    'list.serves': 'Voor',
    'list.ingredients': 'Ingrediënten',
    'list.stepsLabel': 'Bereiding',
    'list.delete': '🗑️ Verwijderen',
    'list.confirmDelete': 'Dit recept verwijderen?',
    'list.searchPlaceholder': 'Zoek recepten of ingrediënten...',
    'list.noResults': 'Geen recepten gevonden.',
    'list.edit': '✏️ Bewerken',
    'list.cancel': 'Annuleren',
    'list.update': '💾 Recept bijwerken',
    'list.updating': 'Bijwerken…',
    'list.updated': 'Recept bijgewerkt! ✅',
    'list.editingHeading': '✏️ Recept bewerken',

    'decide.heading': 'Wat eten we vanavond?',
    'decide.surpriseBtn': '🎲 Verras me!',
    'decide.clearFilters': 'Filters wissen',
    'decide.hint': 'Selecteer ingrediënten die je hebt (of wilt gebruiken). Recepten met alle gekozen ingrediënten worden getoond.',
    'decide.loadingIngredients': 'Ingrediënten laden…',
    'decide.matchingHeading': 'Passende recepten',
    'decide.noMatches': 'Geen recepten passen bij deze filters.',
    'decide.noPool': 'Geen recepten om uit te kiezen! Voeg recepten toe of wis je filters.',
    'decide.noIngredients': 'Nog geen ingrediënten.',
    'decide.addRecipesFirst': 'Voeg eerst recepten toe',
    'decide.first': '!',
    'decide.tonight': '🎲 Vanavond kook je…',
    'decide.tryAnother': '🎲 Probeer een andere',

    'cat.carbs': '🍞 Koolhydraten',
    'cat.protein': '🥩 Eiwitten',
    'cat.vegetable': '🥦 Groenten',
    'cat.fruit': '🍎 Fruit',
    'cat.dairy': '🥛 Zuivel',
    'cat.spice': '🌶️ Kruiden & Specerijen',
    'cat.condiment': '🫙 Sauzen & Smaakmakers',
    'cat.other': '📦 Overig',
  }
};

// Current language (saved in localStorage)
let currentLang = localStorage.getItem('lang') || 'en';

// Get a translated string
function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || key;
}

// Apply translations to all elements with data-i18n / data-i18n-placeholder / data-i18n-title
function applyTranslations() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });

  // Update language switch button visual state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

// Switch language
function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
  // Notify other scripts that may need to re-render dynamic content
  window.dispatchEvent(new CustomEvent('langChanged'));
}

// Wire up the language switcher (called automatically on DOM ready)
function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  applyTranslations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLangSwitcher);
} else {
  initLangSwitcher();
}
