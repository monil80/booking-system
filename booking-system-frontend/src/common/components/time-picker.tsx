"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TimePickerDemoProps {
  setTime: (time: string) => void;
  current?: string;
}

export function TimePickerDemo({ setTime, current }: TimePickerDemoProps) {
  const [hours, setHours] = useState<string>("09");
  const [minutes, setMinutes] = useState<string>("00");
  const [period, setPeriod] = useState<string>("AM");

  useEffect(() => {
    if (current) {
      const [time, ampm] = current.split(" ");
      const [h, m] = time.split(":");
      setHours(h);
      setMinutes(m);
      setPeriod(ampm);
    }
  }, [current]);

  const handleSetTime = () => {
    const formattedTime = `${hours}:${minutes} ${period}`;
    setTime(formattedTime);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-2">
        <div className="grid gap-1">
          <Label htmlFor="hours">Hours</Label>
          <Select value={hours} onValueChange={setHours}>
            <SelectTrigger id="hours" className="w-[70px]">
              <SelectValue placeholder="Hours" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const hour = i === 0 ? "12" : String(i).padStart(2, "0");
                return (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="minutes">Minutes</Label>
          <Select value={minutes} onValueChange={setMinutes}>
            <SelectTrigger id="minutes" className="w-[70px]">
              <SelectValue placeholder="Minutes" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => {
                const minute = String(i).padStart(2, "0");
                return (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="period">Period</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period" className="w-[70px]">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSetTime} size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Set Time
        </Button>
      </div>
    </div>
  );
}
