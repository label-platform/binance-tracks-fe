/* eslint-disable consistent-return */
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useUnmount } from 'react-use';

interface Props {
    heightForRefresh?: number;
    handleRefresh(): void;
    depth?: string | boolean | number;
}

export function usePullToRefresh(props: Props) {
    const { handleRefresh, heightForRefresh = 60, depth } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [height, setHeight] = useState(0);
    const [percent, setPercent] = useState(0);
    const touchStartY = useRef<number | null>(null);
    const containerTarget = useRef(null);

    function handleTouchStart(e: any) {
        if (containerTarget.current === null) return;
        if (containerTarget.current.scrollTop !== 0) return;
        touchStartY.current = e.changedTouches[0].screenY;
    }
    function handleTouchMove(e: any) {
        if (typeof touchStartY.current === 'number') {
            const { screenY } = e.changedTouches[0];
            const scrolledHeight = Math.floor((screenY - touchStartY.current) * 0.3);
            if (scrolledHeight >= 0) {
                setIsOpen(true);
                setHeight(scrolledHeight);
                setPercent(scrolledHeight >= heightForRefresh ? 1 : +(scrolledHeight / heightForRefresh).toFixed(2));
            }
        }
    }
    function handleTouchEnd() {
        if (typeof touchStartY.current === 'number' && height >= heightForRefresh) {
            handleRefresh();
            setIsStart(true);
        } else {
            touchStartY.current = null;
            setHeight(0);
            setIsOpen(false);
        }
    }

    function end() {
        touchStartY.current = null;
        setIsStart(false);
        setIsOpen(false);
    }

    useEffect(() => {
        if (containerTarget.current === null) return;
        containerTarget.current.addEventListener('touchstart', handleTouchStart);
        containerTarget.current.addEventListener('touchmove', handleTouchMove);
        containerTarget.current.addEventListener('touchend', handleTouchEnd);
        return () => {
            if (containerTarget.current === null) return;
            containerTarget.current.removeEventListener('touchstart', handleTouchStart);
            containerTarget.current.removeEventListener('touchmove', handleTouchMove);
            containerTarget.current.removeEventListener('touchend', handleTouchEnd);
        };
    }, [height, depth]);

    useUnmount(() => {
        if (containerTarget.current === null) return;
        containerTarget.current.removeEventListener('touchstart', handleTouchStart);
        containerTarget.current.removeEventListener('touchmove', handleTouchMove);
        containerTarget.current.removeEventListener('touchend', handleTouchEnd);
    });

    return {
        isOpen,
        isStart,
        percent,
        containerTarget,
        end,
    };
}
