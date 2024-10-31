// app/components/CreateWorkspaceForm.tsx
import { Form } from "@remix-run/react";

type NewFormProps = {
  actionUrl: string; // route URL where the form should submit data
};

export function NewForm({ actionUrl }: NewFormProps) {
  return (
    <Form method="post" action={actionUrl}>
      <label>
        Workspace Name:
        <input type="text" name="name" required />
      </label>
      <br /> 
      <label>
        Description:
        <textarea name="description" required></textarea>
      </label>
      <br />
      <button type="submit">Create Workspace</button>
    </Form>
  );
}
