"use client";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Project } from "@/types/Project";
import { AddProject } from "@/components/AddProject";
import { ProjectBoard } from "@/components/ProjectBoard";
import { Account } from "@/components/Account";
import Calendar from "@/components/Calendar";

export default function Page() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAccount, setShowAccount] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowAccount(false);
    setShowCalendar(false);
  };

  const handleShowAccount = () => {
    setShowAccount(true);
    setShowCalendar(false);
  };

  const handleShowCalendar = () => {
    setShowCalendar(true);
    setShowAccount(false);
    setSelectedProject(null);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        onProjectClick={handleProjectClick}
        onAccountClick={handleShowAccount}
        onCalendarClick={handleShowCalendar}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {showAccount
                      ? "Mon compte"
                      : showCalendar
                      ? "Calendrier"
                      : "Liste des projets"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!showAccount && !showCalendar && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {selectedProject?.title || "Nouveau projet"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {!showAccount && !showCalendar ? (
          <>
            {!selectedProject && (
              <div className="flex flex-col items-center justify-center p-8 rounded-lg h-full bg-muted/50">
                <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
                  Aucun projet sélectionné
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Sélectionnez un projet ou ajoutez-en un nouveau pour commencer
                  à travailler.
                </p>
                <div className="flex items-center gap-4">
                  <AddProject
                    onAddProject={(title: string, slug: string) =>
                      setProjects([...projects, { title, slug }])
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {selectedProject && <ProjectBoard project={selectedProject} />}
            </div>
          </>
        ) : showCalendar ? (
          <div className="p-4">
            <Calendar />
          </div>
        ) : (
          <Account />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
