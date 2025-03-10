import { useState, useEffect } from "react";
import { Todo } from "@/../../types";
import { fetchTasks, addTask, editTask, deleteTask, deleteAllTasks } from "@/services/taskservice";

export const useTasks = (sortCriteria: string, searchQuery: string) => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const tasksPerPage = 5;
  const [activeTab, setActiveTab] = useState<"uncompleted" | "completed">("uncompleted");

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await fetchTasks(sortCriteria, searchQuery);
      setTasks(tasks);
    };
    fetchData();
  }, [sortCriteria, searchQuery]);

  const handleAddTask = async (newTask: Todo) => {
    const addedTask = await addTask(newTask);
    setTasks((prevTasks) => [...prevTasks, addedTask]);
  };

  const handleEditTask = async (updatedTask: Todo) => {
    const editedTask = await editTask(updatedTask);
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? editedTask : task)));
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleDeleteAllTasks = async () => {
    await deleteAllTasks();
    setTasks([]);
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      const toggledTask = await editTask(updatedTask);
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? toggledTask : task)));
    }
  };

  return {
    tasks,
    currentPage,
    setCurrentPage,
    completedPage,
    setCompletedPage,
    tasksPerPage,
    activeTab,
    setActiveTab,
    handleAddTask,
    handleEditTask,
    handleDeleteTask,
    handleDeleteAllTasks,
    toggleComplete,
  };
};