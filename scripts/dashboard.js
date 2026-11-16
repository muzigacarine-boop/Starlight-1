// Shows the logged-in user's real name on the dashboard.
// Load this AFTER supabase-client.js, auth.js, data.js and app.js,
// so it replaces the sample name ("Aline") that those files set.

(async function startDashboard() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  const { data: profile } = await db
    .from('profiles')
    .select('first_name, role')
    .eq('id', session.user.id)
    .maybeSingle();

    if (profile && profile.role === 'staff') {
  const link = document.createElement('a');
  link.href = 'admin.html';
  link.className = 'text-link';
  link.textContent = 'Staff dashboard →';
  document.querySelector('.welcome-section').appendChild(link);
}

  const firstName = (profile && profile.first_name) || session.user.email || 'there';
  const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

  // Name
  set('welcomeName', firstName);
  const profileName = document.querySelector('.profile-name');
  const avatar = document.querySelector('.avatar');
  if (profileName) profileName.textContent = firstName;
  if (avatar) avatar.textContent = firstName.charAt(0).toUpperCase();

  // Log out
  const profileButton = document.getElementById('profileButton');
  if (profileButton) {
    profileButton.addEventListener('click', () => {
      if (confirm('Log out of Starlight check-in?')) logOut();
    });
  }

  // Staff link
  if (profile && profile.role === 'staff') {
    const link = document.createElement('a');
    link.href = 'admin.html';
    link.className = 'text-link';
    link.textContent = 'Staff dashboard →';
    document.querySelector('.welcome-section').appendChild(link);
  }

  // Real check-in data
  const { data: checkins } = await db
    .from('checkins')
    .select('month')
    .eq('user_id', session.user.id);

  const months = new Set((checkins || []).map((c) => c.month));
  const thisMonth = new Date().toISOString().slice(0, 7) + '-01';
  const prevMonth = (key) => {
    const [y, m] = key.split('-').map(Number);
    return new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 7) + '-01';
  };

  const doneThisMonth = months.has(thisMonth);

  // Streak: consecutive months, counting back from this month (or last month)
  let streak = 0;
  let cursor = doneThisMonth ? thisMonth : prevMonth(thisMonth);
  while (months.has(cursor)) { streak++; cursor = prevMonth(cursor); }

  const total = Math.min(months.size, 12);

  // Banner
  if (doneThisMonth) {
    set('checkinStatus', 'COMPLETE');
    set('checkinTitle', "You're all set for this month");
    set('checkinDescription', 'Thank you for checking in. See you next month!');
    const button = document.getElementById('checkinButton');
    if (button) button.innerHTML = 'Checked in ✓';
  } else {
    set('checkinStatus', 'DUE THIS MONTH');
    set('checkinTitle', 'Your monthly check-in is waiting');
    set('checkinDescription', 'Take a minute to share your progress and stay connected to new opportunities.');
    const button = document.getElementById('checkinButton');
    if (button) button.innerHTML = 'Complete check-in <span aria-hidden="true">→</span>';
  }

  // Stats and progress
  set('streakCount', streak);
  set('milestoneCount', total + '/12');
  set('milestoneDescription', 'Monthly check-ins completed');
  set('progressLabel', total + ' of 12 months');

  const fill = document.getElementById('progressFill');
  if (fill) fill.style.width = (total / 12) * 100 + '%';
  const bar = document.getElementById('journeyProgress');
  if (bar) bar.setAttribute('aria-valuenow', total);

  // Milestone message
  const title = document.querySelector('#milestoneMessage strong');
  const text = document.querySelector('#milestoneMessage p');
  const next = total < 6 ? 6 : 12;
  const left = next - total;
  if (title && text) {
    if (total === 0) {
      title.textContent = 'Your journey starts here.';
      text.textContent = 'Complete your monthly check-ins to build your progress.';
    } else if (total >= 12) {
      title.textContent = 'Milestone reached!';
      text.textContent = "You completed 12 monthly check-ins. Thank you for staying connected.";
    } else {
      title.textContent = left + ' more check-in' + (left > 1 ? 's' : '') + ' until your ' + next + '-month milestone.';
      text.textContent = 'Keep going. Every month counts.';
    }
  }
})();