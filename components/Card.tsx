import React from "react";

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  icon,
  children,
  className = "",
}) => {
  return (
    <div
      className={`bg-slate-950/50 border border-slate-800 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      <div className="p-3 md:p-4 bg-slate-900/70 border-b border-slate-800 flex items-center space-x-3">
        {icon}
        <h3 className="font-bold text-white text-base md:text-lg break-words">
          {title}
        </h3>
      </div>
      <div className="p-3 md:p-4 lg:p-6 text-slate-300">{children}</div>
    </div>
  );
};
