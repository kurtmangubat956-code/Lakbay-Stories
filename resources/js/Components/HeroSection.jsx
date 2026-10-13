import SmartImage from '@/Components/SmartImage';

export default function HeroSection({ image, alt, eyebrow, title, description, credit, size = 'lg', children }) {
    const height = size === 'lg' ? 'min-h-[38rem] lg:min-h-[44rem]' : 'min-h-[24rem] lg:min-h-[30rem]';

    return (
        <section className={`relative flex items-end ${height}`}>
            <SmartImage src={image} alt={alt} eager className="!absolute inset-0 h-full w-full" />
            <div
                className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/35 to-forest-900/45"
                aria-hidden="true"
            />

            <div className="container-page relative pb-14 pt-32 text-cream-50 lg:pb-20">
                {eyebrow && (
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cream-200">{eyebrow}</p>
                )}
                <h1
                    className={`mt-3 max-w-3xl font-serif leading-[1.05] ${
                        size === 'lg' ? 'text-5xl sm:text-6xl lg:text-7xl' : 'text-4xl sm:text-5xl lg:text-6xl'
                    }`}
                >
                    {title}
                </h1>
                {description && (
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream-100/90">{description}</p>
                )}
                {children && <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>}
            </div>

            {credit && (
                <p className="absolute bottom-3 right-5 text-[11px] text-cream-100/60 sm:right-8">{credit}</p>
            )}
        </section>
    );
}
