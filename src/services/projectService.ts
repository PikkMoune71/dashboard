import { db } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Project } from "@/types/Project";

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
      projectData.slug = projectData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }
    await updateDoc(projectRef, projectData);

    return updatedProject;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet :", error);
    throw new Error("Erreur lors de la mise à jour du projet.");
  }
};
