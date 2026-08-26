"use client";

import * as React from "react";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "./utils";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateTimePicker({ date, setDate, placeholder = "Pick a date and time" }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [hours, setHours] = React.useState<string>(date ? String(date.getHours()).padStart(2, '0') : "00");
  const [minutes, setMinutes] = React.useState<string>(date ? String(date.getMinutes()).padStart(2, '0') : "00");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setHours(String(date.getHours()).padStart(2, '0'));
      setMinutes(String(date.getMinutes()).padStart(2, '0'));
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
  };

  const handleApply = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours));
      newDate.setMinutes(parseInt(minutes));
      setDate(newDate);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    setHours("00");
    setMinutes("00");
    setDate(undefined);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Hour</label>
                <select
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent"
                >
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <option key={hour} value={String(hour).padStart(2, '0')}>
                      {String(hour).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-2xl font-bold text-gray-400 mt-5">:</div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Minute</label>
                <select
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <option key={minute} value={String(minute).padStart(2, '0')}>
                      {String(minute).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-[#AE275F] hover:bg-[#8d1f4d] text-white"
                onClick={handleApply}
                disabled={!selectedDate}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
