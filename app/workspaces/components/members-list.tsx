import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { ArrowLeftIcon, MoreVerticalIcon, ShieldAlert, UsersRoundIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { useConfirm } from "~/features/hooks/useConfirm";
import { MemberAvatar } from "~/features/member/components/members-avatar";
import { useWorkspaceId } from "~/hooks/user-workspaceId";

export const MembersList = () => {
  const user = useLoaderData();
  const { workspaceAdmin } = useLoaderData();
  const data = user;
  const navigate = useNavigate();

  const workspaceId = useWorkspaceId();
  const currentWorkspaceId = data.workspaceId;

  // Filter members that belong to the current workspace
  const membersInCurrentWorkspace = data.members.filter(
    (member) => member.workspaceId == currentWorkspaceId
  );

  // Get the user IDs from the filtered members
  // const userIdsInCurrentWorkspace = membersInCurrentWorkspace.map(member => member.userId);

  // Find the user information for these user IDs
  const userRoles = membersInCurrentWorkspace.map((member) => ({
    userId: member.userId,
    role: member.role,
  }));

  const usersInCurrentWorkspace = data.user
    .filter((user) => userRoles.some((userRole) => userRole.userId === user.id))
    .map((user) => {
      // Step 3: Attach the role to each user based on userId
      const userRole = userRoles.find(
        (userRole) => userRole.userId === user.id
      );
      return {
        ...user, // Copy the user properties
        role: userRole ? userRole.role : "MEMBER", // Add role (default to 'MEMBER' if not found)
      };
    });

  const users = usersInCurrentWorkspace;

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete task",
    "This action cannot be undone",
    "destructive"
  );

  const handleDeleteMember = async (id: string) => {
    const ok = await confirmDelete();
    if (!ok) return;
    const formData = new FormData();
    formData.append("_method", "DELETE");
    formData.append("memberId", id);

    await fetch(`/workspaces/${workspaceId}/members`, {
      method: "POST",
      body: formData,
    });
    navigate(`/workspaces/${workspaceId}/members`);
  };

  const handleUpdateMember = async (id: string) => {
    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("memberId", id);

    await fetch(`/workspaces/${workspaceId}/members`, {
      method: "POST",
      body: formData,
    });
    navigate(`/workspaces/${workspaceId}/members`);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild variant="outline" size="sm">
          <Link to={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold"><p className="text-lg font-semibold inline-flex items-center">
            <UsersRoundIcon className="w-5 h-5 mr-2" /> Members List
          </p></CardTitle>
      </CardHeader>
      <div className="px-7">
        <div className="inline-flex items-center">
          <ShieldAlert className="w-4 h-4 m-1" />
          <small>
            Only Workspace Admin Has Permission to Manage Roles and Delete
            Members.
          </small>
        </div>

        <DottedSperator />
      </div>
      <Form method="post">
        <CardContent className="p-7">
          {users.map((member, index) => (
            <Fragment key={member.id}>
              <div className="flex items-center gap-2">
                <MemberAvatar
                  classname="size-10"
                  fallbackClassName="text-lg"
                  name={member.name}
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">
                    {member.name}{" "}
                    {
                      workspaceAdmin.userId === member.id ? (
                        <small>({`WORKSPACE ${member.role}`})</small> // Content when condition is true
                      ) : (
                        <small>({member.role})</small>
                      ) // Content when condition is false
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <input type="hidden" name="memberId" value={member.id} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-auto" variant="secondary" size="icon">
                      <MoreVerticalIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="bg-slate-50 p-3 rounded-md"
                  >
                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      onClick={() => handleUpdateMember(member.id)}
                    >
                      {member.role === "ADMIN"
                        ? "Set as Member"
                        : "Set as Administrator"}
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem className="font-medium cursor-pointer"
                                    onClick={() => handleUpdateMember(member.id)}
                                
                                >
                                Set as Member
                                </DropdownMenuItem> */}
                    <DropdownMenuItem
                      className="font-medium text-amber-700 cursor-pointer"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      Remove {member.name}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index < users.length - 1 && <Separator className="my-2.5" />}
            </Fragment>
          ))}
        </CardContent>
      </Form>
    </Card>
  );
};
