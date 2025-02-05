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

interface AddTaskProps {
  onAddTask: (title: string, slug: string) => void;
}

export const AddTask: React.FC<AddTaskProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const auth = getAuth();
  const user = auth.currentUser;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleAddTask = async () => {
    if (title.trim() === "") return;

    if (!user) {
      console.error("L'utilisateur n'est pas connecté.");
      return;
    }

    try {
      await addDoc(collection(db, "projects"), {
        title,
        slug,
        createdAt: new Date(),
        userId: user.uid,
      });

      onAddTask(title, slug);
      handleOpen();
      toast({
        title: "Projet ajouté !",
        description: `Le projet "${title}" a été ajouté avec succès.`,
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet : ", error);
    }
  };

  const handleOpen = () => {
    setTitle("");
    setSlug("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus />
          Nouveau Projet
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titre du projet
            </Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              className="col-span-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddTask}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
