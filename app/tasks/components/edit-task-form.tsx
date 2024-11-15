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
} & EditTasksFromProp;

export const EditTaskForm = ({
  onCancel,
  taskId,
  tasks,
  projects,
  actionUrl,
}: EditTasksFormProps) => {
  const { projectId } = useLoaderData();
  const taskData = tasks.find((task) => task.id === taskId);
  const projectOptions = projects;

  const [name, setName] = useState(taskData?.name);
  const [date, setDate] = useState(new Date(taskData.dueDate));
  const [assignee, setAssignee] = useState(taskData.assignee.name);
  const [status, setStatus] = useState(taskData.status);
  const [project, setProject] = useState(taskData.project.name);
  const [projectImage, setProjectImage] = useState(taskData.project.imageUrl);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date); // Set the selected date
  };

  const handleProjectChange = (id: string) => {
    const selectedProject = projectOptions.find((p) => p.id === id);

    if (selectedProject) {
      // Set the whole object (id and name)
      setSelectedProject(selectedProject);
    }
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeDate = (event) => {
    setDate(event.target.value);
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
                value="data"
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
                value={dueDate}
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
              <Select value={assignee}>
                <SelectTrigger>
                  <div className="flex items-center gap-x-2">
                    <MemberAvatar classname="size-6" name={assignee} />
                    {assignee}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {
                    <SelectItem
                      key={taskData?.assigneeId}
                      value={taskData?.assigneeId}
                    >
                      <div className="flex items-center gap-x-2">
                        <MemberAvatar classname="size-6" name={assignee} />
                        {assignee}
                      </div>
                    </SelectItem>
                  }
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
                value={selectedProject.id}
                onValueChange={handleProjectChange}
                name="UpdateProjectId"
              >
                <SelectTrigger>
                  {selectedProject ? (
                    <div className="flex items-center gap-x-2">
                      <ProjectAvatar
                        classname="size-6"
                        name={selectedProject.name}
                        image={selectedProject.imageUrl}
                      />
                      {selectedProject.name}
                    </div>
                  ) : (
                    <span>Select Projects</span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-x-2">
                        <ProjectAvatar
                          classname="size-6"
                          name={project.name}
                          image={project.imageUrl}
                        />
                        {project.name}
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

            <Button type="submit" name="task" size="lg" onClick={close}>
              Create Task
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
