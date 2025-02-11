import { createAsyncThunk } from "@reduxjs/toolkit";
import { Task } from "@/types/Task";
import {
  getTasks,
  addTask,
  updateTask,
  removeTask,
} from "@/services/taskService";

// Récupérer les tâches d'un projet
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (projectId: string) => {
    return await getTasks(projectId);
  }
);

// Ajouter une nouvelle tâche
export const addTaskAction = createAsyncThunk(
  "tasks/addTask",
  async ({ projectId, task }: { projectId: string; task: Task }) => {
    return await addTask(projectId, task);
  }
);

// Mettre à jour une tâche
export const updateTaskAction = createAsyncThunk(
  "tasks/updateTask",
  async ({
    projectId,
    updatedTask,
  }: {
    projectId: string;
    updatedTask: Task;
  }) => {
    return await updateTask(projectId, updatedTask);
  }
);

// Supprimer une tâche
export const removeTaskAction = createAsyncThunk(
  "tasks/removeTask",
  async ({ projectId, taskId }: { projectId: string; taskId: string }) => {
    return await removeTask(projectId, taskId);
  }
);
