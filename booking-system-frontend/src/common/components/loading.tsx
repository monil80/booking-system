"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );
}
