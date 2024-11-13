import { useSearchParams } from "@remix-run/react";
import { TaskStatus } from "../types";

export const useTaskFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const projectId = searchParams.get("projectId") || "";
    const status = searchParams.get("status") as TaskStatus | null;
    const assigneeId = searchParams.get("assigneeId") || "";
    const search = searchParams.get("search") || "";
    const dueDate = searchParams.get("dueDate") || "";

    const setFilters = (filters: { [key: string]: string | null }) => {
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams);

            Object.entries(filters).forEach(([key, value]) => {
                if (value === null) {
                    newParams.delete(key); 
                } else {
                    newParams.set(key, value);
                }
            });

            return newParams;
        });
    };

    return {
        projectId,
        status: status ? Object.values(TaskStatus).includes(status as TaskStatus) ? status : null : null,
        assigneeId,
        search,
        dueDate,
        setFilters, 
    };
};
