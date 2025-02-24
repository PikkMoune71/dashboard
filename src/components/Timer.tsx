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
import { formatTime } from "@/composables/useFormatDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { setSeconds, setStoredTimes } from "@/store/slices/timerSlice";

import { AppDispatch, RootState } from "@/store/store";
import useTimer from "@/hooks/use-timer";

const Timer = () => {
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const {
    isRunning,
    seconds,
    storedTimes,
    toggleTimer,
    resetTimer,
    saveTimer,
    deleteTimeRecord,
  } = useTimer(selectedTask);

  useEffect(() => {
    const savedTask = localStorage.getItem("selectedTask");
    const savedTime = localStorage.getItem("timerTime");

    if (savedTask && savedTime) {
      const task = JSON.parse(savedTask);
      setSelectedTask(task);
      dispatch(setSeconds(Number(savedTime)));
    }
  }, [dispatch]);

  const handleSelectTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId) || null;
    setSelectedTask(task);

    localStorage.setItem("selectedTask", JSON.stringify(task));
    localStorage.setItem("timerTime", String(0));
  };

  const changeProject = () => {
    setSelectedTask(null);
    dispatch(setStoredTimes([]));

    localStorage.removeItem("selectedTask");
    localStorage.removeItem("timerTime");
  };

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
                  <span className="text-xs font-bold mt-3">
                    Total :{" "}
                    {formatTime(
                      storedTimes.reduce((acc, time) => acc + time, 0)
                    )}{" "}
                  </span>
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
            <Select onValueChange={handleSelectTask}>
              <SelectTrigger className="w-[220px] bg-white rounded-lg p-2">
                <SelectValue placeholder="Choisis une tâche" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {tasks.map((task: Task) => (
                    <SelectItem
                      key={task.id}
                      value={task.id as string}
                      className="cursor-pointer"
                    >
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;
