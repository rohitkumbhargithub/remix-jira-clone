import { useLocation } from "react-router-dom";
import UserButton from "./user-button";
import { MobileSidebar } from "./ui/mobile-sidebar";

const pathnameMap = {
    "tasks": {
        title: "My Tasks",
        description: "View all of your tasks here",
    },
    "projects": {
        title: "My Project",
        description: "View tasks of your project here",
    },
};

const defaultMap = {
    title: "Home",
    description: "Monitor all of your projects and tasks here",
};

export const Nav = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const pathnameParts = pathname.split("/");
    const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

    const { title, description } = pathnameMap[pathnameKey] || defaultMap;

    return (
        <nav className="pt-4 px-6 flex items-center justify-between">
            <div className="flex-col hidden lg:flex">
                <h1 className="text-lg font-bold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <MobileSidebar />
            <UserButton />
        </nav>
    );
};
