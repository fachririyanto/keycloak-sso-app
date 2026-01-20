import { Link } from "@tanstack/react-router";
import { LayoutGrid, Check } from "lucide-react";

import { AppUrl } from "@/lib/config";
import { useAppStore } from "./store";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

import { AppSidebar } from "./sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const { store } = useAppStore();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex sticky top-0 left-0 z-30 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background border-b">
                    <div className="flex flex-grow items-center gap-2 px-4">
                        <div className="flex flex-grow items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/app">
                                            App
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{store.pageTitle}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <ButtonListApps />
                    </div>
                </header>
                <main className="p-4">
                    {children}
                </main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}

function ButtonListApps() {
    return (
        <Popover>
            <PopoverTrigger>
                <LayoutGrid />
            </PopoverTrigger>
            <PopoverContent align="end" className="p-1 w-[200px]">
                <ul className="flex flex-col text-sm">
                    <li>
                        <Link to={AppUrl} className="flex p-2 items-center rounded-md transition-colors hover:bg-muted">
                            <span className="flex-grow">
                                App One
                            </span>
                            <Check size={16} />
                        </Link>
                    </li>
                    <li>
                        <Link to="http://localhost:5174" className="flex p-2 items-center rounded-md transition-colors hover:bg-muted">
                            <span className="flex-grow">
                                App Two
                            </span>
                        </Link>
                    </li>
                </ul>
            </PopoverContent>
        </Popover>
    );
}