const form = document.querySelector(".container"); // form of input fields
const input = document.querySelector("#new-task-input"); // new task input field
const list_el = document.querySelector("#tasks"); // for generated task list

// creating array of object
let todos = [{ text: "fill my todo list", done: false }];

// read out local storage:
// if empty (first start of App) - then write in 1 dataset
// if not empty, read out local storage

if (localStorage.getItem("todos") === null) {
  localStorage.setItem("todos", JSON.stringify(todos));
} else {
  todos = JSON.parse(localStorage.getItem("todos"));
  // console.log(todos);
}

// Create todo item with new user input
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = input.value; // new entered text for new task

  // check for valid user input
  if (!task) {
    alert("Please fill in that task");
    return;
  }
  //   check that toList is too long
  if (todos.length > 9) {
    alert("You should first work on your task !");
  } else {
    todos.push({ text: task, done: false });
    // console.log(todos);

    // store in local storage
    localStorage.setItem("todos", JSON.stringify(todos));
    // clear input field
    input.value = "";

    // rerender todo list
    rerenderTodoList();
  }
});

function rerenderTodoList() {
  // delete actual rendered todo list
  list_el.innerHTML = "";

  todos = JSON.parse(localStorage.getItem("todos"));

  todos.forEach((item, index) => {
    renderItem(item, index);
  });
}

function renderItem(item, index) {
  const task_el = document.createElement("div"); // create a new div with class "task"
  task_el.classList.add("task");
  // add id to item container !
  task_el.setAttribute("id", index);

  const task_content_el = document.createElement("div"); // create a new div with class "content" (as child from task)
  task_content_el.classList.add("content");

  task_el.appendChild(task_content_el); // append div "content" to div "task"

  const task_input_el = document.createElement("input"); // create a new input field as readonly with class "text" (as child from content)
  task_input_el.classList.add("todo_text");
  task_input_el.type = "text";
  task_input_el.value = item.text;
  task_input_el.setAttribute("readonly", "readonly");
  
  // console.log("index =",index, "as" ,item.done);
  item.done ? task_input_el.classList.add("done") : task_input_el.classList.add("open");

  task_content_el.appendChild(task_input_el); // append input field to div "content"

  const task_actions_el = document.createElement("div"); // create a new div with class "actions"
  task_actions_el.classList.add("actions");

  // 3 buttons done, edit, delete
  const task_done_el = document.createElement("span"); // create a new span element with class "done"
  task_done_el.classList.add("done");
  task_done_el.innerHTML = "&#xe876;"; // set the innerHTML of the span to the done icon from the Material Symbols Outlined font
  
  
  
  task_done_el.style.fontFamily = "Material Symbols Outlined"; // set the font family of the span to the Material Symbols Outlined font


  const task_edit_el = document.createElement("span"); // create a new span element with class "edit"
  task_edit_el.classList.add("edit");
  task_edit_el.innerHTML = "&#xe3c9;"; // set the innerHTML of the span to the edit icon from the Material Symbols Outlined font
  task_edit_el.style.fontFamily = "Material Symbols Outlined"; // set the font family of the span to the Material Symbols Outlined font


  const task_delete_el = document.createElement("span"); // create a new button with class "delete"
  task_delete_el.classList.add("delete");
  task_delete_el.innerHTML = "&#xe872;";
  task_delete_el.style.fontFamily = "Material Symbols Outlined";

  task_actions_el.appendChild(task_done_el); // append div with class "done" to div with class "actions"
  task_actions_el.appendChild(task_edit_el); // append div with class "edit" to div with class "actions"
  task_actions_el.appendChild(task_delete_el); // append button with class "delete" to div with class "actions"

  // assemble all
  task_el.appendChild(task_actions_el); // append div with class "actions" to div "task"

  list_el.appendChild(task_el); // append all divs to div with ID "tasks"

  // ### DELETE #### listen on button delete that it is clicked
  task_delete_el.addEventListener("click", (e) => {
    // get id of container "task"
    index_btn = e.target.parentElement.parentElement.id;
    // console.log(index_btn);

    // delete this id in database
    todos.splice(index_btn, 1);

    if (!todos.length) {
      alert("You finished all tasks !");
    }
    // store in local storage
    localStorage.setItem("todos", JSON.stringify(todos));

    // rerender todo list
    rerenderTodoList();
  });

  // ### EDIT #### listen on button edit that it is clicked
  task_edit_el.addEventListener("click", (e) => {
    if (task_edit_el.innerText.toLowerCase() == "edit") {
      task_edit_el.innerText = "Save";
      task_input_el.removeAttribute("readonly"); // change attribute that you can edit text of task
      task_input_el.focus();
    } else {
      task_edit_el.innerText = "Edit";
      task_input_el.setAttribute("readonly", "readonly"); // change attribute back to readonly (no edit possible)

      // get changes from input field
      changes = task_input_el.value;

      // get id of container "task"
      index_btn = e.target.parentElement.parentElement.id;
      // console.log(index_btn);

      // update id dataset in database
      todos[index_btn].text = changes;
      // console.log(todos)

      // store in local storage
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });

  // ### DONE #### listen on button done that it is clicked
  task_done_el.addEventListener("click", (e) => {
    // get id of container "task"
    index_btn = e.target.parentElement.parentElement.id;

    // toggle done status flag in database
    if (todos[index_btn].done == false) {
      todos[index_btn].done = true;
    } else {
      todos[index_btn].done = false;
    };
    // store in local storage
    localStorage.setItem("todos", JSON.stringify(todos));
    // rerender todo list
    rerenderTodoList();
  });
}

window.addEventListener("load", rerenderTodoList());
