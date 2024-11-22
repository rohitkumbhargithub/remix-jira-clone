import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { DottedSperator } from "./ui/dotted-speartar";
import Project from "./project";

export const Sidebar = () => {
  return (
   <aside className="fixed top-0 left-0 h-screen bg-neutral-100 p-3 w-72">
      <h1 className="mb-6">LOGO</h1>

      <DottedSperator className="mb-4" />
      <WorkspaceSwitcher />
      <DottedSperator className="mt-4 mb-4" />
      <Navigation />
      <DottedSperator className="mt-4 mb-4" />
      <Project />
    </aside>
  );
};
