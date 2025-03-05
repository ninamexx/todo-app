import { Button } from "@/components/ui/button";
import { Todo } from "types";

type TaskItemProps = {
  task: Todo;
  onDelete: () => void;
};

export const TaskItem = ({ task, onDelete }: TaskItemProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <span>{task.title}</span>
      <Button variant="ghost" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};
