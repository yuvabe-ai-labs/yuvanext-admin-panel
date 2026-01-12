import Signin from "@/pages/SignIn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  component: Signin,
});
