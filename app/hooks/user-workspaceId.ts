import { useParams } from "@remix-run/react";

export const useWorkspaceId = () => {
    const params = useParams();
    return params.workspaceId as string;
}