import { createAsyncThunk } from "@reduxjs/toolkit";
import { Project } from "@/types/Project";
import { getProjects, updateProject } from "@/services/projectService";

export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchProjects",
  async () => {
    const projects = await getProjects();
    return projects;
  }
);

// Mettre à jour un projet
export const updateProjectAction = createAsyncThunk(
  "tasks/updateTask",
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
