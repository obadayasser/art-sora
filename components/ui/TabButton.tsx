"use client";

import { ReactNode } from "react";

type TabPosition = "left" | "middle" | "right";

interface TabButtonProps {
    children: ReactNode;
    isActive: boolean;
    onClick: () => void;
    position?: TabPosition;
}

const clipPaths: Record<TabPosition, string> = {
    left: "polygon(0 0, calc(100% - 15px) 0, 100% 100%, 0 100%)",
    middle: "polygon(0 0, calc(100% - 15px) 0, 100% 100%, 15px 100%)",
    right: "polygon(0 0, 100% 0, 100% 100%, 15px 100%)",
};

const roundedClasses: Record<TabPosition, string> = {
    left: "rounded-l-2xl",
    middle: "",
    right: "rounded-r-2xl",
};

export function TabButton({ children, isActive, onClick, position = "middle" }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
                md:text-lg text-sm relative px-6 py-2 font-semibold transition-all duration-300
                ${roundedClasses[position]}
                ${isActive
                    ? "text-white bg-primary dark:bg-[#E8679A]"
                    : "text-[var(--muted)] hover:text-primary dark:hover:text-[#E8679A] bg-[var(--card-bg)] dark:bg-[#1e1e1e]"
                }
            `}
            style={{ clipPath: clipPaths[position] }}
        >
            {children}
        </button>
    );
}
