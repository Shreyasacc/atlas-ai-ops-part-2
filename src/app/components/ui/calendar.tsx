"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  React.useEffect(() => {
    // Inject CSS styles for calendar
    const styleId = 'rdp-calendar-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .rdp-container .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #AE275F;
        }
        
        .rdp-container .rdp-months {
          display: flex;
          flex-direction: column;
        }
        
        .rdp-container .rdp-month {
          width: 100%;
        }
        
        .rdp-container .rdp-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        
        .rdp-container .rdp-head_row,
        .rdp-container .rdp-row {
          display: table-row;
          width: 100%;
        }
        
        .rdp-container .rdp-head_cell,
        .rdp-container .rdp-cell {
          width: 14.285714%;
          height: var(--rdp-cell-size);
          text-align: center;
          padding: 0;
        }
        
        .rdp-container .rdp-head_cell {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 400;
        }
        
        .rdp-container .rdp-day {
          height: var(--rdp-cell-size);
          width: var(--rdp-cell-size);
          margin: 0 auto;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .rdp-container .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
          background-color: #f3f4f6;
        }
        
        .rdp-container .rdp-day_selected {
          background-color: var(--rdp-accent-color) !important;
          color: white !important;
          font-weight: 500;
        }
        
        .rdp-container .rdp-day_today:not(.rdp-day_selected) {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        
        .rdp-container .rdp-day_outside {
          color: #d1d5db;
        }
        
        .rdp-container .rdp-day_disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }
        
        .rdp-container .rdp-caption {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.5rem 0;
          position: relative;
        }
        
        .rdp-container .rdp-caption_label {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .rdp-container .rdp-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .rdp-container .rdp-nav_button {
          width: 1.75rem;
          height: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
          border: 1px solid #e5e7eb;
          background: transparent;
          opacity: 0.5;
          cursor: pointer;
        }
        
        .rdp-container .rdp-nav_button:hover {
          opacity: 1;
          background-color: #f9fafb;
        }
        
        .rdp-container .rdp-nav_button_previous {
          position: absolute;
          left: 0.25rem;
        }
        
        .rdp-container .rdp-nav_button_next {
          position: absolute;
          right: 0.25rem;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="rdp-container">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    </div>
  );
}

export { Calendar };
