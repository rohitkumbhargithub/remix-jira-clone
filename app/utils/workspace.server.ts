import { generateInviteCode } from "~/lib/utils";
import { prisma } from "./prisma.server";
import { getUserSession } from "./session.server";
import { json, Params } from "@remix-run/react";
import { redirect } from "react-router";

type WorkspaceForm = {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
};

enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export const createWorkspaces = async (
  workspace: WorkspaceForm,
  request: Request
) => {
  const user = await getUserSession(request);

  if (!user) {
    throw new Error("User must be logged in to create a workspace.");
  }

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
};

export const getAllWorkspaces = async (request: Request) => {
  const user = await getUserSession(request);
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }

  const workspaces = await prisma.workspace.findMany({});
  return workspaces;
};

export const getAllWorkspacesId = async (
  request: Request,
  workspaceId: WorkspaceId
) => {
  const user = await getUserSession(request);
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      id: workspaceId,
    },
  });
  return workspaces;
};

export const removeImage = async (request: Request, workspaceId: number) => {
  // Ensure user is logged in
  const user = await getUserSession(request);
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }

  // Fetch the workspace
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found.");
  }

  const workspaces = await prisma.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      imageUrl: "",
    },
  });

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

  return workspaces;
};

type WorkspaceId = {
  workspaceId: string | number;
};

export const UpdateWorkspace = async (
  workspace: WorkspaceForm,
  workspaceId: WorkspaceId,
  request: Request
) => {
  const user = await getUserSession(request);

  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }

  const getWorkspaceImage = await prisma.workspace.findMany({
    where: {
      id: Number(workspaceId),
    },
  })

  const currentImageUrl = getWorkspaceImage[0].imageUrl;
  const imageUrl = typeof workspace.imageUrl === 'string' && workspace.imageUrl !== currentImageUrl
    ? workspace.imageUrl
    : currentImageUrl;

  const updatedWorkspace = await prisma.workspace.update({
    where: {
      id: Number(workspaceId),
    },
    data: {
      name: workspace.name,
      imageUrl: imageUrl,
    },
  });

  return updatedWorkspace;
};

export const DeleteWorkspace = async (
  workspaceId: WorkspaceId,
  request: Request
) => {
  const user = await getUserSession(request);
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }

  // Delete all tasks related to the workspace first
  await prisma.tasks.deleteMany({
    where: { workspaceId: Number(workspaceId) },
  });

  // Delete all projects related to the workspace
  await prisma.project.deleteMany({
    where: { workspaceId: Number(workspaceId) },
  });

  // Delete all members related to the workspace
  await prisma.member.deleteMany({
    where: { workspaceId: Number(workspaceId) },
  });

  // Finally, delete the workspace
  const deleteWorkspace = await prisma.workspace.delete({
    where: { id: Number(workspaceId) },
  });

  return deleteWorkspace;
};

export const getAllMemeber = async (request: Request) => {
  const user = await getUserSession(request);
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }
  const workspace = await getAllWorkspaces(request);
  const members = await prisma.member.findMany({
    where: {
      workspaceId: workspace.id,
    },
    include: {
      workspace: true,
      user: true,
    },
  });
  return members;
};

export const getMemeberByWorkspace = async (
  request: Request,
  params: Params
) => {
  const user = await getUserSession(request);
  const userId = params.userId;
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }
  const workspace = await getAllWorkspaces(request);
  const members = await prisma.member.findMany({
    where: {
      workspaceId: workspace.id,
      userId: user.id,
    },
    include: {
      workspace: true,
    },
  });
  return members;
};

type MemberId = {
  memberId: number;
};

export const deleteMemberInWorkspace = async (
  memerId: MemberId,
  workspaceId: WorkspaceId,
  request: Request
) => {
  const user = await getUserSession(request);
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }

  // const memberData = await prisma.member.findMany({
  //   where: {
  //     userId: Number(memerId),
  //     workspaceId: Number(workspaceId),
  //   },
  // });

  // if (memberData[0].role === "ADMIN") {
  //   throw new Error("You can't delete");
  // }


  // if(memberData[0].userId === user.id){
  //   throw new Error("You can't delete");
  // }

  // console.log(memberData)

  // const deleteMember = await prisma.member.delete({
  //   where: {
  //     id: memberData[0].id,
  //   },
  // });

  // return deleteMember;
  let deleteMember;
  const memberData = await prisma.member.findMany({
    where: {
      userId: Number(memerId),
      workspaceId: Number(workspaceId),
    },
  });

  const workspaceMemeber = await prisma.member.findMany({
    where: {
      workspaceId: Number(workspaceId)
    },
  });

  if (workspaceMemeber.length === 1) {
    throw new Error("failed to delete");
  }

  const isUserInWorkspace = workspaceMemeber.find(member => member.userId === user.id && member.role === MemberRole.ADMIN);

  if(isUserInWorkspace){
    if (memberData[0].role === "MEMBER") {
      deleteMember = await prisma.member.delete({
        where: {
          id: memberData[0].id,
        }
      });
     
    }else{
      deleteMember = await prisma.member.delete({
        where: {
          id: memberData[0].id,
        },
      });
    }
  }
  return deleteMember;
};

export const updateAsMemberInWorkspace = async (
  memerId: MemberId,
  workspaceId: WorkspaceId,
  request: Request
) => {
  const user = await getUserSession(request);
  if (!user) {
    throw new Error("User must be logged in to view workspaces.");
  }

  let updateMember;
  const memberData = await prisma.member.findMany({
    where: {
      userId: Number(memerId),
      workspaceId: Number(workspaceId),
    },
  });

  const workspaceMemeber = await prisma.member.findMany({
    where: {
      workspaceId: Number(workspaceId)
    },
  });

  if (workspaceMemeber.length === 1) {
    throw new Error("failed to update");
  }

  const isUserInWorkspace = workspaceMemeber.find(member => member.userId === user.id && member.role === MemberRole.ADMIN || MemberRole.MEMBER);

  if(isUserInWorkspace){
    if (memberData[0].role === "MEMBER") {
      updateMember = await prisma.member.update({
        where: {
          id: memberData[0].id,
        },
        data: {
          role: MemberRole.ADMIN,
        },
      });
     
    }else{
      updateMember = await prisma.member.update({
        where: {
          id: memberData[0].id,
        },
        data: {
          role: MemberRole.MEMBER,
        },
      });
    }
  }
  return updateMember;
};

// export const updateAsAdminInWorkspace = async (
//   memerId: MemberId,
//   workspaceId: WorkspaceId,
//   request: Request
// ) => {
//   const user = await getUserSession(request);
//   if (!user) {
//     throw new Error("User must be logged in to view workspaces.");
//   }

//   const memberData = await prisma.member.findMany({
//     where: {
//       userId: Number(memerId),
//       workspaceId: Number(workspaceId),
//     },
//   });

//   const updateMember = await prisma.member.update({
//     where: {
//       id: memberData[0].id,
//     },
//     data: {
//       role: MemberRole.ADMIN,
//     },
//   });

//   return updateMember;
// };

export const getJoinedWorkspace = async (params: Params, request: Request) => {
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
    return json(
      { error: "Invalid invite code or workspace ID" },
      { status: 400 }
    );
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

  // Using a transaction to ensure that the user is added to the workspace correctly
  const newMemberData = await prisma.$transaction(async (prisma) => {
    // Create the new member record
    const newMember = await prisma.member.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: MemberRole.MEMBER, // Assuming MemberRole is defined elsewhere
      },
    });

    // Retrieve the updated workspace data
    const updatedWorkspace = await prisma.workspace.findUnique({
      where: { id: workspace.id },
      include: {
        user: true,
        members: true, // Include all members
      },
    });

    return {
      newMember,
      workspace: updatedWorkspace,
    };
  });

  if (!newMemberData) {
    return json(
      { error: "Failed to add member to the workspace" },
      { status: 500 }
    );
  }

  // Update user's session with the new workspace
  const updatedUserSession = {
    ...user,
    workspaces: Array.isArray(user.workspaces)
      ? [...user.workspaces, newMemberData.workspace]
      : [newMemberData.workspace],
  };

  const getWorkspaces = (user) => {
    return (user.workspaces || []).map(
      ({ id, name, imageUrl, inviteCode, createdAt }) => ({
        id,
        name,
        imageUrl,
        inviteCode,
        createdAt,
      })
    );
  };

  // Usage
  const workspaceData = getWorkspaces(updatedUserSession);
  return workspaceData;
};

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
      },
    });

    return json({ message: "Invite code updated successfully", workspace });
  } catch (error) {
    return json(
      { error: "Failed to update invite code", details: error.message },
      { status: 500 }
    );
  }
};
