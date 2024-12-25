// src/FetchTasks.js
import React, { useEffect, useState } from "react";
import { ref, onValue, set, remove, update } from "firebase/database";
import { database } from "./Firebase";
import "./App.css"; // Create and use a CSS file for styling

const FetchTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, "tasks");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tasksArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: name === "completed" ? e.target.checked : value,
    }));
  };

  const generateRandomId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const taskId = editTaskId || generateRandomId();
      const taskRef = ref(database, `tasks/${taskId}`);

      await set(taskRef, newTask);

      alert(editTaskId ? "Task updated successfully!" : "Task added successfully!");
      setEditTaskId(null);
      setNewTask({ title: "", description: "", completed: false });
    } catch (error) {
      console.error("Error adding/updating task:", error);
      alert("Failed to add/update task. Please try again.");
    }
  };

  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      completed: task.completed,
    });
    setEditTaskId(task.id);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const taskRef = ref(database, `tasks/${taskId}`);
      await remove(taskRef);
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const toggleTaskCompletion = async (task) => {
    try {
      const taskRef = ref(database, `tasks/${task.id}`);
      await update(taskRef, { completed: !task.completed });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const notCompletedTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <>
    <div className="task-container">
      <h1>Task Manager</h1>

      <form className="task-form" onSubmit={handleAddTask}>
        <h2>{editTaskId ? "Edit Task" : "Add New Task"}</h2>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="completed">Completed:</label>
          <input
            type="checkbox"
            id="completed"
            name="completed"
            checked={newTask.completed}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-button">
          {editTaskId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div className="tasks-section">
        <div className="task-list">
          <h2>Not Completed Tasks</h2>
          <ul>
            {notCompletedTasks.map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task)}
                  />
                </div>
                <p>{task.description}</p>
                <p className="task-id">ID: {task.id}</p>
                <button onClick={() => handleEditTask(task)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="delete-button">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="task-list completed-tasks">
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map((task) => (
              <li key={task.id} className="task-item completed">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task)}
                  />
                </div>
                <p>{task.description}</p>
                <p className="task-id">ID: {task.id}</p>
                <button onClick={() => handleEditTask(task)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="delete-button">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default FetchTasks;
