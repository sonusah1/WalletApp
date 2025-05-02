"use client"
import React from "react"

export const Select = ({ children, onValueChange, defaultValue }) => (
  <select
    onChange={(e) => onValueChange(e.target.value)}
    defaultValue={defaultValue}
    className="border rounded px-3 py-2 w-full"
  >
    {children}
  </select>
)

export const SelectTrigger = ({ children }) => <>{children}</>
export const SelectContent = ({ children }) => <>{children}</>
export const SelectItem = ({ children, value }) => (
  <option value={value}>{children}</option>
)
export const SelectValue = ({ placeholder }) => (
  <option disabled value="">{placeholder}</option>
)
