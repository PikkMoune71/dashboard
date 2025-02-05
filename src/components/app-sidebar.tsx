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
import { AddTask } from "./AddTask";
import { Project } from "@/types/Project";
import { fetchProjects } from "@/composables/useFetchProject";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
    };

    loadProjects();
  }, []);

  if (loading || !user) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 mt-4">
          <AddTask
            onAddTask={(title, slug) =>
              setProjects([...projects, { title, slug }])
            }
          />
        </div>
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
