import { TimerState } from "@/types/TimerState";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTimeFromFirestore } from "../actions/timerAction";

const initialState: TimerState = {
  isRunning: false,
  seconds: 0,
  selectedTaskId: null,
  storedTimes: [],
  status: "idle",
  error: null,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setIsRunning(state, action: PayloadAction<boolean>) {
      state.isRunning = action.payload;
    },
    setSeconds(state, action: PayloadAction<number>) {
      state.seconds = action.payload;
    },
    setSelectedTaskId(state, action: PayloadAction<string | null>) {
      state.selectedTaskId = action.payload;
    },
    addTime(state, action: PayloadAction<number>) {
      state.storedTimes.push(action.payload);
    },
    removeTime(state, action: PayloadAction<number>) {
      state.storedTimes = state.storedTimes.filter(
        (time) => time !== action.payload
      );
    },
    resetTimer(state) {
      state.seconds = 0;
      state.isRunning = false;
      state.storedTimes = [];
    },
    setStoredTimes(state, action: PayloadAction<number[]>) {
      console.log(action.payload);
      state.storedTimes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lors du succès de fetchTimeFromFirestore
      .addCase(fetchTimeFromFirestore.fulfilled, (state, action) => {
        state.storedTimes = action.payload; // On met à jour le state avec les données de Firestore
        state.status = "succeeded"; // On indique que la requête est terminée
      })
      // Lors de l'échec de fetchTimeFromFirestore
      .addCase(fetchTimeFromFirestore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      // Lors du statut en attente de fetchTimeFromFirestore
      .addCase(fetchTimeFromFirestore.pending, (state) => {
        state.status = "loading";
      });
  },
});

export const {
  setIsRunning,
  setSeconds,
  setSelectedTaskId,
  addTime,
  removeTime,
  resetTimer,
  setStoredTimes,
} = timerSlice.actions;

export default timerSlice.reducer;
