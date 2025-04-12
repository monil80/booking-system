import { navPath } from "./nav-path";

export type NavItem = {
  id: string;
  path: string;
  name: string;
  isPublicPath: boolean;
};

export const navArray: NavItem[] = [
  {
    id: "Home",
    path: navPath.home,
    name: "Home",
    isPublicPath: false,
  },
  {
    id: "login",
    path: navPath.login,
    name: "Login",
    isPublicPath: true,
  },
  {
    id: "signup",
    path: navPath.signup,
    name: "Sign Up",
    isPublicPath: true,
  },
  {
    id: "dashboard",
    path: navPath.dashboard,
    name: "Dashboard",
    isPublicPath: false,
  },
  {
    id: "booking-list",
    path: navPath.bookingList,
    name: "Booking List",
    isPublicPath: false,
  },
  {
    id: "booking-entry",
    path: navPath.bookingEntry,
    name: "Booking Entry",
    isPublicPath: false,
  },
  {
    id: "demo",
    path: navPath.demo,
    name: "Demo",
    isPublicPath: true,
  },
];
