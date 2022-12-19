import { useEffect, useRef, useState } from 'react';

interface Props {
    threshold?: number;
    rootMargin?: number;
    root?: Element;
}

export function useIntersectionObserver(option?: Props) {
    const { threshold = 1, rootMargin = 0, root = null } = option || {};
    const ref = useRef();
    const [inView, setInView] = useState(false);

    useEffect(() => {
        let intersectionObserver: any;
        if (ref.current !== null) {
            intersectionObserver = new IntersectionObserver(
                (entries) => {
                    const [entry] = entries;
                    if (entry?.isIntersecting) {
                        setInView(true);
                    } else {
                        setInView(false);
                    }
                },
                { threshold: [threshold], rootMargin: `${rootMargin}px`, root: root }
            );
            intersectionObserver.observe(ref.current);
        }

        return () => {
            intersectionObserver.disconnect();
        };
    }, []);

    return {
        ref,
        inView,
    };
}
