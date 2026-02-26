import React from 'react';

import { getViewAngleRad } from '@/components/features/tools/armor/useArmorProcessor';
import { getVehicleImage } from '@/utils/getVehicleImage';


import type { ArmorAngle } from '@/utils/getVehicleImage';

interface DepthMinimapProps {
  angle: ArmorAngle;
  detectedMaxDepth: number;
  maxDepth: number;
  minDepth: number;
  size?: number;
  slug: string;
}

const MAX_DIM = 140;
const ARROW_LEN = 14;
const ARROW_HEAD = 5;
const LINE_COLOR = 'rgba(255,255,100,0.8)';
const ARROW_COLOR = 'rgba(255,255,255,0.9)';

const DepthMinimap = React.forwardRef<HTMLCanvasElement, DepthMinimapProps>(
  function DepthMinimap(
    { angle, detectedMaxDepth, maxDepth, minDepth, size, slug },
    ref,
  ) {
    const internalRef = React.useRef<HTMLCanvasElement>(null);
    const canvasRef =
      (ref as React.RefObject<HTMLCanvasElement | null>) ?? internalRef;
    const [loaded, setLoaded] = React.useState(false);
    const imgRef = React.useRef<HTMLImageElement | null>(null);

    React.useEffect(() => {
      setLoaded(false);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = getVehicleImage(slug, 'top_armor', true);
      img.onload = () => {
        imgRef.current = img;
        setLoaded(true);
      };
      img.onerror = () => {
        imgRef.current = null;
        setLoaded(false);
      };

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }, [slug]);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img || !loaded) return;

      const dim = size ?? MAX_DIM;
      const scale = Math.min(dim / img.width, dim / img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const theta = getViewAngleRad(angle);
      const dx = Math.cos(theta);
      const dy = Math.sin(theta);
      const cx = w / 2;
      const cy = h / 2;
      const maxD = detectedMaxDepth || 1;
      const halfExtent = (Math.abs(dx) * w) / 2 + (Math.abs(dy) * h) / 2;

      for (let py = 0; py < h; py += 1) {
        for (let px = 0; px < w; px += 1) {
          const i = (py * w + px) * 4;
          if (data[i + 3] === 0) continue;

          const relX = px - cx;
          const relY = py - cy;
          const proj = (relX * dx + relY * dy) / halfExtent;
          const depth = ((proj + 1) / 2) * maxD;

          if (depth < minDepth || depth > maxDepth) {
            data[i] = Math.round(data[i] * 0.25);
            data[i + 1] = Math.round(data[i + 1] * 0.25);
            data[i + 2] = Math.round(data[i + 2] * 0.25);
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const diag = Math.hypot(w, h);

      const drawBoundaryLine = (depth: number) => {
        if (!isFinite(depth)) return;
        const t = (depth / maxD) * 2 - 1;
        const pos = t * halfExtent;

        const perpX = -dy;
        const perpY = dx;

        const x1 = cx + dx * pos - perpX * diag;
        const y1 = cy + dy * pos - perpY * diag;
        const x2 = cx + dx * pos + perpX * diag;
        const y2 = cy + dy * pos + perpY * diag;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      drawBoundaryLine(minDepth);
      drawBoundaryLine(maxDepth);

      const edgeT = (dirX: number, dirY: number) => {
        let t = Infinity;
        if (dirX > 0) t = Math.min(t, (w - cx) / dirX);
        if (dirX < 0) t = Math.min(t, -cx / dirX);
        if (dirY > 0) t = Math.min(t, (h - cy) / dirY);
        if (dirY < 0) t = Math.min(t, -cy / dirY);
        return t;
      };

      const tEdge = edgeT(-dx, -dy);
      const edgeX = cx + -dx * tEdge;
      const edgeY = cy + -dy * tEdge;
      const arrowStartX = edgeX + dx * 3;
      const arrowStartY = edgeY + dy * 3;
      const arrowEndX = arrowStartX + dx * ARROW_LEN;
      const arrowEndY = arrowStartY + dy * ARROW_LEN;

      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowStartY);
      ctx.lineTo(arrowEndX, arrowEndY);
      ctx.strokeStyle = ARROW_COLOR;
      ctx.lineWidth = 2;
      ctx.stroke();

      const headAngle = Math.atan2(dy, dx);
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowEndY);
      ctx.lineTo(
        arrowEndX - ARROW_HEAD * Math.cos(headAngle - 0.5),
        arrowEndY - ARROW_HEAD * Math.sin(headAngle - 0.5),
      );
      ctx.moveTo(arrowEndX, arrowEndY);
      ctx.lineTo(
        arrowEndX - ARROW_HEAD * Math.cos(headAngle + 0.5),
        arrowEndY - ARROW_HEAD * Math.sin(headAngle + 0.5),
      );
      ctx.strokeStyle = ARROW_COLOR;
      ctx.lineWidth = 2;
      ctx.stroke();
    }, [canvasRef, loaded, angle, minDepth, maxDepth, detectedMaxDepth, size]);

    if (!loaded) return null;

    return (
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          opacity: 0.85,
          borderRadius: 4,
        }}
      />
    );
  },
);

export default DepthMinimap;
