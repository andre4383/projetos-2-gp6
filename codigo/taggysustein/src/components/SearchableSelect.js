"use client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function SearchableSelect({
  label,
  placeholder,
  items,
  value,
  onChange,
  disabled,
}) {
  const [open, setOpen] = useState(false);

  const safeItems = items || [];

  return (
    <div className="w-full">
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            suppressHydrationWarning
            disabled={disabled}
            type="button"
            className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed text-left"
          >
            <span className="truncate">
              {value
                ? safeItems.find((item) => item.valor === value)?.nome ||
                  placeholder
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 z-[100]"
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>Nenhum resultado.</CommandEmpty>
              <CommandGroup>
                {safeItems.map((item) => (
                  <CommandItem
                    key={item.valor}
                    value={item.nome}
                    onSelect={() => {
                      onChange(item.valor, item.nome);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${value === item.valor ? "opacity-100" : "opacity-0"}`}
                    />
                    {item.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
