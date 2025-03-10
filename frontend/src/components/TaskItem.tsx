import { Button } from "@/components/ui/button";
import { Todo } from "@/../../types";
import { calculateDaysUntilDue } from "@/utils/utils";
import { Checkbox } from "@/components/ui/checkbox";

type TaskItemProps = {
  task: Todo;
  toggleComplete: (id: string) => void;
  onEdit: (task: Todo) => void;
};

export const TaskItem = ({ task, toggleComplete, onEdit }: TaskItemProps) => {
  return (
    <div className="flex justify-between items-center p-2 border rounded">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => toggleComplete(task.id)}
      >
        <Checkbox
          className="mr-5"
          checked={task.completed}
          onChange={() => toggleComplete(task.id)}
        />
        <div
          className={`${task.completed ? "line-through text-gray-500" : ""}`}
        >
          <div></div>
          {task.title && (
            <h2 className="text-lg inline-flex items-center">{task.title}</h2>
          )}
          {task.description && <p className="text-sm">{task.description} </p>}
          {task.priority && <p className="text-sm">{task.priority} priority</p>}
          {task.dueDate && (
            <p className="text-sm">Due {calculateDaysUntilDue(task.dueDate)}</p>
          )}
        </div>
      </div>

      <div className="space-x-2">
        <Button
          onClick={() => onEdit(task)}
          className="bg-blue-200 hover:bg-blue-300"
        >
          ✏️
        </Button>
      </div>
    </div>
  );
};
