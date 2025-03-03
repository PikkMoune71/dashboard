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
import { Label } from "./ui/label";
import ColorPicker from "./ColorPicker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { formatDateToISO } from "@/composables/useFormatDate";
import { TaskItem } from "./TaskItem";

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
  const { storedTimes } = useSelector((state: any) => state.timer);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"]>("todo");
  const [newTaskStartDate, setNewTaskStartDate] = useState<string>("");
  const [newTaskEndDate, setNewTaskEndDate] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [status, setStatus] = useState<Task["status"] | undefined>(undefined);
  const [titleProject, setTitleProject] = useState<string>(project.title);
  const [colorProject, setColorProject] = useState<string>(
    project.color || "bg-slate-500"
  );
  const [isColorPickerVisible, setIsColorPickerVisible] =
    useState<boolean>(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState<string>("");
  const [editTaskDescription, setEditTaskDescription] = useState<string>("");
  const [editTaskStatus, setEditTaskStatus] = useState<Task["status"]>("todo");
  const [editTaskStartDate, setEditTaskStartDate] = useState<string>("");
  const [editTaskEndDate, setEditTaskEndDate] = useState<string>("");

  useEffect(() => {
    setTitleProject(project.title);
    if (project.id) {
      dispatch(fetchTasks(project.id));
    }
    if (project.color) {
      setColorProject(project.color);
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

  const handleProjectColorChange = (newColor: string) => {
    setColorProject(newColor);
    dispatch(
      updateProjectAction({
        userId: project.userId ?? "",
        updatedProject: { ...project, color: newColor },
      })
    );
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
      startDate: newTaskStartDate,
      endDate: newTaskEndDate,
      timeSpent: [],
    };

    await dispatch(
      addTaskAction({ projectId: project.id ?? "", task: newTask })
    );

    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskStatus("todo");
    setNewTaskStartDate("");
    setNewTaskEndDate("");
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
    setEditTaskStartDate(formatDateToISO(task.startDate));
    setEditTaskEndDate(formatDateToISO(task.endDate));
    setIsEditDialogOpen(true);
  };

  const handleSaveEditTask = () => {
    if (!editTaskTitle.trim()) return;

    const updatedTask = {
      ...tasks.find((task: Task) => task.id === editTaskId),
      title: editTaskTitle,
      description: editTaskDescription,
      status: editTaskStatus,
      startDate: editTaskStartDate,
      endDate: editTaskEndDate,
      time: [],
    };

    dispatch(updateTaskAction({ projectId: project.id ?? "", updatedTask }));
    setIsEditDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string, projectId: string) => {
    dispatch(removeTaskAction({ projectId, taskId }));
  };

  const sortTasksByStartDate = (tasks: Task[]) => {
    return tasks.sort((a, b) => {
      const dateA = new Date(a.startDate || "");
      const dateB = new Date(b.startDate || "");

      if (a.status === "done" && b.status === "done") {
        return dateB.getTime() - dateA.getTime(); // Décroissant
      }

      // Si une des tâches est "done", on donne priorité à cette tâche
      if (a.status === "done") return -1;
      if (b.status === "done") return 1;

      // Si aucune des tâches n'est "done", on fait un tri croissant normal
      return dateA.getTime() - dateB.getTime(); // Croissant
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <EditButton value={titleProject} onSave={handleSaveEditButton} />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Popover
                open={isColorPickerVisible}
                onOpenChange={setIsColorPickerVisible}
              >
                <PopoverTrigger asChild>
                  <div
                    className={`w-10 h-10 rounded-full cursor-pointer ${colorProject}`}
                  />
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="p-4 border rounded-md shadow-md"
                >
                  <h3 className="text-lg font-bold mb-4">
                    Changer la couleur du projet
                  </h3>
                  <ColorPicker
                    setColor={handleProjectColorChange}
                    color={colorProject}
                  />
                  <Button
                    className="bg-primary text-white w-full mt-4"
                    onClick={() => setIsColorPickerVisible(false)}
                  >
                    Modifier
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
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
            <div>
              <Label className="text-sm text-gray-500">Date de Début</Label>
              <Input
                type="date"
                placeholder="Date de début"
                value={newTaskStartDate}
                onChange={(e) => setNewTaskStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-500">Date de Fin</Label>
              <Input
                type="date"
                placeholder="Date de fin"
                value={newTaskEndDate}
                onChange={(e) => setNewTaskEndDate(e.target.value)}
              />
            </div>
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
          <div>
            <Label className="text-sm text-gray-500">Date de Début</Label>
            <Input
              type="date"
              placeholder="Date de début"
              value={editTaskStartDate}
              onChange={(e) => setEditTaskStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm text-gray-500">Date de Fin</Label>
            <Input
              type="date"
              placeholder="Date de fin"
              value={editTaskEndDate}
              onChange={(e) => setEditTaskEndDate(e.target.value)}
            />
          </div>
          <Select
            value={editTaskStatus}
            onValueChange={(value) =>
              setEditTaskStatus(value as Task["status"])
            }
          >
            <SelectTrigger
              className={`p-2 rounded ${
                editTaskStatus
                  ? statusColors[editTaskStatus]
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
            <Button onClick={handleSaveEditTask}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 p-4">
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
                  {sortTasksByStartDate(tasks)
                    .filter((task: Task) => task.status === status)
                    .map((task: Task, index: any) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id || ""}
                        index={index}
                      >
                        {(provided) => (
                          <TaskItem
                            task={task}
                            project={project}
                            provided={provided}
                            timeSpent={storedTimes}
                            icon={icon}
                            handleEditTask={handleEditTask}
                            handleDeleteTask={handleDeleteTask}
                          />
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
