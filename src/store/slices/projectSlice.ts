import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "@/types/Project";
import { fetchProjects } from "../actions/projectsAction";
import { updateProjectAction } from "../actions/projectsAction";
import { deleteProjectAction } from "../actions/projectsAction";

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur inconnue";
      })
      .addCase(updateProjectAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProjectAction.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        const index = state.projects.findIndex(
          (project) => project.id === updatedProject.id
        );
        state.projects[index] = updatedProject;
        state.loading = false;
      })
      .addCase(updateProjectAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur inconnue";
      })
      .addCase(deleteProjectAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProjectAction.fulfilled, (state, action) => {
        const { deletedProject } = action.meta.arg;
        const index = state.projects.findIndex(
          (project) => project.id === deletedProject.id
        );

        if (index !== -1) {
          state.projects.splice(index, 1);
        }

        state.loading = false;
      })

      .addCase(deleteProjectAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur inconnue";
      });
  },
});

export const { setProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
