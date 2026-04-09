// Homework 2 Todo App component
import React, { useState, useEffect } from "react";

export default function App() {
  // State: list of todos
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  });

  // State: text inside input box
  const [draft, setDraft] = useState("");

  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'completed'
  // State for editing
  const [editingTodoId, setEditingTodoId] = useState(null); // ID of the todo being edited
  const [editDraft, setEditDraft] = useState(""); // Text for the todo being edited
  // State: delete completed todos
  const [deletedTodo, setDeletedTodo] = useState(null); // ID of the todo being deleted


  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

  // useEffect to handle undo delete
  useEffect(() => {
    if(!deletedTodo) return;

    const timer = setTimeout (() => {
      setDeletedTodo(null); // clear the deleted todo after 5 seconds
    }, 5000);
    return () => clearTimeout(timer); // clear the timer if the component unmounts or deletedTodo changes
  }, [deletedTodo]);

  // Function: add a new todo
  function addTodo(e) {
    e.preventDefault();

    if (draft.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: draft,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setDraft("");
  }

  function toggleTodo(id) {
  setTodos(
    todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );
}

//delete completed todos
function deleteTodo(id){
  const i = todos.findIndex((todo) => todo.id === id);
  const removed = todos[i]; // store the index

  setDeletedTodo({todo: removed, i}); // set the deleted todo
  setTodos(todos.filter((todo) => todo.id !== id)); // remove the todo from the list
}

// editing the todo item
function startEditing(todo){
  setEditingTodoId(todo.id); //set the id of the todo
  setEditDraft(todo.text);   // set the text
}

//cancel editing
function cancelEditing(){
  setEditingTodoId(null); // clear the editing id
  setEditDraft(""); // clear the edit draft
}

//save
function saveEditing(id){
  // if the draft is empty, return
  if(editDraft.trim === "")
    return;

  //update the todo list
  setTodos(
    todos.map((todo) => {
      if(todo.id === id){
        return {...todo, text: editDraft.trim()};
      }
      return todo;
    })
  )
  cancelEditing(); // clear the editing state
}

// handle key down event in edit mode
function handleEditKeyDown(e, id){
  //if enter is pressed save the edit
  if(e.key === "Enter"){
    saveEditing(id);
  } 
  // if escape is pressed, cancel the edit
  else if (e.key === "Escape"){
    cancelEditing(); // cancel editing 
  }
}

// Undo
function undoDelete(){
  //check if there are any deleted tasks
  if(!deletedTodo)
    return

  const update = [...todos];
  update.splice(deletedTodo.index, 0, deletedTodo.todo);
  setTodos(update);
  setDeletedTodo(null); // Clear the list of the todos so that it can reset the cache
}

function clearCompleted(){
  setTodos(todos.filter((todo) => !todo.completed));

}

const visibleTodos =
  filter === "active"
    ? todos.filter((t) => !t.completed)
    : filter === "completed"
    ? todos.filter((t) => t.completed)
    : todos;

// Store the count variables
const completedCount = todos.filter((todo) => todo.completed).length;
const remainingCount = todos.filter((todo) => !todo.completed).length;
const progress = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  return (
    <div 
    style={{ 
      width: "100%",
      maxWidth: 640,
      background: "#f5f1ea", 
      borderRadius: 24,
      padding: 32, 
      boxShadow: "0 20px 60px rgba(34, 48, 70, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.7)",
      textAlign: "center",
      fontSize: "1rem",
      lineHeight: 1,
      margin: "0 0 12px 0",
      }}>
      <h1>Todo app</h1>
      <h2>Stay ahead of your day</h2>

      {/* Input Form */}
      <form onSubmit={addTodo} style={{ display: "flex", gap: 8 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a task..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>

        <button
          type = "button" 
          onClick = {clearCompleted}
          >
          Clear
        </button>
      </form>

      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <FilterButton current={filter} value="all" onClick={setFilter} />
        <FilterButton current={filter} value="active" onClick={setFilter} />
        <FilterButton current={filter} value="completed" onClick={setFilter} />
      </div>

      {deletedTodo && (
        <div style = {{ marginTop: 16}}>
          Todo deleted - 
          <button type = "button" onClick = {undoDelete}> Undo </button>
          </div>
      )}

      {/* Display the counts and progress precentage */}
      <div style = {{
        marginTop: 20,
        padding: 20,
        borderRadius: 18, 
        background: "#f8fbff",
        border: "1px solid #dbe7f3",
        boxShadow: "0 8px 20px rgba(34,48, 70, 0.06)",
        }}>
        <div
          style= {{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <div style= {{ flex: 1}}>
            <p style= {{ margin: 0, fontSize: 14, color: "#6b7a90" }} > Remaining </p>
            <p style= {{ margin: "6px 0 0", fontSize: 28, fontWeight: 700}} > {remainingCount} </p>
          </div>

          <div style= {{ flex: 1}}>
            <p style= {{ margin: 0, fontSize: 14, color: "#6b7a90" }} > Completed </p>
            <p style= {{ margin: "6px 0 0", fontSize: 28, fontWeight: 700}} > {completedCount} </p>
          </div>

          <div style= {{ flex: 1}}>
            <p style= {{ margin: 0, fontSize: 14, color: "#6b7a90" }} > Progress </p>
            <p style= {{ margin: "6px 0 0", fontSize: 28, fontWeight: 700}} > {progress}% </p>
          </div>
        </div>
      </div>

      <div
        style = {{
          marginTop: 12,
          width: "100%",
          height: 12,
          background: "#dfe7ef",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div 
          style = {{
            width: `${progress}%`,
            height: "100%",
            background: "#2bb673",
            borderRadius: 999,
          }}
        />
      </div>
      
      {/* Todo List */}
        <ul style={{ marginTop: 20, paddingLeft: 0 }}>
      {visibleTodos.length === 0 ? (
        <li style={{ listStyle: "none" }}>
          {filter === "active"
            ? "No active tasks found."
            : filter === "completed"
            ? "No completed tasks found."
            : "No tasks yet. Add one above!"}
        </li>
      ) : (
        visibleTodos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{
              listStyle: "none",
              padding: "10px 12px",
              border: "1px solid #eee",
              borderRadius: 8,
              marginBottom: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textDecoration: todo.completed ? "line-through" : "none",
              opacity: todo.completed ? 0.6 : 1,
              fontSize: "1.4rem",
              background: "#fff",

            }}
          >
            {/* editing the todo item */}
            {editingTodoId === todo.id ? (
              <input
                value = {editDraft}
                autoFocus
                onChange= {(e) => setEditDraft(e.target.value)} /* set the text */
                onKeyDown={(e) => handleEditKeyDown(e, todo.id)} /* when  */
                onClick={(e) => e.stopPropagation()} // prevent toggle
                style = {{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6, 
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <span
                // double click to edit
                onDoubleClick={(e) => {
                  e.stopPropagation(); // prevent toggle
                  startEditing(todo);  // start editing
                }}
              >
                {todo.text}
              </span>

            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
              }}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                padding: "0 6px",
              }}
              aria-label="Delete todo"
              title="Delete"
            >
              ×
            </button>
          </li>
        ))
      )}
    </ul>


    </div>
  );
}

function FilterButton({ current, value, onClick }) {
  const active = current === value;

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        border: "1px solid",
        borderColor: active ? "black" : "#ccc",
        background: active ? "black" : "white",
        color: active ? "white" : "black",
        cursor: "pointer",
      }}
    >
      {value[0].toUpperCase() + value.slice(1)}
    </button>
  );
}
