import React, { useState, useEffect } from "react";

const Todo = () => {
    const [Todo, setTodo] = useState({ name: "", description: "" });
    const [Todos, setTodos] = useState([]);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState(""); // For notifications

    useEffect(() => {
        fetch("http://localhost:5000/api/tasks")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to load tasks");
                return response.json();
            })
            .then((data) => setTodos(data))
            .catch((err) => console.error("Error loading tasks:", err));
    }, []);

    const handleChange = (e) => {
        setTodo({ ...Todo, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        if (!Todo.name.trim() || !Todo.description.trim()) {
            setError(true);
            return;
        }
        setError(false);
        setTodos([...Todos, { ...Todo, isCompleted: false }]);
        setTodo({ name: "", description: "" });

        setMessage("Data is Added Successfully!"); // Show saved message
        setTimeout(() => setMessage(""), 2000); // Clear message after 2 seconds
    };

    const handleToggleComplete = async (index) => {
        const toggledTask = { ...Todos[index], isCompleted: !Todos[index].isCompleted };

        try {
            const response = await fetch("http://localhost:5000/api/tasks/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(toggledTask),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const updatedTask = await response.json(); // Updated task from the backend
            const updatedTodos = [...Todos];
            updatedTodos[index] = updatedTask; // Replace with the updated task
            setTodos(updatedTodos);

            setMessage("Data is save successfully!"); // Show updated message
            setTimeout(() => setMessage(""), 2000); // Clear message after 2 seconds

            console.log("Task saved successfully.");
        } catch (err) {
            console.error("Error saving task:", err.message);
        }
    };

    const handleDelete = async (index) => {
        const taskToDelete = Todos[index];

        if (!taskToDelete._id) {
            console.error("Task ID is missing:", taskToDelete);
            return; // Exit if ID is missing
        }

        const updatedTodos = Todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);

        try {
            const url = `http://localhost:5000/api/tasks/${taskToDelete._id}`;
            console.log(`Sending DELETE request to: ${url}`);

            const response = await fetch(url, {
                method: "DELETE",
            });

            if (!response.ok) {
                console.error(`Failed to delete task. Response status: ${response.status}`);
                throw new Error("Failed to delete task");
            }

            setMessage("Data is deleted!"); // Show deleted message
            setTimeout(() => setMessage(""), 2000); // Clear message after 2 seconds

            console.log("Task deleted successfully");
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    return (
        <div className="container">
            <section className="Todo-box">
                <h1>Todo List</h1>
                {error && <p>Both fields are required!</p>}
                {message && <p className="notification">{message}</p>} {/* Display the notification */}
                <input
                    type="text"
                    placeholder="Enter task name"
                    name="name"
                    value={Todo.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="Enter task description"
                    name="description"
                    value={Todo.description}
                    onChange={handleChange}
                />
                <button onClick={handleAdd}>Add</button>
            </section>

            <div className="todos">
                {Todos.map((item, index) => (
                    <div className="todo-card" key={index}>
                        <div>
                            <strong>Name:</strong> <span>{item.name}</span>
                        </div>
                        <div>
                            <strong>Description:</strong> {item.description}
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                checked={item.isCompleted}
                                onChange={() => handleToggleComplete(index)}
                            />
                            <label>Mark as Completed</label>
                            <button onClick={() => handleDelete(index)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Todo;
