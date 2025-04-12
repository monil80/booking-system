import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verified: boolean;
}

interface AuthState {
  users: User[];
  currentUserId: string | null;
  isAuthenticated: boolean;
  addUser: (user: User) => void;
  verifyUser: (email: string) => void;
  login: (userId: string) => void;
  logout: () => void;
}

// For demo purposes, we'll add a default verified user
const defaultUsers: User[] = [
  {
    id: "1",
    firstName: "Demo",
    lastName: "User",
    email: "demo@example.com",
    password: "Password123",
    verified: true,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      users: defaultUsers,
      currentUserId: null,
      isAuthenticated: false,
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      verifyUser: (email) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.email === email ? { ...user, verified: true } : user
          ),
        })),
      login: (userId) => set({ currentUserId: userId, isAuthenticated: true }),
      logout: () => set({ currentUserId: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
