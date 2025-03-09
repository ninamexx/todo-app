import { Button } from "@/components/ui/button";
import { Todo } from "../../../types"; //Fix this path

type TaskItemProps = {
  task: Todo;
  toggleComplete: (id: string) => void;
  onEdit: (task: Todo) => void;
};

export const TaskItem = ({ task, toggleComplete, onEdit }: TaskItemProps) => {
  return (
    <div className="flex justify-between items-center p-2 border rounded">
      <div
        className={`cursor-pointer ${
          task.completed ? "line-through text-gray-500" : ""
        }`}
        onClick={() => toggleComplete(task.id)}
      >
        {task.title && <h2 className="text-lg">{task.title}</h2>}
        {task.description && <p className="text-sm">{task.description}</p>}
        {task.dueDate && <p className="text-sm">Due: {task.dueDate}</p>}
        {task.priority && <p className="text-sm">Priority: {task.priority}</p>}
      </div>

      <div className="space-x-2">
        <Button onClick={() => onEdit(task)} className="text-blue-500">
          ✏️
        </Button>
      </div>
    </div>
  );
};
