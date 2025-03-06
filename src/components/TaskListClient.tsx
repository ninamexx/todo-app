"use client";
import { Todo } from "@/../../types";
import React, { useState } from "react";
import TaskList from "./TaskList";
import { TaskForm } from "./TaskForm";
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
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Todo | null>(null);

  const addTask = (newTask: Todo) => {
    setTasks([...tasks, newTask]);
  };

  const editTask = (updatedTask: Todo) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setTaskToEdit(null);
    setIsTaskFormVisible(false);
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
    const task = tasks.find((task) => task.id === id); // For debugging
    if (task) {
      console.log(task.id, "task is completed?", !task.completed);
    }
  };

  const handleEdit = (task: Todo) => {
    setTaskToEdit(task);
    setIsTaskFormVisible(true);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => {
          setIsTaskFormVisible(true);
          setTaskToEdit(null);
        }}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Add Task
      </button>
      {isTaskFormVisible && (
        <TaskForm
          onAddTask={taskToEdit ? editTask : addTask}
          onClose={() => {
            setIsTaskFormVisible(false);
            setTaskToEdit(null);
          }}
          task={taskToEdit}
          onDelete={deleteTask}
        />
      )}
      <TaskList
        tasks={tasks}
        onDelete={deleteTask}
        toggleComplete={toggleComplete}
        onEdit={handleEdit}
      />
    </div>
  );
};
