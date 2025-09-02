import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showDebrief, setShowDebrief] = useState(false);

  // Load tasks from Supabase on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) setTasks(data);
  };

  // Add or update task
  const handleAddOrUpdate = async () => {
    if (!task.trim()) return;

    if (editIndex !== null) {
      const t = tasks[editIndex];
      const { error } = await supabase
        .from("todos")
        .update({ text: task })
        .eq("id", t.id);
      if (!error) {
        const updated = [...tasks];
        updated[editIndex].text = task;
        setTasks(updated);
        setEditIndex(null);
      }
    } else {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ text: task, date: new Date().toLocaleDateString() }])
        .select();
      if (!error && data) setTasks([...tasks, data[0]]);
    }
    setTask("");
  };

  // Toggle complete
  const toggleComplete = async (index) => {
    const t = tasks[index];
    const { error } = await supabase
      .from("todos")
      .update({ completed: !t.completed })
      .eq("id", t.id);
    if (!error) {
      const updated = [...tasks];
      updated[index].completed = !t.completed;
      setTasks(updated);
    }
  };

  // Edit
  const handleEdit = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  // Delete
  const handleDelete = async (index) => {
    const t = tasks[index];
    const { error } = await supabase.from("todos").delete().eq("id", t.id);
    if (!error) setTasks(tasks.filter((_, i) => i !== index));
  };

  // Roll over
  const rollOver = async (index) => {
    const t = tasks[index];
    const newDate = new Date().toLocaleDateString();
    const { error } = await supabase
      .from("todos")
      .update({ date: newDate })
      .eq("id", t.id);
    if (!error) {
      const updated = [...tasks];
      updated[index].date = newDate;
      setTasks(updated);
    }
  };

  // Reschedule
  const reschedule = async (index) => {
    const t = tasks[index];
    const newDate = prompt(
      "Enter new date (DD/MM/YYYY):",
      new Date().toLocaleDateString()
    );
    if (newDate) {
      const { error } = await supabase
        .from("todos")
        .update({ date: newDate })
        .eq("id", t.id);
      if (!error) {
        const updated = [...tasks];
        updated[index].date = newDate;
        setTasks(updated);
      }
    }
  };

  // Re-Evaluate
  const reEvaluate = (index) => {
    const reason = prompt(
      "What was the blocker? (Ran out of time / Energy low / Too big / Not priority)"
    );
    if (reason) {
      alert(`Noted: "${reason}" for "${tasks[index].text}"`);
      // Later we can save this into a "reasons" table in Supabase
    }
  };

  const completedTasks = tasks.filter((t) => t.completed);
  const notCompletedTasks = tasks.filter((t) => !t.completed);

  return (
    <div>
      <h1>To-Do</h1>

      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={handleAddOrUpdate}>
        {editIndex !== null ? "Update" : "Add"}
      </button>

      <ul>
        {tasks.map((t, i) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleComplete(i)}
            />
            <span
              style={{ textDecoration: t.completed ? "line-through" : "none" }}
            >
              {t.text} ({t.date})
            </span>
            <button onClick={() => handleEdit(i)}>Edit</button>
            <button onClick={() => handleDelete(i)}>X</button>
          </li>
        ))}
      </ul>

      <button onClick={() => setShowDebrief(!showDebrief)}>
        {showDebrief ? "Hide" : "Show"} Daily Debrief
      </button>

      {showDebrief && (
        <div style={{ marginTop: "20px" }}>
          <h2>Daily Debrief</h2>
          <h3>✅ Completed Today</h3>
          <ul>
            {completedTasks.length > 0 ? (
              completedTasks.map((t) => <li key={t.id}>{t.text}</li>)
            ) : (
              <p>No tasks completed today.</p>
            )}
          </ul>

          <h3>❌Not Completed</h3>
          <ul>
            {notCompletedTasks.length > 0 ? (
              notCompletedTasks.map((t, i) => (
                <li key={t.id}>
                  {t.text} ({t.date}){" "}
                  <button onClick={() => rollOver(i)}>Roll Over</button>
                  <button onClick={() => reschedule(i)}>Reschedule</button>
                  <button onClick={() => reEvaluate(i)}>Re-evaluate</button>
                  <button onClick={() => handleDelete(i)}>Delete</button>
                </li>
              ))
            ) : (
              <p>All tasks done 🎉</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
