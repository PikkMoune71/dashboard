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
  removeTaskAction,
} from "@/store/actions/tasksAction";
import { setTasks } from "@/store/slices/taskSlice";
import { Textarea } from "./ui/textarea";
import { EditButton } from "./EditButton";
import { updateProjectAction } from "@/store/actions/projectsAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"]>("todo");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [status, setStatus] = useState<Task["status"] | undefined>(undefined);
  const [titleProject, setTitleProject] = useState<string>(project.title);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState<string>("");
  const [editTaskDescription, setEditTaskDescription] = useState<string>("");
  const [editTaskStatus, setEditTaskStatus] = useState<Task["status"]>("todo");

  useEffect(() => {
    setTitleProject(project.title);
    if (project.id) {
      dispatch(fetchTasks(project.id));
    }
  }, [dispatch, project]);

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

    dispatch(setTasks(updatedTasks));
    dispatch(updateTaskAction({ projectId, updatedTask }));
  };

  const addTaskToProject = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      title: newTaskTitle,
      status: newTaskStatus,
      description: newTaskDescription,
      projectId: project.id || "",
      createdAt: new Date().toISOString(),
    };

    await dispatch(
      addTaskAction({ projectId: project.id ?? "", task: newTask })
    );

    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskStatus("todo");
    setIsDialogOpen(false);
  };

  const handleSaveEditButton = (newValue: string) => {
    if (newValue.trim() && newValue !== titleProject) {
      setTitleProject(newValue);

      dispatch(
        updateProjectAction({
          userId: project.userId ?? "",
          updatedProject: { ...project, title: newValue },
        })
      );
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTaskId(task.id ?? "");
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || "");
    setEditTaskStatus(task.status);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditTask = () => {
    if (!editTaskTitle.trim()) return;

    const updatedTask = {
      ...tasks.find((task: Task) => task.id === editTaskId),
      title: editTaskTitle,
      description: editTaskDescription,
      status: editTaskStatus,
    };

    dispatch(updateTaskAction({ projectId: project.id ?? "", updatedTask }));
    setIsEditDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string, projectId: string) => {
    dispatch(removeTaskAction({ projectId, taskId }));
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <EditButton value={titleProject} onSave={handleSaveEditButton} />
        </div>
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
            <Textarea
              placeholder="Description de la tâche"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
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

      {/* Edit Task Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Titre de la tâche"
            value={editTaskTitle}
            onChange={(e) => setEditTaskTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description de la tâche"
            value={editTaskDescription}
            onChange={(e) => setEditTaskDescription(e.target.value)}
          />
          <Select
            value={editTaskStatus}
            onValueChange={(value) =>
              setEditTaskStatus(value as Task["status"])
            }
          >
            <SelectTrigger
              className={`p-2 rounded ${
                status ? statusColors[status] : "bg-indigo-200 text-indigo-700"
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
            <Button onClick={handleSaveEditTask}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
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
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`rounded-full ${
                                    statusColors[task.status]
                                  }`}
                                >
                                  {icon}
                                </Badge>
                                <h3 className="font-bold">{task.title}</h3>
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
                                  <DropdownMenuItem
                                    onClick={() => handleEditTask(task)}
                                  >
                                    <Pencil className="mr-2" /> Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteTask(
                                        task.id ?? "",
                                        project.id ?? ""
                                      )
                                    }
                                    className="text-red-500"
                                  >
                                    <Trash2 className="mr-2" /> Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-sm">{task.description}</p>
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
