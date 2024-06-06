import React, { useState, useEffect } from "react";
import axios from "axios";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  timestamp: number;
}

const SingleTimeTasks: React.FC = () => {
  const [dailyTodos, setDailyTodos] = useState<Todo[]>([]);
  const [singleTimeTodos, setSingleTimeTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          "https://www.igorgawlowicz.pl/todo/todos"
        );
        const { dailyTodos, singleTimeTodos } = response.data;
        setDailyTodos(dailyTodos);
        setSingleTimeTodos(singleTimeTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  return (
    <div>
      <h2>Daily Tasks</h2>
      <ul>
        {singleTimeTodos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default SingleTimeTasks;
