import { json, redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

export const loader = () => {
  return null;
};

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const tasksData = JSON.parse(formData.get("tasks") as string);

  if (!Array.isArray(tasksData)) {
    return json({ error: "Invalid tasks data" }, { status: 400 });
  }

  try {
    // Perform bulk updates or any other logic
    await Promise.all(
      tasksData.map((tasks) =>
        prisma.tasks.update({
          where: { id: tasks.id },
          data: {
            status: tasks.status,
            position: tasks.position,
          },
        })
      )
    );

    return json({ success: true });
  } catch (error) {
    console.error("Error updating tasks:", error);
    return json({ error: "Failed to update tasks" }, { status: 500 });
  }
}
