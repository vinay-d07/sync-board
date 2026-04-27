import React from 'react'
import { useCanvasContext } from '../../context/CanvasContext'

export const ContextMenu = () => {
    const { style, updateStyle } = useCanvasContext()

    const handleStyleChange = (property, value) => {
        updateStyle({ [property]: value })
    }

    return (
        <div className="absolute top-1/2 left-4 -translate-y-1/2 
    bg-white border border-gray-200 rounded-xl shadow-lg 
    p-3 w-56 space-y-4">

            {/* Stroke */}
            <div>
                <div className="text-xs text-gray-500 mb-2">Stroke</div>
                <div className="flex gap-2 flex-wrap">
                    {["#000000", "#e03131", "#2f9e44", "#1971c2", "#f08c00", "#ae3ec9", "#495057"].map(color => (
                        <button
                            key={color}
                            onClick={() => handleStyleChange("strokeColor", color)}
                            className={`w-6 h-6 rounded-full border 
                        ${style.strokeColor === color ? "ring-2 ring-black" : ""}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            {/* Fill */}
            <div>
                <div className="text-xs text-gray-500 mb-2">Fill</div>
                <div className="flex gap-2 flex-wrap items-center">
                    <button
                        onClick={() => handleStyleChange("fillColor", "transparent")}
                        className={`w-6 h-6 rounded border text-xs flex items-center justify-center
                    ${style.fillColor === "transparent" ? "ring-2 ring-black" : ""}`}
                    >
                        ✕
                    </button>

                    {["#ffc9c9", "#d3f9d8", "#d0ebff", "#fff3bf", "#e5dbff"].map(color => (
                        <button
                            key={color}
                            onClick={() => handleStyleChange("fillColor", color)}
                            className={`w-6 h-6 rounded border 
                        ${style.fillColor === color ? "ring-2 ring-black" : ""}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            {/* Stroke Width */}
            <div>
                <div className="text-xs text-gray-500 mb-2">Stroke width</div>
                <div className="flex gap-2">
                    {[1, 2, 4, 8].map(w => (
                        <button
                            key={w}
                            onClick={() => handleStyleChange("strokeWidth", w)}
                            className={`flex-1 h-6 rounded border flex items-center justify-center
                        ${style.strokeWidth === w ? "bg-gray-200" : ""}`}
                        >
                            <div
                                className="bg-black rounded"
                                style={{ height: w, width: "70%" }}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Opacity */}
            <div>
                <div className="text-xs text-gray-500 mb-1">
                    Opacity {Math.round(style.opacity * 100)}%
                </div>
                <input
                    type="range"
                    min="10"
                    max="100"
                    value={style.opacity * 100}
                    onChange={(e) =>
                        handleStyleChange("opacity", e.target.value / 100)
                    }
                    className="w-full accent-black"
                />
            </div>

        </div>
    )
}
