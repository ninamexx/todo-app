import { Todo } from "@/../../types";
import { v4 as uuidv4 } from "uuid";

export const predefinedTasks: Todo[] = [
  { id: uuidv4(), title: "Setup Project", description: "Initialize the project repository and setup initial files.", dueDate: "2025-03-01", completed: false, priority: "Medium" },
  { id: uuidv4(), title: "Create Components", description: "Develop the main components for the to-do app.", dueDate: "2025-03-02", completed: false, priority: "High" },
  { id: uuidv4(), title: "Implement State Management", description: "Add state management to handle tasks.", dueDate: "2025-03-03", completed: false, priority: "Low" },
  { id: uuidv4(), title: "Connect to Backend", description: "Set up API calls to connect the frontend with the backend.", dueDate: "2025-03-04", completed: false, priority: "Medium" },
  { id: uuidv4(), title: "Add Styling", description: "Apply CSS styles to make the app visually appealing.", dueDate: "2025-03-05", completed: false, priority: "High" },
  { id: uuidv4(), title: "Write Unit Tests", description: "Create unit tests for the components.", dueDate: "2025-03-06", completed: true, priority: "Low" },
  { id: uuidv4(), title: "Fix Bugs", description: "Identify and fix bugs in the application.", dueDate: "2025-03-07", completed: true, priority: "Medium" },
  { id: uuidv4(), title: "Optimize Performance", description: "Improve the performance of the application.", dueDate: "2025-03-08", completed: true, priority: "High" },
  { id: uuidv4(), title: "Deploy Application", description: "Deploy the application to a cloud provider.", dueDate: "2025-03-09", completed: true, priority: "Low" },
  { id: uuidv4(), title: "Write Documentation", description: "Document the project and its components.", dueDate: "2025-03-09", completed: true, priority: "Medium" },
];

export const addPredefinedTasks = async (setTasks: (tasks: Todo[]) => void, addTask: (task: Todo) => Promise<void>) => {
  setTasks([]);
  for (const task of predefinedTasks) {
    await addTask(task);
  }
};