import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { House, Users, Store, TriangleAlert, LayoutGrid, Dessert, ScrollText } from 'lucide-react';
import AppLogo from './app-logo';

const merchantNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/dashboard',
        icon: House,
    },
    {
        title: 'Warung',
        href: '/tenant',
        icon: Store,
    },
    {
        title: 'Kategori',
        href: '/category',
        icon: LayoutGrid,
    },
    {
        title: 'Menu',
        href: '/menu',
        icon: Dessert,
    },
    {
        title: 'Pesanan',
        href: '/order',
        icon: ScrollText,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/dashboard',
        icon: House,
    },
    {
        title: 'Pedagang',
        href: '/merchant',
        icon: Users,
    },
    {
        title: 'Warung',
        href: '/tenant',
        icon: Store,
    },
    {
        title: 'Laporan',
        href: '/report',
        icon: TriangleAlert,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar({ userType }: { userType: string }) {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild variant={'default'}>
                            <Link href={`/${userType}/dashboard`} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {userType === 'merchant' 
                ? <NavMain items={merchantNavItems.map(item => ({
                    ...item,
                    href: `/${userType}${item.href}`
                }))} />
                : <NavMain items={adminNavItems.map(item => ({
                    ...item,
                    href: `/${userType}${item.href}`
                }))} />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems.map(item => ({
                    ...item,
                    href: `/${userType}${item.href}`
                }))} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
