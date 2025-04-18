import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface EditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Editor.displayName = "Editor";

export { Editor };