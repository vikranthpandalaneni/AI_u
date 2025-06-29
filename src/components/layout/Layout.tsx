import React, { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { cn } from '../../lib/utils'

interface LayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {showSidebar && (
          <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Sidebar */}
            <aside className={cn(
              "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-200 ease-in-out md:relative md:top-0 md:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
              <Sidebar />
            </aside>
          </>
        )}
        
        {/* Main content */}
        <main className={cn(
          "flex-1 overflow-hidden",
          showSidebar ? "md:ml-0" : ""
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}