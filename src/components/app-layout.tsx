
'use client';

import type { ReactNode } from 'react';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquareHeart, TrendingUp } from 'lucide-react'; // Added TrendingUp icon

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { href: '/', label: 'Recovery Plan', icon: <Home /> },
  { href: '/progress', label: 'Progress Tracking', icon: <TrendingUp /> }, // New Progress Item
  { href: '/chat-support', label: 'AI Chat Support', icon: <MessageSquareHeart /> },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
             {/* Placeholder for a logo if needed */}
            <span className="text-lg font-semibold text-primary">Road to Recovery</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                 {/* Correct usage: Wrap SidebarMenuButton with Link */}
                 <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                        asChild={false} // Important: asChild should be false here
                        variant="ghost"
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        className="w-full justify-start" // Ensure button takes full width
                    >
                        {item.icon}
                        <span className="ml-2">{item.label}</span> {/* Add margin for spacing */}
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
         <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
           <SidebarTrigger className="sm:hidden" />
           {/* Optional: Add breadcrumbs or other header content here */}
         </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
            {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
