
const users = JSON.parse(localStorage.getItem('users') || '{}');
const reports = JSON.parse(localStorage.getItem('reports') || '{}');
const reminderText = localStorage.getItem('reminder') || '';
document.getElementById('reminderBox').textContent = reminderText;
if (reminderText) document.getElementById('reminderBox').classList.remove('hidden');

function login() {
  const u = username.value, p = password.value;
  if (u === 'admin' && p === 'admin') return adminPanel.classList.remove('hidden');
  if (users[u] && users[u].password === p) {
    userPanel.classList.remove('hidden');
    document.getElementById('date').textContent = 'Date: ' + new Date().toLocaleDateString();
    if (reports[u] && reports[u][today()]) reportStatus.textContent = 'Already submitted';
  } else alert('Invalid credentials');
}

function submitReport() {
  const u = username.value, c = +confirmed.value, conn = +connected.value, t = +total.value;
  if (!reports[u]) reports[u] = {};
  if (reports[u][today()]) return reportStatus.textContent = 'Already submitted';
  const p = ((c / t) * 100).toFixed(2);
  reports[u][today()] = { confirmed: c, connected: conn, total: t, percent: p };
  localStorage.setItem('reports', JSON.stringify(reports));
  reportStatus.textContent = 'Submitted!';
}

function createUser() {
  const u = newUser.value, p = newPass.value;
  if (users[u]) return alert('Exists');
  users[u] = { password: p };
  localStorage.setItem('users', JSON.stringify(users));
  alert('User Created');
}

function viewReports() {
  const d = reportDate.value;
  let out = '<table><tr><th>User</th><th>Confirmed</th><th>Connected</th><th>Total</th><th>%</th><th>Actions</th></tr>';
  for (const u in reports) {
    if (reports[u][d]) {
      const r = reports[u][d];
      out += `<tr><td>${u}</td><td>${r.confirmed}</td><td>${r.connected}</td><td>${r.total}</td><td>${r.percent}%</td>
      <td><button onclick="deleteReport('${u}','${d}')">Delete</button></td></tr>`;
    }
  }
  reportsDiv.innerHTML = out + '</table>';
}

function exportToCSV() {
  const d = reportDate.value;
  let csv = 'Username,Confirmed,Connected,Total,Percent\n';
  for (const u in reports) {
    if (reports[u][d]) {
      const r = reports[u][d];
      csv += `${u},${r.confirmed},${r.connected},${r.total},${r.percent}\n`;
    }
  }
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'reports.csv';
  a.click();
}

function deleteReport(u, d) {
  delete reports[u][d];
  localStorage.setItem('reports', JSON.stringify(reports));
  viewReports();
}

function setReminder() {
  const txt = document.getElementById('reminder').value;
  localStorage.setItem('reminder', txt);
  alert('Reminder set!');
}

function today() {
  return new Date().toISOString().split('T')[0];
}
