import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { DottedSperator } from "./ui/dotted-speartar";
import Project from "./project";
import JiraLogo from "../utils/images/utils/jira.svg"

export const Sidebar = () => {
  return (
   <aside className="fixed top-0 left-0 h-screen bg-neutral-100 p-3 w-72">
      <img src={JiraLogo} alt="jira logo" className="object-cover" />

      <DottedSperator className="mb-4" />
      <WorkspaceSwitcher />
      <DottedSperator className="mt-4 mb-4" />
      <Navigation />
      <DottedSperator className="mt-4 mb-4" />
      <Project />
    </aside>
  );
};
