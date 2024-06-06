import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  timestamp: number;
}

interface TodoState {
  dailyTodos: Todo[];
}

const initialState: TodoState = {
  dailyTodos: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<Todo>) {
      state.dailyTodos.push(action.payload);
    },
    deleteTodo(state, action: PayloadAction<number>) {
      state.dailyTodos = state.dailyTodos.filter(
        (todo) => todo.id !== action.payload
      );
    },
    markAsDone(state, action: PayloadAction<number>) {
      const todo = state.dailyTodos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.done = !todo.done;
      }
    },
  },
});

export const { addTodo, deleteTodo, markAsDone } = todoSlice.actions;
export default todoSlice.reducer;
