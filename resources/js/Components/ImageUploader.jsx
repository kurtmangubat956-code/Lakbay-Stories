import InputError from '@/Components/InputError';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUploader({ id, label, currentUrl, maxKb, error, onChange, onRemove }) {
    const input = useRef(null);
    const [preview, setPreview] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [removed, setRemoved] = useState(false);

    useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

    const shown = preview ?? (removed ? null : currentUrl);
    const maxMb = maxKb / 1024;

    const select = (file) => {
        if (!file) {
            return;
        }

        if (!ACCEPTED.includes(file.type)) {
            setLocalError('Choose a JPG, PNG, or WebP image.');
            return;
        }

        if (file.size > maxKb * 1024) {
            setLocalError(`That image is too large. The limit is ${maxMb} MB.`);
            return;
        }

        setLocalError(null);
        setRemoved(false);
        setPreview(URL.createObjectURL(file));
        onChange(file);
    };

    const remove = () => {
        input.current.value = '';
        setPreview(null);
        setLocalError(null);
        setRemoved(true);
        onChange(null);
        onRemove?.();
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-ink/80">
                {label}
            </label>

            <div className="mt-2 overflow-hidden rounded-xl border border-dashed border-cream-300 bg-white">
                {shown ? (
                    <img src={shown} alt="Cover preview" className="aspect-[16/9] w-full object-cover" />
                ) : (
                    <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 text-ink/50">
                        <ImagePlus className="h-8 w-8" aria-hidden="true" strokeWidth={1.25} />
                        <span className="text-sm">No cover image selected</span>
                    </div>
                )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                    ref={input}
                    id={id}
                    type="file"
                    accept={ACCEPTED.join(',')}
                    aria-describedby={`${id}-hint`}
                    onChange={(e) => select(e.target.files[0])}
                    className="block text-sm text-ink/70 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-forest-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-forest-800 hover:file:bg-forest-100"
                />
                {shown && (
                    <button
                        type="button"
                        onClick={remove}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 hover:underline"
                    >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Remove image
                    </button>
                )}
            </div>

            <p id={`${id}-hint`} className="mt-2 text-xs text-ink/60">
                JPG, PNG, or WebP, up to {maxMb} MB. Landscape images work best.
            </p>
            <InputError message={localError ?? error} className="mt-2" />
        </div>
    );
}
