import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const clean = (values) =>
    Object.fromEntries(
        Object.entries(values).filter(([, value]) => value !== '' && value != null),
    );

export default function useFilters(url, initial, only) {
    const [values, setValues] = useState(initial);
    const [loading, setLoading] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const visit = (next) => {
        router.get(url, clean(next), {
            only,
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    const setFilter = (key, value, { debounce = false } = {}) => {
        const next = { ...values, [key]: value };
        setValues(next);
        clearTimeout(timer.current);

        if (debounce) {
            timer.current = setTimeout(() => visit(next), 350);
        } else {
            visit(next);
        }
    };

    const reset = () => {
        const next = Object.fromEntries(Object.keys(values).map((key) => [key, '']));
        clearTimeout(timer.current);
        setValues(next);
        visit(next);
    };

    const isActive = Object.values(values).some((value) => value !== '' && value != null);

    return { values, setFilter, reset, loading, isActive };
}
