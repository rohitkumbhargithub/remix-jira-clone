import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Link, useLoaderData } from "@remix-run/react"
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { DottedSperator } from "~/componets/ui/dotted-speartar"
import { MemberAvatar } from "~/features/member/components/members-avatar"

export const MembersList = () => {
    const user = useLoaderData();
    const data = user;
    const workspaceId = data.workspaceId;
    const id = parseInt(workspaceId, 10);
    const currentWorkspaceId = data.workspaceId;

    // Filter members that belong to the current workspace
    const membersInCurrentWorkspace = data.members.filter(member => member.workspaceId == currentWorkspaceId);

    // Get the user IDs from the filtered members
    const userIdsInCurrentWorkspace = membersInCurrentWorkspace.map(member => member.userId);

    // Find the user information for these user IDs
    const usersInCurrentWorkspace = data.user.filter(user => userIdsInCurrentWorkspace.includes(user.id));

    const users = usersInCurrentWorkspace;

        return (
        <Card className="w-full h-full border-none shadow-none">
            {/* <ConfirmDialog/> */}
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button asChild variant="outline" size="sm">
                    <Link to={`/workspaces/${id}`}>
                    <ArrowLeftIcon className="size-4 mr-2"/>
                    Back
                    </Link>
                </Button>
                <CardTitle className="text-xl font-bold">
                    Members List
                </CardTitle>
            </CardHeader>
                <div className="px-7">
                    <DottedSperator/>
                </div>
            <CardContent className="p-7">
                {users.map((member, index) => (
                    <Fragment key={member.$id}>
                        <div className="flex items-center gap-2">
                            <MemberAvatar classname="size-10"
                            fallbackClassName="text-lg"
                            name={member.name}
                            />
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                            <Button className="ml-auto"
                                variant="secondary"
                                size="icon"
                            >
                            <MoreVerticalIcon className="size-4 text-muted-foreground" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="end" className="bg-slate-50 p-3 rounded-md">
                                <DropdownMenuItem className="font-medium"
                                    // onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                                    // disabled={isUpdatingMember}
                                >
                                Set as Administrator
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-medium"
                                    // onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                                    // disabled={isUpdatingMember}
                                >
                                Set as Member
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-medium text-amber-700"
                                    // onClick={() => handleDeleteMember(member.$id)}
                                    // disabled={isDeletingMember}
                                >
                                Remove {member.name}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {index < users.length - 1 && (
                            <Separator className="my-2.5" />
                        )}
                    </Fragment>
                ))}
            </CardContent>
        </Card>
    )
}