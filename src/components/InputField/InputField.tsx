import React, { useEffect, useId, useRef, useState, forwardRef } from 'react';

export interface InputFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: string;
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  maxLength?: number;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    onClear,
    onEnter,
    label,
    placeholder,
    helperText,
    errorMessage,
    disabled = false,
    invalid = false,
    loading = false,
    variant = 'outlined',
    size = 'md',
    type = 'text',
    showClearButton = false,
    showPasswordToggle = false,
    maxLength,
    className = '',
  } = props;

  const generatedId = useId();
  const inputId = `input-${generatedId}`;
  const helperId = helperText || errorMessage ? `${inputId}-hint` : undefined;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? (value ?? ''));
  useEffect(() => {
    if (isControlled) setInternalValue(value ?? '');
  }, [value, isControlled]);

  const [showPassword, setShowPassword] = useState(false);
  const localRef = useRef<HTMLInputElement | null>(null);
  const inputRef = (ref as React.RefObject<HTMLInputElement>) ?? localRef;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue('');
    const synthetic = { target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange?.(synthetic);
    onClear?.();
    inputRef && (inputRef as React.RefObject<HTMLInputElement>).current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onEnter?.(e);
  };

    const sizeClasses: Record<string, string> = {
    sm: 'h-8 py-1 px-2 text-sm',
    md: 'h-10 py-2 px-3 text-base',
    lg: 'h-12 py-3 px-4 text-lg',
  };


  const variantClasses: Record<string, string> = {
    filled:
      'bg-gray-100 dark:bg-gray-700 border border-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
    outlined:
      'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
    ghost:
      'bg-transparent border-b border-gray-300 dark:border-b-gray-600 focus:border-b-indigo-500 focus:ring-0',
  };

  const invalidClasses = invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';

  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text';

  const base = 'w-full rounded-md transition-colors appearance-none focus:outline-none flex items-center';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          ref={ref as any}
          type={showPasswordToggle && showPassword ? 'text' : type}
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || loading}
          aria-invalid={invalid}
          aria-describedby={helperId}
          maxLength={maxLength}
          className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${invalidClasses} ${disabledClasses} ${
            loading ? 'pr-12' : showClearButton || (showPasswordToggle && type === 'password') ? 'pr-10' : ''
          } dark:text-white`}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {loading && (
            <div role="status" aria-live="polite" className="pointer-events-auto pr-2" title="Loading">
              <svg className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          )}

          <div className="pointer-events-auto flex items-center space-x-1">
            {showClearButton && !!internalValue && !loading && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear input"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
              >
                ✕
              </button>
            )}

            {showPasswordToggle && type === 'password' && !loading && (
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            )}
          </div>
        </div>
      </div>

      {(helperText || errorMessage) && (
        <p id={helperId} className={`mt-1 text-sm ${invalid ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`} aria-live={invalid ? 'assertive' : 'polite'}>
          {invalid ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';
export const TextInput = InputField;
export default InputField;
