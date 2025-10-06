// src/components/FilterButton.js

import React from 'react';

const FilterButton = ({ option, isSelected, onToggle }) => {
  // Base classes for the button
  const baseClasses = "px-4 py-2 border rounded-md cursor-pointer text-sm transition-colors duration-200 text-center";

  // Classes to apply when the button is selected
  const selectedClasses = "bg-black text-white border-black";

  // Classes to apply when the button is NOT selected
  const unselectedClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400";

  return (
    <label className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
      {/* 
        The actual checkbox is hidden but still functional for accessibility and state management.
        The `sr-only` class hides it visually but keeps it available to screen readers.
      */}
      <input
        type="checkbox"
        className="sr-only" // Tailwind class for screen-reader only
        checked={isSelected}
        onChange={() => onToggle(option)}
      />
      <span className="capitalize">{option}</span>
    </label>
  );
};

export default FilterButton;