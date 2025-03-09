import { Todo } from "@/../../types";
import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import { TaskForm } from "./TaskForm";
import { Pagination } from "@/components/Pagination";
import { Button } from "./ui/button";
import axios from "axios";
import { addPredefinedTasks } from "../predefinedTasks";

export const TaskListClient = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const tasksPerPage = 5;
  const [sortCriteria, setSortCriteria] = useState<"title" | "dueDate">(
    "title"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"uncompleted" | "completed">(
    "uncompleted"
  );

  useEffect(() => {
    // Fetch tasks from the API when the component mounts
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          params: {
            sort: sortCriteria,
            search: searchQuery,
          },
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [sortCriteria, searchQuery]);

  const addTask = async (newTask: Todo) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        newTask
      );
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const editTask = async (updatedTask: Todo) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${updatedTask.id}`,
        updatedTask
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? response.data : task
        )
      );
      setTaskToEdit(null);
      setIsTaskFormVisible(false);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

      // Check if the current page is empty and adjust the page number
      if (activeTab === "uncompleted") {
        const uncompletedTasks = tasks.filter((task) => !task.completed);
        const totalPages =
          Math.ceil(uncompletedTasks.length / tasksPerPage) || 1;
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      } else {
        const completedTasks = tasks.filter((task) => task.completed);
        const totalPages = Math.ceil(completedTasks.length / tasksPerPage) || 1;
        if (completedPage > totalPages) {
          setCompletedPage(totalPages);
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      console.log(
        `Task "${task.title}" marked as ${
          updatedTask.completed ? "completed" : "uncompleted"
        }`
      );
      try {
        const response = await axios.put(
          `http://localhost:5000/api/tasks/${id}`,
          updatedTask
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? response.data : task))
        );

        // Check if the current page is empty and adjust the page number
        if (activeTab === "uncompleted") {
          const uncompletedTasks = tasks.filter((task) => !task.completed);
          const totalPages =
            Math.ceil(uncompletedTasks.length / tasksPerPage) || 1;
          if (currentPage > totalPages) {
            setCurrentPage(totalPages);
          }
        } else {
          const completedTasks = tasks.filter((task) => task.completed);
          const totalPages =
            Math.ceil(completedTasks.length / tasksPerPage) || 1;
          if (completedPage > totalPages) {
            setCompletedPage(totalPages);
          }
        }
      } catch (error) {
        console.error("Error toggling task completion:", error);
      }
    }
  };

  const handleEdit = (task: Todo) => {
    setTaskToEdit(task);
    setIsTaskFormVisible(true);
  };

  const deleteAllTasks = async () => {
    try {
      // Fetch all tasks from the backend
      const response = await axios.get("http://localhost:5000/api/tasks");
      const allTasks: Todo[] = response.data.tasks;

      // Delete all tasks from the backend
      for (const task of allTasks) {
        await axios.delete(`http://localhost:5000/api/tasks/${task.id}`);
      }

      // Clear existing tasks from the frontend state
      setTasks([]);
    } catch (error) {
      console.error("Error deleting all tasks:", error);
    }
  };

  // Sorting logic
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortCriteria === "title") {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
  });

  // Filter tasks based on completion status
  const uncompletedTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  // Pagination logic for uncompleted tasks
  const indexOfLastUncompletedTask = currentPage * tasksPerPage;
  const indexOfFirstUncompletedTask = indexOfLastUncompletedTask - tasksPerPage;
  const currentUncompletedTasks = uncompletedTasks.slice(
    indexOfFirstUncompletedTask,
    indexOfLastUncompletedTask
  );

  // Pagination logic for completed tasks
  const indexOfLastCompletedTask = completedPage * tasksPerPage;
  const indexOfFirstCompletedTask = indexOfLastCompletedTask - tasksPerPage;
  const currentCompletedTasks = completedTasks.slice(
    indexOfFirstCompletedTask,
    indexOfLastCompletedTask
  );

  const paginateUncompleted = (pageNumber: number) =>
    setCurrentPage(pageNumber);
  const paginateCompleted = (pageNumber: number) =>
    setCompletedPage(pageNumber);

  const handleAddPredefinedTasks = async () => {
    await deleteAllTasks();
    await addPredefinedTasks(setTasks, addTask);
  };

  return (
    <div className="space-y-4 w-4/7 mx-auto">
      <Button
        onClick={() => {
          setIsTaskFormVisible(true);
          setTaskToEdit(null);
        }}
        className=""
      >
        + New Task
      </Button>
      <Button onClick={handleAddPredefinedTasks} className="">
        + Add Predefined Tasks
      </Button>
      <Button onClick={deleteAllTasks} className="">
        Delete All Tasks
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
              setSortCriteria(e.target.value as "dueDate" | "title")
            }
            className="border p-2 rounded"
          >
            <option value="title">Due Ddate</option>
            <option value="dueDate">Title</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>
      <div className="tabs flex space-x-4">
        <button
          className={`tab ${
            activeTab === "uncompleted" ? "active" : ""
          } p-2 border-b-2`}
          onClick={() => setActiveTab("uncompleted")}
        >
          Uncompleted Tasks ({uncompletedTasks.length})
        </button>
        <button
          className={`tab ${
            activeTab === "completed" ? "active" : ""
          } p-2 border-b-2`}
          onClick={() => setActiveTab("completed")}
        >
          Completed Tasks ({completedTasks.length})
        </button>
      </div>
      {activeTab === "uncompleted" ? (
        <>
          {currentUncompletedTasks.length === 0 ? (
            <p>No uncompleted tasks, yippie!</p>
          ) : (
            <>
              <TaskList
                tasks={currentUncompletedTasks}
                toggleComplete={toggleComplete}
                onEdit={handleEdit}
              />
              <Pagination
                tasksPerPage={tasksPerPage}
                totalTasks={uncompletedTasks.length}
                paginate={paginateUncompleted}
                currentPage={currentPage}
              />
            </>
          )}
        </>
      ) : (
        <>
          {currentCompletedTasks.length === 0 ? (
            <p>No completed tasks... yet</p>
          ) : (
            <>
              <TaskList
                tasks={currentCompletedTasks}
                toggleComplete={toggleComplete}
                onEdit={handleEdit}
              />
              <Pagination
                tasksPerPage={tasksPerPage}
                totalTasks={completedTasks.length}
                paginate={paginateCompleted}
                currentPage={completedPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
