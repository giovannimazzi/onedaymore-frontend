import { useEffect, useRef, useState } from "react";
import { getCategoryFallbackImage } from "../utils/productImage";

export default function ProductImage({
  src,
  categorySlug,
  alt,
  className,
  onDisplaySrcChange,
}) {
  const fallbackSrc = getCategoryFallbackImage(categorySlug);
  const [resolvedSrc, setResolvedSrc] = useState(() => src || fallbackSrc);
  const onDisplaySrcChangeRef = useRef(onDisplaySrcChange);
  onDisplaySrcChangeRef.current = onDisplaySrcChange;

  useEffect(() => {
    const next = src || fallbackSrc;
    setResolvedSrc(next);
    onDisplaySrcChangeRef.current?.(next);
  }, [src, fallbackSrc]);

  return (
    <img
      src={resolvedSrc}
      alt={alt ?? ""}
      className={className}
      onError={() => {
        setResolvedSrc(fallbackSrc);
        onDisplaySrcChangeRef.current?.(fallbackSrc);
      }}
    />
  );
}
