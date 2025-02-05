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

export default function Page() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <SidebarProvider>
      <AppSidebar onProjectClick={handleProjectClick} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Liste des projets</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {selectedProject?.title || "Nouveaux projet"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {!selectedProject && (
          <div className="flex flex-col items-center justify-center p-8 rounded-lg h-full bg-muted/50">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
              Aucun projet sélectionné
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Sélectionnez un projet ou ajoutez-en un nouveau pour commencer à
              travailler.
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
          {selectedProject && (
            <>
              <div className="aspect-video rounded-xl bg-muted/50">
                <h3>{selectedProject.title}</h3>
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
