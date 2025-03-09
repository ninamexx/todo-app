import React, { useState, useEffect } from "react";
import { Todo } from "@/../../types";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { z } from "zod";

interface TaskInputProps {
  onAddTask: (task: Todo) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  task: Todo | null;
}

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

export const TaskForm = ({
  onAddTask,
  onClose,
  onDelete,
  task,
}: TaskInputProps) => {
  const [taskName, setTaskName] = useState(task?.title || "");
  const [taskDescription, setTaskDescription] = useState(
    task?.description || ""
  );
  const [taskDueDate, setTaskDueDate] = useState(task?.dueDate || "");
  const [taskPriority, setTaskPriority] = useState(task?.priority || "Low");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [dueDateWarning, setDueDateWarning] = useState("");

  useEffect(() => {
    if (task) {
      setTaskName(task.title);
      setTaskDescription(task.description);
      setTaskDueDate(task.dueDate);
      setTaskPriority(task.priority);
    }
  }, [task]);

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setTaskDueDate(selectedDate);

    if (!selectedDate) {
      setDueDateWarning("");
      setErrors((prevErrors) => ({
        ...prevErrors,
        dueDate: "Due date is required",
      }));
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (selectedDate < today) {
      setDueDateWarning("Warning: The due date is in the past.");
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.dueDate;
        return newErrors;
      });
    } else {
      setDueDateWarning("");
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.dueDate;
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    const result = taskSchema.safeParse({
      title: taskName.trim(),
      description: taskDescription.trim(),
      dueDate: taskDueDate.trim(),
    });

    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          newErrors[error.path[0]] = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    const newTask: Todo = {
      id: uuidv4(),
      title: taskName.trim(),
      description: taskDescription.trim(),
      dueDate: taskDueDate.trim(),
      priority: taskPriority as "Low" | "Medium" | "High",
      completed: false,
    };
    onAddTask(newTask);
    setTaskName("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskPriority("Low");
    onClose();
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md sm:w-3/4">
        <h2 className="text-2xl mb-4">{task ? "Edit Task" : "Add New Task"}</h2>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task title..."
          className="border p-2 rounded w-full mb-1"
        />
        {errors.title && <p className="text-red-500 mb-3">{errors.title}</p>}
        <input
          type="text"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Enter task description..."
          className="border p-2 rounded w-full mb-1"
        />
        {errors.description && (
          <p className="text-red-500 mb-3">{errors.description}</p>
        )}
        <input
          type="date"
          value={taskDueDate}
          onChange={handleDueDateChange}
          className="border p-2 rounded w-full mb-1"
        />
        {dueDateWarning ? (
          <p className="text-yellow-500">{dueDateWarning}</p>
        ) : (
          errors.dueDate && <p className="text-red-500">{errors.dueDate}</p>
        )}
        <select
          value={taskPriority}
          onChange={(e) =>
            setTaskPriority(e.target.value as "Low" | "Medium" | "High")
          }
          className="border p-2 rounded w-full mb-1"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <div className="flex justify-between items-center">
          {task && (
            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </Button>
          )}
          <div className="flex justify-end space-x-2 ml-auto">
            <Button
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-500 text-white p-2 rounded"
            >
              {task ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
