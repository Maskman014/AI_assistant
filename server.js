const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Example API route
app.post("/api/book", (req, res) => {
  const { name, issue, date } = req.body;

  // Temporary example doctor assignment
  let doctor = "General Physician";
  if (issue.toLowerCase().includes("heart")) doctor = "Cardiologist";
  else if (issue.toLowerCase().includes("bone")) doctor = "Orthopedic";
  else if (issue.toLowerCase().includes("eye")) doctor = "Ophthalmologist";

  res.json({
    appointment: {
      name,
      issue,
      date,
      doctor,
      department: doctor,
      contact: "+91-98765-43210",
      room: "Room 101",
    },
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
