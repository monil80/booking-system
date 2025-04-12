"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-muted-foreground mb-4">
        The page you’re looking for doesn’t exist.
      </p>
      <Button variant="outline" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
}
