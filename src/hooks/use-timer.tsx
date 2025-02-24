import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsRunning,
  setSeconds,
  setStoredTimes,
} from "@/store/slices/timerSlice";
import {
  fetchTimeFromFirestore,
  saveTimeToFirestore,
  removeTimeFromFirestore,
} from "@/store/actions/timerAction";
import { AppDispatch, RootState } from "@/store/store";
import { Task } from "@/types/Task";
import { toast } from "./use-toast";
import { formatTime } from "@/composables/useFormatDate";

const useTimer = (selectedTask: Task | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isRunning, seconds, storedTimes } = useSelector(
    (state: RootState) => state.timer
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedTask) {
      dispatch(fetchTimeFromFirestore(selectedTask.id as string));
    }
  }, [selectedTask, dispatch]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch(setSeconds(seconds + 1));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, dispatch, seconds]);

  const toggleTimer = () => dispatch(setIsRunning(!isRunning));

  const resetTimer = () => {
    dispatch(setIsRunning(false));
    dispatch(setSeconds(0));

    localStorage.removeItem("selectedTask");
    localStorage.removeItem("timerTime");
  };

  const saveTimer = () => {
    if (!selectedTask) return;

    const newStoredTimes = [...storedTimes, seconds];
    dispatch(setStoredTimes(newStoredTimes));
    dispatch(
      saveTimeToFirestore({ taskId: selectedTask.id as string, seconds })
    );

    toast({
      title: "Timer enregistré !",
      description: `Le temps de ${formatTime(
        seconds
      )} a été ajouté à la tâche "${selectedTask.title}".`,
      className: "bg-green-600 text-white",
    });

    dispatch(setSeconds(0));
    localStorage.setItem("selectedTask", JSON.stringify(selectedTask));
    localStorage.setItem("timerTime", String(0));
  };

  const deleteTimeRecord = (index: number) => {
    const newStoredTimes = storedTimes.filter((_, i) => i !== index);
    dispatch(setStoredTimes(newStoredTimes));
    if (selectedTask) {
      dispatch(
        removeTimeFromFirestore({
          taskId: selectedTask.id as string,
          seconds: storedTimes[index],
        })
      );
    }
  };

  return {
    isRunning,
    seconds,
    storedTimes,
    toggleTimer,
    resetTimer,
    saveTimer,
    deleteTimeRecord,
  };
};

export default useTimer;
