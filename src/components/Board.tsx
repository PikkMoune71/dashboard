import { useUser } from "@/composables/useFetchUser";
import React, { useState } from "react";
import { AddProject } from "./AddProject";
import { Project } from "@/types/Project";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Task } from "@/types/Task";
import { Card } from "./ui/card";
import Calendar from "./Calendar";
import Timer from "./Timer";
import { PieChartDonut } from "./PieChartDonut";
import CalendarDownload from "./CalendarDownload";

export const Board = () => {
  const { user } = useUser();
  const [addProjects, setAddProjects] = useState<Project[]>([]);
  const projects = useSelector((state: RootState) => state.projects.projects);

  const totalTasks = projects.reduce(
    (acc, project) => acc + (project.tasks?.length ?? 0),
    0
  );

  const totalTodoTasks = projects.reduce(
    (acc, project) =>
      acc +
      (project.tasks?.filter((task: Task) => task.status === "todo").length ||
        0),
    0
  );

  const totalInProgressTasks = projects.reduce(
    (acc, project) =>
      acc +
      (project.tasks?.filter((task: Task) => task.status === "inProgress")
        .length || 0),
    0
  );

  const totalDoneTasks = projects.reduce(
    (acc, project) =>
      acc +
      (project.tasks?.filter((task: Task) => task.status === "done").length ||
        0),
    0
  );

  return (
    <div className="bg-zinc-100 min-h-screen p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center rounded-lg my-10 gap-4">
        <h2 className="text-3xl md:text-5xl font-semibold text-muted-foreground text-center md:text-left">
          Bonjour <span className="text-primary">{user?.firstName}</span> ! 👋
        </h2>
        <div>
          <AddProject
            onAddProject={(title: string, slug: string) =>
              setAddProjects([...addProjects, { title, slug }])
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-1 row-span-1 bg-white p-4">
          <h2 className="text-2xl font-semibold mb-2">🚧 Tâches en cours</h2>
          {projects.every((project) =>
            (project.tasks ?? []).every((task) => task.status !== "inProgress")
          ) ? (
            <p className="ttext-3xl font-bold text-gray-300 text-center">
              Aucune tâche en cours
            </p>
          ) : (
            projects.map((project) => (
              <div key={project.id}>
                {project.tasks
                  ?.filter((task) => task.status === "inProgress")
                  .map((task) => (
                    <Card
                      key={task.id}
                      className="flex items-center gap-2 p-2 rounded-lg mt-2"
                    >
                      <span
                        className={`${project.color} p-3 rounded-full`}
                      ></span>
                      <span>{task.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {project.title}
                      </span>
                    </Card>
                  ))}
              </div>
            ))
          )}
        </Card>

        <Timer isWidget />

        <Card className="col-span-1 sm:col-span-2 lg:col-span-3 row-span-4 p-4">
          <div className="flex items-center justify-between flex-wrap">
            <h2 className="text-2xl font-semibold mb-4">📅 Calendrier</h2>
            <CalendarDownload />
          </div>
          <Calendar />
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white p-4">
          <h2 className="text-2xl font-semibold mb-4">📊 Statistiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center w-full h-40 bg-primary text-white rounded-xl">
              <span className="text-5xl font-bold">{projects.length}</span>
              <h3 className="text-lg font-bold">Projets</h3>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center w-full h-40 bg-amber-300 rounded-xl">
              <span className="text-5xl font-bold">{totalTasks}</span>
              <h3 className="text-lg font-bold">Tâches Total</h3>
            </Card>
          </div>
        </Card>

        <PieChartDonut
          totalTasks={totalTasks}
          totalTodoTasks={totalTodoTasks}
          totalInProgressTasks={totalInProgressTasks}
          totalDoneTasks={totalDoneTasks}
        />
      </div>
    </div>
  );
};
