import { TaskItem } from "./TaskItem";
import { Todo } from "@/../../types";

type TaskListProps = {
  tasks: Todo[];
  toggleComplete: (id: string) => void;
  onEdit: (task: Todo) => void;
};

export default function TaskList({
  tasks,
  toggleComplete,
  onEdit,
}: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleComplete={toggleComplete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
