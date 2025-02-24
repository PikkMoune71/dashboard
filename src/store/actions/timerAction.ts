import { fetchTime, removeTime, saveTime } from "@/services/timerService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// fetchTimeFromFirestore
export const fetchTimeFromFirestore = createAsyncThunk(
  "tasks/fetchTimeFromFirestore",
  async (taskId: string) => {
    const result = await fetchTime(taskId);
    console.log("result", result);
    return result;
  }
);

// Sauvegarder le temps passé sur une tâche
export const saveTimeToFirestore = createAsyncThunk(
  "tasks/saveTimeToFirestore",
  async ({ taskId, seconds }: { taskId: string; seconds: number }) => {
    const result = await saveTime(taskId, seconds);

    return result;
  }
);

// Supprimer un enregistrement de temps
export const removeTimeFromFirestore = createAsyncThunk(
  "tasks/removeTimeFromFirestore",
  async ({ taskId, seconds }: { taskId: string; seconds: number }) => {
    const result = await removeTime(taskId, seconds);

    return result;
  }
);
