import { useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";

export const useEditTasksModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [taskId, setTaskId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Retrieve taskId from searchParams when the component is mounted
      const taskParam = searchParams.get("update-task");
      setTaskId(taskParam);
    }
  }, [isMounted, searchParams]);

  const open = (id: string) => {
    setTaskId(id);
    // Corrected: Use string literal for the key "update-task"
    setSearchParams({ "update-task": id });
  };

  const close = () => {
    setTaskId(null);
    setSearchParams({});
  };

  return { taskId, open, close, setTaskId };
};
