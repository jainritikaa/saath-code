"use client"; // Add this line at the top to ensure it's a client-side component

import { useState } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState<
    { text: string; status: string; completed: boolean }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>("");

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { text: inputValue.trim(), status: "In progress", completed: false },
      ]);
      setInputValue("");
    }
  };

  const removeTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const toggleCompletion = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    newTodos[index].status = newTodos[index].completed ? "Done" : "In progress";
    setTodos(newTodos);
  };

  const getStatusButtonStyle = (status: string) => {
    switch (status) {
      case "In progress":
        return "text-orange-500 bg-orange-50";
      case "On hold":
        return "text-blue-500 bg-blue-50";
      case "Done":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-2 bg-white px-4">
      <h1 className="text-2xl font-bold text-center mb-4">Task Manager</h1>
      {todos.length === 0 ? (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-left mb-2">Features</h2>
            <ul className="text-gray-500 text-sm list-disc list-inside ml-4">
              <li>Real-time collaborative code editing.</li>
              <li>Multiple language support.</li>
              <li>Integrated terminal and output window.</li>
              <li>To-do list for task management.</li>
              <li>Code highlighting and formatting.</li>
            </ul>
          </div>
          <div className="flex mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new task"
              className="border border-gray-300 text-sm rounded-md h-8 flex-grow px-2"
            />
            <button
              onClick={addTodo}
              className="p-2 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-blue-200 text-blue-500 h-8 bg-blue-50 rounded-md px-2 ml-2 cursor-pointer"
            >
              Add
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new task"
              className="border border-gray-300 text-xs rounded-md h-8 flex-grow px-2"
            />
            <button
              onClick={addTodo}
              className="p-2 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-blue-200 text-blue-500 h-8 bg-blue-50 rounded-md px-2 ml-2 cursor-pointer"
            >
              Add
            </button>
          </div>
          <ul className="w-full max-w-md bg-blue-50 rounded-lg">
            {todos.map((todo, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-sm border-b p-2 border-gray-200"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompletion(index)}
                    className="mr-2"
                  />
                  <span className={todo.completed ? "line-through" : ""}>
                    {todo.text}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    className={`mr-4 py-1 px-2 rounded-sm ${getStatusButtonStyle(
                      todo.status
                    )}`}
                  >
                    {todo.status}
                  </button>
                  <button
                    onClick={() => removeTodo(index)}
                    className="text-left inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-blue-200 px-4 py-1 rounded-md bg-blue-50 text-blue-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TodoList;
