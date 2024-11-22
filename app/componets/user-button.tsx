import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { BiLogOut } from "react-icons/bi";
import { DottedSperator } from "./ui/dotted-speartar";
import { LogOut } from "lucide-react";

export default function UserButton() {
  const { user } = useLoaderData();
  const fetcher = useFetcher(); 
  
  if (!user) {
    return null; 
  }

  const { name, email } = user;
  const avatarFallback = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase() ?? "U";

  const handleLogout = () => {
    fetcher.submit(null, { method: "post", action: "/logout" });
  };

  return (
    <DropdownMenu modal={false}>
  <DropdownMenuTrigger className="outline-none relative z-50">
    <Avatar className="w-8 h-8 hover:opacity-90 transition">
      <AvatarFallback className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent
    align="end"
    side="bottom"
    className="w-60 bg-gray-50 rounded-md shadow-lg z-50"
    sideOffset={10}
  >
    <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
      <Avatar className="w-[42px] h-[42px]">
        <AvatarFallback className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-neutral-900">
          {name || "User"}
        </p>
        <p className="text-xs text-neutral-500">{email}</p>
      </div>
    </div>
    <DottedSperator className="mb-1" />
    <DropdownMenuItem
      onClick={handleLogout}
      className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

  );
}
