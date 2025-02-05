import { db } from "@/app/firebase/config";
import { Project } from "@/types/Project";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchProjects = async (): Promise<Project[]> => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        try {
          const q = query(
            collection(db, "projects"),
            where("userId", "==", userId)
          );
          const querySnapshot = await getDocs(q);

          const fetchedProjects: Project[] = [];
          querySnapshot.forEach((doc) => {
            fetchedProjects.push({
              id: doc.id,
              ...doc.data(),
            } as Project);
          });

          resolve(fetchedProjects);
        } catch (error) {
          console.error("Erreur lors de la récupération des projets : ", error);
          reject(error);
        }
      } else {
        console.log("L'utilisateur n'est pas authentifié.");
        resolve([]);
      }
    });
  });
};
