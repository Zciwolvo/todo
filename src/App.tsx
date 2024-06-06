import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingIcon from "./loadingIcon";
import logo from "./todo.svg";
import "./App.css";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  timestamp: number;
}

function App(): JSX.Element {
  const [dailyTodos, setDailyTodos] = useState<Todo[]>([]);
  const [singleTimeTodos, setSingleTimeTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isDaily, setIsDaily] = useState<boolean>(true);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [isSlowResponse, setIsSlowResponse] = useState<boolean>(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const startTime = Date.now();
        const response = await axios.get(
          "https://www.igorgawlowicz.pl/todo/todos"
        );
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (responseTime > 100) {
          setIsSlowResponse(true);
        } else {
          setIsSlowResponse(false);
        }

        const { dailyTodos, singleTimeTodos } = response.data;

        setTimeout(() => {
          setIsSlowResponse(false);
          setDailyTodos(dailyTodos);
          setSingleTimeTodos(singleTimeTodos);
        }, 500);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  useEffect(() => {
    const body = document.body;
    if (isNightMode) {
      body.classList.add("night-mode");
    } else {
      body.classList.remove("night-mode");
    }
  }, [isNightMode]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== "") {
      const newTodo: Omit<Todo, "id"> = {
        text: inputValue,
        done: false,
        timestamp: new Date().getTime(),
      };
      try {
        const response = await axios.post(
          "https://www.igorgawlowicz.pl/todo/todos",
          {
            newTodo,
            isDaily,
          }
        );
        const createdTodo = response.data;
        if (isDaily) {
          setDailyTodos([...dailyTodos, createdTodo]);
        } else {
          setSingleTimeTodos([...singleTimeTodos, createdTodo]);
        }
        setInputValue("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleDeleteTodo = async (id: number, isDaily: boolean) => {
    try {
      await axios.delete(`https://www.igorgawlowicz.pl/todo/todos/${id}`);
      if (isDaily) {
        setDailyTodos(dailyTodos.filter((todo) => todo.id !== id));
      } else {
        setSingleTimeTodos(singleTimeTodos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleToggle = () => {
    setIsDaily(!isDaily);
  };

  const handleNightModeToggle = () => {
    setIsNightMode(!isNightMode);
  };

  const handleMarkAsDone = async (id: number, isDaily: boolean) => {
    try {
      const updatedTodos = (isDaily ? dailyTodos : singleTimeTodos).map(
        (todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)
      );
      await axios.put(`https://www.igorgawlowicz.pl/todo/todos/${id}`, {
        done: !isDaily ? dailyTodos : singleTimeTodos,
      });
      if (isDaily) {
        setDailyTodos(updatedTodos);
      } else {
        setSingleTimeTodos(updatedTodos);
      }
    } catch (error) {
      console.error("Error marking todo as done:", error);
    }
  };

  return (
    <div
      className={`App ${
        isNightMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <header className="App-header">
        <h1
          className="text-2xl mb-4 flex items-center"
          style={{ justifyContent: "center" }}
        >
          Todo App (Igor Gawłowicz)
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "24px",
              height: "24px",
              marginLeft: "8px",
            }}
            className="inline-block"
          />
        </h1>
        <div className="toggle-container flex justify-between items-center">
          <div className="toggle flex items-center">
            <label className="switch">
              <input type="checkbox" onChange={handleNightModeToggle} />
              <span className="slider round"></span>
            </label>
            <span>Night Mode</span>
          </div>
          <div className="task-toggle">
            <button
              className="bg-transparent hover:bg-blue-500 text-grey-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={handleToggle}
            >
              {isDaily ? "Daily Tasks" : "Single-time Tasks"}
            </button>
          </div>
        </div>
      </header>
      <div className="container mx-auto p-4">
        <div className="input-group flex mb-3">
          <input
            type="text"
            className="form-control rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:ring-1"
            placeholder="Enter a todo"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-black py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            type="button"
            onClick={handleAddTodo}
          >
            Add Todo
          </button>
        </div>
        <div className="todos">
          {isDaily
            ? dailyTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="todo-item p-3 bg-white rounded-md shadow-sm flex justify-between items-center"
                >
                  <span
                    className={`text-lg ${todo.done ? "line-through" : ""}`}
                    onClick={() => handleMarkAsDone(todo.id, true)}
                  >
                    {todo.text}
                  </span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteTodo(todo.id, true)}
                  >
                    Delete
                  </button>
                </div>
              ))
            : singleTimeTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="todo-item p-3 bg-white rounded-md shadow-sm flex justify-between items-center"
                >
                  <span
                    className={`text-lg ${todo.done ? "line-through" : ""}`}
                    onClick={() => handleMarkAsDone(todo.id, false)}
                  >
                    {todo.text}
                  </span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteTodo(todo.id, false)}
                  >
                    Delete
                  </button>
                </div>
              ))}
        </div>
        {isSlowResponse && <LoadingIcon />}{" "}
        <ul>
          <li>
            <Link to="/daily-tasks">Daily Tasks</Link>
          </li>
          <li>
            <Link to="/single-time-tasks">Single-time Tasks</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
