"use client";

import {
  ClipboardList,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Project } from "@/types/Project";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function NavProjects({
  onProjectClick,
}: {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}) {
  const { isMobile } = useSidebar();
  const projects = useSelector((state: RootState) => state.projects.projects);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Liste des projets</SidebarGroupLabel>
      {projects.length === 0 && (
        <SidebarGroupLabel className="text-muted-foreground">
          Aucun projet
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {projects.map((project, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onProjectClick(project);
                }}
              >
                <ClipboardList />
                <span>{project.title}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    onProjectClick(project);
                  }}
                >
                  <Folder className="text-muted-foreground" />
                  <span>Voir le projet</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Partager</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 />
                  <span>Supprimer le projet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
