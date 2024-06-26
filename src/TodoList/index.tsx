import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";

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

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    const date = new Date().toLocaleString();
    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      date: date,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-center text-gray-600 tracking-wider mb-8">
        TODO APP
      </h1>
      <div className="bg-[#fff] p-8 rounded shadow-lg xl:w-[900px] md:w-[580px]">
        <form onSubmit={handleAddTodo} className="flex mb-4">
          <input
            type="text"
            value={editTodo ? editTodo.text : newTodo}
            onChange={(e) =>
              editTodo
                ? setEditTodo({ ...editTodo, text: e.target.value })
                : setNewTodo(e.target.value)
            }
            className="input input-bordered w-full input-info px-3 py-6 border rounded mr-2"
            placeholder="Add a new task..."
          />
          {editTodo ? (
            <button
              type="button"
              onClick={handleUpdateTodo}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          ) : (
            <button
              type="submit"
              className="bg-error text-white px-6 py-2 rounded"
            >
              Add
            </button>
          )}
        </form>
        <ul className="space-y-4">
          {Array.isArray(todos) ? (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex justify-between items-center p-4 border rounded shadow-sm ${
                  todo.completed ? "bg-gray-200" : "bg-white"
                }`}
              >
                <div className="flex items-center">
                  <FaCheck
                    onClick={() => handleToggleComplete(todo.id)}
                    className={`mr-4 cursor-pointer text-[25px] ${
                      todo.completed ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <div className="text-sm text-gray-400">{todo.date}</div>
                <div className="flex items-center ">
                  <FaEdit
                    onClick={() => handleEditTodo(todo)}
                    className={`text-blue-500 mr-2 cursor-pointer text-[30px] ${
                      todo.completed ? "cursor-not-allowed" : ""
                    }`}
                    style={{ pointerEvents: todo.completed ? "none" : "auto" }}
                  />
                  <FaTrash
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-500 cursor-pointer mt-1 text-[30px] "
                  />
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
