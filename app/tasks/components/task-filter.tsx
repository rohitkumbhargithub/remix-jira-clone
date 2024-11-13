import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";
import { json } from "@remix-run/react";
import { DatePicker } from "~/componets/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TaskStatus } from "../types";

// Assuming `useTaskFilters` is still applicable, we can use this hook directly
import { useTaskFilters } from "../hooks/use-filter-tasks";
import { LoaderFunction } from "@remix-run/node";

// Loader function to fetch projects and members
export const loader: LoaderFunction = async ({ params }) => {
  const workspaceId = params.workspaceId; // Get workspaceId from URL params
  const [projectsRes, membersRes] = await Promise.all([
    fetch(`/api/projects?workspaceId=${workspaceId}`).then((res) => res.json()),
    fetch(`/api/members?workspaceId=${workspaceId}`).then((res) => res.json()),
  ]);
  return json({
    projects: projectsRes.documents,
    members: membersRes.documents,
  });
};

interface DataFiltersProps {
  hideProjectFilter?: boolean;
  projects: { id: string; name: string }[];
  members: { id: string; name: string }[];
}

export const DataFilters = ({
  hideProjectFilter,
  projects,
  members,
}: DataFiltersProps) => {
  const { status, assigneeId, projectId, dueDate, setFilters } =
    useTaskFilters();

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  const memberOptions = members.map((member) => ({
    value: member.id,
    label: member.name,
  }));

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? "all"} // Set default to 'all' if assigneeId is not provided
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees"/>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Project Filter (Optional) */}
      {!hideProjectFilter && (
        <Select
        defaultValue={projectId ?? "all"} // Set default to 'all' if assigneeId is not provided
        onValueChange={(value) => onProjectChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees"/>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectSeparator />
          {projectOptions?.map((project) => (
            <SelectItem key={project.value} value={project.value}>
              {project.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      )}

      {/* Due Date Filter */}
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};
