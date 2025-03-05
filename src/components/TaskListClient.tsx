"use client";
import { Todo } from "@/../../types";
import React, { useState } from "react";
import TaskList from "./TaskList";
import { v4 as uuidv4 } from "uuid";

export const TaskListClient = () => {
  const [tasks, setTasks] = useState<Todo[]>([
    { id: uuidv4(), title: "Learn React", completed: false },
    { id: uuidv4(), title: "Build To-Do App", completed: false },
  ]);
  const [taskName, setTaskName] = useState("");

  const addTask = () => {
    if (!taskName.trim()) return;
    const newTask: Todo = {
      id: uuidv4(),
      title: taskName,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskName("");
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
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add
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
