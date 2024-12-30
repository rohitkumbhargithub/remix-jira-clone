
import { cn } from "~/lib/utils";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";


type WorksapceAvatarProps = {
    image: string;
    name: string;
    classname: string;
};

export const WorkspaceAvatar = ({
    image,
    name,
    classname
}: WorksapceAvatarProps) => {
    if(image){
        return (
            <div className={cn(
                "size-8 p-1 relative rounded-md overflow-hidden",
                classname
            )}>
                <img src={image} alt={name} fill className="object-cover rounded-md" />
            </div>
        )
    }

    if(!image){
    return (
        <Avatar className={cn("size-8 rounded-md", classname)}>
            <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase">
                {name[0]}
            </AvatarFallback>
        </Avatar>
    )
    }
}