import React from 'react'
import { useThemeStore } from '../store/useThemeStore.js';
import { PaletteIcon } from "lucide-react";
import { THEMES } from '../constants/index.js';

const ThemeSelector = () => {

    const {theme, setTheme} = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* Dropdown Trigger */}
    <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-6 text-base-content opacity-70" />
    </button>

    <div className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto" tabIndex={0}>
        <div className="space-y-1">
            {THEMES.map((thm) => (
                <button 
                    key={thm.name}
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${theme === thm.name ? "btn-active border-amber-50" : ""}`}
                    onClick={() => setTheme(thm.name)}
                >
                    <PaletteIcon className="size-4 text-base-content opacity-70" />
                    <span className='font-medium text-sm'>{thm.label}</span>
                    <div className="ml-auto flex gap-1">
                        {thm.colors.map((color, index) => (
                            <div 
                                key={index}
                                className="size-2 rounded-full"
                                style={{backgroundColor: color}}
                            ></div>
                        ))}
                    </div>
                    
                </button>
            ))}
        </div>
    </div>
    </div>
  )
}

export default ThemeSelector
