import React, { useState, useEffect } from "react";
import { Todo } from "@/../../types";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";

interface TaskInputProps {
  onAddTask: (task: Todo) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  task: Todo | null;
}

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

  useEffect(() => {
    if (task) {
      setTaskName(task.title);
      setTaskDescription(task.description);
      setTaskDueDate(task.dueDate);
    }
  }, [task]);

  const handleSubmit = () => {
    if (!taskName.trim() || !taskDescription.trim() || !taskDueDate.trim())
      return;
    const newTask: Todo = {
      id: task?.id || uuidv4(),
      title: taskName,
      description: taskDescription,
      dueDate: taskDueDate,
      completed: task?.completed || false,
    };
    onAddTask(newTask);
    setTaskName("");
    setTaskDescription("");
    setTaskDueDate("");
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
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl mb-4">{task ? "Edit Task" : "Add New Task"}</h2>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task title..."
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Enter task description..."
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="date"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <div className="flex justify-end space-x-2">
          <div className="flex space-x-2 justify-bet">
            {task && (
              <Button
                onClick={handleDelete}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </Button>
            )}
          </div>
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
  );
};
