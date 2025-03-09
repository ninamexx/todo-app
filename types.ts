export interface Todo {
    id: string;
    title: string;
    description: string;
    dueDate: string; //YYYY-MM-DD
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
}