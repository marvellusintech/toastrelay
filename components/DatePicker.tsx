"use client";

import * as React from "react";
import { format, setHours, setMinutes } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  showTime?: boolean;
  placeholder?: string;
}

export function DatePicker({
  date,
  setDate,
  showTime = false,
  placeholder = "Pick a date",
}: DatePickerProps) {
  // Extract time values or default to 09:00 AM
  const hours = date ? date.getHours() : 9;
  const minutes = date ? date.getMinutes() : 0;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }

    // Preserve existing time if set, otherwise retain default time
    let updatedDate = selectedDate;
    if (date) {
      updatedDate = setHours(updatedDate, date.getHours());
      updatedDate = setMinutes(updatedDate, date.getMinutes());
    } else {
      updatedDate = setHours(updatedDate, hours);
      updatedDate = setMinutes(updatedDate, minutes);
    }

    setDate(updatedDate);
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    const baseDate = date || new Date();
    const numValue = parseInt(value, 10);

    const updatedDate =
      type === "hour"
        ? setHours(baseDate, numValue)
        : setMinutes(baseDate, numValue);

    setDate(updatedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-full justify-between px-3 py-2 bg-input/20 text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <span>
            {date
              ? format(date, showTime ? "PPP 'at' p" : "PPP")
              : placeholder}
          </span>
          {showTime ? (
            <Clock className="h-4 w-4 opacity-50" />
          ) : (
            <CalendarIcon className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          defaultMonth={date}
        />

        {showTime && (
          <div className="border-t border-border p-3 flex items-center justify-between gap-2 bg-zinc-50/50">
            <span className="text-xs font-medium text-zinc-500">Time:</span>
            <div className="flex flex-1 items-center gap-1.5">
              {/* Hours Selector */}
              <Select
                value={hours.toString()}
                onValueChange={(v) => handleTimeChange("hour", v)}
              >
                <SelectTrigger className="h-8  text-xs">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()} className="text-xs">
                      {i.toString().padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-zinc-400 font-medium">:</span>

              {/* Minutes Selector (15-min increments) */}
              <Select
                value={minutes.toString()}
                onValueChange={(v) => handleTimeChange("minute", v)}
              >
                <SelectTrigger className="h-8  text-xs">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {[0, 15, 30, 45].map((m) => (
                    <SelectItem key={m} value={m.toString()} className="text-xs">
                      :{m.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}