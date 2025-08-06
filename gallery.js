document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('upload-btn');
  const gallery   = document.getElementById('media-gallery');

  renderGallery();

  uploadBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      alert('Please choose a file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const items = JSON.parse(localStorage.getItem('mediaItems') || '[]');
      items.unshift({
        id:   Date.now(),
        type: file.type,
        url:  e.target.result
      });
      localStorage.setItem('mediaItems', JSON.stringify(items));
      fileInput.value = '';
      renderGallery();
    };
    reader.readAsDataURL(file);
  });

  function renderGallery() {
    gallery.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('mediaItems') || '[]');
    if (!items.length) {
      gallery.innerHTML = '<p>No media uploaded yet.</p>';
      return;
    }
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'media-item';
      let media;
      if (item.type.startsWith('image/')) {
        media = document.createElement('img');
        media.src = item.url;
      } else if (item.type.startsWith('video/')) {
        media = document.createElement('video');
        media.src = item.url;
        media.controls = true;
      }
      const delBtn = document.createElement('button');
      delBtn.textContent = '×';
      delBtn.addEventListener('click', () => deleteItem(item.id));
      div.appendChild(media);
      div.appendChild(delBtn);
      gallery.appendChild(div);
    });
  }

  function deleteItem(id) {
    let items = JSON.parse(localStorage.getItem('mediaItems') || '[]');
    items = items.filter(i => i.id !== id);
    localStorage.setItem('mediaItems', JSON.stringify(items));
    renderGallery();
  }
});