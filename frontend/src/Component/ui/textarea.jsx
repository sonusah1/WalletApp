"use client"
import React from "react"

export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`border rounded px-3 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
))
