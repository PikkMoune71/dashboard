// src/services/projectService.ts
import { db } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
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
