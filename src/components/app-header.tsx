'use client';

import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function AppHeader() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Letterhead' },
        { href: '/blog', label: 'Blog' },
    ];

    return (
        <header className="bg-card border-b sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-8 w-8 shrink-0"/>
                    <span className="text-xl font-headline font-bold text-foreground">TexHead</span>
                </Link>
                
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-4">
                    {navLinks.map((link) => (
                        <Button key={link.href} variant="ghost" asChild className={cn(pathname === link.href && 'bg-accent')}>
                            <Link href={link.href}>{link.label}</Link>
                        </Button>
                    ))}
                    <Button asChild>
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </nav>

                {/* Mobile Nav */}
                <div className="md:hidden">
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between border-b pb-4">
                                     <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                                        <Logo className="h-8 w-8 shrink-0"/>
                                        <span className="text-xl font-headline font-bold text-foreground">TexHead</span>
                                    </Link>
                                </div>
                                <nav className="flex flex-col gap-4 mt-8">
                                    {navLinks.map((link) => (
                                        <Button key={link.href} variant="ghost" asChild className={cn("justify-start", pathname === link.href && 'bg-accent')} onClick={() => setIsMenuOpen(false)}>
                                            <Link href={link.href}>{link.label}</Link>
                                        </Button>
                                    ))}
                                    <Button asChild className="mt-4 w-full" onClick={() => setIsMenuOpen(false)}>
                                        <Link href="/contact">Contact Us</Link>
                                    </Button>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
