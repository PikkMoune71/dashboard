import { createAsyncThunk } from "@reduxjs/toolkit";
import { Project } from "@/types/Project";
import { getProjects } from "@/services/projectService";

export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchProjects",
  async () => {
    const projects = await getProjects();
    return projects;
  }
);
