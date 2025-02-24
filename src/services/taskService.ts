import { db } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Task } from "@/types/Task";

// Récupérer les tâches d'un projet
export const getTasks = async (projectId: string): Promise<Task[]> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);

    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      const taskData = doc.data();
      tasks.push({
        id: doc.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        projectId: taskData.projectId,
        createdAt:
          taskData.createdAt instanceof Timestamp
            ? taskData.createdAt.toDate().toISOString()
            : taskData.createdAt,
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        timeSpent: taskData.timeSpent || [],
      });
    });

    return tasks;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches : ", error);
    throw new Error("Erreur lors de la récupération des tâches");
  }
};

// Ajouter une nouvelle tâche
export const addTask = async (projectId: string, task: Task): Promise<Task> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  try {
    const tasksRef = collection(db, "tasks");
    const docRef = await addDoc(tasksRef, {
      ...task,
      projectId,
      createdAt: Timestamp.now(),
    });

    const newTask: Task = { ...task, id: docRef.id };
    return newTask;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche : ", error);
    throw new Error("Erreur lors de l'ajout de la tâche");
  }
};

export const updateTask = async (
  projectId: string,
  updatedTask: Task
): Promise<Task> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  if (!updatedTask || !updatedTask.id) {
    throw new Error("Task ID is undefined or task is not defined");
  }

  try {
    // Mettre à jour la tâche dans la collection "tasks"
    const taskDocRef = doc(db, "tasks", updatedTask.id);
    await updateDoc(taskDocRef, {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      projectId: updatedTask.projectId,
      startDate: updatedTask.startDate,
      endDate: updatedTask.endDate,
      timeSpent: updatedTask.timeSpent || [],
    });

    // Mettre à jour la tâche dans le projet concerné
    const projectDocRef = doc(db, "projects", projectId);
    const projectSnapshot = await getDoc(projectDocRef);

    if (projectSnapshot.exists()) {
      const projectData = projectSnapshot.data();

      if (projectData.tasks) {
        const updatedTasks = projectData.tasks.map((task: Task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );

        await updateDoc(projectDocRef, { tasks: updatedTasks });
      }
    }

    return updatedTask;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche : ", error);
    throw new Error("Erreur lors de la mise à jour de la tâche");
  }
};

// Supprimer une tâche
export const removeTask = async (
  projectId: string,
  taskId: string
): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  try {
    const taskDocRef = doc(db, "tasks", taskId);
    await deleteDoc(taskDocRef);
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche : ", error);
    throw new Error("Erreur lors de la suppression de la tâche");
  }
};
