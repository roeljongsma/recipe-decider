const newPasswordForm = document.getElementById('new-password-form');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const messageEl = document.getElementById('reset-message');

function showMessage(text, isError = true) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? '#d63031' : '#10b981';
}

// Supabase puts a recovery token in the URL hash when user clicks the email link.
// supabase-js auto-handles it and creates a temporary "recovery" session.
// We just need to verify a session exists, then call updateUser.

let recoverySessionReady = false;

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
    recoverySessionReady = true;
  }
});

// Also check immediately in case the event fired before listener attached
(async () => {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) recoverySessionReady = true;
})();

newPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pw = newPasswordInput.value;
  const confirm = confirmPasswordInput.value;

  if (pw.length < 6) {
    showMessage(t('auth.passwordTooShort'));
    return;
  }
  if (pw !== confirm) {
    showMessage(t('auth.passwordMismatch'));
    return;
  }

  if (!recoverySessionReady) {
    // Give Supabase a moment to process the URL hash
    await new Promise(r => setTimeout(r, 500));
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) {
      showMessage(t('auth.invalidResetLink'));
      return;
    }
  }

  const { error } = await supabaseClient.auth.updateUser({ password: pw });
  if (error) {
    showMessage(error.message);
    return;
  }
  showMessage(t('auth.passwordUpdated'), false);
  setTimeout(() => {
    window.location.href = 'app.html';
  }, 1500);
});
