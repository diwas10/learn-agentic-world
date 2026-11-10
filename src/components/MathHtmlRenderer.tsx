import React, { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';

interface MathHtmlRendererProps {
  htmlContent: string;
  className?: string;
}

export const MathHtmlRenderer: React.FC<MathHtmlRendererProps> = ({ htmlContent, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
          ],
          throwOnError: false,
        });
      } catch (e) {
        console.warn('KaTeX auto-render notice:', e);
      }
    }
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className={`lesson-html-container ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
