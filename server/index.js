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
      upvotes: 0
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
