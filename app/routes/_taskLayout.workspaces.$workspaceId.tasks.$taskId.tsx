import { authenticator } from "~/utils/auth.server";


export const loader = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in"
  });

  return null;
}


const TaskId = () => {
  return (
    <h1>taskId</h1>
  )
}


export default TaskId;