"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  IconDotsVertical,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
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

type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
};

function getStoredUser(fallback: SidebarUser): SidebarUser {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as {
      firstName?: string;
      lastName?: string;
      name?: string;
      email?: string;
      profilePicture?: string | null;
    };
    const name =
      parsed.name ||
      [parsed.firstName, parsed.lastName].filter(Boolean).join(" ") ||
      fallback.name;
    return {
      name,
      email: parsed.email || fallback.email,
      avatar: parsed.profilePicture || fallback.avatar,
    };
  } catch {
    return fallback;
  }
}

export function NavUser({ user }: { user: SidebarUser }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(getStoredUser(user));
  }, [user]);

  const initials = useMemo(() => {
    return (
      currentUser.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "DR"
    );
  }, [currentUser.name]);

  const logout = async () => {
    try {
      await axios.post("/api/logout");
    } catch {
      // Keep logout client-side even if API cleanup fails.
    }

    [
      "authToken",
      "authTokenExpiresAt",
      "user",
      "userRole",
      "lastEmail",
      "rememberMe",
      "adminToken",
    ].forEach((key) => localStorage.removeItem(key));

    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "authUser=; path=/; max-age=0";
    document.cookie = "authProvider=; path=/; max-age=0";
    router.replace("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentUser.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {currentUser.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentUser.name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/doctor/settings")}
              >
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/doctor/settings")}
              >
                <IconSettings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} variant="destructive">
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
