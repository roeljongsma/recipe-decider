// If already logged in, skip login page
(async () => {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    window.location.href = 'app.html';
  }
})();

const authSection = document.getElementById('auth-section');
const resetSection = document.getElementById('reset-section');
const authForm = document.getElementById('auth-form');
const resetForm = document.getElementById('reset-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageEl = document.getElementById('auth-message');
const resetEmailInput = document.getElementById('reset-email');
const resetMessageEl = document.getElementById('reset-message');
const showResetLink = document.getElementById('show-reset-link');
const backToLoginLink = document.getElementById('back-to-login-link');

function showMessage(el, text, isError = true) {
  el.textContent = text;
  el.style.color = isError ? '#d63031' : '#10b981';
}

async function doLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    showMessage(messageEl, t('auth.fillFields'));
    return;
  }
  showMessage(messageEl, t('auth.loggingIn'), false);
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    showMessage(messageEl, error.message);
  } else {
    window.location.href = 'app.html';
  }
}

async function doSignup() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    showMessage(messageEl, t('auth.fillFields'));
    return;
  }
  if (password.length < 6) {
    showMessage(messageEl, t('auth.passwordTooShort'));
    return;
  }
  showMessage(messageEl, t('auth.signingUp'), false);
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin + '/app.html'
    }
  });
  if (error) {
    showMessage(messageEl, error.message);
    return;
  }
  // Detect "user already exists" — Supabase returns success but with empty identities
  if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    showMessage(messageEl, t('auth.emailExists'));
    return;
  }
  showMessage(messageEl, t('auth.created'), false);
}

async function doReset(e) {
  e.preventDefault();
  const email = resetEmailInput.value.trim();
  if (!email) {
    showMessage(resetMessageEl, t('auth.fillFields'));
    return;
  }
  showMessage(resetMessageEl, '...', false);
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset.html'
  });
  if (error) {
    showMessage(resetMessageEl, error.message);
  } else {
    showMessage(resetMessageEl, t('auth.resetSent'), false);
  }
}

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  doLogin();
});
loginBtn.addEventListener('click', (e) => { e.preventDefault(); doLogin(); });
signupBtn.addEventListener('click', doSignup);

resetForm.addEventListener('submit', doReset);

showResetLink.addEventListener('click', (e) => {
  e.preventDefault();
  authSection.style.display = 'none';
  resetSection.style.display = 'block';
  resetEmailInput.value = emailInput.value; // copy email if user typed it
  resetEmailInput.focus();
});
backToLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  resetSection.style.display = 'none';
  authSection.style.display = 'block';
});
