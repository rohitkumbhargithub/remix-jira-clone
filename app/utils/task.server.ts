import { getUserSession } from "./session.server";
import { TaskStatus } from "~/tasks/types";
import { prisma } from "./prisma.server";
import { getAllUsers } from "./user.server";


type TaskForm = {
  id: string,
  name: string,
  workspaceId: string,
  projectId: string,
  assigneeId: string,
  description: string,
  dueDate: string,
  status: TaskStatus,
  position: number,
}

function validatePosition(position: number): boolean {
  return position >= 1000 && position <= 100000;
}



export const createTask = async (
  tasks: TaskForm,
  request: Request
) => {
  const user = await getUserSession(request); 

  if (!user) {
    throw new Error('User must be logged in to create a workspace.');
  }

  if (!validatePosition(tasks.position)) {
    throw new Error('Position must be between 1000 and 100000.');
  }

  const newTask = await prisma.tasks.create({
    data: {
      name: tasks.name,
      dueDate: tasks.dueDate,
      status: tasks.status,
      position: tasks.position,
      description: "",
      workspaceId: tasks.workspaceId,
      projectId: tasks.projectId,
      assigneeId: tasks.assigneeId,
      createdAt: new Date(),
    }
  });

  return {
    newTask
  };
};


export const getTask = async (request: Request) => {
  const user = await getUserSession(request); 

  if (!user) {
    throw new Error('User must be logged in to create a workspace.');
  }

  const tasks = await prisma.tasks.findMany({
    include: {
      project: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
      assignee: {
        select: {
          name: true,
          
        },
      },
    },
  });
  
  return tasks;
}


