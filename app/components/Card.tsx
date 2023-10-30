"use client"

import React from "react"

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}
1
const Card = ({ children, className, ...props }: Props) => {
  return (
    <div className={`rounded-lg py-3 bg-gray-900 text-white relative group overflow-hidden ${className}`} {...props}>{children}</div>
  )
}

export default Card