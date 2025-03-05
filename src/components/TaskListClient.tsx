"use client";
import { Todo } from "@/../../types";
import React, { useState } from "react";
import { TaskList } from "./TaskList";
import { v4 as uuidv4 } from "uuid";

export const TaskListClient = () => {
  const [tasks, setTasks] = useState<Todo[]>([
    { id: uuidv4(), title: "Learn React", completed: false },
    { id: uuidv4(), title: "Build To-Do App", completed: false },
  ]);

  const addTask = (title: string) => {
    const newTask: Todo = {
      id: uuidv4(),
      title,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl">To-Do List</h2>
      <button
        onClick={() => addTask("New Task")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Task
      </button>
      <TaskList tasks={tasks} onDelete={deleteTask} />
    </div>
  );
};
