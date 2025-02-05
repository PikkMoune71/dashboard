import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import Cookies from "js-cookie";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";

export function useUser() {
  const [authUser, loading] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || loading) return;

    const fetchUserData = async () => {
      if (authUser) {
        // Récupérer les données utilisateur depuis Firestore
        const userDocRef = doc(db, "users", authUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const userLogged = {
            name: `${userData.firstName} ${userData.lastName}`, // Combinaison prénom + nom
            email: userData.email || "Email inconnu",
            avatar: userData.avatar || "/default-avatar.png", // Avatar par défaut si non défini
          };

          setUser(userLogged);
          Cookies.set("user", JSON.stringify(userLogged), {
            expires: 7,
            secure: true,
            path: "/",
          });
        }
      } else {
        Cookies.remove("user");
        setUser(null);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [authUser, router, loading, isMounted]);

  return { user, loading };
}
