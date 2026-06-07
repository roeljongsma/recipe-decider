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
    showMessage('Please enter email and password.');
    return;
  }
  showMessage('Signing up…', false);
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    showMessage(error.message);
  } else {
    showMessage('Account created! Check your email to confirm, then log in.', false);
  }
});

loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    showMessage('Please enter email and password.');
    return;
  }
  showMessage('Logging in…', false);
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    showMessage(error.message);
  } else {
    showMessage('Logged in! (Recipe page coming soon.)', false);
    console.log('User:', data.user);
  }
});
