import { cn } from "~/lib/utils";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";

interface MemberAvatarProps {
    name: string;
    classname?: string;
    fallbackClassName?: string;
};

export const MemberAvatar = ({
    name,
    classname,
    fallbackClassName,
}: MemberAvatarProps) => {
    
    return (
        <Avatar className={cn("size-5 transition border-neutral-300 rounded-full", classname)}>
            <AvatarFallback className={cn(
                "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
                fallbackClassName
            )}>
                {name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}