import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export type SelectOption = {
    value: string;
    label: string;
};

export const InputSelect: React.FC<{
    options: SelectOption[];
    value?: string;
    onValueChange?: (v: string) => void;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    placeholder?: string;
    emptyMessage?: string;
}> = ({
    options,
    value = "",
    onValueChange,
    className,
    children,
    placeholder = "Search...",
    emptyMessage = "No results found.",
}) => {
        const [selectedValue, setSelectedValue] = React.useState<string>(value);
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

        // Sync internal state with prop
        React.useEffect(() => {
            setSelectedValue(value);
        }, [value]);

        const onOptionSelect = (option: string) => {
            // If selecting the same value, we might want to toggle it off or just keep it.
            // Standard select usually keeps it. Combobox with "all" might want to toggle.
            // Let's stick to standard behavior: set the value.
            setSelectedValue(option);
            onValueChange?.(option);
            setIsPopoverOpen(false);
        };

        const onClearAllOptions = () => {
            setSelectedValue("");
            onValueChange?.("");
            setIsPopoverOpen(false);
        };

        return (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    {children}
                </PopoverTrigger>
                <PopoverContent className={cn("w-[300px] p-0 shadow-xl border-slate-200 overflow-hidden rounded-xl", className)} align="start">
                    <Command className="rounded-xl">
                        <CommandInput
                            placeholder={placeholder}
                            wrapperClassName="px-4 border-b border-slate-100 h-12"
                            className="text-sm border-none focus:ring-0 focus-visible:ring-0 !ring-0 !ring-offset-0 rounded-none h-11 !shadow-none"
                        />
                        <CommandList className="max-h-[280px] overflow-y-auto scrollbar-hide">
                            <CommandEmpty className="py-8 text-xs text-slate-500 text-center">
                                {emptyMessage}
                            </CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = selectedValue === option.value;
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={() => onOptionSelect(option.value)}
                                            className="px-3 py-2.5 text-xs cursor-pointer hover:bg-slate-50 aria-selected:bg-blue-50/50 group/item flex items-center justify-between"
                                        >
                                            <span className={cn(
                                                "transition-colors",
                                                isSelected ? "text-[#1E40AF] font-semibold" : "text-slate-600"
                                            )}>
                                                {option.label}
                                            </span>
                                            <CheckIcon
                                                className={cn(
                                                    "h-3.5 w-3.5 text-[#1E40AF] transition-all",
                                                    isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
                                                )}
                                            />
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator className="bg-slate-100" />
                        <div className="p-1.5 flex items-center gap-1.5 bg-slate-50/30">
                            {selectedValue && (
                                <>
                                    <CommandItem
                                        onSelect={onClearAllOptions}
                                        className="flex-1 h-8 text-[11px] font-medium text-slate-500 hover:text-destructive hover:bg-destructive/10 justify-center cursor-pointer"
                                    >
                                        Clear
                                    </CommandItem>
                                    <Separator orientation="vertical" className="h-4 bg-slate-200" />
                                </>
                            )}
                            <CommandItem
                                onSelect={() => setIsPopoverOpen(false)}
                                className="flex-1 h-8 text-[11px] font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 justify-center cursor-pointer"
                            >
                                Tutup
                            </CommandItem>
                        </div>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    };
InputSelect.displayName = "InputSelect";
