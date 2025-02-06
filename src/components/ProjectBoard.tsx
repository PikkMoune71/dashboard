/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Project } from "@/types/Project";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Task } from "@/types/Task";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskAction,
  fetchTasks,
  updateTaskAction,
} from "@/store/actions/tasksAction";
import { setTasks } from "@/store/slices/taskSlice";

const statusColors = {
  todo: "bg-indigo-200 text-indigo-700",
  inProgress: "bg-amber-200 text-amber-700",
  done: "bg-green-200 text-green-700",
};

interface ProjectBoardProps {
  project: Project;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ project }) => {
  const dispatch = useDispatch<any>();
  const tasks = useSelector((state: any) =>
    state.tasks.tasks.filter((task: Task) => task.projectId === project.id)
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"]>("todo");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState<Task["status"] | undefined>(undefined);

  useEffect(() => {
    if (project.id) {
      dispatch(fetchTasks(project.id));
    }
  }, [dispatch, project.id]);

  const columns = {
    todo: {
      title: "À Faire",
      icon: "📝",
    },
    inProgress: {
      title: "En Cours",
      icon: "🚧",
    },
    done: {
      title: "Terminée",
      icon: "🎉",
    },
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex(
      (t) => t.id === result.draggableId
    );

    if (taskIndex === -1) return;

    const updatedTask = {
      ...updatedTasks[taskIndex],
      status: result.destination.droppableId as Task["status"],
    };

    updatedTasks[taskIndex] = updatedTask;
    const projectId = updatedTask.projectId;

    if (!projectId) {
      console.error("Le projectId est manquant pour la tâche", updatedTask.id);
      return;
    }

    // Mettre à jour la tâche dans le store (local)
    dispatch(setTasks(updatedTasks));
    // Mettre à jour la tâche dans la base de données
    dispatch(updateTaskAction({ projectId, updatedTask }));
  };

  const addTaskToProject = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      title: newTaskTitle,
      status: newTaskStatus,
      projectId: project.id || "",
      createdAt: new Date().toISOString(),
    };

    await dispatch(
      addTaskAction({ projectId: project.id ?? "", task: newTask })
    );

    setNewTaskTitle("");
    setNewTaskStatus("todo");
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h3 className="font-bold">{project.title}</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">+ Ajouter une tâche</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle tâche</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Titre de la tâche"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Select
              value={newTaskStatus}
              onValueChange={(value) => {
                setNewTaskStatus(value as Task["status"]);
                setStatus(value as Task["status"]);
              }}
            >
              <SelectTrigger
                className={`p-2 rounded ${
                  status
                    ? statusColors[status]
                    : "bg-indigo-200 text-indigo-700"
                }`}
              >
                <SelectValue placeholder="Choisir un statut" />
              </SelectTrigger>
              <SelectContent className="m-2">
                <SelectItem value="todo" className="bg-indigo-200 my-2">
                  À faire
                </SelectItem>
                <SelectItem value="inProgress" className="bg-amber-200 my-2">
                  En cours
                </SelectItem>
                <SelectItem value="done" className="bg-green-200 my-2">
                  Terminée
                </SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button onClick={addTaskToProject}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(columns).map(([status, { title, icon }]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-muted/50 p-4 rounded-lg min-h-[300px]"
                >
                  <h2
                    className={`font-bold p-1 rounded-full w-32 text-center ${
                      status
                        ? statusColors[status as keyof typeof statusColors]
                        : "bg-indigo-200 text-indigo-700"
                    }`}
                  >
                    {title} {icon}
                  </h2>
                  {tasks
                    .filter((task: Task) => task.status === status)
                    .map((task: Task, index: any) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id || ""}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 rounded-xl shadow my-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-bold">{task.title}</h3>
                              <Badge
                                className={`rounded-full mb-2 p-2 ${
                                  statusColors[task.status]
                                }`}
                              ></Badge>
                            </div>
                            <p>{task.description}</p>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};
