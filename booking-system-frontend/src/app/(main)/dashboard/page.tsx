"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/common/context/auth-context";
import { format } from "date-fns";
import { ApplicationShareData } from "@/common/config/AppShareData";

export default function WelcomePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-md p-4">
        <CardHeader className="flex items-center space-y-2">
          <Avatar className="h-16 w-16 text-xl font-medium">
            <AvatarFallback>
              {user.first_name?.charAt(0)}
              {user.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <CardTitle className="text-lg font-semibold">
              Welcome, {user.first_name} {user.last_name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Logged in as: <span className="font-medium">{user.email}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Account Verified:</span>
            <span className="font-semibold">
              {user.is_verified ? "yes" : "no"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Joined:</span>
            <span className="font-medium">
              {format(
                new Date(user?.created_at || new Date().toUTCString()),
                ApplicationShareData.dateTimeFormate
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
