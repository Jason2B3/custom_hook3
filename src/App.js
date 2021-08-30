import React, { useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      //^ Grab JSON data from Firebase back end
      const response = await fetch(
        "https://customhook3-default-rtdb.firebaseio.com/tasks.json"
      );
      if (!response.ok) throw new Error("Request failed!");
      const data = await response.json();
      //^ Load the tasks into the array below, then update the stateful one
      const loadedTasks = [];
      for (const taskKey in data) {
        loadedTasks.push({ id: taskKey, text: data[taskKey].text });
      }
      setTasks(loadedTasks); // update stateful array
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  };
  // Run the fetchTasks function on starup to grab any existing entries
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a task to the stateful tasks array
  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
