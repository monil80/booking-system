"use client";

import { navPath } from "@/common/config/nav-path";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Home() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace(navPath.dashboard);
  });
  return <div className=""></div>;
}
