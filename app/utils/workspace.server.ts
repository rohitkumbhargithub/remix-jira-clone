import { generateInviteCode } from '~/lib/utils';
import { prisma } from './prisma.server';
import { getUserSession } from './session.server'; 
import { json, Params } from '@remix-run/react';
import { redirect } from 'react-router';

type WorkspaceForm = {
    id: string,
    name: string,
    imageUrl: string,
    inviteCode: string;
}

enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
};

export const createWorkspaces = async (workspace: WorkspaceForm, request: Request) => {
    const user = await getUserSession(request);
  
    if (!user) {
      throw new Error("User must be logged in to create a workspace.");
    }
  
    try{
        const newWorkspace = await prisma.workspace.create({
            data: {
              name: workspace.name,
              userId: user.id,
              imageUrl: workspace.imageUrl,
              inviteCode: workspace.inviteCode,
            },
          });
        
          const member = await prisma.member.create({
            data: {
              userId: user.id,
              workspaceId: newWorkspace.id,
              role: MemberRole.ADMIN,
            },
          });
        
          return {
            id: newWorkspace.id,
            name: workspace.name,
            imageUrl: workspace.imageUrl,
            inviteCode: workspace.inviteCode, // Return inviteCode
            member: member.id,
          };
    }catch(error){
        console.log(error)
    }
    
  };


  export const getAllWorkspaces = async (request: Request) => {
    const user = await getUserSession(request);
    if (!user) {
        throw new Error("User must be logged in to view workspaces.");
    }

    const workspaces = await prisma.workspace.findMany();
    return workspaces;
};

  

export const getWorkspacesByUser = async (request: Request) => {
    const user = await getUserSession(request);
    if (!user) {
        throw new Error("User must be logged in to view workspaces.");
    }

    const workspaces = await prisma.workspace.findMany({
        where: {
            userId: user.id,
        },
    });

    // const workspaces = await prisma.workspace.findMany();
    return workspaces;
};

type WorkspaceId = {
  workspaceId: string | number;
}

export const UpdateWorkspace = async (workspace: WorkspaceForm, workspaceId: WorkspaceId, request: Request) => {
    const user = await getUserSession(request);

    if (!user) {
        throw new Error("User must be logged in to view workspaces.");
    }

    const updatedWorkspace = await prisma.workspace.update({
        where: {
          id: Number(workspaceId), 
        },
        data: {
          name: workspace.name,      
          imageUrl: workspace.imageUrl,  
        },
      });

      return updatedWorkspace;
}


export const DeleteWorkspace = async(workspaceId: WorkspaceId, request: Request) => {
  const user = await getUserSession(request);
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }

  await prisma.member.deleteMany({
    where: { workspaceId: Number(workspaceId) },
  });

  // Delete the Workspace
  const deleteWorkspace = await prisma.workspace.delete({
    where: { id: Number(workspaceId) },
  });

  return deleteWorkspace;
}

export const getAllMemeber = async(request: Request) => {
  const user = await getUserSession(request);
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }
  const workspace = await getAllWorkspaces(request)
  const members = await prisma.member.findMany({
    where: {
        workspaceId: workspace.id,
    },

});
return members;
}

export const getJoinedWorkspace = async(params: Params, request: Request) => {
  const user = await getUserSession(request);
  if (!user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }

  const { workspaceId, inviteCode } = params;

  // Find workspace by ID and inviteCode
  const workspace = await prisma.workspace.findFirst({
    where: { id: Number(workspaceId), inviteCode },
  });

  if (!workspace) {
    return json({ error: "Invalid invite code or workspace ID" }, { status: 400 });
  }

  // Check if the user is already a member
  const existingMember = await prisma.member.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    },
  });

  if (existingMember) {
    console.log("User is already a member");
    return redirect(`/workspaces/${workspaceId}`);
  }

  const newMemberData = await prisma.$transaction(async (prisma) => {
    const newMember = await prisma.member.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: MemberRole.MEMBER,
      },
    });

    // Retrieve the updated workspace data
    const updatedWorkspace = await prisma.workspace.findUnique({
      where: { id: workspace.id },
      include: {
        user: true,
        members: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    return {
      newMember,
      workspace: updatedWorkspace,
    };
  });

  if (!newMemberData) {
    return json({ error: "Failed to add member to the workspace" }, { status: 500 });
  }

  // Update user's session with the new workspace
  const updatedUserSession = {
    ...user,
    workspaces: [ newMemberData.workspace], // Assuming user.workspaces is an array of workspaces
  };

  const getWorkspaces = (user) => {
    return user.workspaces.map(({ id, name, imageUrl, inviteCode, createdAt }) => ({
      id,
      name,
      imageUrl,
      inviteCode,
      createdAt,
    }));
  };
  
  // Usage
  const workspaceData = getWorkspaces(updatedUserSession);
  return workspaceData;
}


export const ResetCode = async (params: Params, request: Request) => {
  const user = await getUserSession(request);
  if (!user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }
  
  const { workspaceId, inviteCode } = params;

  try {
    const workspace = await prisma.workspace.update({
      where: { id: Number(workspaceId), inviteCode },
      data: { 
        inviteCode: generateInviteCode(6),
      }
    });

    return json({ message: "Invite code updated successfully", workspace });
  } catch (error) {
    return json({ error: "Failed to update invite code", details: error.message }, { status: 500 });
  }
};
