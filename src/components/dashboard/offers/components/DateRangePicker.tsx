import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangePickerProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: dateRange.from,
    to: dateRange.to
  });

  const presets = [
    {
      label: 'Last 7 Days',
      value: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
    {
      label: 'Last 30 Days',
      value: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
    {
      label: 'This Month',
      value: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
  ];

  const handleRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return;
    
    // Update the temp range immediately for UI feedback
    setTempRange(range);
    
    // Only trigger the onDateRangeChange callback when BOTH dates are selected
    if (range.from && range.to) {
      onDateRangeChange({ from: range.from, to: range.to });
      setIsOpen(false);
    }
  };

  const applyPreset = (preset: { from: Date; to: Date }) => {
    onDateRangeChange(preset);
    setTempRange({ from: preset.from, to: preset.to });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal w-[240px]"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          <div className="border-r border-border p-2 space-y-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => applyPreset(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="p-2">
            <Calendar
              mode="range"
              selected={{
                from: tempRange.from,
                to: tempRange.to,
              }}
              onSelect={handleRangeChange}
              numberOfMonths={2}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}