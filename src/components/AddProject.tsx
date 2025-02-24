"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { generateSlug } from "@/composables/useGenerateSlug";
import { db } from "@/app/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchProjects } from "@/store/actions/projectsAction";
import ColorPicker from "./ColorPicker";

interface AddProjectProps {
  onAddProject: (title: string, slug: string, color: string) => void;
}

export const AddProject: React.FC<AddProjectProps> = ({ onAddProject }) => {
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const auth = getAuth();
  const user = auth.currentUser;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleAddProject = async () => {
    if (title.trim() === "") return;

    if (!user) {
      console.error("L'utilisateur n'est pas connecté.");
      return;
    }

    try {
      await addDoc(collection(db, "projects"), {
        title,
        slug,
        color,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });

      dispatch(fetchProjects());
      onAddProject(title, slug, color);
      setTitle("");
      setSlug("");
      setColor("");
      setOpen(false);
      toast({
        title: "Projet ajouté !",
        description: `Le projet "${title}" a été ajouté avec succès.`,
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet : ", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du projet.",
        className: "bg-red-600 text-white",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full ">
          <Plus />
          <span className="group-data-[collapsible=icon]:hidden">
            Nouveau Projet
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un projet</DialogTitle>
          <DialogDescription>
            Entrez un nom pour votre nouveau projet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col">
            <Label htmlFor="title">Titre du projet</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              className="col-span-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <ColorPicker setColor={setColor} />
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddProject}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
