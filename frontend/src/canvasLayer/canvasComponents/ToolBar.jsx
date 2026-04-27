import React from "react";
import {
    Hand,
    MousePointer,
    Square,
    Diamond,
    Circle,
    ArrowRight,
    Slash,
    Pencil,
    Type,
    Eraser
} from "lucide-react";

const tools = [
    { name: "hand", icon: Hand },
    { name: "cursor", icon: MousePointer },
    { name: "rectangle", icon: Square },
    { name: "rhombus", icon: Diamond },
    { name: "circle", icon: Circle },
    { name: "arrow", icon: ArrowRight },
    { name: "line", icon: Slash },
    { name: "pencil", icon: Pencil },
    { name: "text", icon: Type },
    { name: "eraser", icon: Eraser }
];

export const ToolBar = ({ activeTool, setTool }) => {
    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex gap-2 px-3 py-2 bg-neutral-900 rounded-xl shadow-lg border border-neutral-700">
            {tools.map(({ name, icon: Icon }) => (
                <button
                    key={name}
                    onClick={() => setTool(name)}
                    className={`
            w-9 h-9 flex items-center justify-center rounded-lg
            transition-all duration-150
            ${activeTool === name
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                        }
          `}
                    title={name}
                >
                    <Icon size={18} />
                </button>
            ))}
        </div>
    );
};