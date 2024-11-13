"use client";

import { z } from "zod";
import { useRef } from "react";
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
import {
  Form,
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

interface EditTasksFormProps {
  onCancel?: () => void;
}

export const EditTaskForm = ( {onCancel} : EditTasksFormProps
) => {


  

  return (
    <div className="w-full h-full border-none shadow-none bg-white rounded-lg p-5">
      <div className="flex p-2 border-b border-gray-200 p-3">
        <h2 className="text-xl font-bold">Edit a Task</h2>
      </div>

      <div className="p-3">
        <Form
          method="post"
          encType="multipart/form-data"
          // action={actionUrl}
          // onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-y-6">
            <div>
              <label htmlFor="taskName" className="font-bold-sm">
                Task Name
              </label>
              <input
                type="text"
                id="taskName"
                name="taskName"
                placeholder="Enter Task Name"
                // value={task.taskName}
                // onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="font-bold-sm">
                Due Date
              </label>
              {/* <DatePicker
                value={dueDate}
                onChange={handleDueDateChange}
                name="dueDate"
                placeholder="Select a Date"
                className="my-4"
              />
              {error && <p className="text-red-500">{error}</p>}{" "} */}
            </div>

            <div>
              <label htmlFor="assigneeId" className="font-bold-sm">
                Assignee
              </label>
              <Select
                // value={selectedAssignee.id}
                // onValueChange={handleAssigneeChange}
                // name="assigneeId"
              >
                <SelectTrigger>
                  {/* {selectedAssignee ? (
                    <div className="flex items-center gap-x-2">
                      <MemberAvatar
                        classname="size-6"
                        name={selectedAssignee.name}
                      />
                      {selectedAssignee.name}
                    </div>
                  ) : (
                    <span>Select assignee</span>
                  )} */}
                </SelectTrigger>
                <SelectContent>
                  {/* {memberOptions.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-x-2">
                        <MemberAvatar classname="size-6" name={member.name} />
                        {member.name}
                      </div>
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="status" className="font-bold-sm">
                Status
              </label>

              <Select
                // value={selectedStatus}
                // onValueChange={handleStatusChange}
                // name="status"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
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
              <label htmlFor="projectId" className="font-bold-sm">
                Project
              </label>
              <Select
                // value={selectedProject.id}
                // onValueChange={handleProjectChange}
                // name="projectId"
              >
                <SelectTrigger>
                  {/* {selectedProject ? (
                    <div className="flex items-center gap-x-2">
                      <ProjectAvatar
                        classname="size-6"
                        name={selectedProject.name}
                        image={selectedProject.imageUrl}
                      />
                      {selectedProject.name}
                    </div>
                  ) : (
                    <span>Select assignee</span>
                  )} */}
                </SelectTrigger>
                <SelectContent>
                  {/* {projectOptions.map((project) => (
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
                  ))} */}
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
