export interface TimerState {
  isRunning: boolean;
  seconds: number;
  selectedTaskId: string | null;
  storedTimes: number[];
}
