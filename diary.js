document.addEventListener('DOMContentLoaded', () => {
  const textEl   = document.getElementById('entry-text');
  const moodEl   = document.getElementById('mood-select');
  const saveBtn  = document.getElementById('save-btn');
  const listEl   = document.getElementById('entries');
  let editId     = null;

  renderEntries();

  saveBtn.addEventListener('click', () => {
    const text = textEl.value.trim();
    if (!text) {
      alert('Please write something.');
      return;
    }
    const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');

    if (editId) {
      const idx = entries.findIndex(e => e.id === editId);
      entries[idx].text = text;
      entries[idx].mood = moodEl.value;
      editId = null;
      saveBtn.textContent = 'Save';
    } else {
      entries.unshift({
        id:   Date.now(),
        date: new Date().toLocaleString(),
        text,
        mood: moodEl.value
      });
    }

    localStorage.setItem('diaryEntries', JSON.stringify(entries));
    textEl.value = '';
    moodEl.selectedIndex = 0;
    renderEntries();
  });

  function renderEntries() {
    listEl.innerHTML = '';
    const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    if (!entries.length) {
      listEl.innerHTML = '<li>No entries yet.</li>';
      return;
    }
    entries.forEach(e => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="date">${e.date}</div>
        <div class="mood">${e.mood}</div>
        <p>${e.text}</p>
        <button class="edit-btn">Edit</button>
        <button class="del-btn">Delete</button>
      `;
      li.querySelector('.edit-btn')
        .addEventListener('click', () => startEdit(e.id));
      li.querySelector('.del-btn')
        .addEventListener('click', () => deleteEntry(e.id));
      listEl.appendChild(li);
    });
  }

  function startEdit(id) {
    const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    const e = entries.find(x => x.id === id);
    textEl.value  = e.text;
    moodEl.value  = e.mood;
    saveBtn.textContent = 'Update';
    editId = id;
  }

  function deleteEntry(id) {
    let entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    entries = entries.filter(e => e.id !== id);
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
    renderEntries();
  }
});
// background-uploader.js (or add at bottom of your existing JS)

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('bg-input');
  const applyBtn  = document.getElementById('bg-btn');

  // 1. On load, see if user previously chose a bg & apply it
  const savedBg = localStorage.getItem('customBg');
  if (savedBg) {
    document.body.style.backgroundImage = `url(${savedBg})`;
  }

  // 2. Handle “Apply” click
  applyBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select an image first.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const dataURL = e.target.result;
      // Apply background
      document.body.style.backgroundImage = `url(${dataURL})`;
      // Persist it
      localStorage.setItem('customBg', dataURL);
    };
    reader.readAsDataURL(file);
  });
});
