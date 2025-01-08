import { useParams } from "@remix-run/react";

export const useProjectId = () => {
    const params = useParams();
    return params.projectId as string;
}