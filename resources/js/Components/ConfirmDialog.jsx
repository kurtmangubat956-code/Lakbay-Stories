import Modal from '@/Components/Modal';
import { DialogTitle } from '@headlessui/react';
import { Loader2, TriangleAlert } from 'lucide-react';

export default function ConfirmDialog({
    show,
    title,
    message,
    confirmLabel = 'Delete',
    processing = false,
    onConfirm,
    onClose,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md" closeable={!processing}>
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                        <TriangleAlert className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                        <DialogTitle className="font-serif text-xl text-ink">{title}</DialogTitle>
                        <p className="mt-2 text-sm leading-relaxed text-ink/70">{message}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={processing} className="btn-secondary">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} disabled={processing} className="btn-danger">
                        {processing && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
