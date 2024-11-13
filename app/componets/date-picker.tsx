import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils"; // Assuming this is a utility function for conditional classNames
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "~/components/ui/popover";

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
    name: string; // Name of the hidden input field to match with the form field
}

export const DatePicker = ({
    value,
    onChange,
    className,
    placeholder = "Select a Date",
    name
}: DatePickerProps) => {
    const handleDateChange = (date: Date | null) => {
        if (date) {
            onChange(date);
        } else {
            onChange(undefined); // Handle the case when the user clears the date
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                        "w-full justify-start text-left font-normal px-3",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={handleDateChange}
                    initialFocus
                />
            </PopoverContent>

            {/* Hidden input to carry the selected date value in the form */}
            <input
                type="hidden"
                name={name}
                value={value ? format(value, "yyyy-MM-dd") : ""} // Format as yyyy-MM-dd
            />
        </Popover>
    );
};
