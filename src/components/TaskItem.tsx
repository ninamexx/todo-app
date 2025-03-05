import { Button } from "@/components/ui/button";

type TaskItemProps = {
  task: string;
  onDelete: () => void;
};

export const TaskItem = ({ task, onDelete }: TaskItemProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <span>{task}</span>
      <Button variant="ghost" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};
