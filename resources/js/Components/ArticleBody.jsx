export default function ArticleBody({ content }) {
    const blocks = (content ?? '')
        .split(/\r?\n\s*\r?\n/)
        .map((block) => block.trim())
        .filter(Boolean);

    return (
        <div className="mx-auto max-w-2xl text-[1.0625rem] leading-8 text-ink/85">
            {blocks.map((block, index) =>
                block.startsWith('## ') ? (
                    <h2 key={index} className="mb-4 mt-12 font-serif text-3xl leading-tight text-ink">
                        {block.slice(3)}
                    </h2>
                ) : (
                    <p
                        key={index}
                        className={`mb-6 whitespace-pre-line ${
                            index === 0 ? 'font-serif text-2xl leading-9 text-ink' : ''
                        }`}
                    >
                        {block}
                    </p>
                ),
            )}
        </div>
    );
}
