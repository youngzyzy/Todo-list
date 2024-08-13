const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector(".container__input");
const todoItems = document.querySelector(".todo-items");
const clearBtn = document.querySelector(".clearAllBtn");

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  const booleanFromStorage = getBooleanFromStorage();
  let i = 0;
  itemsFromStorage.forEach((item) => {
    if (booleanFromStorage[i] === true) {
      addItemToDom(item, true);
    } else {
      addItemToDom(item, false);
    }
    i++;
  });
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  //check if trying to enter empty task
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  //check if entering task already in todo list
  if (checkIfAlreadyInStorage(newItem)) {
    alert("already in storage!");
    itemInput.value = "";
    return;
  }

  addItemToDom(newItem);

  addItemToStorage(newItem);
  itemInput.value = "";

  //try
  addBooleanToStorage(false);

  //
}

function checkIfAlreadyInStorage(newItem) {
  const itemsFromStorage = getItemsFromStorage();
  let bool = false;
  itemsFromStorage.forEach((item) => {
    if (item === newItem) {
      bool = true;
    }
  });
  return bool;
}
// try

function addBooleanToStorage(boolean) {
  let booleanFromStorage = getBooleanFromStorage();
  booleanFromStorage.push(boolean);
  localStorage.setItem("boolean", JSON.stringify(booleanFromStorage));
}
//
//try
function getBooleanFromStorage() {
  let booleanFromStorage;
  if (localStorage.getItem("boolean") === null) {
    booleanFromStorage = [];
  } else {
    booleanFromStorage = JSON.parse(localStorage.getItem("boolean"));
  }
  return booleanFromStorage;
}
//

function addItemToDom(newItem, boolean) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");

  todoItem.innerHTML = `   <div class="todo__item-left">
  <i class="fa-regular fa-circle"></i>
  <p class="todo__item-left-p">${newItem}</p>
</div>
<div class="todo__item-right remove-item">
  <i class="fa-solid fa-x"></i>
</div>`;
  if (boolean === true) {
    toggleIcon(todoItem.firstElementChild.firstElementChild);
    todoItem.firstElementChild
      .querySelector(".todo__item-left-p")
      .classList.add("strikethrough");
  }

  todoItems.appendChild(todoItem);
}

function addItemToStorage(newItem) {
  let itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(newItem);

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function onItemClick(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.parentElement.classList.contains("todo__item-left")) {
    modifyCompleted(
      e.target.parentElement.firstElementChild,
      e.target.parentElement.children[1]
    );
  }
}

function modifyCompleted(iconElement, pElement) {
  pElement.classList.toggle("strikethrough");
  toggleIcon(iconElement);

  //try
  let index = getIndex(pElement.textContent);
  modifyBooleanInStorage(index);
  //
}

function toggleIcon(iconElement) {
  if (iconElement.classList.contains("fa-circle")) {
    iconElement.classList.remove("fa-circle");
    iconElement.classList.add("fa-square-check");
  } else {
    iconElement.classList.add("fa-circle");
    iconElement.classList.remove("fa-square-check");
  }
}

function modifyBooleanInStorage(index) {
  let booleanFromStorage = getBooleanFromStorage();
  if (booleanFromStorage[index] === false) {
    booleanFromStorage[index] = true;
  } else {
    booleanFromStorage[index] = false;
  }
  setBooleanInStorage(booleanFromStorage);
}

function setBooleanInStorage(newBooleanArray) {
  localStorage.setItem("boolean", JSON.stringify(newBooleanArray));
}

function getIndex(textContent) {
  let itemsFromStorage = getItemsFromStorage();
  let index = 0;
  itemsFromStorage.forEach((i) => {
    if (i === textContent) {
      indexOfStrikethrough = index;
    }
    index++;
  });
  return indexOfStrikethrough;
}

function removeItem(item) {
  const textContent = item.querySelector(".todo__item-left-p").textContent;
  const index = getIndex(textContent);

  //remove from dom
  if (confirm("remove item?")) {
    item.remove();

    //remove item from storage
    removeItemFromStorage(textContent);
    //remove boolean from storage
    removeBooleanFromStorage(index);
  }
}

function removeBooleanFromStorage(index) {
  let booleanFromStorage = getBooleanFromStorage();
  booleanFromStorage.splice(index, 1);

  localStorage.setItem("boolean", JSON.stringify(booleanFromStorage));
}

function clearAllItems(e) {
  //remove all items from dom
  while (todoItems.firstChild) {
    todoItems.removeChild(todoItems.firstChild);
  }
  //remove all items in local storage
  localStorage.clear();
}

function removeItemFromStorage(textContent) {
  let itemsFromStorage = getItemsFromStorage();

  //remove textContent from local storage
  itemsFromStorage = itemsFromStorage.filter((i) => i !== textContent);
  // set local storage to new array with removed item/textContent
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// event listeners
itemForm.addEventListener("submit", onAddItemSubmit);
todoItems.addEventListener("click", onItemClick);
clearBtn.addEventListener("click", clearAllItems);
document.addEventListener("DOMContentLoaded", displayItems);
