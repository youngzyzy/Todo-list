const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector(".container__input");
const todoItems = document.querySelector(".todo-items");
const clearBtn = document.querySelector(".clearAllBtn");

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDom(item);
  });
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  addItemToDom(newItem);

  addItemToStorage(newItem);
  itemInput.value = "";
}

function addItemToDom(newItem) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");

  todoItem.innerHTML = `   <div class="todo__item-left">
  <i class="fa-regular fa-circle"></i>
  <p class="todo__item-left-p">${newItem}</p>
</div>
<div class="todo__item-right remove-item">
  <i class="fa-solid fa-x"></i>
</div>`;
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
  //try

  if (iconElement.classList.contains("fa-circle")) {
    iconElement.classList.remove("fa-circle");
    iconElement.classList.add("fa-square-check");
  } else {
    iconElement.classList.add("fa-circle");
    iconElement.classList.remove("fa-square-check");
  }
}

function removeItem(item) {
  const textContent = item.querySelector(".todo__item-left-p").textContent;

  //remove from dom
  if (confirm("remove item?")) {
    item.remove();

    //remove from storage
    removeItemFromStorage(textContent);

    //CHECKUI();
  }
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
