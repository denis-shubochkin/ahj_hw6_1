const addBlock = document.querySelectorAll('.add-block');
const addButtons = document.querySelectorAll('.add-button');
const closeAddButtons = document.querySelectorAll('.add-cancel-button');
const taskBlocks = document.querySelectorAll('.task-block');
const emptyZone = document.querySelector('.tasks');
let draggedEl;
let ghostEl;
let difX;
let difY;

function updateCloseCoords(el) {
  const tasks = el.querySelectorAll('.task');
  tasks.forEach((elem) => {
    const del = elem.querySelector('.task-close');
    const { top, left } = elem.getBoundingClientRect();
    del.style.top = `${top + window.scrollY - 5}px`;
    del.style.left = `${left + window.scrollX + elem.offsetWidth * 0.85}px`;
  });
}

function selectAddBlock(event) {
  const e = event.target;
  e.querySelector('.add-label').style.textDecoration = 'underline';
  e.style.backgroundColor = 'rgb(195, 203, 207)';
  e.querySelector('.add-img').style.backgroundImage = 'url(../src/pic/addS.png)';
}

function unselectAddBlock(event) {
  const e = event.target;
  e.querySelector('.add-label').style.textDecoration = 'none';
  e.style.backgroundColor = '';
  e.querySelector('.add-img').style.backgroundImage = "url('../src/pic/add.png')";
}

function showDeleteButton(event) {
  let cur;
  if (event.target.className === 'task') {
    cur = event.target.querySelector('.task-close');
  } else {
    cur = event.target;
  }
  cur.style.display = 'block';
}

function hideDeleteButton(event) {
  let cur;
  if (event.target.className === 'task') {
    cur = event.target.querySelector('.task-close');
  } else {
    cur = event.target;
  }
  cur.style.display = 'none';
}


function createTask(parent, name) {
  const str = `<div class="task">
  <span class="task-name">${name}</span>
  <button class="task-close">&#10005</button>
</div>`;
  parent.insertAdjacentHTML('beforeend', str);
  const element = parent.lastChild;
  const delBut = element.querySelector('.task-close');
  const { top, left } = element.getBoundingClientRect();
  delBut.style.top = `${top + window.scrollY - 5}px`;
  delBut.style.left = `${left + window.scrollX + element.offsetWidth * 0.85}px`;
  element.addEventListener('mouseover', showDeleteButton);
  element.addEventListener('mouseout', hideDeleteButton);
  delBut.addEventListener('click', () => {
    element.removeEventListener('mouseover', showDeleteButton);
    element.removeEventListener('mouseout', hideDeleteButton);
    element.remove();
    updateCloseCoords(parent);
  });
  element.addEventListener('mousedown', (evt) => {
    evt.preventDefault();
    if (evt.target.className === 'task-close') {
      return;
    }
    element.querySelector('.task-close').style.display = 'none';
    draggedEl = element;
    const drTop = draggedEl.getBoundingClientRect().top;
    const drLeft = draggedEl.getBoundingClientRect().left;
    element.style.cursor = 'grabbing';
    ghostEl = element.cloneNode(true);
    ghostEl.classList.add('dragged');
    ghostEl.style.width = `${draggedEl.offsetWidth}px`;
    document.body.appendChild(ghostEl);
    ghostEl.style.left = `${drLeft - 10}px`;
    ghostEl.style.top = `${drTop - 15}px`;
    difX = evt.pageX - (drLeft - 10);
    difY = evt.pageY - (drTop - 15);
  });
}

function editFormClose(element, type) {
  const addForm = element.closest('.task-block').querySelector('.add-form');
  const addBl = element.closest('.task-block').querySelector('.add-block');
  const area = element.closest('.add-form').querySelector('.add-textarea');
  area.value = '';
  if (type === 'add') {
    addForm.style.display = 'none';
    addBl.style.display = 'flex';
    return;
  }
  element.addEventListener('click', () => {
    addForm.style.display = 'none';
    addBl.style.display = 'flex';
  });
}

function openAddForm(event) {
  const e = event.target;
  const addForm = e.closest('.task-block').querySelector('.add-form');
  e.style.display = 'none';
  addForm.style.display = 'block';
}

document.addEventListener('mousemove', (evt) => {
  evt.preventDefault();
  if (!draggedEl) return;
  ghostEl.style.left = `${evt.pageX - difX}px`;
  ghostEl.style.top = `${evt.pageY - difY}px`;
});

emptyZone.addEventListener('mouseup', () => {
  if (draggedEl) {
    draggedEl.style.cursor = 'default';
    document.body.removeChild(ghostEl);
    ghostEl = null;
    draggedEl = null;
    difX = null;
    difY = null;
  }
});

document.addEventListener('mouseup', () => {
  if (draggedEl) {
    draggedEl.style.cursor = 'default';
    document.body.removeChild(ghostEl);
    ghostEl = null;
    draggedEl = null;
    difX = null;
    difY = null;
  }
});

taskBlocks.forEach((el) => {
  el.addEventListener('mouseup', (evt) => {
    if (!draggedEl) {
      return;
    }
    const closest = document.elementFromPoint(evt.clientX, evt.clientY);
    const closestUpper = document.elementFromPoint(evt.clientX, evt.clientY - 10);
    const closestLower = document.elementFromPoint(evt.clientX, evt.clientY + 10);
    let topTarget = closest.getBoundingClientRect().top;
    const { top } = ghostEl.getBoundingClientRect();
    const block = closest.closest('.task-block');
    const list = block.querySelector('.task-list');
    console.log(`${top}----${topTarget}`);
    if (closest.className === 'task') {
      if (topTarget >= top) {
        list.insertBefore(draggedEl, closest);
      } else {
        list.insertBefore(draggedEl, closest);
        list.insertBefore(closest, draggedEl);
      }
      draggedEl.style.cursor = 'default';
      updateCloseCoords(list);
      document.body.removeChild(ghostEl);
      ghostEl = null;
      draggedEl = null;
      difX = null;
      difY = null;
    } else if (closest.className !== 'task' && closestUpper.className === 'task') {
      topTarget = closestUpper.getBoundingClientRect().top;
      if (topTarget >= top) {
        list.insertBefore(draggedEl, closestUpper);
      } else {
        list.insertBefore(draggedEl, closestUpper);
        list.insertBefore(closestUpper, draggedEl);
      }
      draggedEl.style.cursor = 'default';
      updateCloseCoords(list);
      document.body.removeChild(ghostEl);
      ghostEl = null;
      draggedEl = null;
      difX = null;
      difY = null;
    } else if (closest.className !== 'task' && closestLower.className === 'task') {
      topTarget = closestLower.getBoundingClientRect().top;
      if (topTarget >= top) {
        list.insertBefore(draggedEl, closestLower);
      } else {
        list.insertBefore(draggedEl, closestLower);
        list.insertBefore(closestLower, draggedEl);
      }
      draggedEl.style.cursor = 'default';
      updateCloseCoords(list);
      document.body.removeChild(ghostEl);
      ghostEl = null;
      draggedEl = null;
      difX = null;
      difY = null;
    } else if (closest.className !== 'task') {
      list.insertAdjacentElement('beforeend', draggedEl);
      draggedEl.style.cursor = 'default';
      updateCloseCoords(list);
      document.body.removeChild(ghostEl);
      ghostEl = null;
      draggedEl = null;
      difX = null;
      difY = null;
    } else {
      draggedEl.style.cursor = 'default';
      document.body.removeChild(ghostEl);
      ghostEl = null;
      draggedEl = null;
      difX = null;
      difY = null;
    }
  });
});


addBlock.forEach((el) => {
  el.addEventListener('mouseover', selectAddBlock);
  el.addEventListener('mouseout', unselectAddBlock);
  el.addEventListener('click', openAddForm);
});

addButtons.forEach((el) => {
  const taskList = el.closest('.task-block').querySelector('.task-list');
  const area = el.closest('.add-form').querySelector('.add-textarea');
  el.addEventListener('click', () => {
    if (area.value !== '') {
      createTask(taskList, area.value);
      area.value = '';
      editFormClose(el, 'add');
    }
  });
});


closeAddButtons.forEach((el) => {
  el.addEventListener('click', () => {
    editFormClose(el, 'close');
  });
});
