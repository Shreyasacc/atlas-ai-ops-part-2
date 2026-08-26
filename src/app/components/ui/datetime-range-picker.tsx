"use client";

import * as React from "react";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar as CalendarIcon, Clock, X, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "./utils";

interface DateTimeRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onApply: (start: Date, end: Date) => void;
  onCancel?: () => void;
  trigger?: React.ReactNode;
}

export function DateTimeRangePicker({ 
  startDate, 
  endDate, 
  onApply,
  onCancel,
  trigger 
}: DateTimeRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [selectedStartDate, setSelectedStartDate] = React.useState<Date | undefined>(startDate);
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date | undefined>(endDate);
  const [activeTab, setActiveTab] = React.useState<'start' | 'end'>('start');
  
  // Time states for start
  const [startHours, setStartHours] = React.useState<string>(
    startDate ? String(startDate.getHours()).padStart(2, '0') : "00"
  );
  const [startMinutes, setStartMinutes] = React.useState<string>(
    startDate ? String(startDate.getMinutes()).padStart(2, '0') : "00"
  );
  
  // Time states for end
  const [endHours, setEndHours] = React.useState<string>(
    endDate ? String(endDate.getHours()).padStart(2, '0') : "23"
  );
  const [endMinutes, setEndMinutes] = React.useState<string>(
    endDate ? String(endDate.getMinutes()).padStart(2, '0') : "59"
  );

  const handleApply = () => {
    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate);
      start.setHours(parseInt(startHours));
      start.setMinutes(parseInt(startMinutes));
      start.setSeconds(0);
      
      const end = new Date(selectedEndDate);
      end.setHours(parseInt(endHours));
      end.setMinutes(parseInt(endMinutes));
      end.setSeconds(59);
      
      if (start > end) {
        alert("Start date must be before end date");
        return;
      }
      
      onApply(start, end);
      setIsOpen(false);
    } else {
      alert("Please select both start and end dates");
    }
  };

  const handleClear = () => {
    setSelectedStartDate(undefined);
    setSelectedEndDate(undefined);
    setStartHours("00");
    setStartMinutes("00");
    setEndHours("23");
    setEndMinutes("59");
    setActiveTab('start');
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  const currentDate = activeTab === 'start' ? selectedStartDate : selectedEndDate;
  const currentHours = activeTab === 'start' ? startHours : endHours;
  const currentMinutes = activeTab === 'start' ? startMinutes : endMinutes;

  const handleDateSelect = (date: Date | undefined) => {
    if (activeTab === 'start') {
      setSelectedStartDate(date);
      // Auto-switch to end tab after selecting start date
      if (date && !selectedEndDate) {
        setTimeout(() => setActiveTab('end'), 300);
      }
    } else {
      setSelectedEndDate(date);
    }
  };

  const handleHoursChange = (value: string) => {
    if (activeTab === 'start') {
      setStartHours(value);
    } else {
      setEndHours(value);
    }
  };

  const handleMinutesChange = (value: string) => {
    if (activeTab === 'start') {
      setStartMinutes(value);
    } else {
      setEndMinutes(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#AE275F] to-[#8d1f4d] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-1">Select Custom Date Range</h3>
              <p className="text-white/80 text-sm">Choose start and end date with time</p>
            </div>
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {/* Tab Header */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('start')}
              className={cn(
                "flex-1 px-6 py-4 text-sm font-medium transition-all relative",
                activeTab === 'start'
                  ? "bg-white text-[#AE275F] shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>Start Date & Time</span>
                {selectedStartDate && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              {selectedStartDate && (
                <div className={cn(
                  "text-xs mt-1.5 font-normal",
                  activeTab === 'start' ? "text-[#AE275F]/70" : "text-gray-500"
                )}>
                  {format(selectedStartDate, "MMM d, yyyy")} • {startHours}:{startMinutes}
                </div>
              )}
              {activeTab === 'start' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AE275F]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('end')}
              className={cn(
                "flex-1 px-6 py-4 text-sm font-medium transition-all relative",
                activeTab === 'end'
                  ? "bg-white text-[#AE275F] shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>End Date & Time</span>
                {selectedEndDate && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              {selectedEndDate && (
                <div className={cn(
                  "text-xs mt-1.5 font-normal",
                  activeTab === 'end' ? "text-[#AE275F]/70" : "text-gray-500"
                )}>
                  {format(selectedEndDate, "MMM d, yyyy")} • {endHours}:{endMinutes}
                </div>
              )}
              {activeTab === 'end' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AE275F]" />
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex flex-col md:flex-row">
            {/* Calendar */}
            <div className="flex-1 p-6 border-r border-gray-200">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleDateSelect}
                initialFocus
                className="rounded-lg border-0 mx-auto"
              />
            </div>
            
            {/* Time Picker & Summary */}
            <div className="w-full md:w-64 bg-gray-50 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-[#AE275F]">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {activeTab === 'start' ? 'Start' : 'End'} Time
                </span>
              </div>
              
              {/* Time Selectors */}
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 justify-center">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-2 text-center">Hour</label>
                    <select
                      value={currentHours}
                      onChange={(e) => handleHoursChange(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-[#AE275F] text-center font-medium text-lg"
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                        <option key={hour} value={String(hour).padStart(2, '0')}>
                          {String(hour).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-3xl font-bold text-gray-400 mt-6">:</div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-2 text-center">Minute</label>
                    <select
                      value={currentMinutes}
                      onChange={(e) => handleMinutesChange(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-[#AE275F] text-center font-medium text-lg"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <option key={minute} value={String(minute).padStart(2, '0')}>
                          {String(minute).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-white rounded-lg p-4 mb-4 border-2 border-[#AE275F]/20">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Selected Range</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">From</div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedStartDate ? (
                          <>
                            {format(selectedStartDate, "MMM d, yyyy")}
                            <br />
                            <span className="text-[#AE275F]">{startHours}:{startMinutes}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Not selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">To</div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedEndDate ? (
                          <>
                            {format(selectedEndDate, "MMM d, yyyy")}
                            <br />
                            <span className="text-[#AE275F]">{endHours}:{endMinutes}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Not selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Hint */}
              <div className="text-xs text-gray-500 text-center bg-blue-50 border border-blue-200 rounded-lg p-3">
                {activeTab === 'start' ? (
                  <span>👆 Select start date, then switch to End tab</span>
                ) : (
                  <span>👆 Select end date and time to complete</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              className="flex-1 py-6"
              onClick={handleClear}
            >
              Clear Selection
            </Button>
            <Button
              variant="outline"
              className="flex-1 py-6"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 py-6 bg-[#AE275F] hover:bg-[#8d1f4d] text-white shadow-lg shadow-[#AE275F]/30"
              onClick={handleApply}
              disabled={!selectedStartDate || !selectedEndDate}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Date Range
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}