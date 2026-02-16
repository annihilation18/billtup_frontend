"use client";

import * as React from "react";

// Simple toast implementation as fallback
interface ToasterProps {
  theme?: "light" | "dark" | "system";
  className?: string;
  style?: React.CSSProperties;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
}

const Toaster = ({ theme = "light", className = "", style, position = "bottom-right" }: ToasterProps) => {
  return (
    <div 
      id="sonner-toaster" 
      className={`fixed z-[100] ${className}`}
      style={{
        ...style,
        ...getPositionStyles(position)
      }}
    />
  );
};

function getPositionStyles(position: ToasterProps["position"]) {
  switch (position) {
    case "top-left":
      return { top: "1rem", left: "1rem" };
    case "top-right":
      return { top: "1rem", right: "1rem" };
    case "bottom-left":
      return { bottom: "1rem", left: "1rem" };
    case "bottom-right":
      return { bottom: "1rem", right: "1rem" };
    case "top-center":
      return { top: "1rem", left: "50%", transform: "translateX(-50%)" };
    case "bottom-center":
      return { bottom: "1rem", left: "50%", transform: "translateX(-50%)" };
    default:
      return { bottom: "1rem", right: "1rem" };
  }
}

// Simple toast function
let toastId = 0;
export const toast = {
  success: (message: string) => showToast(message, "success"),
  error: (message: string) => showToast(message, "error"),
  info: (message: string) => showToast(message, "info"),
  warning: (message: string) => showToast(message, "warning"),
  message: (message: string) => showToast(message, "default"),
};

function showToast(message: string, type: "success" | "error" | "info" | "warning" | "default") {
  const container = document.getElementById("sonner-toaster");
  if (!container) return;
  
  const id = `toast-${toastId++}`;
  const toast = document.createElement("div");
  toast.id = id;
  toast.className = `
    mb-2 p-4 rounded-lg shadow-lg border bg-white text-sm
    animate-in slide-in-from-right duration-300
    ${type === "success" ? "border-green-500 text-green-900" : ""}
    ${type === "error" ? "border-red-500 text-red-900" : ""}
    ${type === "info" ? "border-blue-500 text-blue-900" : ""}
    ${type === "warning" ? "border-yellow-500 text-yellow-900" : ""}
    ${type === "default" ? "border-gray-300 text-gray-900" : ""}
  `;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add("animate-out", "fade-out", "slide-out-to-right");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export { Toaster };
