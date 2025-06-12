let departmentId = localStorage.getItem('department_id');
let ws;

function setDepartment() {
  const input = document.getElementById('deptInput').value;
  if (!input) return alert('Please enter a department ID');
  localStorage.setItem('department_id', input);
  location.reload();
}

function changeDepartment() {
  localStorage.removeItem('department_id');
  location.reload();
}

function getStatusText(status) {
  const map = {
    waiting: 'Waiting',
    called: 'Called',
    in_progress: 'In Progress',
    completed: 'Completed'
  };
  return map[status] || 'Unknown';
}

if (departmentId) {
  document.getElementById('config').style.display = 'none';
  document.getElementById('displaySection').style.display = 'block';

  const backendUrl = 'http://localhost:5000';
  ws = new WebSocket('ws://localhost:5000');

  ws.onopen = () => console.log('WebSocket connected');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const tokenBody = document.getElementById('tokenBody');

    if (data.type === 'token-update') {
      const row = data.payload;
      if (row.department_id == departmentId) {
        const existingRow = [...tokenBody.children].find(
          tr => tr.dataset.token === row.token_code
        );

        const newRowHTML = `
          <td>${row.token_code}</td>
          <td>${row.room_number}</td>
          <td>${getStatusText(row.status)}</td>
        `;

        if (existingRow) {
          existingRow.innerHTML = newRowHTML;
        } else {
          const tr = document.createElement('tr');
          tr.dataset.token = row.token_code;
          tr.innerHTML = newRowHTML;
          tokenBody.appendChild(tr);
          if (tokenBody.rows.length > 5) tokenBody.deleteRow(5);
        }
      }
    }

    if (data.type === 'token-done') {
      const rowToRemove = [...tokenBody.children].find(
        tr => tr.dataset.token === data.token_id
      );
      if (rowToRemove) rowToRemove.remove();
    }

    if (data.type === 'emergency_alert') {
      const alert = data.payload;
      const overlay = document.getElementById('alertOverlay');
      const msg = document.getElementById('alertMessage');
      const dept = document.getElementById('alertDepartment');

      overlay.style.display = 'flex';

      const bgMap = {
        code_blue: 'blue',
        code_red: 'red',
        code_orange: 'orange',
        code_green: 'green'
      };

      overlay.style.backgroundColor = bgMap[alert.alert_type] || 'black';
      msg.innerText = alert.alert_type.replace('_', ' ').toUpperCase();
      dept.innerText = `Department: ${alert.department}`;

      const soundId = {
        code_blue: 'codeBlueSound',
        code_red: 'codeRedSound',
        code_orange: 'codeOrangeSound',
        code_green: 'codeGreenSound'
      }[alert.alert_type];

      if (soundId) {
        const audio = document.getElementById(soundId);
        if (audio) {
          audio.play().catch(err => {
            console.error('Audio play failed:', err);
          });
        }
      }

      // Auto-hide after 15 seconds
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 15000);
    }

    if (data.type === 'emergency_alert_clear') {
      const overlay = document.getElementById('alertOverlay');
      overlay.style.display = 'none';

      // Stop all alert sounds
      ['codeBlueSound', 'codeRedSound', 'codeOrangeSound', 'codeGreenSound'].forEach(id => {
        const audio = document.getElementById(id);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    }
  };

  async function fetchTokens() {
    try {
      const res = await fetch(`${backendUrl}/display/display-tokens?department_id=${departmentId}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return;

      document.getElementById('deptLabel').textContent = data[0].department;
      const tokenBody = document.getElementById('tokenBody');
      tokenBody.innerHTML = '';

      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.dataset.token = row.token_code;
        tr.innerHTML = `
          <td>${row.token_code}</td>
          <td>${row.room_number}</td>
          <td>${getStatusText(row.status)}</td>
        `;
        tokenBody.appendChild(tr);
      });
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
    }
  }

  fetchTokens();
}
