
'use client';

import type { ReactNode } from 'react';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquareHeart } from 'lucide-react';

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
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { href: '/', label: 'Recovery Plan', icon: <Home /> },
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
                <Link href={item.href} passHref legacyBehavior>
                  {/* Remove asChild: SidebarMenuButton renders its own button structure */}
                  <SidebarMenuButton
                    variant="ghost"
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
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

