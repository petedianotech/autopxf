'use client';

import { usePathname } from 'next/navigation';
import { Bot, Globe, PlusCircle } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './ui/sidebar';
import Link from 'next/link';

const links = [
  {
    href: '/create',
    label: 'Create Post',
    icon: PlusCircle,
  },
  {
    href: '/autopx-all',
    label: 'Autopx All',
    icon: Globe,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/create" className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold text-foreground">autopx</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(link.href)}
                  tooltip={link.label}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
