"use client";
import { Todo } from "@/../../types";
import React, { useState } from "react";
import TaskList from "./TaskList";
import { TaskForm } from "./TaskForm";
import { v4 as uuidv4 } from "uuid";
import { Pagination } from "@/components/Pagination";
import { Button } from "./ui/button";

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
    {
      id: uuidv4(),
      title: "Profit",
      completed: false,
      description: "Prophet",
      dueDate: "2025-12-31",
    },
    {
      id: uuidv4(),
      title: "Repeat",
      completed: false,
      description: "Reheat",
      dueDate: "2025-12-31",
    },
    {
      id: uuidv4(),
      title: "Repeat",
      completed: false,
      description: "Reheat",
      dueDate: "2025-12-31",
    },
    {
      id: uuidv4(),
      title: "Repeat",
      completed: false,
      description: "Reheat",
      dueDate: "2025-12-31",
    },

    // Add more tasks as needed
  ]);
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const [sortCriteria, setSortCriteria] = useState<"title" | "dueDate">(
    "title"
  );

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

  // Sorting logic
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortCriteria === "title") {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
  });

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-4 w-4/7 mx-auto">
      <Button
        onClick={() => {
          setIsTaskFormVisible(true);
          setTaskToEdit(null);
        }}
        className="bg-blue-500 text-white p-2 rounded"
      >
        + New Task
      </Button>
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
      <div className="flex justify-between items-center">
        <div>
          <label htmlFor="sort" className="mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortCriteria}
            onChange={(e) =>
              setSortCriteria(e.target.value as "title" | "dueDate")
            }
            className="border p-2 rounded"
          >
            <option value="title">Title</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>
      <TaskList
        tasks={currentTasks}
        toggleComplete={toggleComplete}
        onEdit={handleEdit}
      />
      <Pagination
        tasksPerPage={tasksPerPage}
        totalTasks={tasks.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};
