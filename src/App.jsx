import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  return (
    <div>
      <h1>To-Do</h1>
      <input value={task} onChange={(e) => setTask(e.target.value)} />
      <button
        onClick={() => {
          if (!task) return;
          setTasks([...tasks, task]);
          setTask("");
        }}
      >
        Add
      </button>

      <ul>
        {tasks.map((t, i) => (
          <li key={i}>
            {t}{" "}
            <button onClick={() => setTasks(tasks.filter((_, j) => j !== i))}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
