import { db } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Project } from "@/types/Project";
import { generateSlug } from "@/composables/useGenerateSlug";

export const getProjects = async (): Promise<Project[]> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  try {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      const projectData = doc.data();
      projects.push({
        id: doc.id,
        title: projectData.title,
        slug: projectData.slug,
        createdAt:
          projectData.createdAt instanceof Timestamp
            ? projectData.createdAt.toDate().toISOString()
            : projectData.createdAt,
        userId: projectData.userId,
      });
    });

    projects.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return projects;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets : ", error);
    throw new Error("Erreur lors de la récupération des projets");
  }
};

export const updateProject = async (
  userId: string,
  updatedProject: Project
): Promise<Project> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!userId || userId !== user?.uid) {
    throw new Error("Utilisateur non connecté");
  }

  if (!updatedProject.id) {
    throw new Error("L'ID du projet est requis pour la mise à jour.");
  }

  try {
    const { id, ...projectData } = updatedProject;

    const projectRef = doc(db, "projects", id);
    if (projectData.title) {
      projectData.slug = generateSlug(projectData.title);
    }
    await updateDoc(projectRef, projectData);

    return updatedProject;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet :", error);
    throw new Error("Erreur lors de la mise à jour du projet.");
  }
};

export const deleteProject = async (
  userId: string,
  deletedProject: Project
): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!userId || userId !== user?.uid) {
    throw new Error("Utilisateur non connecté");
  }

  if (!deletedProject.id) {
    throw new Error("L'ID du projet est requis pour la suppression.");
  }

  try {
    const projectRef = doc(db, "projects", deletedProject.id);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
    throw new Error("Erreur lors de la suppression du projet.");
  }
};
