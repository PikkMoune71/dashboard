"use client";

import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteProjectAction } from "@/store/actions/projectsAction";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function NavProjects({
  onProjectClick,
}: {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}) {
  const { isMobile } = useSidebar();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const dispatch = useDispatch<AppDispatch>();
  const auth = getAuth();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleDeleteProject = (projectId: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("Utilisateur non authentifié");
      return;
    }

    const deletedProject = projects.find((project) => project.id === projectId);
    if (!deletedProject) {
      console.error("Projet non trouvé");
      return;
    }

    setProjectToDelete(deletedProject);
    setIsModalOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      const userId = auth.currentUser?.uid;
      dispatch(
        deleteProjectAction({
          userId: userId || "",
          deletedProject: projectToDelete,
        })
      );
    }
    setIsModalOpen(false);
    toast({
      title: "Projet Supprimé !",
      description: `Le projet "${projectToDelete?.title}" a été supprimé avec succès.`,
      className: "bg-red-600 text-white",
    });
  };

  const cancelDeleteProject = () => {
    setIsModalOpen(false);
  };

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
                <span
                  className={`${project.color} w-4 h-4 rounded-full`}
                ></span>
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
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => project.id && handleDeleteProject(project.id)}
                >
                  <Trash2 />
                  <span>Supprimer le projet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce projet ?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteProject}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              className="ml-2 rounded-xl"
              variant="destructive"
              onClick={confirmDeleteProject}
            >
              <Trash2 />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  );
}
