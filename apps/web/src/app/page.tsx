"use client";
import { Button } from "@workspace/ui/components/button";

// import { emailSchema } from "@workspace/zod-validator";
export default function Page() {
  // const parse = emailSchema.safeParse("test");
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>
    </div>
  );
}
