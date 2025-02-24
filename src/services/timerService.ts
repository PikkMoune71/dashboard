import { db } from "@/app/firebase/config";
import { updateDoc, doc, getDoc } from "firebase/firestore";

export const fetchTime = async (taskId: string) => {
  const taskRef = doc(db, "tasks", taskId);
  const taskDoc = await getDoc(taskRef);
  return taskDoc.data()?.timeSpent || [];
};

export const saveTime = async (taskId: string, seconds: number) => {
  const taskRef = doc(db, "tasks", taskId);

  const taskDoc = await getDoc(taskRef);
  const currentTimes = taskDoc.exists() ? taskDoc.data()?.timeSpent || [] : [];

  // Si seconds est un tableau (en cas de multiple secondes), on l'ajoute à currentTimes
  const updatedTimes = [...currentTimes, seconds];

  await updateDoc(taskRef, {
    timeSpent: updatedTimes,
  });

  return { taskId, seconds };
};

export const removeTime = async (taskId: string, seconds: number) => {
  const taskRef = doc(db, "tasks", taskId);

  const taskDoc = await getDoc(taskRef);
  if (taskDoc.exists()) {
    const currentTimeSpent: number[] = taskDoc.data()?.timeSpent || [];

    // On filtre la liste des times en excluant la valeur 'seconds'
    const updatedTimeSpent = currentTimeSpent.filter(
      (time) => time !== seconds
    );

    await updateDoc(taskRef, {
      timeSpent: updatedTimeSpent,
    });
  }

  return { taskId, seconds };
};
