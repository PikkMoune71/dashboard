/* eslint-disable @next/next/no-html-link-for-pages */
import { RegisterForm } from "@/components/register-form";
import { Logo } from "@/components/Logo";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex items-center justify-center ">
            <Logo width={200} />
          </div>
        </a>
        <RegisterForm />
      </div>
    </div>
  );
}
