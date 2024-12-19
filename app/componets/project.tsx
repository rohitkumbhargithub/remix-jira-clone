import { useLocation, useParams, useSearchParams } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { ProjectAvatar } from "~/projects/components/project-avatar";
import ProjectModal from "./project-modal";
import { cn } from "~/lib/utils";

const Project = ({projects = []}) => {
  const {workspaceId} = useParams();
  const filteredProjects = projects.filter(project => project.workspaceId === Number(workspaceId));
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const openModal = () => {
    searchParams.set("create-project", "true");
    setSearchParams(searchParams);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    searchParams.delete("create-project");
    setSearchParams(searchParams);
  };

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <ProjectModal isOpen={isModalOpen} onClose={closeModal} />
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase text-neutral-500">Projects</p>
          <RiAddCircleFill
            onClick={openModal}
            className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          />
        </div>
        {
          filteredProjects ? 
          (filteredProjects?.map((project) => {
            const href = `/workspaces/${workspaceId}/projects/${project.id}`;
            const isActive = location.pathname === href;
      
            return (
              <Link to={href} key={project.id}>
                <div
                  className={cn(
                    "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                    isActive && "bg-white shadow-sm hover:opacity text-primary"
                  )}
                >
                  <ProjectAvatar image={project.imageUrl} name={project.name} />
                  <span className="truncate">{project.name}</span>
                </div>
              </Link>
            );
          })):
          (
            <p>No project assigne</p>
          )
        }
        
      </div>
    </>
  );
};

export default Project;
