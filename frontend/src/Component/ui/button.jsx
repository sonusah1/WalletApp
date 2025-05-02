// src/components/ui/button.jsx
"use client"

import React from "react"
import PropTypes from "prop-types"
import  clsx  from "clsx"

export const Button = React.forwardRef(
  ({ className, children, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variantStyles = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      ghost: "text-gray-700 hover:bg-gray-100",
      link: "text-blue-600 hover:underline",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    }

    const sizeStyles = {
      sm: "px-3 py-1 text-sm",
      default: "px-4 py-2 text-sm",
      lg: "px-5 py-3 text-base",
      icon: "p-2 h-9 w-9",
    }

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "outline", "ghost", "link", "destructive"]),
  size: PropTypes.oneOf(["sm", "default", "lg", "icon"]),
}
