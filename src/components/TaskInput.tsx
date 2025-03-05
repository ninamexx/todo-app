import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TaskInputProps = {
  onAddTask: (task: string) => void;
};

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      //Remove whitespace from both sides of a string
      onAddTask(task);
      setTask("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex items-center space-x-4">
      <Input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add new task"
        className="flex-1"
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
};
