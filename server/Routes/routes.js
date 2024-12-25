const e = require('express');
const route = e.Router();
const taskS = require("../Model/model");

// Add Task
route.post("/add", async (req, res) => {
    try {
        const task = req.body.task;
        const todo = new taskS({ task });
        await todo.save();
        return res.status(200).json({ message: { todo } });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error adding task" });
    }
});

// Get all the Tasks
route.get("/", async (req, res) => {
    try {
        const todos = await taskS.find();
        if (!todos.length) {
            return res.status(404).json({ message: "There are no tasks" });
        }
        return res.status(200).json({ message: { todos } });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error fetching tasks" });
    }
});

// Get particular Task using id
route.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await taskS.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Task Not found" });
        }
        return res.status(200).json({ message: { todo } });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error fetching task" });
    }
});



// Toggle Task Completion
route.put("/toggle/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await taskS.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Task Not found" });
        }
        
        todo.done = !todo.done;
        await todo.save(); 
        
        return res.status(200).json({ message: { todo } });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error updating task" });
    }
});



// Update Task
route.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { task } = req.body; 
    try {
        const updatedTodo = await taskS.findByIdAndUpdate(id, { task }, { new: true });
        
        if (!updatedTodo) {
            return res.status(404).json({ message: "Unable to update, Task not found" });
        }
        
        return res.status(200).json({ message: { updatedTodo } });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error updating task" });
    }
});

// Delete Task
route.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await taskS.findByIdAndDelete(id);
        
        if (!todo) {
            return res.status(404).json({ message: "Unable to delete, Task not found" });
        }
        
        return res.status(200).json({ message: "Deleted Successfully" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error deleting task" });
    }
});

module.exports = route;
