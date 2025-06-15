// client/src/App.js
import React, { useEffect, useState } from "react";

function App() {
  const [feedback, setFeedback] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

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

  const submitComment = (feedbackId) => {
    const comment = commentInputs[feedbackId];
    if (!comment || comment.trim() === "") return;

    fetch(`http://localhost:3001/api/feedback/${feedbackId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: comment }),
    })
      .then(res => res.json())
      .then(newComment => {
        setFeedback(prev =>
          prev.map(f =>
            f.id === feedbackId
              ? { ...f, comments: [...(f.comments || []), newComment] }
              : f
          )
        );
        setCommentInputs(prev => ({ ...prev, [feedbackId]: "" }));
      });
  };

  const sorted = [...feedback].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🚀 Quick Feedback Board</h1>
      {/* Existing input + submit feedback */}
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
        {sorted.map(f => (
          <li key={f.id} style={{ marginBottom: "2rem" }}>
            <div>
              {f.message} - {f.upvotes} votes
              <button onClick={() => upvote(f.id)} style={{ marginLeft: "1rem" }}>
                ▲ Upvote
              </button>
              <div style={{ fontSize: "0.8rem", color: "gray" }}>
                {new Date(f.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Comments Section */}
            <div style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
              <strong>Comments:</strong>
              <ul>
                {(f.comments || []).map(c => (
                  <li key={c.id}>
                    {c.message} <span style={{ fontSize: "0.7rem", color: "gray" }}>
                      ({new Date(c.timestamp).toLocaleString()})
                    </span>
                  </li>
                ))}
              </ul>

              {/* Add comment input */}
              <input
                placeholder="Add a comment..."
                value={commentInputs[f.id] || ""}
                onChange={e =>
                  setCommentInputs(prev => ({ ...prev, [f.id]: e.target.value }))
                }
                style={{ width: "300px", marginRight: "0.5rem" }}
              />
              <button onClick={() => submitComment(f.id)}>Comment</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App;