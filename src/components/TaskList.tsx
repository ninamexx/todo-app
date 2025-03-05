import { TaskItem } from "./TaskItem";

type TaskListProps = {
  tasks: string[];
  onDelete: (index: number) => void;
};

export const TaskList = ({ tasks, onDelete }: TaskListProps) => {
  return (
    <div>
      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} onDelete={() => onDelete(index)} />
      ))}
    </div>
  );
};
