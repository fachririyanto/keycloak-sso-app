import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home } from "lucide-react";

import { cn } from "@/lib/shadcn/utils";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebarNav() {
    // get pathname
    const [pathname, setPathname] = useState<string>("");
    const location = useLocation();

    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/app" className={cn(pathname === "/app" && "bg-muted")}>
                                <Home className="size-4" />
                                <span>Home</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}