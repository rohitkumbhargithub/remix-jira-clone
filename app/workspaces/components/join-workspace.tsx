import { Form, Link, useLoaderData } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { DottedSperator } from "~/componets/ui/dotted-speartar"

export const JoinWorkspaceForm = ({initialValues, workspace}) => {
    const id = parseInt(initialValues.workspaceId, 10);
    const workspaceData = Array.isArray(workspace) ? workspace.find((ws) => ws.id === id) : null;

   
    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Join Workspace
                </CardTitle>
            <CardDescription>
                You&apos;ve been invited to join <strong>{workspaceData ? workspaceData.name : "Unknown"}</strong> workspace
            </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSperator/>
            </div>
            <CardContent className="p-7">
                <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
                    <Button className="w-full lg:w-fit"
                        type="button"
                        size="lg"
                        // disabled={isPending}
                        asChild
                    >
                        <Link to="/">Cancel</Link>
                    </Button>

            <Form method="post" >
            <input type="hidden" name="workspaceId" value={id} />
            <Button className="w-full lg:w-fit"
                        size="lg"
                        
              type="submit"
            >
              Join Workspace
            </Button>
          </Form>
                </div>
            </CardContent>
        </Card>
    )
}