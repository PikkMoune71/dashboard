"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Pause, Play, TimerIcon, TimerReset } from "lucide-react";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const storedStartTime = localStorage.getItem("timerStartTime");
    const storedSeconds = localStorage.getItem("timerSeconds");
    const storedIsRunning = localStorage.getItem("timerIsRunning");

    if (storedStartTime && storedIsRunning === "true") {
      const now = Date.now();
      const elapsedTime = Math.floor((now - parseInt(storedStartTime)) / 1000);
      setSeconds((storedSeconds ? parseInt(storedSeconds) : 0) + elapsedTime);

      setIsRunning(true);
    } else if (storedSeconds) {
      setSeconds(parseInt(storedSeconds));
    }
  }, []);

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="grid grid-cols-2 p-2 bg-amber-300 rounded-lg group-data-[collapsible=icon]:hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TimerIcon />
            <span className="text-sm">Timer</span>
          </div>
          <h1 className="text-2xl font-bold">{formatTime(seconds)}</h1>
        </div>
        <div className="flex items-end justify-end gap-2">
          <Button
            onClick={toggleTimer}
            className="bg-primary text-white rounded-full"
          >
            {isRunning ? <Pause /> : <Play />}
          </Button>
          <Button
            onClick={resetTimer}
            className="bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
          >
            <TimerReset className="cursor-pointer" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 p-2 bg-amber-300 rounded-lg group-data-[state=expanded]:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <TimerIcon />
          </PopoverTrigger>
          <PopoverContent className="bg-primary text-white rounded-xl p-2 ml-12">
            <div className="grid grid-cols-2 p-2 rounded-lg group-data-[collapsible=icon]:hidden">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TimerIcon />
                  <span className="text-sm">Timer</span>
                </div>
                <h1 className="text-2xl font-bold">{formatTime(seconds)}</h1>
              </div>
              <div className="flex items-end justify-end gap-2">
                <Button
                  onClick={toggleTimer}
                  className="bg-amber-300 text-black rounded-full hover:bg-amber-400"
                >
                  {isRunning ? <Pause /> : <Play />}
                </Button>
                <Button
                  onClick={resetTimer}
                  className="bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <TimerReset />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default Timer;
