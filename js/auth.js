// If already logged in, skip login page
(async () => {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    window.location.href = 'app.html';
  }
})();

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageEl = document.getElementById('auth-message');

function showMessage(text, isError = true) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? '#b00' : '#2d7a46';
}

signupBtn.addEventListener('click', async () => {
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
});

loginBtn.addEventListener('click', async () => {
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
});
