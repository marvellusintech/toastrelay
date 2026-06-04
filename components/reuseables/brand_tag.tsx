import React from 'react';

interface BrandTagProps {
  children?: React.ReactNode;
  className?: string;
}

export const BrandTag = ({ children, className = "" }: BrandTagProps) => (
  <span className={`font-semibold tracking-tight inline-flex items-baseline ${className}`}>
    {children}
    <sup className="text-[10px] ml-0.5 font-bold opacity-70">™</sup>
  </span>
);