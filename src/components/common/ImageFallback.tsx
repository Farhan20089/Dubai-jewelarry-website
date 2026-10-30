import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  containerClassName?: string;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt = 'Dubai Gold & Jewellers',
  fallbackTitle = 'Dubai Gold Item',
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-stone-900 border border-stone-800 text-stone-400 p-4 text-center select-none ${containerClassName} ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2">
          <Sparkles className="w-6 h-6 text-amber-400/80" />
        </div>
        <span className="text-xs font-serif-luxury tracking-widest uppercase text-amber-200/70">
          {fallbackTitle}
        </span>
        <span className="text-[10px] text-stone-500 mt-0.5">Dubai Gold & Jewellers</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};
