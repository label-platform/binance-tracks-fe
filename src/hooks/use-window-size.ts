import { useState, useEffect } from 'react';

interface ISize {
    width: number | undefined;
    height: number | undefined;
}

function useWindowSize(): ISize {
    const [windowSize, setWindowSize] = useState<ISize>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        const handleResize = () => {
            const viewportWidth = window.visualViewport.width;
            const viewportHeight = window.visualViewport.height;
            // const width = window.screen.width;
            // const height = window.screen.height;
            const width = viewportWidth <= 346 ? window.screen.width : viewportWidth;
            const height = viewportWidth <= 346 ? window.screen.height : viewportHeight;
            setWindowSize({
                width,
                height,
            });
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
}

export default useWindowSize;
