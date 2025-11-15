'use client';

import { useState, ReactNode } from 'react';

interface AccordionProps {
  title: string | ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  variant?: 'primary' | 'secondary';
}

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  variant = 'secondary',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isPrimary = variant === 'primary';
  const buttonClasses = isPrimary
    ? `w-full px-6 py-4 text-left flex items-center justify-between transition-colors bg-purple hover:bg-lila ${titleClassName}`
    : `w-full px-6 py-4 text-left flex items-center justify-between transition-colors hover:bg-gray-50 ${titleClassName}`;
  
  const titleColor = isPrimary ? 'text-white' : 'text-purple';
  const chevronColor = isPrimary ? 'text-white' : 'text-purple';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-expanded={isOpen}
      >
        <div className="flex-1">
          {typeof title === 'string' ? (
            <h2 className={`text-2xl font-bold font-heading ${titleColor}`}>
              {title}
            </h2>
          ) : (
            title
          )}
        </div>
        <svg
          className={`w-6 h-6 ${chevronColor} transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className={`px-6 pb-6 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
}
