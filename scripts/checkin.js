(async function startCheckin() {
  const form = document.getElementById('checkin-form');
  const message = document.getElementById('formMessage');
  const submitButton = form.querySelector('button[type="submit"]');

  function show(text, type) {
    message.textContent = text;
    message.className = 'form-message ' + type;
  }

  // 1. The person must be logged in
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }
  const userId = session.user.id;

  // 2. Have they already checked in this month?
  const thisMonth = new Date().toISOString().slice(0, 7) + '-01';
  const { data: existing } = await db
    .from('checkins')
    .select('id')
    .eq('user_id', userId)
    .eq('month', thisMonth)
    .maybeSingle();

  if (existing) {
    show('You have already checked in this month. Thank you!', 'success');
    form.querySelectorAll('input, select, textarea, button').forEach((el) => { el.disabled = true; });
    return;
  }

  // 3. Save the answers
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    show('Saving…', 'success');

    const answers = Object.fromEntries(new FormData(form).entries());
    Object.keys(answers).forEach((key) => {
      if (typeof answers[key] === 'string') answers[key] = answers[key].trim();
    });

    const { error } = await db
      .from('checkins')
      .insert([{ user_id: userId, answers }]);

    if (error) {
      submitButton.disabled = false;
      if (error.code === '23505') return show('You have already checked in this month.', 'error');
      return show('Could not save: ' + error.message, 'error');
    }

    show('Thank you! Your check-in has been saved. Taking you back…', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  });
})();
