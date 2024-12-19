import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { DottedSperator } from "./ui/dotted-speartar";
import Project from "./project";
import JiraLogo from "../utils/images/utils/jira.svg";

export const Sidebar = ({ projects }) => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <img src={JiraLogo} alt="jira logo" className="object-cover mb-4" />
      <DottedSperator className="m-2" />
      <WorkspaceSwitcher />
      <DottedSperator className="m-2" />
      <Navigation />
      <DottedSperator className="m-2" />
      <div className="flex flex-col gap-y-2 flex-1 overflow-y-auto">
        <Project projects={projects} />
      </div>
    </aside>
  );
};
