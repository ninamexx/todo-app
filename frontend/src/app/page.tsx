import { TaskListClient } from "@/components/TaskListClient";

export default function Home() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-4xl font-bold my-6 text-center">My To-Do App</h1>
      <TaskListClient />
    </main>
  );
}
