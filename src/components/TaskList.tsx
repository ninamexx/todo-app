import { TaskItem } from "./TaskItem";
import { Todo } from "@/../../types";

type TaskListProps = {
  tasks: Todo[];
  onDelete: (index: string) => void;
};

export const TaskList = ({ tasks, onDelete }: TaskListProps) => {
  return (
    <div>
      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} onDelete={() => onDelete(task.id)} />
      ))}
    </div>
  );
};
