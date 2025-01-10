import { ScrollBar, ScrollArea } from "~/components/ui/scroll-area";
import { DottedSperator } from "./dotted-speartar";
import { AnalyticsCard } from "./analytics-card";
import { useLoaderData } from "@remix-run/react";


export const Analytics = () => {
    // if(!data) return null;
    const { totalTask, assignee, completedTask, inCompletedTask, overDueTask } = useLoaderData();
    

    return (
        <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
            <div className="w-full flex flex-row">
                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Total Tasks"
                        value={totalTask.taskCount}
                        variant={totalTask.taskDifference > 0 ? "up": "down"}
                        increaseValue={totalTask.taskDifference}
                    />
                    <DottedSperator direction="vertical" />
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Assigneed Tasks"
                        value={assignee.assigneeCount}
                        variant={assignee.assigneeDifference > 0 ? "up": "down"}
                        increaseValue={assignee.assigneeDifference}
                    />
                    <DottedSperator direction="vertical" />
                </div>

                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="Completed Tasks"
                        value={completedTask.completeTaskCount}
                        variant={completedTask.completeTaskDifference > 0 ? "up": "down"}
                        increaseValue={completedTask.completeTaskDifference}
                    />
                    <DottedSperator direction="vertical" />
                </div>

                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="OverDue Tasks"
                        value={overDueTask.overDueTaskCount}
                        variant={overDueTask.overDueTaskDifference > 0 ? "up": "down"}
                        increaseValue={overDueTask.overDueTaskDifference}
                    />
                    <DottedSperator direction="vertical" />
                </div>

                <div className="flex items-center flex-1">
                    <AnalyticsCard 
                        title="InCompleted Tasks"
                        value={inCompletedTask.inCompleteTaskCount}
                        variant={inCompletedTask.inCompleteTaskDifference > 0 ? "up": "down"}
                        increaseValue={inCompletedTask.inCompleteTaskDifference}
                    />
                </div>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}