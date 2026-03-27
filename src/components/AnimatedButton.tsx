import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function AnimatedButton({
  onClick,
  children,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = false,
}: AnimatedButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-600 text-white shadow-lg hover:shadow-2xl',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-2xl',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-2xl',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-2xl',
    outline: 'border-2 border-gradient-to-r from-teal-500 to-cyan-600 text-teal-600 hover:bg-teal-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-xl font-semibold
        transition-all duration-300 transform
        hover:-translate-y-1 active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        before:absolute before:inset-0 before:bg-white before:opacity-0
        before:transition-opacity before:duration-300 hover:before:opacity-10
        group flex items-center justify-center space-x-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></span>

      {Icon && <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />}

      <span className="relative z-10">{children}</span>

      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 group-hover:animate-pulse-glow transition-all duration-300"></span>
    </button>
  );
}
