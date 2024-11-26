import { redirect, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { RiAddCircleFill } from "react-icons/ri";
import { WorkspaceAvatar } from "~/workspaces/workspace-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useWorkspaceId } from "~/hooks/user-workspaceId";
import { useEffect, useState } from "react";
import Modal from "./modal";

export const WorkspaceSwitcher = () => {
  const { workspaces } = useLoaderData();
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaceId);

  useEffect(() => {
    setSelectedWorkspaceId(workspaceId);
  }, [workspaceId]);

  const openModal = () => {
    // const newUrl = `/workspaces/${workspaceId}`;
    // window.location.href = newUrl;
    searchParams.set("create-workspace", "true");
    setSearchParams(searchParams);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    searchParams.delete("create-workspace");
    setSearchParams(searchParams);
  };

  const onSelect = (id: string) => {
    // Set workspaceId in the URL to keep state when refreshing
    navigate(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Modal isOpen={isModalOpen} onClose={closeModal} />
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={openModal}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={onSelect} value={selectedWorkspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces.map((workspaceItem) => (
            <SelectItem key={workspaceItem.id} value={workspaceItem.id.toString()}>
              <div className="flex justify-start items-center gap-1 font-medium overflow-hidden">
                <WorkspaceAvatar
                  name={workspaceItem.name}
                  image={workspaceItem.imageUrl}
                />
                <span className="truncate m-2">{workspaceItem.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};