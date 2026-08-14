import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-8" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 140 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g className="text-nexora-500">
        {/* Abstract N Shape */}
        <path d="M10 30V10L25 25V10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Orbital curve around the N */}
        <path d="M6 20C6 12.268 12.268 6 20 6C27.732 6 34 12.268 34 20C34 27.732 27.732 34 20 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
      </g>
      {/* NEXORA Text */}
      <text x="45" y="27" fill="currentColor" className="text-light-text dark:text-dark-text font-bold tracking-widest" style={{ fontSize: '20px', fontFamily: 'Inter, sans-serif' }}>
        NEXORA
      </text>
    </svg>
  );
}
