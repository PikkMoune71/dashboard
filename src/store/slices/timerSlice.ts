import { TimerState } from "@/types/TimerState";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TimerState = {
  isRunning: false,
  seconds: 0,
  selectedTaskId: null,
  storedTimes: [],
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
