import axios from "axios";
import { Todo } from "@/../../types";

const API_URL = "http://localhost:5000/api/tasks";

export const fetchTasks = async (sortCriteria: string, searchQuery: string) => {
  const response = await axios.get(API_URL, {
    params: {
      sort: sortCriteria,
      search: searchQuery,
    },
  });
  return response.data.tasks;
};

export const addTask = async (newTask: Todo) => {
  const response = await axios.post(API_URL, newTask);
  return response.data;
};

export const editTask = async (updatedTask: Todo) => {
  const response = await axios.put(`${API_URL}/${updatedTask.id}`, updatedTask);
  return response.data;
};

export const deleteTask = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const deleteAllTasks = async () => {
  const response = await axios.get(API_URL);
  const allTasks: Todo[] = response.data.tasks;
  for (const task of allTasks) {
    await axios.delete(`${API_URL}/${task.id}`);
  }
};