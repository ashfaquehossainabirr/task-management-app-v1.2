import { createContext, useContext, useEffect, useState } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
      return [];
    }
  });

  // ✅ ALWAYS SYNC TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // CREATE TASK
  const addTask = (task) => {
    setTasks((prev) => [
      ...prev,
      {
        ...task,
        id: Date.now(),
        status: task.status || "todo",
      },
    ]);
  };

  // DELETE TASK
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ⭐ IMPORTANT FIX (SAFE UPDATE FUNCTION)
  const updateTaskStatus = (id, newStatus) => {
    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === id) {
          return { ...task, status: newStatus };
        }
        return task;
      });

      return updated;
    });
  };

  // ADMIN EDIT
  const editTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? { ...task, ...updatedTask }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        updateTaskStatus,
        editTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);