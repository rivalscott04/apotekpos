import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface CurrencyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string | number;
    onChange: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ className, value, onChange, ...props }, ref) => {
        const [displayValue, setDisplayValue] = React.useState("");

        // Initialize display value from props
        React.useEffect(() => {
            if (value !== undefined && value !== null) {
                setDisplayValue(formatCurrency(value));
            } else {
                setDisplayValue("");
            }
        }, [value]);

        const formatCurrency = (val: string | number) => {
            if (!val) return "";
            const number = Number(val);
            if (isNaN(number)) return "";

            // Format as IDR: "Rp 500.000"
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(number);
        };

        const parseValue = (val: string) => {
            // Remove non-numeric characters except for possible negative sign (though price usually positive)
            return val.replace(/[^0-9]/g, "");
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            const rawValue = parseValue(inputValue);

            // Update parent with numeric value
            const numberValue = rawValue ? parseInt(rawValue, 10) : 0;
            onChange(numberValue);

            // We don't update displayValue immediately with full formatting to allow typing,
            // but we can add basic formatting if desired. 
            // For better UX, usually we just let user type numbers and format on blur, 
            // OR we just show the raw number while typing and format fully on blur.
            // However, the user asked for "User types 500000 -> Format Rp 500.000"
            // A common pattern is:

            // If we format *while* typing, cursor management becomes tricky.
            // Let's take the simple approach: formatted display always, cursor jumps to end is common downside 
            // but acceptable for simple "Rp" inputs often.

            // Let's try to update display value directly for immediate feedback as requested
            // "nanti akan otomatis di format"

            // Re-format the raw number to show back to user
            // Note: This causes cursor jumping issues in basic implementations.

            // BETTER APPROACH: Use effective "number values" but text input.
            // Let's keep it simple: Show formatted value always.
        };

        // To avoid cursor jumping issues, let's use a simpler approach often used in financial apps:
        // We only re-format completely on blur or if we are careful.
        // But since I can't easily install external libs like 'react-currency-input-field',
        // I will implement a safe version:
        // 1. User types numbers.
        // 2. We format it nicely as they type if we can, 
        //    but if we use native Input, cursor jumps.

        // Let's stick to: Update `displayValue` to reflect `rawValue` formatted, but only if it's a valid number.
        // If we rely on Intl.NumberFormat for *every* keystroke, it adds "Rp " and ".", which is good.

        return (
            <Input
                ref={ref}
                type="text"
                className={cn("", className)}
                value={displayValue}
                onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    const numberVal = raw ? parseInt(raw, 10) : 0;
                    onChange(numberVal); // Send number to parent form

                    // Update local display immediately
                    // This mimics "typing 500 automatically becomes Rp 500"
                    if (raw) {
                        const formatted = new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(numberVal);
                        setDisplayValue(formatted);
                    } else {
                        setDisplayValue("");
                    }
                }}
                {...props}
            />
        );
    }
);
CurrencyInput.displayName = "CurrencyInput";
