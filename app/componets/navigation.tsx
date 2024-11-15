import { Link, useLocation } from "@remix-run/react";
import { GoCheckCircle, GoCheckCircleFill, GoPeople } from "react-icons/go";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { useWorkspaceId } from "~/hooks/user-workspaceId";

// Assuming you are passing `workspaceId` as a prop to this component
const routes = (workspaceId) => [
    {
        label: "Home",
        href: `/workspaces/${workspaceId}`,
        icon: IoHomeOutline,
        activeIcon: IoHomeOutline,
    },
    {
        label: "My Tasks",
        href: `/workspaces/${workspaceId}/tasks`,
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill,
    },
    {
        label: "Settings",
        href: `/workspaces/${workspaceId}/settings`, 
        icon: IoSettingsOutline,
        activeIcon: IoSettingsOutline,
    },
    {
        label: "Members",
        href: `/workspaces/${workspaceId}/members`,
        icon: GoPeople,
        activeIcon: GoPeople,
    }
];

export const Navigation = () => {
    const location = useLocation(); 
    const workspaceId = useWorkspaceId();
    return (
        <ul className="flex flex-col">
            {
                routes(workspaceId).map((item) => {
                    const isActive = location.pathname === item.href; 
                    const Icon = isActive ? item.activeIcon : item.icon;

                    return (
                        <Link key={item.href} to={item.href}>
                            <div>
                                <div className={`flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500 ${isActive ? "bg-white text-black shadow-sm opacity-100 text-primary" : ""}`}>
                                    <Icon className="w-5 h-5 text-neutral-500" />
                                    {item.label}
                                </div>
                            </div>
                        </Link>
                    );
                })
            }
        </ul>
    );
};
