// Escape text before putting it into HTML, so nobody can inject code.
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const prettyKey = (k) => k.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const prettyDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

(async function startAdmin() {
  const message = document.getElementById('adminMessage');
  const main = document.getElementById('adminMain');

  document.getElementById('logoutButton').addEventListener('click', logOut);

  // 1. Must be logged in
  const { data: { session } } = await db.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  // 2. Must be staff
  const { data: me } = await db
    .from('profiles').select('role').eq('id', session.user.id).maybeSingle();

  if (!me || me.role !== 'staff') {
    message.textContent = 'This page is for Starlight staff only. Redirecting…';
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    return;
  }

  // 3. Load the data (the database only returns it because this user is staff)
  const [alumniRes, checkinRes] = await Promise.all([
    db.from('profiles')
      .select('id, first_name, surname, email, personal_contact, graduation_year')
      .eq('role', 'alumni')
      .order('surname'),
    db.from('checkins')
      .select('user_id, month, answers, created_at')
      .order('created_at', { ascending: false })
  ]);

  if (alumniRes.error || checkinRes.error) {
    message.textContent = 'Could not load data: ' + (alumniRes.error || checkinRes.error).message;
    return;
  }

  const alumni = alumniRes.data;
  const byUser = {};
  checkinRes.data.forEach((c) => { (byUser[c.user_id] = byUser[c.user_id] || []).push(c); });

  // Same month key the database uses (first day of the month, UTC)
  const thisMonth = new Date().toISOString().slice(0, 7) + '-01';

  // 4. Summary cards
  const total = alumni.length;
  const checked = alumni.filter((a) => (byUser[a.id] || []).some((c) => c.month === thisMonth)).length;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statChecked').textContent = checked;
  document.getElementById('statPending').textContent = total - checked;
  document.getElementById('statRate').textContent = (total ? Math.round((checked / total) * 100) : 0) + '%';
  document.getElementById('monthLabel').textContent =
    new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  // 5. Table
  const tbody = document.getElementById('alumniRows');

  if (!total) {
    tbody.innerHTML = '<tr><td colspan="7">No alumni have signed up yet.</td></tr>';
  }

  alumni.forEach((a) => {
    const list = byUser[a.id] || [];
    const last = list[0];
    const done = list.some((c) => c.month === thisMonth);
    const name = [a.first_name, a.surname].filter(Boolean).join(' ') || a.email;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${esc(name)}</td>
      <td>${esc(a.email)}</td>
      <td>${esc(a.personal_contact)}</td>
      <td>${esc(a.graduation_year)}</td>
      <td>${last ? esc(prettyDate(last.created_at)) : 'Never'}</td>
      <td>${done ? '✅ Checked in' : '⏳ Pending'}</td>
      <td>${list.length ? '<button class="button button-light" type="button">View</button>' : ''}</td>
    `;
    tbody.appendChild(row);

    if (list.length) {
      const details = document.createElement('tr');
      details.hidden = true;
      const blocks = list.map((c) => {
        const items = Object.entries(c.answers || {})
          .map(([k, v]) => `<li><strong>${esc(prettyKey(k))}:</strong> ${esc(v)}</li>`)
          .join('');
        return `<p><strong>${esc(prettyDate(c.month))}</strong></p><ul>${items}</ul>`;
      }).join('');
      details.innerHTML = `<td colspan="7">${blocks}</td>`;
      tbody.appendChild(details);

      row.querySelector('button').addEventListener('click', () => { details.hidden = !details.hidden; });
    }
  });

  message.hidden = true;
  main.hidden = false;
})();