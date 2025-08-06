document.addEventListener('DOMContentLoaded', () => {
  const dateEl  = document.getElementById('plan-date');
  const timeEl  = document.getElementById('plan-time');
  const textEl  = document.getElementById('plan-text');
  const saveBtn = document.getElementById('plan-save-btn');
  const listEl  = document.getElementById('plan-list');
  let editId    = null;

  renderPlans();

  saveBtn.addEventListener('click', () => {
    const date  = dateEl.value;
    const time  = timeEl.value;
    const text  = textEl.value.trim();
    if (!date || !time || !text) {
      alert('Please fill out all fields.');
      return;
    }
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');

    if (editId) {
      const idx = plans.findIndex(p => p.id === editId);
      plans[idx] = { id: editId, date, time, text };
      editId = null;
      saveBtn.textContent = 'Save Plan';
    } else {
      plans.unshift({
        id:   Date.now(),
        date,
        time,
        text
      });
    }

    localStorage.setItem('plans', JSON.stringify(plans));
    dateEl.value = '';
    timeEl.value = '';
    textEl.value = '';
    renderPlans();
  });

  function renderPlans() {
    listEl.innerHTML = '';
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    if (!plans.length) {
      listEl.innerHTML = '<li>No plans yet.</li>';
      return;
    }
    plans.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${p.date} @ ${p.time}</strong>
        <p>${p.text}</p>
        <button class="edit-plan">Edit</button>
        <button class="del-plan">Delete</button>
      `;
      li.querySelector('.edit-plan')
        .addEventListener('click', () => startEdit(p.id));
      li.querySelector('.del-plan')
        .addEventListener('click', () => deletePlan(p.id));
      listEl.appendChild(li);
    });
  }

  function startEdit(id) {
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    const p = plans.find(x => x.id === id);
    dateEl.value = p.date;
    timeEl.value = p.time;
    textEl.value = p.text;
    save