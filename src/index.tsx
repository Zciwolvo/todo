import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import DailyTasks from "./DailyTasks";
import SingleTimeTasks from "./SingleTimeTasks";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/daily-tasks" element={<DailyTasks></DailyTasks>} />
        <Route
          path="/single-time-tasks"
          element={<SingleTimeTasks></SingleTimeTasks>}
        />
      </Routes>
    </Router>
  </Provider>,
  document.getElementById("root")
);
