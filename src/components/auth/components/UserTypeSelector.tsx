import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface UserTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserTypeSelector({ value, onChange }: UserTypeSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="grid grid-cols-2 gap-2"
    >
      <div>
        <RadioGroupItem
          value="brand"
          id="brand"
          className="peer sr-only"
        />
        <div className="p-[3px] relative rounded-lg">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r rounded-lg transition-opacity duration-200",
            value === "brand" ? "from-indigo-500 to-purple-500 opacity-100" : "from-indigo-500/30 to-purple-500/30 opacity-0 hover:opacity-100"
          )} />
          <Label
            htmlFor="brand"
            className={cn(
              "flex items-center justify-center px-6 py-2 bg-black rounded-[6px] relative transition duration-200 text-white cursor-pointer",
              value === "brand" ? "bg-transparent" : "hover:bg-transparent hover:cursor-pointer"
            )}
          >
            I'm a Brand
          </Label>
        </div>
      </div>
      <div>
        <RadioGroupItem
          value="presenter"
          id="presenter"
          className="peer sr-only"
        />
        <div className="p-[3px] relative rounded-lg">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r rounded-lg transition-opacity duration-200",
            value === "presenter" ? "from-indigo-500 to-purple-500 opacity-100" : "from-indigo-500/30 to-purple-500/30 opacity-0 hover:opacity-100"
          )} />
          <Label
            htmlFor="presenter"
            className={cn(
              "flex items-center justify-center px-6 py-2 bg-black rounded-[6px] relative transition duration-200 text-white cursor-pointer",
              value === "presenter" ? "bg-transparent" : "hover:bg-transparent hover:cursor-pointer"
            )}
          >
            Im Presenter
          </Label>
        </div>
      </div>
    </RadioGroup>
  );
}