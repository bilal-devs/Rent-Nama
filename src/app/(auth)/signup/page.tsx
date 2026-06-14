import { SignUpForm } from "@/components/auth/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Rent Nama account",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
