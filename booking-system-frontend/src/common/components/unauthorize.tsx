"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function UnAuthorized() {
  useEffect(() => {});
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <Lock className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-2xl font-semibold">Unauthorized</h1>
      <p className="text-muted-foreground mb-4">
        You don’t have permission to view this page.
      </p>
      <Button
        variant="outline"
        onClick={() => (window.location.href = "/login")}
      >
        Login
      </Button>
    </div>
  );
}
