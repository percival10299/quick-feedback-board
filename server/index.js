// server/index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let feedbackList = [];

app.get("/api/feedback", (req, res) => {
  res.json(feedbackList);
});

app.post("/api/feedback", (req, res) => {
  const { message } = req.body;
  if (message && message.trim() !== "") {
    const newEntry = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      comments: []   // <-- each new feedback has its own empty comments array
    };
    feedbackList.push(newEntry);
    res.status(201).json(newEntry);
  } else {
    res.status(400).json({ error: "Message is required" });
  }
});

app.post("/api/feedback/:id/upvote", (req, res) => {
  const id = Number(req.params.id);
  const item = feedbackList.find(f => f.id === id);
  if (item) {
    item.upvotes++;
    res.json(item);
  } else {
    res.status(404).json({ error: "Feedback not found" });
  }
});

// Add comment to a feedback item
app.post("/api/feedback/:id/comments", (req, res) => {
  const id = Number(req.params.id);
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Comment message required" });
  }

  const item = feedbackList.find(f => f.id === id);
  if (!item) {
    return res.status(404).json({ error: "Feedback not found" });
  }

  if (!item.comments) item.comments = [];

  const newComment = {
    id: Date.now(),
    message,
    timestamp: new Date().toISOString()
  };

  item.comments.push(newComment);

  res.status(201).json(newComment);
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
