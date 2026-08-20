import { useEffect, useRef, useState } from "react";

interface VerticalMarqueeProps {
    text: string;
    className?: string;
}

function VerticalMarquee({ text, className = "" }: VerticalMarqueeProps) {
    const containerRef = useRef<HTMLParagraphElement>(null);
    const innerRef = useRef<HTMLSpanElement>(null);
    const [overflow, setOverflow] = useState({ active: false, distance: 0 });

    useEffect(() => {
        const measure = () => {
            const container = containerRef.current;
            const inner = innerRef.current;
            if (!container || !inner) return;
            const distance = inner.scrollHeight - container.clientHeight;
            setOverflow({ active: distance > 0, distance });
        };

        measure();

        const container = containerRef.current;
        const inner = innerRef.current;
        const observer = new ResizeObserver(measure);
        if (inner) observer.observe(inner);
        if (container) observer.observe(container);
        window.addEventListener("load", measure);
        return () => {
            observer.disconnect();
            window.removeEventListener("load", measure);
        };
    }, [text]);

    return (
        <p
            ref={containerRef}
            className={`overflow-hidden ${className}`}
            style={overflow.active ? { height: "1.5em" } : undefined}
        >
            <span
                ref={innerRef}
                className={`block ${overflow.active ? "vertical-marquee will-change-transform" : ""}`}
                style={
                    overflow.active
                        ? ({ "--marquee-distance": `${overflow.distance}px` } as React.CSSProperties)
                        : undefined
                }
            >
                {text}
            </span>
        </p>
    );
}

export default VerticalMarquee;
