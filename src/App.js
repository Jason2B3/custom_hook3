import React, { useEffect, useState, useCallback } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useFetch from "./hooks/useFetch";
function App() {
  const [tasks, setTasks] = useState([]); // stateful task list

  // Component specific success function
  // This is what we do if the useFetch custom hook succeeds in pulling data down from Firebase
  const transformTasks = useCallback(function (tasksObj) {
    const loadedTasks = [];
    // Fill up an array with objects describing each saved task in Firebase
    for (const taskKey in tasksObj) {
      loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
    }
    setTasks(loadedTasks); // update the stateful tasks array
  },[]) // no dependencies needed

  const {
    isLoading,
    error,
    sendRequest: fetchTasks, // rename the imported sendRequest ƒ() to be more informative
  } = useFetch(
    { url: "https://customhook3-default-rtdb.firebaseio.com/tasks.json" },
    transformTasks
  ); // Import the useFetch states and methods

  // On startup, fetch any existing tasks already saved on Firebase
  useEffect(() => {
    fetchTasks(); // this function may return different values on re-render
  }, [fetchTasks]); // add it as a dep, but protect its declaration in useFetch.js from ƒ() recreation

  // On submission, add a task to the stateful tasks array
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
