import { cn } from '../../utils/cn';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-white ' +
    'hover:bg-[var(--color-accent-hover)] ' +
    'active:bg-[var(--color-accent-active)] ' +
    'focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
  secondary:
    'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] ' +
    'hover:bg-[var(--color-hover)] ' +
    'active:bg-[var(--color-hover)] ' +
    'focus-visible:ring-2 focus-visible:ring-[var(--color-border)]',
  ghost:
    'bg-transparent text-[var(--color-text-primary)] ' +
    'hover:bg-[var(--color-hover)] ' +
    'active:bg-[var(--color-hover)] ' +
    'focus-visible:bg-[var(--color-hover)]',
  danger:
    'bg-red-500 text-white ' +
    'hover:bg-red-600 ' +
    'active:bg-red-700 ' +
    'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
};

export const Button = ({
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};
