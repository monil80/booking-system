"use client";
import NotFound from "./not-found";
import Loading from "./loading";
import UnAuthorized from "./unauthorize";
import { ReactNode, useEffect, useMemo } from "react";
import { useAuth } from "../context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { navArray } from "../config/nav-items";
import { navPath } from "../config/nav-path";

export type IAclGuardProps = {
  children: ReactNode;
  storedToken?: string | number | boolean | object | null;
};

const AclGuard = (props: IAclGuardProps) => {
  const { storedToken } = props;
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const navDetail = useMemo(
    () => navArray.find((i) => i.path === pathname),
    [pathname]
  );

  useEffect(() => {
    if (!storedToken && !navDetail?.isPublicPath) {
      router.push(navPath.login);
    }
    if (storedToken && user && navDetail?.isPublicPath) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!storedToken && navDetail?.isPublicPath) {
    return <>{props.children}</>;
  }
  if (!storedToken) {
    if (pathname !== navPath.login) return <Loading></Loading>;
  }
  if (!navDetail) {
    return <NotFound />;
  }
  if (navDetail.isPublicPath) {
    return <>{props.children}</>;
  }
  if (user && storedToken) {
    return <>{props.children}</>;
  }
  return <UnAuthorized />;
};

export default AclGuard;
