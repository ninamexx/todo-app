import { Todo } from "@/../../types";
import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import { TaskForm } from "./TaskForm";
import { Pagination } from "@/components/Pagination";
import { Button } from "./ui/button";
import axios from "axios";
import { calculateDaysUntilDue } from "@/utils/utils";

export const TaskListClient = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const [sortCriteria, setSortCriteria] = useState<"title" | "dueDate">(
    "title"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch tasks from the API when the component mounts
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          params: {
            page: currentPage,
            limit: tasksPerPage,
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
  }, [currentPage, tasksPerPage, sortCriteria, searchQuery]);

  const addTask = async (newTask: Todo) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        newTask
      );
      setTasks([...tasks, response.data]);
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
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      try {
        const response = await axios.put(
          `http://localhost:5000/api/tasks/${id}`,
          updatedTask
        );
        setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      } catch (error) {
        console.error("Error toggling task completion:", error);
      }
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

  // Format due dates
  const tasksWithFormattedDueDates = currentTasks.map((task) => ({
    ...task,
    formattedDueDate: calculateDaysUntilDue(task.dueDate),
  }));

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
      <TaskList
        tasks={tasksWithFormattedDueDates}
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
