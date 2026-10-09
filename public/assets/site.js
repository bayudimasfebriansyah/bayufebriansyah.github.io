const filterBar = document.querySelector('[data-filters]');
if (filterBar) {
  const cards = [...document.querySelectorAll('.project-card')];
  const buttons = [...filterBar.querySelectorAll('[data-filter]')];
  const count = filterBar.querySelector('[role="status"]');
  filterBar.hidden = false;
  filterBar.addEventListener('click',event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const selected = button.dataset.filter;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let visible = 0;
    cards.forEach(card=> {
      card.hidden = selected !== 'all' && !card.dataset.category.split(' ').includes(selected);
      if (!card.hidden) visible++;
    });
    count.textContent = `${visible} ${visible===1?'project':'projects'}`;
  });
}

const dialog = document.querySelector('.image-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  let opener;
  const close = () => dialog.close();
  document.querySelectorAll('[data-zoom]').forEach(link=>link.addEventListener('click',event=> {
    event.preventDefault();
    opener = link;
    const img = dialog.querySelector('img');
    img.src = link.href;
    img.alt = link.querySelector('img').alt;
    dialog.querySelector('figcaption').textContent = link.dataset.caption;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.querySelector('button').focus();
  }));
  dialog.querySelector('button').addEventListener('click',close);
  dialog.addEventListener('click',event=> {if (event.target === dialog) {const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) close();}});
  dialog.addEventListener('close',()=> {document.body.style.overflow='';opener?.focus();});
}
