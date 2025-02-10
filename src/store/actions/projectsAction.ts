import { createAsyncThunk } from "@reduxjs/toolkit";
import { Project } from "@/types/Project";
import {
  deleteProject,
  getProjects,
  updateProject,
} from "@/services/projectService";

export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchProjects",
  async () => {
    const projects = await getProjects();
    return projects;
  }
);

// Mettre à jour un projet
export const updateProjectAction = createAsyncThunk(
  "projects/updateTask",
  async ({
    userId,
    updatedProject,
  }: {
    userId: string;
    updatedProject: Project;
  }) => {
    return await updateProject(userId, updatedProject);
  }
);

// Supprimer un projet
export const deleteProjectAction = createAsyncThunk<
  void,
  { userId: string; deletedProject: Project },
  { rejectValue: string }
>(
  "projects/deleteProject",
  async ({ userId, deletedProject }, { rejectWithValue }) => {
    try {
      await deleteProject(userId, deletedProject);
    } catch {
      return rejectWithValue("Failed to delete project");
    }
  }
);
