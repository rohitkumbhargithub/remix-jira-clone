import { useLocation } from "react-router-dom";
import UserButton from "./user-button";
import { MobileSidebar } from "./ui/mobile-sidebar";
import { FileLineChart, HomeIcon, LayoutList } from "lucide-react";

const pathnameMap = {
    "tasks": {
        title: "My Tasks",
        icon: <LayoutList />,
        description: "View all of your tasks here",
    },
    "projects": {
        title: "My Project",
        icon: <FileLineChart />,
        description: "View tasks of your project here",
    },
};

const defaultMap = {
    title: "Home",
    icon: <HomeIcon />,
    description: "Monitor all of your projects and tasks here",
};

export const Nav = ({projects}) => {
    const location = useLocation();
    const pathname = location.pathname;
    const pathnameParts = pathname.split("/");
    const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

    const { title, description, icon } = pathnameMap[pathnameKey] || defaultMap;

    return (
        <nav className="pt-4 px-6 flex items-center justify-between">
            <div className="flex-col hidden lg:flex">
            <div className="inline-flex items-center">{icon}<h3 className="font-bold m-2"> {title}</h3></div>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <MobileSidebar projects={projects} />
            <UserButton />
        </nav>
    );
};
