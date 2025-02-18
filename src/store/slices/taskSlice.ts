import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "@/types/Task";
import {
  fetchTasks,
  addTaskAction,
  updateTaskAction,
  removeTaskAction,
} from "@/store/actions/tasksAction";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: { message: string | null; code?: string | number } | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setError: (
      state,
      action: PayloadAction<{ message: string; code?: string | number }>
    ) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          message: action.error.message || "Erreur inconnue",
          code: action.error.code,
        };
      })
      .addCase(addTaskAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTaskAction.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.loading = false;
      })
      .addCase(addTaskAction.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          message: action.error.message || "Erreur lors de l'ajout de la tâche",
        };
      })
      .addCase(updateTaskAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskAction.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        );

        state.loading = false;
      })
      .addCase(updateTaskAction.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          message:
            action.error.message || "Erreur lors de la mise à jour de la tâche",
        };
      })
      .addCase(removeTaskAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeTaskAction.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.meta.arg.taskId
        );
        state.loading = false;
      })
      .addCase(removeTaskAction.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          message:
            action.error.message || "Erreur lors de la suppression de la tâche",
        };
      });
  },
});

export const { setTasks, setError, setLoading } = tasksSlice.actions;
export default tasksSlice.reducer;
