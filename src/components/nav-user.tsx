"use client";
import { useEffect, useState } from "react";
import { ChevronsUpDown, LogOut, User, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { doc, onSnapshot } from "firebase/firestore";

export function NavUser({
  user: initialUser,
  onShowAccount,
}: {
  user: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
  };
  onShowAccount: () => void;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    if (!initialUser.id) return;

    const userRef = doc(db, "users", initialUser.id);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUser((prev) => ({ ...prev, avatar: docSnap.data().avatar }));
      }
    });

    return () => unsubscribe();
  }, [initialUser.id]);

  const name = `${user.firstName} ${user.lastName}`;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove("user");

      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SidebarMenu className="rounded-2xl">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={name} />
                <AvatarFallback className="rounded-lg">
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onShowAccount}>
                <User2 />
                Mon compte
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
