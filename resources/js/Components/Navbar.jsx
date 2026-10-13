import Logo from '@/Components/Logo';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
    { label: 'Home', name: 'home', match: 'home' },
    { label: 'Destinations', name: 'destinations.index', match: 'destinations.*' },
    { label: 'Stories', name: 'blog.index', match: 'blog.*' },
    { label: 'About', name: 'about', match: 'about' },
    { label: 'Credits', name: 'credits', match: 'credits' },
];

export default function Navbar({ overlay = false }) {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const solid = !overlay || open;

    const linkClass = (active) =>
        `rounded-full px-3 py-2 text-sm font-medium transition-colors ${
            solid
                ? active
                    ? 'text-forest-800'
                    : 'text-ink/70 hover:text-forest-800'
                : active
                  ? 'text-white'
                  : 'text-white/80 hover:text-white'
        }`;

    const accountLinks = auth.user ? (
        <>
            <Link href={route('my-posts.index')} className={linkClass(route().current('my-posts.*'))}>
                My Journal
            </Link>
            <Link href={route('profile.edit')} className={linkClass(route().current('profile.edit'))}>
                Profile
            </Link>
            <Link
                href={route('logout')}
                method="post"
                as="button"
                className={solid ? 'btn-secondary' : 'btn border border-white/50 text-white hover:bg-white/10'}
            >
                Log out
            </Link>
        </>
    ) : (
        <>
            <Link href={route('login')} className={linkClass(route().current('login'))}>
                Login
            </Link>
            <Link href={route('register')} className={solid ? 'btn-primary' : 'btn-light'}>
                Start writing
            </Link>
        </>
    );

    return (
        <header
            className={
                overlay
                    ? `absolute inset-x-0 top-0 z-40 ${open ? 'bg-cream-100 shadow-sm' : ''}`
                    : 'sticky top-0 z-40 border-b border-cream-200 bg-cream-100/95 backdrop-blur'
            }
        >
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest-800 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
            >
                Skip to content
            </a>

            <nav aria-label="Main" className="container-page flex h-16 items-center justify-between lg:h-20">
                <Link href={route('home')} className={solid ? 'text-forest-800' : 'text-white'}>
                    <Logo />
                </Link>

                <div className="hidden items-center gap-1 lg:flex">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={route(link.name)}
                            aria-current={route().current(link.match) ? 'page' : undefined}
                            className={linkClass(route().current(link.match))}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <span className={`mx-2 h-5 w-px ${solid ? 'bg-cream-300' : 'bg-white/30'}`} aria-hidden="true" />
                    {accountLinks}
                </div>

                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    className={`rounded-full p-2 lg:hidden ${solid ? 'text-forest-800' : 'text-white'}`}
                >
                    {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
                </button>
            </nav>

            {open && (
                <div id="mobile-menu" className="border-t border-cream-200 bg-cream-100 lg:hidden">
                    <div className="container-page flex flex-col items-start gap-1 py-4">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={route(link.name)}
                                aria-current={route().current(link.match) ? 'page' : undefined}
                                className={linkClass(route().current(link.match))}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <span className="my-2 h-px w-full bg-cream-200" aria-hidden="true" />
                        {accountLinks}
                    </div>
                </div>
            )}
        </header>
    );
}
