import { cn } from "~/lib/utils";

interface DottedSperatorProps {
    className?: string;
    color?: string;
    height?: string;
    dotSize?: string;
    gapSize?: string;
    direction?: "horizontal" | "vertical";
}

export const DottedSperator = ({
    className,
    color = "#d4d4d8",
    height = "5px",
    dotSize = "10px",
    gapSize = "2px",
    direction = "horizontal",
}: DottedSperatorProps) => {
    const isHorizontal = direction === "horizontal";

    return (
        <div
            className={cn(
                isHorizontal
                    ? "w-full flex items-center"
                    : "h-full flex flex-col items-center",
                className
            )}
        >
            <div
                className={isHorizontal ? "flex-grow" : "flex-grow-0"}
                style={{
                    width: isHorizontal ? "100%" : height,
                    height: isHorizontal ? height : "100%",
                    backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
                    backgroundSize: isHorizontal
                        ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
                        : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
                    backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
                    backgroundPosition: "center",
                }}
            />
        </div>
    );
};
