"use client";

import { z } from "zod";
import { useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { DatePicker } from "~/componets/date-picker";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectAvatar } from "../../projects/components/project-avatar";
import { MemberAvatar } from "~/features/member/components/members-avatar";
import { useWorkspaceId } from "~/hooks/user-workspaceId";
import { createTaskSchema } from "../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, useLoaderData } from "@remix-run/react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Task, TaskStatus } from "../types";
import { DottedSperator } from "~/componets/ui/dotted-speartar";

type EditTasksFromProp = {
  actionUrl: string;
};

type EditTasksFormProps = {
  onCancel?: () => void;
  taskId: string;
  tasks: [];
  projects: [];
  members: [];
} & EditTasksFromProp;

export const EditTaskForm = ({
  onCancel,
  taskId,
  tasks,
  projects,
  actionUrl,
  members,
}: EditTasksFormProps) => {
  const taskData = tasks.find((task) => task.id === taskId);
  const projectOptions = projects;
  const memberOptions = members;

  const [name, setName] = useState(taskData?.name);
  const [date, setDate] = useState(new Date(taskData.dueDate));
  const [status, setStatus] = useState(taskData.status);


  const [selectedAssignee, setSelectedAssignee] = useState<{
    id: string;
    name: string;
  } | null>(
    taskData?.assigneeId
      ? { id: taskData.assigneeId, name: taskData.assignee.name }
      : null
  );
  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(
    taskData?.projectId
      ? {
          id: taskData.projectId,
          name: taskData.project.name,
          image: taskData.project.imageUrl,
        }
      : null
  );

  const handleDueDateChange = (selectedDate: any) => {

    if (selectedDate) {
      setDate(new Date(selectedDate)); 
  };

  const handleAssigneeChange = (id: string) => {
    const selectedMember = memberOptions.find((m) => m.id === id);
    if (selectedMember) {
      setSelectedAssignee(selectedMember);
    }
  };

  const handleProjectChange = (id: string) => {
    const selectedProject = projectOptions.find((p) => p.id === id);
    if (selectedProject) {
      setSelectedProject(selectedProject);
    }
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  return (
    <div className="w-full h-full border-none shadow-none bg-white rounded-lg p-5">
      <div className="flex p-2 border-b border-gray-200 p-3">
        <h2 className="text-xl font-bold">Edit a Task</h2>
      </div>

      <div className="p-3">
        <Form
          method="post"
          encType="multipart/form-data"
          action={actionUrl}
          // onSubmit={handleSubmit}
        >
          <input type="hidden" name="_method" value="PATCH" />
          <input type="hidden" name="taskId" value={taskId ?? ""} />
          <div className="flex flex-col gap-y-6">
            <div>
              <label htmlFor="updateTaskName" className="font-bold-sm">
                Task Name
              </label>
              <input
                type="text"
                id="updateTaskName"
                name="updateTaskName"
                placeholder="Enter Task Name"
                value={name}
                onChange={handleChangeName}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="updateDueDate" className="font-bold-sm">
                Due Date
              </label>
              <DatePicker
                value={date}
                onChange={handleDueDateChange}
                name="updateDueDate"
                placeholder="Select a Date"
                className="my-4"
              />
            </div>

            <div>
              <label htmlFor="assigneeId" className="font-bold-sm">
                Assignee
              </label>
              <Select
                value={selectedAssignee?.id || ""}
                onValueChange={handleAssigneeChange}
                name="assigneeId"
              >
                <SelectTrigger>
                  {selectedAssignee ? (
                    <div className="flex items-center gap-x-2">
                      <MemberAvatar
                        classname="size-6"
                        name={selectedAssignee.name}
                      />
                      {selectedAssignee.name}
                    </div>
                  ) : (
                    <span>{taskData?.assignee.name || "Select an assignee"}</span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {memberOptions.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-x-2">
                        <MemberAvatar classname="size-6" name={member.name} />
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="UpdateStatus" className="font-bold-sm">
                Status
              </label>

              <Select
                value={status}
                name="UpdateStatus"
                onValueChange={(newStatus) => setStatus(newStatus)} // Update state when value changes
              >
                <SelectTrigger>
                  {/* Display the current status or "Select Status" as a placeholder */}
                  <SelectValue placeholder={status || "Select Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={TaskStatus.IN_REVIEW}>
                    In Review
                  </SelectItem>
                  <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                  <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="UpdateProjectId" className="font-bold-sm">
                Project
              </label>
              <Select
                value={selectedProject?.id || ""}
                onValueChange={handleProjectChange}
                name="UpdateProjectId"
              >
                <SelectTrigger>
                  {selectedProject ? (
                    <div className="flex items-center gap-x-2">
                      <ProjectAvatar
                        classname="size-6"
                        name={selectedProject?.name}
                        image={selectedProject?.imageUrl}
                      />
                      {selectedProject?.name}
                    </div>
                  ) : (
                    <span>{taskData.project.name || "Select an project"}</span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-x-2">
                        <ProjectAvatar
                          classname="size-6"
                          name={project?.name}
                          image={project?.imageUrl}
                        />
                        {project?.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="py-3" />

          <DottedSperator className="py-7" />
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button type="submit" name="task" size="lg" onClick={onCancel}>
              Save the changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
