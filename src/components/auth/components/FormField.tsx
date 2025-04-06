import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  error?: string;
  placeholder?: string;
  register: any;
}

export function FormField({
  id,
  label,
  type = 'text',
  error,
  placeholder,
  register,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor={id} className="text-sm font-medium text-zinc-200">
          {label}
        </Label>
        <Input
          id={id}
          type={type}
          {...register(id)}
          placeholder={placeholder}
          className="w-full bg-purple-500/5 border-purple-500/20 focus:border-purple-500/50 focus:ring-purple-500/20 placeholder:text-zinc-400"
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}