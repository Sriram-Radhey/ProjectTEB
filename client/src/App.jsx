import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  // This helps to fetch all tasks
  const fetchTodos = async () => {
      const response = await fetch('http://localhost:5000/api/');
      const data = await response.json();
      if (response.ok) {
          setTodos(data.message.todos);
      }
  };

  // Helps to add a new Task
  const addTodo = async () => {
      if (!task) return;
      const response = await fetch('http://localhost:5000/api/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task }),
      });
      if (response.ok) {
          setTask('');
          fetchTodos();
      }
  };

  // for editing task
  const editTodo = async (id) => {
      if (!editTask) return; 
      const response = await fetch(`http://localhost:5000/api/update/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: editTask }),
      });
      if (response.ok) {
          setEditTask(''); 
          setEditId(null); 
          fetchTodos(); 
      }
  };

  // delete an exsisting task
  const deleteTodo = async (id) => {
      await fetch(`http://localhost:5000/api/${id}`, {
          method: 'DELETE',
      });
      fetchTodos();
  };

  // It is for showing the or grouping the completed tasks
  const toggleTodo = async (id) => {
    const response = await fetch(`http://localhost:5000/api/toggle/${id}`, {
        method: 'PUT',
    });
    if (response.ok) {
        fetchTodos();
    }
  };

  // Updates the DOM directly
  useEffect(() => {
      fetchTodos();
  }, []);

  // To Store the completed tasks or todos
  const completedTodos = todos.filter(todo => todo.done);

  return (
      <div className="todo-container">
          <h1>Todo List</h1>
          <div className="input-container">
              <input 
                  type="text" 
                  value={task} 
                  onChange={(e) => setTask(e.target.value)} 
                  placeholder="Add a new task..." 
              />
              <button onClick={addTodo}>Add Task</button>
          </div>
          
          <h2>All Todos</h2>
          <ul className="todo-list">
              {todos.map(todo => (
                  <li key={todo._id} className={todo.done ? 'completed' : ''}>
                      {editId === todo._id ? (
                          <>
                              <input 
                                  type="text" 
                                  value={editTask} 
                                  onChange={(e) => setEditTask(e.target.value)} 
                                  placeholder="Edit task..."
                              />
                              <button onClick={() => editTodo(todo._id)}>Save</button>
                          </>
                      ) : (
                          <>
                              <span onClick={() => toggleTodo(todo._id)}>{todo.task}</span>
                              <button onClick={() => { 
                                  setEditId(todo._id); 
                                  setEditTask(todo.task);
                              }}>Edit</button>
                              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                          </>
                      )}
                  </li>
              ))}
          </ul>

          <button onClick={() => setShowCompleted(!showCompleted)}>
              {showCompleted ? "Hide Completed Todos" : "Show Completed Todos"}
          </button>

          {showCompleted && (
              <>
                  <h2>Completed Todos</h2>
                  <ul className="todo-list">
                      {completedTodos.map(todo => (
                          <li key={todo._id} className='completed'>
                              <span>{todo.task}</span>
                          </li>
                      ))}
                  </ul>
              </>
          )}
      </div>
  );
}

export default App;


