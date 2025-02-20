/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
import { useSelector } from "react-redux";
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

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasks = useSelector((state: any) => state.tasks.tasks);

  useEffect(() => {
    const storedTaskId = localStorage.getItem("selectedTaskId");
    const storedStartTime = localStorage.getItem("timerStartTime");
    const storedSeconds = localStorage.getItem("timerSeconds");
    const storedIsRunning = localStorage.getItem("timerIsRunning");

    if (storedTaskId) {
      const task = tasks.find((task: Task) => task.id === storedTaskId);
      setSelectedTask(task || null);
    }

    if (storedStartTime && storedIsRunning === "true") {
      const now = Date.now();
      const elapsedTime = Math.floor((now - parseInt(storedStartTime)) / 1000);
      const totalSeconds =
        (storedSeconds ? parseInt(storedSeconds) : 0) + elapsedTime;
      setSeconds(totalSeconds);
      setIsRunning(true);
    } else if (storedSeconds) {
      setSeconds(parseInt(storedSeconds));
    }
  }, [tasks]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem("timerSeconds", seconds.toString());
  }, [seconds]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      localStorage.setItem("timerIsRunning", "false");
    } else {
      const now = Date.now();
      localStorage.setItem("timerStartTime", now.toString());
      setIsRunning(true);
      localStorage.setItem("timerIsRunning", "true");
    }
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
    localStorage.removeItem("timerStartTime");
    localStorage.removeItem("timerSeconds");
    localStorage.removeItem("timerIsRunning");
  };

  const saveTimer = () => {
    if (selectedTask) {
      const task = {
        ...selectedTask,
        time: seconds,
      };
      setSelectedTask(task);
      toast({
        title: "Timer enregistré !",
        description: `Le timer pour la tâche "${task.title}" a été enregistré avec succès.`,
        className: "bg-green-600 text-white",
      });
    }
  };

  const changeProject = () => {
    setSelectedTask(null);
    localStorage.removeItem("selectedTaskId");
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    if (task.id) {
      localStorage.setItem("selectedTaskId", task.id); // Sauvegarder l'ID de la tâche sélectionnée
    }
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
            <Select
              onValueChange={(taskId) => {
                const task = tasks.find((t: Task) => t.id === taskId);
                if (task) {
                  setSelectedTask(task);
                  localStorage.setItem("selectedTaskId", task.id); // Sauvegarder l'ID de la tâche
                }
              }}
            >
              <SelectTrigger className="w-[220px] bg-white rounded-lg p-2">
                <SelectValue placeholder="Choisis une tâche" />
              </SelectTrigger>
              {tasks.length > 0 && (
                <SelectContent>
                  {tasks.map((task: Task) => (
                    <SelectGroup key={task.id}>
                      <SelectItem
                        key={task.id}
                        value={task.id as string}
                        onClick={() => handleSelectTask(task)}
                        className="cursor-pointer"
                      >
                        {task.title}
                      </SelectItem>
                    </SelectGroup>
                  ))}
                </SelectContent>
              )}
            </Select>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;
