"use client"
import type { Layer } from "@/app/playground/page"

interface TextLayerRendererProps {
  layer: Layer
}

export function TextLayerRenderer({ layer }: TextLayerRendererProps) {
  if (layer.type !== "text") return null

  return (
    <div
      className="w-full h-full flex overflow-hidden p-1"
      style={{
        fontFamily: layer.fontFamily || "Inter",
        fontSize: `${layer.fontSize || 24}px`,
        fontWeight: layer.fontWeight || "normal",
        fontStyle: layer.fontStyle || "normal",
        textDecoration: layer.textDecoration || "none",
        textAlign: (layer.textAlign as any) || "left",
        lineHeight: layer.lineHeight || 1.2,
        letterSpacing: `${layer.letterSpacing || 0}px`,
        color: layer.fontColor || "#FFFFFF",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        alignItems: layer.textAlign === "center" ? "center" : layer.textAlign === "right" ? "flex-end" : "flex-start",
        justifyContent:
          layer.textAlign === "center"
            ? "center"
            : layer.textAlign === "right"
              ? "flex-end"
              : layer.textAlign === "justify"
                ? "stretch"
                : "flex-start",
      }}
    >
      <div className="w-full">{layer.content || "New Text"}</div>
    </div>
  )
}
