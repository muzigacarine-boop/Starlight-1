async function signUp(fields) {
  const { email, password, ...profile } = fields;
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: profile }
  });
  if (error) return alert(error.message);

  if (!data.session) {
    alert('Account created. Please confirm your email, then log in.');
    window.location.href = 'login.html';
    return;
  }
  window.location.href = 'index.html';
}
async function logIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  const { data: profile } = await db
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  window.location.href = (profile && profile.role === 'staff') ? 'admin.html' : 'index.html';
}
async function requireLogin() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) window.location.href = 'login.html';
  return session;
}

async function logOut() {
  await db.auth.signOut();
  window.location.href = 'login.html';
}