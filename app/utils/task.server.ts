import { getUserSession } from "./session.server";
import { TaskStatus } from "~/tasks/types";
import { prisma } from "./prisma.server";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

type TaskForm = {
  id: string;
  name: string;
  workspaceId: string;
  projectId: string;
  assigneeId: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  position: number;
};

function validatePosition(position: number): boolean {
  return position >= 1000 && position <= 100000;
}

export const createTask = async (tasks: TaskForm, request: Request) => {
  const user = await getUserSession(request);

  if (!user) {
    throw new Error("User must be logged in to create a workspace.");
  }

  if (!validatePosition(tasks.position)) {
    throw new Error("Position must be between 1000 and 100000.");
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
    },
  });

  return {
    newTask,
  };
};

export const getTask = async (request: Request) => {
  const user = await getUserSession(request);

  if (!user) {
    throw new Error("User must be logged in to create a workspace.");
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
};

type TaskId = {
  taskId: string | number;
};

type UpdateForm = {
  id: string;
  name: string;
  projectId: number;
  assigneeId: number;
  dueDate: string;
  status: TaskStatus;
};

export const updateTask = async (
  taskId: number,
  task: UpdateForm,
  request: Request
) => {
  const user = await getUserSession(request);

  if (!user) {
    throw new Error("User must be logged in to create a workspace.");
  }

  // Check if task exists
  const existingTask = await prisma.tasks.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new Error(`Task with ID ${taskId} not found.`);
  }

  // Proceed with updating the task
  const updatedTask = await prisma.tasks.update({
    where: { id: taskId },
    data: {
      name: task.name,
      projectId: task.projectId,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      status: task.status,
    },
  });

  return updatedTask;
};

export const deleteTask = async (taskId: TaskId, request: Request) => {
  const user = await getUserSession(request);

  if (!user) {
    throw new Error("User must be logged in to delete a task.");
  }

  const deletedTask = await prisma.tasks.deleteMany({
    where: { id: Number(taskId) },
  });

  return deletedTask;
};

type WorkspaceId = {
  workspaceId: string | number;
};

type ProjectId = {
  projectId: string | number;
};

const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

export const getTotalTasks = async (
  workspaceId: WorkspaceId,
  projectId: ProjectId,
) => {

  const thisMonthTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      createdAt: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
      
    },
  });

  // Fetch last month's tasks
  const lastMonthTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  const taskCount = thisMonthTasks;
  const taskDifference = taskCount - lastMonthTasks;
  console.log()

  return {
    taskCount,
    taskDifference,
  };
};

export const getTotalAssignee = async (workspaceId: WorkspaceId, projectId: ProjectId) => {
 
  const thisMonthAssignedTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      createdAt: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
    },
  });

  const lastMonthAssignedTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  const assigneeCount = thisMonthAssignedTasks;
  const assigneeDifference = assigneeCount - lastMonthAssignedTasks; 
  return {
    assigneeCount,
    assigneeDifference,
  };
};

export const getTotalCompleteTask = async (workspaceId: WorkspaceId, projectId: ProjectId) => {
 
  const thisMonthCompletedTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      status: TaskStatus.DONE,
      createdAt: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
    },
  });

  const lastMonthCompletedTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      status: TaskStatus.DONE,
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  const completeTaskCount = thisMonthCompletedTasks;
  const completeTaskDifference = completeTaskCount - lastMonthCompletedTasks; 
  return {
    completeTaskCount,
    completeTaskDifference,
  };
};


export const getTotalInCompleteTask = async (workspaceId: WorkspaceId, projectId: ProjectId) => {

  const thisMonthInCompletedTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      status: {
        not: TaskStatus.DONE,
      },
      createdAt: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
    },
  });

  const lastMonthInCompletedTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      status: {
        not: TaskStatus.DONE,
      },
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  const inCompleteTaskCount = thisMonthInCompletedTasks;
  const inCompleteTaskDifference = inCompleteTaskCount - lastMonthInCompletedTasks; 
  return {
    inCompleteTaskCount,
    inCompleteTaskDifference,
  };
};


export const getTotalOverDueTask = async (workspaceId: WorkspaceId, projectId: ProjectId) => {

  const thisMonthOverDueTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      dueDate: {
        lt: now, 
      },
      createdAt: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
    },
  });

  const lastMonthOverDueTasks = await prisma.tasks.count({
    where: {
      ...(projectId
        ? { projectId: Number(projectId) }
        : { workspaceId: Number(workspaceId) }),
      dueDate: {
        lt: now, 
      },
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  const overDueTaskCount = thisMonthOverDueTasks;
  const overDueTaskDifference = overDueTaskCount - lastMonthOverDueTasks; 
  return {
    overDueTaskCount,
    overDueTaskDifference,
  };
};