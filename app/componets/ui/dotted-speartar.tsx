import { cn } from "~/lib/utils";

interface DottedSperatorProps {
    className?: string,
    color?: string,
    height?: string,
    dotSize?: string,
    gapSize?: string,
    direction?: "horizontal" | "vertical"
}

export const DottedSperator = ({ 
    className,
    color = "#d4d4d8",
    height = "2px",
    dotSize = "6px",
    direction = "horizontal"
}: DottedSperatorProps) => {
    const isHorizontal = direction === "horizontal";

    return (
        <div className={cn( isHorizontal ? "w-full flex item-center" : "h-full flex flex-col item-center",
            className
        )}>

        <div className={isHorizontal ? "flex-grow" : "flex-grow-0"}/>
        </div>
    )
}