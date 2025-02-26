"use client";
import { useState, useEffect } from "react";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import { Separator } from "./ui/separator";
import Timer from "./Timer";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar({
  onProjectClick,
  onAccountClick,
  onCalendarClick,
  onHomeClick,
}: {
  onProjectClick: (project: Project) => void;
  onAccountClick: () => void;
  onCalendarClick: () => void;
  onHomeClick: () => void;
}) {
  const { user, loading } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useIsMobile();

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
        <div className="px-10 pt-3 group-data-[collapsible=icon]:hidden">
          <Logo />
        </div>
        <div
          className={`${
            isMobile && "hidden"
          } "flex justify-center group-data-[state=expanded]:hidden`}
        >
          <Logo isIcon />
        </div>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 mt-4">
          <AddProject
            onAddProject={(title: string, slug: string) =>
              setProjects([...projects, { title, slug }])
            }
          />
          <div className="my-2">
            <Button
              variant="outline"
              className="w-full font-semibold"
              onClick={onCalendarClick}
            >
              📅{" "}
              <span className="group-data-[collapsible=icon]:hidden">
                Calendrier
              </span>
            </Button>
          </div>
        </div>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Tableau de bord</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" onClick={onHomeClick}>
                  <span>🏠</span>
                  <span>Accueil</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavProjects projects={projects} onProjectClick={onProjectClick} />
      </SidebarContent>
      <SidebarFooter>
        <Timer />
        <NavUser user={user} onShowAccount={onAccountClick} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
