import Logo from '@/Components/Logo';
import SmartImage from '@/Components/SmartImage';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { site } = usePage().props;

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <div className="flex flex-col px-6 py-8 sm:px-12">
                <Link href={route('home')} className="text-forest-800">
                    <Logo />
                </Link>

                <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</main>

                <p className="text-sm text-ink/60">
                    <Link href={route('blog.index')} className="underline underline-offset-4 hover:text-forest-800">
                        Back to the stories
                    </Link>
                </p>
            </div>

            <div className="relative hidden lg:block">
                <SmartImage
                    src={`${site.images}/siquijor-cliff.jpg`}
                    alt="Stairway on a cliff above turquoise water in Siquijor"
                    eager
                    className="!absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 to-transparent" aria-hidden="true" />
                <p className="absolute inset-x-12 bottom-12 font-serif text-4xl leading-tight text-cream-50">
                    {site.tagline}
                </p>
            </div>
        </div>
    );
}
