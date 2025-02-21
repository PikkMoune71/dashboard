/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  ArrowDownUp,
  MoreHorizontal,
  Pause,
  Play,
  Save,
  TimerIcon,
  TimerReset,
} from "lucide-react";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Task } from "@/types/Task";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { formatTime } from "@/composables/useFormatDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  setIsRunning,
  setSeconds,
  setStoredTimes,
} from "@/store/slices/timerSlice";
import {
  removeTimeFromFirestore,
  saveTimeToFirestore,
} from "@/store/actions/timerAction";

const Timer = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasks = useSelector((state: any) => state.tasks.tasks);
  const dispatch = useDispatch<any>();
  const { isRunning, seconds, storedTimes } = useSelector(
    (state: any) => state.timer
  );

  useEffect(() => {
    const savedTaskId = localStorage.getItem("selectedTaskId");
    if (savedTaskId) {
      const task = tasks.find((t: Task) => t.id === savedTaskId);
      if (task) {
        setSelectedTask(task);
        dispatch(setStoredTimes(task.timeSpent || []));
      }
    }
  }, [tasks, dispatch]);

  const toggleTimer = () => {
    if (isRunning) {
      dispatch(setIsRunning(false));
    } else {
      dispatch(setIsRunning(true));
    }
  };

  const resetTimer = () => {
    dispatch(setIsRunning(false));
    dispatch(setSeconds(0));
  };

  const saveTimer = () => {
    if (selectedTask) {
      const newStoredTimes = [...storedTimes, seconds];
      dispatch(setStoredTimes(newStoredTimes));

      const updatedTimeSpent = selectedTask.timeSpent
        ? [...selectedTask.timeSpent, seconds]
        : [seconds];

      const task = {
        ...selectedTask,
        timeSpent: updatedTimeSpent,
      };
      dispatch(
        saveTimeToFirestore({
          taskId: task.id as string,
          seconds,
        })
      );
      setSelectedTask(task);
      dispatch(setSeconds(0));

      console.log(task);

      toast({
        title: "Timer enregistré !",
        description: `Le temps de ${formatTime(
          seconds
        )} a été ajouté à la tâche "${task.title}".`,
        className: "bg-green-600 text-white",
      });
    }
  };

  const deleteTimeRecord = (index: number) => {
    const timeToRemove = storedTimes[index];

    const newStoredTimes: number[] = storedTimes.filter(
      (_: number, i: number) => i !== index
    );

    dispatch(setStoredTimes(newStoredTimes));

    if (selectedTask) {
      const updatedTask = {
        ...selectedTask,
        timeSpent: selectedTask.timeSpent || [],
      };

      setSelectedTask(updatedTask);

      dispatch(
        removeTimeFromFirestore({
          taskId: updatedTask.id as string,
          seconds: timeToRemove,
        })
      );
    }
  };

  const changeProject = () => {
    setSelectedTask(null);
    dispatch(setStoredTimes([]));
  };

  const handleSelectTask = (taskId: string) => {
    const task = tasks.find((t: Task) => t.id === taskId);
    if (task) {
      console.log(task);
      setSelectedTask(task);
      localStorage.setItem("selectedTaskId", task.id);
      dispatch(setStoredTimes(task.timeSpent || []));
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        dispatch(setSeconds(seconds + 1));
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, dispatch, seconds]);

  return (
    <>
      {selectedTask ? (
        <>
          <div className="p-2 bg-amber-300 rounded-lg group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between gap-2 mb-2 ">
              <div className="flex items-center gap-2">
                <TimerIcon />
                <span className="text-sm">Timer</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-lg p-2">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {storedTimes.length > 0 ? (
                    storedTimes.map((time: any, index: any) => (
                      <DropdownMenuItem
                        key={index}
                        className="flex justify-between"
                      >
                        {formatTime(time)}
                        <Button
                          variant={"outline"}
                          onClick={() => deleteTimeRecord(index)}
                          className="text-red-500"
                        >
                          ✖
                        </Button>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem>Aucun enregistrement</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={changeProject}>
                    <ArrowDownUp />
                    Changer de tâche
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={resetTimer}
                    className="text-red-500"
                  >
                    <TimerReset />
                    Réinitialiser
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Button onClick={saveTimer} className="w-full mt-2">
                    Enregistrer
                    <Save />
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div>
                <h1 className="text-2xl font-bold">{formatTime(seconds)}</h1>
              </div>
              <div className="flex items-end justify-end gap-2">
                <Button
                  onClick={toggleTimer}
                  className="bg-primary text-white rounded-full"
                >
                  {isRunning ? <Pause /> : <Play />}
                </Button>
              </div>
            </div>
            <span className="text-xs">{selectedTask.title}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-amber-300 rounded-lg group-data-[state=expanded]:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <TimerIcon />
              </PopoverTrigger>
              <PopoverContent className="bg-primary text-white rounded-xl p-2 ml-12">
                <div className="flex items-center justify-between gap-2 mb-2 ">
                  <div className="flex items-center gap-2">
                    <TimerIcon />
                    <span className="text-sm">Timer</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {formatTime(seconds)}
                    </h1>
                  </div>
                  <div className="flex items-end justify-end gap-2">
                    <Button
                      onClick={toggleTimer}
                      className="bg-amber-300 text-black hover:bg-amber-400 rounded-full"
                    >
                      {isRunning ? <Pause /> : <Play />}
                    </Button>
                  </div>
                </div>
                <span className="text-xs">{selectedTask.title}</span>
              </PopoverContent>
            </Popover>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 p-2 bg-amber-300 rounded-lg group-data-[collapsible=icon]:hidden">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TimerIcon />
              <span className="text-sm">Timer</span>
            </div>
            {tasks.map((task: Task) => (
              <Select
                onValueChange={() => task.id && handleSelectTask(task.id)}
                key={task.id}
              >
                <SelectTrigger className="w-[220px] bg-white rounded-lg p-2">
                  <SelectValue placeholder="Choisis une tâche" />
                </SelectTrigger>
                {tasks.length > 0 && (
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        key={task.id}
                        value={task.id as string}
                        className="cursor-pointer"
                      >
                        {task.title}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                )}
              </Select>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;
