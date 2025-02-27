import React from "react";
import { Card } from "./ui/card";
import { Task } from "@/types/Task";
import { DraggableProvided } from "@hello-pangea/dnd";
import { Project } from "@/types/Project";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal, Pencil, Timer, Trash2 } from "lucide-react";
import { formatDateToFrench, formatTime } from "@/composables/useFormatDate";
import { truncateText } from "@/composables/useTruncatedText";

interface TaskProps {
  task: Task;
  project: Project;
  provided: DraggableProvided;
  timeSpent: number[];
  icon: string;
  handleEditTask: (task: Task) => void;
  handleDeleteTask: (taskId: string, projectId: string) => void;
}

const statusColors = {
  todo: "bg-indigo-200 text-indigo-700",
  inProgress: "bg-amber-200 text-amber-700",
  done: "bg-green-200 text-green-700",
};

export const TaskItem: React.FC<TaskProps> = ({
  task,
  project,
  provided,
  timeSpent,
  icon,
  handleEditTask,
  handleDeleteTask,
}) => {
  const formatTaskDates = (
    startDate: string | undefined,
    endDate: string | undefined,
    status: string
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const isOverdue = (start && start < today) || (end && end < today);
    const isUndefined = !startDate && !endDate;

    const isToday =
      (start && start.toDateString() === today.toDateString()) ||
      (end && end.toDateString() === today.toDateString());
    const isDone = status === "done";

    const textClass =
      (isUndefined || isOverdue) && !isToday && !isDone
        ? "text-red-500 font-bold"
        : "text-black";

    if (start && end && start.getTime() === end.getTime()) {
      return (
        <span className={textClass}>
          Le {startDate ? formatDateToFrench(startDate) : "Non défini"}
        </span>
      );
    }

    if (isUndefined) {
      return <span className={textClass}>Non défini</span>;
    }

    return (
      <span className={textClass}>
        Du {startDate ? formatDateToFrench(startDate) : "Non défini"} au{" "}
        {endDate ? formatDateToFrench(endDate) : "Non défini"}
      </span>
    );
  };
  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="bg-white p-2 rounded-xl shadow my-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge className={`rounded-full ${statusColors[task.status]}`}>
            {icon}
          </Badge>
          <h3 className="font-bold">{truncateText(task.title, 40)}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleEditTask(task)}>
              <Pencil className="mr-2" /> Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDeleteTask(task.id ?? "", project.id ?? "")}
              className="text-red-500"
            >
              <Trash2 className="mr-2" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm">{task.description}</p>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs">
          📅 {formatTaskDates(task.startDate, task.endDate, task.status)}
        </span>
        {timeSpent && timeSpent.length > 0 && (
          <div className="flex items-center">
            <Timer width={20} />
            <span className="text-xs mt-1">
              {formatTime(
                timeSpent.reduce(
                  (total: number, time: number) => total + time,
                  0
                )
              )}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
