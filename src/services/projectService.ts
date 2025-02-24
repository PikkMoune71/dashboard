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
import { Task } from "@/types/Task";

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

    const projects: Project[] = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const projectData = docSnapshot.data();
        const tasksRef = collection(db, "tasks");
        const tasksQuery = query(
          tasksRef,
          where("projectId", "==", docSnapshot.id)
        );
        const tasksSnapshot = await getDocs(tasksQuery);

        const tasks: Task[] = tasksSnapshot.docs.map((taskDoc) => ({
          id: taskDoc.id,
          title: taskDoc.data().title,
          description: taskDoc.data().description,
          status: taskDoc.data().status,
          projectId: taskDoc.data().projectId,
          createdAt:
            taskDoc.data().createdAt instanceof Timestamp
              ? taskDoc.data().createdAt.toDate().toISOString()
              : taskDoc.data().createdAt,
          startDate:
            taskDoc.data().startDate instanceof Timestamp
              ? taskDoc.data().startDate.toDate().toISOString()
              : taskDoc.data().startDate,
          endDate:
            taskDoc.data().endDate instanceof Timestamp
              ? taskDoc.data().endDate.toDate().toISOString()
              : taskDoc.data().endDate,
          timeSpent: taskDoc.data().timeSpent || [],
        }));

        return {
          id: docSnapshot.id,
          title: projectData.title,
          slug: projectData.slug,
          color: projectData.color,
          createdAt:
            projectData.createdAt instanceof Timestamp
              ? projectData.createdAt.toDate().toISOString()
              : projectData.createdAt,
          userId: projectData.userId,
          tasks,
        };
      })
    );

    return projects;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets : ", error);
    throw new Error("Erreur lors de la récupération des projets.");
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
