"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { Button } from "./ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between w-full">
            <span className="flex items-center">
                <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Theme</span>
            </span>
            <div className="flex items-center rounded-md bg-secondary p-1">
                <Button 
                    variant={theme === 'light' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setTheme("light")} 
                    className="h-6 px-2 text-xs"
                >
                    Light
                </Button>
                <Button 
                    variant={theme === 'dark' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setTheme("dark")} 
                    className="h-6 px-2 text-xs"
                >
                    Dark
                </Button>
                 <Button 
                    variant={theme === 'system' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setTheme("system")} 
                    className="h-6 px-2 text-xs"
                >
                    System
                </Button>
            </div>
        </div>
    </DropdownMenuItem>
  )
}
