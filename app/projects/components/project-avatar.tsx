import Image from "next/image";
import { cn } from "~/lib/utils";

import { Avatar, AvatarFallback } from "~/components/ui/avatar"

interface ProjectAvatarProps {
    image?: string;
    name?: string;
    classname?: string;
    fallbackClassName?: string;
};

export const ProjectAvatar = ({
    image,
    name,
    classname,
    fallbackClassName,
}: ProjectAvatarProps) => {
    if(image){
        return (
            <div className={cn(
                "size-5 relative rounded-md overflow-hidden",
                classname
            )}>
                <img src={image} alt={name} fill className="object-cover" />
            </div>
        )
    }
    
    return (
        <Avatar className={cn("size-5 rounded-md", classname)}>
            <AvatarFallback className={cn("text-white bg-blue-600 font-semibold text-sm uppercase",
                fallbackClassName,
            )}>
                {name[0]}
            </AvatarFallback>
        </Avatar>
    )
}