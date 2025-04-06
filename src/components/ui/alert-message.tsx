import { CheckCircle2 } from "lucide-react";

interface AlertMessageProps {
  message: string;
}

export function AlertMessage({ message }: AlertMessageProps) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-lg border border-red-800/30 bg-red-950/20 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-red-900/50 p-1">
            <CheckCircle2 className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-sm font-medium text-red-200">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}