import { Params } from "@remix-run/react";
import { prisma } from "./prisma.server";
import { getUserSession } from "./session.server";


type ProjectForm = {
    id: string,
    name: string,
    imageUrl: string,
    workspaceId: string,
}

export const createProject = async (params: Params, project: ProjectForm, request: Request) => {
    const user = await getUserSession(request);
    
    const workspaceId = params;
    if (!user) {
      throw new Error("User must be logged in to create a workspace.");
    }
  
    const newProject = await prisma.project.create({
      data:{
        name: project.name,
        imageUrl: project.imageUrl,
        workspaceId: Number(workspaceId),
      }
    })

    return {
      id: newProject.id,
      name: project.name,
      imageUrl: project.imageUrl,
    }
    
  };


  export const getProjectsByWorkspace = async (request: Request, params: Params) => {
    const user = await getUserSession(request);
    const workspaceId = params;
    if (!user) {
      throw new Error("User must be logged in to create a workspace.");
    }

    const getProjects = await prisma.project.findMany({
      where:{
        workspaceId: workspaceId
      }
    })
    return getProjects;
  }

  export const getProjects = async (request: Request) => {
    const user = await getUserSession(request);

    if (!user) {
      throw new Error("User must be logged in to create a workspace.");
    }

    const getProjects = await prisma.project.findMany({

    })
    return getProjects;
  }

  type ProjectId = {
    projectId: string | number;
  }

  export const DeleteProject = async (projectId: ProjectId, request: Request) => {
    const user = await getUserSession(request);
    if (!user) {
      throw new Error("User must be logged in to view workspaces.");
    }

    await prisma.tasks.deleteMany({
      where: { projectId: Number(projectId) },
    });
  
    const deleteProject = await prisma.project.delete({
      where: {
        id: Number(projectId),
      },
    });
  
    return deleteProject;
  };
  

  export const UpdateProject = async (project: ProjectForm, projectId: ProjectId, request: Request) => {
    const user = await getUserSession(request);

    

    const updateProject = await prisma.project.update({
        where: {
          id: Number(projectId), 
        },
        data: {
          name: project.name,      
          imageUrl: project.imageUrl,  
        },
      });

      return updateProject;
}