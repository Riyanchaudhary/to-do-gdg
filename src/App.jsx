import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  const [task, setTask] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showDebrief, setShowDebrief] = useState(false);
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // fetch tasks whenever user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTasks();
    }
  }, [isAuthenticated, user]);

  // fetch todos only for this user
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("❌ Error fetching tasks:", error);
    } else {
      setTasks(data);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!task.trim()) return;

    if (editIndex !== null) {
      // update
      const t = tasks[editIndex];
      const { error } = await supabase
        .from("todos")
        .update({ text: task, last_date: lastDate || null })
        .eq("id", t.id)
        .eq("user_email", user.email);

      if (!error) {
        const updated = [...tasks];
        updated[editIndex].text = task;
        updated[editIndex].last_date = lastDate || null;
        setTasks(updated);
        setEditIndex(null);
      } else {
        console.error("❌ Error updating task:", error);
      }
    } else {
      // insert new
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            text: task,
            date: new Date().toLocaleDateString(),
            last_date: lastDate || null,
            user_email: user.email, // directly linked to user
          },
        ])
        .select();

      if (!error && data) {
        setTasks([...tasks, data[0]]);
      } else {
        console.error("❌ Error adding task:", error);
      }
    }

    setTask("");
    setLastDate("");
  };

  const toggleComplete = async (index) => {
    const t = tasks[index];
    const { error } = await supabase
      .from("todos")
      .update({ completed: !t.completed })
      .eq("id", t.id)
      .eq("user_email", user.email);

    if (!error) {
      const updated = [...tasks];
      updated[index].completed = !t.completed;
      setTasks(updated);
    } else {
      console.error("❌ Error toggling complete:", error);
    }
  };

  const handleEdit = (index) => {
    setTask(tasks[index].text);
    setLastDate(tasks[index].last_date || "");
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const t = tasks[index];
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", t.id)
      .eq("user_email", user.email);

    if (!error) {
      setTasks(tasks.filter((_, i) => i !== index));
    } else {
      console.error("❌ Error deleting task:", error);
    }
  };

  const completedTasks = tasks.filter((t) => t.completed);
  const notCompletedTasks = tasks.filter((t) => !t.completed);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={theme === "light" ? "light-mode" : ""}>
      <div className="App">
        {/* Theme toggle */}
        <div className={`theme-switch ${theme}`} onClick={toggleTheme}>
          {theme === "dark" ? "🌙" : "☀️"}
        </div>

        <h1>To-Do</h1>

        {/* Auth Buttons */}
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Log In</button>
        ) : (
          <div style={{ marginBottom: "20px" }}>
            <p>Welcome, {user.name || user.email} 👋</p>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </button>
          </div>
        )}

        {isAuthenticated && (
          <>
            {/* Task Input */}
            <div className="input-group">
              <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter task"
              />
              <input
                type="date"
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
              />
              <button className="btn-primary" onClick={handleAddOrUpdate}>
                {editIndex !== null ? "Update" : "Add"}
              </button>
            </div>

            {/* Task List */}
            <ul>
              {tasks.map((t, i) => (
                <li key={t.id}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(i)}
                  />
                  <span
                    style={{
                      textDecoration: t.completed ? "line-through" : "none",
                    }}
                  >
                    {t.text} ({t.date})
                    {t.last_date && (
                      <span style={{ color: "gray" }}>
                        {" "}
                        | Deadline: {t.last_date}
                      </span>
                    )}
                  </span>
                  <button className="btn-edit" onClick={() => handleEdit(i)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(i)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>

            {/* Daily Debrief */}
            <button
              className="debrieftoggle"
              onClick={() => setShowDebrief(!showDebrief)}
            >
              {showDebrief ? "Hide" : "Show"} Daily Debrief
            </button>

            {showDebrief && (
              <div className="debrief">
                <h2>Daily Debrief</h2>
                <h3>✅ Completed Today</h3>
                <ul>
                  {completedTasks.length > 0 ? (
                    completedTasks.map((t) => <li key={t.id}>{t.text}</li>)
                  ) : (
                    <p>No tasks completed today.</p>
                  )}
                </ul>

                <h3>❌ Not Completed</h3>
                <ul>
                  {notCompletedTasks.length > 0 ? (
                    notCompletedTasks.map((t) => (
                      <li key={t.id}>
                        {t.text} ({t.date})
                        {t.last_date && (
                          <span style={{ color: "gray" }}>
                            {" "}
                            | Deadline: {t.last_date}
                          </span>
                        )}
                      </li>
                    ))
                  ) : (
                    <p>All tasks done 🎉</p>
                  )}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
