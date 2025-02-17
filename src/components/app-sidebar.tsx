"use client";
import { useState, useEffect } from "react";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/composables/useFetchUser";
import { Logo } from "./Logo";
import { AddProject } from "./AddProject";
import { Project } from "@/types/Project";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { fetchProjects } from "@/store/actions/projectsAction";
import { Button } from "./ui/button";

export function AppSidebar({
  onProjectClick,
  onAccountClick,
  onCalendarClick,
}: {
  onProjectClick: (project: Project) => void;
  onAccountClick: () => void;
  onCalendarClick: () => void;
}) {
  const { user, loading } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadProjects = async () => {
      dispatch(fetchProjects());
    };

    loadProjects();
  }, [dispatch]);

  if (loading || !user) return null;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 mt-4">
          <AddProject
            onAddProject={(title: string, slug: string) =>
              setProjects([...projects, { title, slug }])
            }
          />
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={onCalendarClick}
            >
              📅 Voir le calendrier
            </Button>
          </div>
        </div>
        <NavProjects projects={projects} onProjectClick={onProjectClick} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onShowAccount={onAccountClick} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
