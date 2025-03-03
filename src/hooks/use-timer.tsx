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
const useTimer = (selectedTaskId: string | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isRunning, seconds, storedTimes } = useSelector(
    (state: RootState) => state.timer
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedTaskId) {
      dispatch(fetchTimeFromFirestore(selectedTaskId));
    }
  }, [selectedTaskId, dispatch]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch(setSeconds(seconds + 1));
      }, 1000);
      localStorage.setItem("timerTime", String(seconds));
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isRunning) {
        // Quand l'onglet devient visible, récupérer et restaurer la valeur du timer
        const savedTime = localStorage.getItem("timerTime");
        if (savedTime) {
          dispatch(setSeconds(Number(savedTime)));
        }
      }
    };

    // Ajouter l'événement visibilitychange
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
    if (!selectedTaskId) return;

    const newStoredTimes = [...storedTimes, seconds];
    dispatch(setStoredTimes(newStoredTimes));
    dispatch(saveTimeToFirestore({ taskId: selectedTaskId, seconds }));
    dispatch(setSeconds(0));

    localStorage.setItem("selectedTaskId", JSON.stringify(selectedTaskId));
    localStorage.setItem("timerTime", String(0));
  };

  const deleteTimeRecord = (index: number) => {
    const newStoredTimes = storedTimes.filter((_, i) => i !== index);
    dispatch(setStoredTimes(newStoredTimes));
    if (selectedTaskId) {
      dispatch(
        removeTimeFromFirestore({
          taskId: selectedTaskId,
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
