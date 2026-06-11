// If already logged in, skip login page
(async () => {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    window.location.href = 'app.html';
  }
})();

const authForm = document.getElementById('auth-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageEl = document.getElementById('auth-message');

function showMessage(text, isError = true) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? '#d63031' : '#10b981';
}

async function doLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    showMessage(t('auth.fillFields'));
    return;
  }
  showMessage(t('auth.loggingIn'), false);
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    showMessage(error.message);
  } else {
    window.location.href = 'app.html';
  }
}

async function doSignup() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    showMessage(t('auth.fillFields'));
    return;
  }
  showMessage(t('auth.signingUp'), false);
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    showMessage(error.message);
  } else {
    showMessage(t('auth.created'), false);
  }
}

// Pressing Enter inside the form triggers Login
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  doLogin();
});

loginBtn.addEventListener('click', doLogin);
signupBtn.addEventListener('click', doSignup);
