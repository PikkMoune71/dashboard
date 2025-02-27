import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import Cookies from "js-cookie";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import crypto from "crypto";

const generateToken = (uid: string) => {
  return crypto.createHash("sha256").update(uid).digest("hex");
};

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
        const userDocRef = doc(db, "users", authUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          let calendarToken = userData.calendarToken;

          if (!calendarToken) {
            calendarToken = generateToken(authUser.uid);
            await setDoc(userDocRef, { calendarToken }, { merge: true });
          }
          const userLogged = {
            id: authUser.uid,
            firstName: userData.firstName || "Prénom inconnu",
            lastName: userData.lastName || "Nom inconnu",
            email: userData.email || "Email inconnu",
            avatar: userData.avatar || "/default-avatar.png",
            bio: userData.bio,
            phone: userData.phone,
            calendarToken,
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
