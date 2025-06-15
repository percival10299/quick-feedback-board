// client/src/App.js
import React, { useEffect, useState } from "react";

function App() {
  const [feedback, setFeedback] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedback(data));
  }, []);

  const submitFeedback = () => {
    if (newMessage.trim() === "") return;
    fetch("http://localhost:3001/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedback([...feedback, data]);
        setNewMessage("");
      });
  };

  const upvote = (id) => {
    fetch(`http://localhost:3001/api/feedback/${id}/upvote`, { method: "POST" })
      .then((res) => res.json())
      .then((updated) => {
        setFeedback((prev) =>
          prev.map((f) => (f.id === updated.id ? updated : f))
        );
      });
  };

  const sorted = [...feedback].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🚀 Quick Feedback Board</h1>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Leave a message (max 200 characters)"
        maxLength={200}
        style={{ padding: "0.5rem", width: "300px" }}
      />
      <button onClick={submitFeedback} style={{ marginLeft: "1rem" }}>
        Submit
      </button>
      <ul>
        {sorted.map((f) => (
          <li key={f.id}>
            {f.message} - {f.upvotes} votes
            <button onClick={() => upvote(f.id)} style={{ marginLeft: "1rem" }}>
              ▲ Upvote
            </button>
            <div style={{ fontSize: "0.8rem", color: "gray" }}>
              {new Date(f.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
