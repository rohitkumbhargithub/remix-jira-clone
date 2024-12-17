import {
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { RiAddCircleFill } from "react-icons/ri";
import { WorkspaceAvatar } from "~/workspaces/workspace-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import Modal from "./modal";

export const WorkspaceSwitcher = () => {
  const { workspaces } = useLoaderData();
  console.log(workspaces)
  const {workspaceId} = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  

  const openModal = () => {
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
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id.toString()}>
              <div className="flex justify-start items-center gap-1 font-medium overflow-hidden">
                <WorkspaceAvatar
                  classname=""
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="truncate m-2">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
