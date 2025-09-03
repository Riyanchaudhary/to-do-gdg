import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [list, setList] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [mode, setMode] = useState("dark");

  const switchMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", { ascending: true });

    if (!error) {
      setList(data);
    } else {
      console.error(error);
    }
  };

  const addOrUpdate = async () => {
    if (!text.trim()) return;

    if (editIdx !== null) {
      const item = list[editIdx];
      const { error } = await supabase
        .from("todos")
        .update({ text: text, last_date: deadline || null })
        .eq("id", item.id)
        .eq("user_email", user.email);

      if (!error) {
        const updated = [...list];
        updated[editIdx].text = text;
        updated[editIdx].last_date = deadline || null;
        setList(updated);
        setEditIdx(null);
      }
    } else {
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            text: text,
            date: new Date().toLocaleDateString(),
            last_date: deadline || null,
            user_email: user.email,
          },
        ])
        .select();

      if (!error && data) {
        setList([...list, data[0]]);
      }
    }

    setText("");
    setDeadline("");
  };

  const toggleDone = async (i) => {
    const item = list[i];
    const { error } = await supabase
      .from("todos")
      .update({ completed: !item.completed })
      .eq("id", item.id)
      .eq("user_email", user.email);

    if (!error) {
      const updated = [...list];
      updated[i].completed = !item.completed;
      setList(updated);
    }
  };

  const editItem = (i) => {
    setText(list[i].text);
    setDeadline(list[i].last_date || "");
    setEditIdx(i);
  };

  const deleteItem = async (i) => {
    const item = list[i];
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", item.id)
      .eq("user_email", user.email);

    if (!error) {
      setList(list.filter((_, idx) => idx !== i));
    }
  };

  const done = list.filter((t) => t.completed);
  const notDone = list.filter((t) => !t.completed);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={mode === "light" ? "light-mode" : ""}>
      <div className="App">
        <div className={`theme-switch ${mode}`} onClick={switchMode}>
          {mode === "dark" ? "🌙" : "☀️"}
        </div>

        <h1>To-Do</h1>

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
            <div className="input-group">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter task"
              />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <button className="btn-primary" onClick={addOrUpdate}>
                {editIdx !== null ? "Update" : "Add"}
              </button>
            </div>

            <ul>
              {list.map((t, i) => (
                <li key={t.id}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleDone(i)}
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
                  <button className="btn-edit" onClick={() => editItem(i)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => deleteItem(i)}>
                    X
                  </button>
                </li>
              ))}
            </ul>

            <button
              className="debrieftoggle"
              onClick={() => setShowSummary(!showSummary)}
            >
              {showSummary ? "Hide" : "Show"} Daily Debrief
            </button>

            {showSummary && (
              <div className="debrief">
                <h2>Daily Debrief</h2>
                <h3>✅ Completed Today</h3>
                <ul>
                  {done.length > 0 ? (
                    done.map((t) => <li key={t.id}>{t.text}</li>)
                  ) : (
                    <p>No tasks completed today.</p>
                  )}
                </ul>

                <h3>❌ Not Completed</h3>
                <ul>
                  {notDone.length > 0 ? (
                    notDone.map((t) => (
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
