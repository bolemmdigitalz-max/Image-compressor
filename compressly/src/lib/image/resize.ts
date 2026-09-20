// Pure resize math, easy to unit-test.

export interface ResizeParams {
  srcWidth: number;
  srcHeight: number;
  /** Hard upper bound on output width (0 = no bound) */
  maxWidth: number;
  /** Hard upper bound on output height (0 = no bound) */
  maxHeight: number;
  /** Scale percentage 1-100 (0 = off) */
  scalePercent: number;
  preserveAspectRatio: boolean;
  preventUpscaling: boolean;
}

export interface ResizeResult {
  width: number;
  height: number;
  changed: boolean;
}

/**
 * Compute the target dimensions given the source size and constraints.
 * Pure function — no DOM access. Used by both engine and tests.
 */
export function computeTargetSize(params: ResizeParams): ResizeResult {
  const { srcWidth, srcHeight } = params;
  if (!srcWidth || !srcHeight) return { width: srcWidth, height: srcHeight, changed: false };

  let targetW = srcWidth;
  let targetH = srcHeight;

  // Apply explicit scale first (percentage scaling).
  if (params.scalePercent > 0 && params.scalePercent < 100) {
    const ratio = params.scalePercent / 100;
    targetW = Math.max(1, Math.round(srcWidth * ratio));
    targetH = Math.max(1, Math.round(srcHeight * ratio));
  }

  // Apply hard max width/height bounds.
  if (params.maxWidth > 0 || params.maxHeight > 0) {
    const maxW = params.maxWidth || Infinity;
    const maxH = params.maxHeight || Infinity;
    if (targetW > maxW || targetH > maxH) {
      const wRatio = maxW / targetW;
      const hRatio = maxH / targetH;
      const ratio = params.preserveAspectRatio ? Math.min(wRatio, hRatio) : Math.min(wRatio, hRatio);
      targetW = Math.max(1, Math.round(targetW * ratio));
      targetH = Math.max(1, Math.round(targetH * ratio));
    }
  }

  // Prevent upscaling — only if there was a constraint that would have caused it.
  const hadConstraint =
    (params.scalePercent > 0 && params.scalePercent < 100) ||
    params.maxWidth > 0 ||
    params.maxHeight > 0;

  if (params.preventUpscaling && hadConstraint && (targetW > srcWidth || targetH > srcHeight)) {
    targetW = srcWidth;
    targetH = srcHeight;
  }

  return {
    width: targetW,
    height: targetH,
    changed: targetW !== srcWidth || targetH !== srcHeight,
  };
}