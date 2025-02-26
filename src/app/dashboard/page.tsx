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
import { ProjectBoard } from "@/components/ProjectBoard";
import { Account } from "@/components/Account";
import Calendar from "@/components/Calendar";
import { Board } from "@/components/Board";

export default function Page() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
    setSelectedProject(null);
  };

  const handleShowCalendar = () => {
    setShowCalendar(true);
    setShowAccount(false);
    setSelectedProject(null);
  };

  const handleShowHome = () => {
    setShowAccount(false);
    setShowCalendar(false);
    setSelectedProject(null);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        onProjectClick={handleProjectClick}
        onAccountClick={handleShowAccount}
        onCalendarClick={handleShowCalendar}
        onHomeClick={handleShowHome}
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
                      : selectedProject
                      ? selectedProject.title
                      : "Page d'accueil"}{" "}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!showAccount && !showCalendar && selectedProject && (
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

        {!showAccount && !showCalendar && !selectedProject ? (
          <Board />
        ) : showCalendar ? (
          <div className="p-4">
            <Calendar />
          </div>
        ) : showAccount ? (
          <Account />
        ) : (
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {selectedProject && <ProjectBoard project={selectedProject} />}
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
