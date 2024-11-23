const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Save completed task
// Save completed task
router.post("/save", async (req, res) => {
    try {
        const { name, description, isCompleted } = req.body;

        // Ensure fields are correct
        if (!name || !description) {
            return res.status(400).send("Name and description are required");
        }

        // If task already exists, update instead of creating new
        const existingTask = await Task.findOne({ name, description });
        if (existingTask) {
            existingTask.isCompleted = isCompleted || existingTask.isCompleted;
            await existingTask.save();
            return res.status(200).json(existingTask); // Return updated task
        }

        // Create a new task
        const newTask = new Task({ name, description, isCompleted });
        await newTask.save();
        res.status(201).json(newTask); // Respond with the created task
    } catch (err) {
        console.error("Error saving task:", err);
        res.status(500).send("Error saving task");
    }
});


// Fetch all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Error fetching tasks");
    }
});

// Delete task by ID
// In your backend, for example routes/tasks.js
// In your backend, for example routes/tasks.js
// In your backend, for example routes/tasks.js
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract task ID from URL parameters
        const task = await Task.findByIdAndDelete(id); // Find and delete the task
        if (!task) {
            return res.status(404).send("Task not found");
        }
        res.status(200).send("Task deleted successfully");
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).send("Error deleting task");
    }
});



module.exports = router;
