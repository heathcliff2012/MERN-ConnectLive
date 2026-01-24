import {create} from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'forest',
    setTheme: (newTheme) => {
        localStorage.setItem('theme', newTheme);
        set({theme: newTheme});
    },
}));