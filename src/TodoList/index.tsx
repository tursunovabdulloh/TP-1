import React, { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    try {
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error("Error parsing todos from localStorage", error);
      return [];
    }
  });
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodo.trim() === "") return;
    const date = new Date().toLocaleString();
    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      date: date,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo(""); // Clear newTodo input after adding
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (todo: Todo) => {
    setEditTodo(todo);
  };

  const handleUpdateTodo = () => {
    if (editTodo && editTodo.text.trim() !== "") {
      setTodos(
        todos.map((todo) =>
          todo.id === editTodo.id ? { ...todo, text: editTodo.text } : todo
        )
      );
      setEditTodo(null);
    }
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  console.log(todos);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={editTodo ? editTodo.text : newTodo}
            onChange={(e) =>
              editTodo
                ? setEditTodo({ ...editTodo, text: e.target.value })
                : setNewTodo(e.target.value)
            }
            className="w-full px-3 py-2 border rounded mr-2"
            placeholder="Add a new task..."
          />
          {editTodo ? (
            <button
              onClick={handleUpdateTodo}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          ) : (
            <button
              onClick={handleAddTodo}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          )}
        </div>
        <ul>
          {Array.isArray(todos) ? (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex justify-between items-center p-2 border-b ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    className="mr-2"
                  />
                  {todo.text}
                </div>
                <div className="text-sm text-gray-400">{todo.date}</div>
                <div className="flex">
                  <button
                    onClick={() => handleEditTodo(todo)}
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-red-500">Error: todos is not an array</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
