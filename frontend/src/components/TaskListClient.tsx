import { Todo } from "@/../../types";
import { useState } from "react";
import TaskList from "./TaskList";
import { TaskForm } from "./TaskForm";
import { Pagination } from "@/components/Pagination";
import { Button } from "./ui/button";
import { useTasks } from "../hooks/useTasks";
import { addPredefinedTasks } from "../predefinedTasks";

export const TaskListClient = () => {
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Todo | null>(null);
  const [sortCriteria, setSortCriteria] = useState<"title" | "dueDate">(
    "dueDate"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const {
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
  } = useTasks(sortCriteria, searchQuery);

  const handleAddPredefinedTasks = async () => {
    await handleDeleteAllTasks();
    await addPredefinedTasks(() => tasks, handleAddTask);
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
      <Button onClick={handleDeleteAllTasks} className="">
        Delete All Tasks
      </Button>
      {isTaskFormVisible && (
        <TaskForm
          onAddTask={taskToEdit ? handleEditTask : handleAddTask}
          onClose={() => {
            setIsTaskFormVisible(false);
            setTaskToEdit(null);
          }}
          task={taskToEdit}
          onDelete={handleDeleteTask}
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
            <p>No uncompleted tasks, create one!</p>
          ) : (
            <>
              <TaskList
                tasks={currentUncompletedTasks}
                toggleComplete={toggleComplete}
                onEdit={setTaskToEdit}
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
                onEdit={setTaskToEdit}
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
