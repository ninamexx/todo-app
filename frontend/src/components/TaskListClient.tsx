import { Todo } from "@/../../types";
import { useState, useEffect } from "react";
import TaskList from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { predefinedTasks } from "@/predefinedTasks";

export const TaskListClient = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const tasksPerPage = 5;
  const [sortCriteria, setSortCriteria] = useState<"dueDate" | "title">(
    "dueDate"
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
      setTasks([...tasks, response.data]);
      console.log(`Task "${newTask.title}" added successfully`);
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
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? response.data : task))
      );
      setTaskToEdit(null);
      setIsTaskFormVisible(false);
      console.log(`Task "${updatedTask.title}" edited successfully`);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);

      // Check if the current page is empty and adjust the page number
      if (activeTab === "uncompleted") {
        const uncompletedTasks = updatedTasks.filter((task) => !task.completed);
        const totalPages =
          Math.ceil(uncompletedTasks.length / tasksPerPage) || 1;
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      } else {
        const completedTasks = updatedTasks.filter((task) => task.completed);
        const totalPages = Math.ceil(completedTasks.length / tasksPerPage) || 1;
        if (completedPage > totalPages) {
          setCompletedPage(totalPages);
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDeleteAllTasks = async () => {
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
        const updatedTasks = tasks.map((task) =>
          task.id === id ? response.data : task
        );
        setTasks(updatedTasks);

        // Check if the current page is empty and adjust the page number
        if (activeTab === "uncompleted") {
          const uncompletedTasks = updatedTasks.filter(
            (task) => !task.completed
          );
          const totalPages =
            Math.ceil(uncompletedTasks.length / tasksPerPage) || 1;
          if (currentPage > totalPages) {
            setCurrentPage(totalPages);
          }
        } else {
          const completedTasks = updatedTasks.filter((task) => task.completed);
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
    console.log(`Editing task "${task.title}"`);
  };

  const addPredefinedTasks = async () => {
    try {
      for (const task of predefinedTasks) {
        await axios.post("http://localhost:5000/api/tasks", task);
      }
      // Fetch the updated list of tasks from the server
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data.tasks);
      console.log("Predefined tasks added successfully");
    } catch (error) {
      console.error("Error adding predefined tasks:", error);
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

  return (
    <div className="space-y-4 w-4/7 mx-auto">
      <div className="flex justify-between items-center mx-auto w-1/2">
        <Button
          onClick={() => {
            setIsTaskFormVisible(true);
            setTaskToEdit(null);
          }}
          className=""
        >
          + New Task
        </Button>
        <Button
          onClick={addPredefinedTasks}
          className="bg-blue-500 hover:bg-blue-800"
        >
          + Add Predefined Tasks
        </Button>
        <Button
          onClick={handleDeleteAllTasks}
          className="bg-red-500 hover:bg-red-800"
        >
          Delete All Tasks
        </Button>
      </div>
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
        <div className="tabs flex space-x-4">
          <Button
            className={`tab ${
              activeTab === "uncompleted"
                ? "bg-gray-500 text-white"
                : "bg-white text-black hover:bg-gray-200"
            } p-2 border-b-2 w-32`}
            onClick={() => setActiveTab("uncompleted")}
          >
            Tod do ({uncompletedTasks.length})
          </Button>
          <Button
            className={`tab ${
              activeTab === "completed"
                ? "bg-gray-500 text-white"
                : "bg-white text-black hover:bg-gray-200"
            } p-2 border-b-2 w-32`}
            onClick={() => setActiveTab("completed")}
          >
            Done ({completedTasks.length})
          </Button>
        </div>
        <div className="flex items-center space-x-4">
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
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
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
      </div>
      {activeTab === "uncompleted" ? (
        <>
          {currentUncompletedTasks.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No uncompleted tasks, add a new one!</p>
            </div>
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
            <div className="flex justify-center items-center h-64">
              <p>No completed tasks... yet</p>
            </div>
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
