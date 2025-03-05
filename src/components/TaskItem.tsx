import { Button } from "@/components/ui/button";
import { Todo } from "types";

type TaskItemProps = {
  task: Todo;
  toggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export const TaskItem = ({ task, toggleComplete, onDelete }: TaskItemProps) => {
  return (
    <div className="flex justify-between items-center p-2 border rounded">
      <div
        className={`cursor-pointer ${
          task.completed ? "line-through text-gray-500" : ""
        }`}
        onClick={() => toggleComplete(task.id)}
      >
        {task.title}
      </div>
      <Button onClick={() => onDelete(task.id)} className="text-red-500">
        ❌
      </Button>
    </div>
  );
};
