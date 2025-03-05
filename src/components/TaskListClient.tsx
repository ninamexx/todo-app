"use client";
import { Todo } from "@/../../types";
import React, { useState } from "react";
import TaskList from "./TaskList";
import { v4 as uuidv4 } from "uuid";

export const TaskListClient = () => {
  const [tasks, setTasks] = useState<Todo[]>([
    {
      id: uuidv4(),
      title: "Learn React",
      completed: false,
      description: "Learn it",
      dueDate: "2025-12-31",
    },
    {
      id: uuidv4(),
      title: "Build To-Do App",
      completed: false,
      description: "Dew it",
      dueDate: "2025-12-31",
    },
  ]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  const addTask = () => {
    if (!taskName.trim() || !taskDescription.trim() || !taskDueDate.trim())
      return;
    const newTask: Todo = {
      id: uuidv4(),
      title: taskName,
      description: taskDescription,
      dueDate: taskDueDate,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskName("");
    setTaskDescription("");
    setTaskDueDate("");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    const task = tasks.find((task) => task.id === id); //For debugging
    if (task) {
      console.log(task.id, "task is completed?", !task.completed);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task title..."
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Enter task description..."
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Task
        </button>
      </div>
      <TaskList
        tasks={tasks}
        onDelete={deleteTask}
        toggleComplete={toggleComplete}
      />
    </div>
  );
};
