import { MenuCategory, MenuItem, RestaurantInfo } from '../types/menu';

export type FlyerPaperTheme = 'sky-blue' | 'ice-blue' | 'radial-burgundy' | 'clean-white' | 'calm-cream';
export type FlyerZoomLevel = 'normal' | 'large' | 'huge';

export interface RenderFrontFlyerOptions {
  categories: MenuCategory[];
  items: MenuItem[];
  restaurant: RestaurantInfo;
  paperTheme: FlyerPaperTheme;
  zoomLevel: FlyerZoomLevel;
  isSquare: boolean;
  masterWidth: number;
  masterHeight: number;
  foodImages: {
    pizza: string;
    feteer: string;
    sweetFeteer: string;
    crepeCloseUp: string;
    pasta: string;
    syrian: string;
  };
}

const WORDMARK_RED_WHITE_SVG = `
<svg viewBox="0 0 300 116" width="300" height="116" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wm-grad" x1="0" y1="0" x2="0" y2="116" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ff3b3b" />
      <stop offset="50%" stop-color="#d81313" />
      <stop offset="100%" stop-color="#8c0707" />
    </linearGradient>
  </defs>
  <g stroke="#ffffff" stroke-width="13.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 272 44 L 272 56 Q 272 65 264 65 Q 256 65 256 56 L 256 45 L 256 56 Q 256 65 248 65 Q 240 65 240 56 L 240 45 L 240 56 Q 240 65 230 65 L 214 65 L 214 14 L 214 65 L 202 65 Q 196 65 196 56 L 196 45 L 196 56 Q 196 65 188 65 Q 180 65 180 56 L 180 45 L 180 56 Q 180 65 172 65 Q 164 65 164 56 L 164 45 L 164 56 Q 164 65 154 65 L 143 65 L 143 46 L 143 65 L 123 65 L 123 46 L 123 65 L 103 65 L 103 14 L 103 60 C 103 75, 68 88, 40 85 C 16 82, 16 56, 42 55 C 70 54, 96 76, 132 88 C 185 103, 240 97, 272 76" />
    <circle cx="143" cy="77" r="2.2" fill="#ffffff" />
    <circle cx="117" cy="75" r="2.1" fill="#ffffff" />
    <circle cx="127" cy="76" r="2.1" fill="#ffffff" />
  </g>
  <g stroke="url(#wm-grad)" stroke-width="8.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 272 44 L 272 56 Q 272 65 264 65 Q 256 65 256 56 L 256 45 L 256 56 Q 256 65 248 65 Q 240 65 240 56 L 240 45 L 240 56 Q 240 65 230 65 L 214 65 L 214 14 L 214 65 L 202 65 Q 196 65 196 56 L 196 45 L 196 56 Q 196 65 188 65 Q 180 65 180 56 L 180 45 L 180 56 Q 180 65 172 65 Q 164 65 164 56 L 164 45 L 164 56 Q 164 65 154 65 L 143 65 L 143 46 L 143 65 L 123 65 L 123 46 L 123 65 L 103 65 L 103 14 L 103 60 C 103 75, 68 88, 40 85 C 16 82, 16 56, 42 55 C 70 54, 96 76, 132 88 C 185 103, 240 97, 272 76" />
    <circle cx="143" cy="77" r="2.2" fill="url(#wm-grad)" stroke="none" />
    <circle cx="117" cy="75" r="2.1" fill="url(#wm-grad)" stroke="none" />
    <circle cx="127" cy="76" r="2.1" fill="url(#wm-grad)" stroke="none" />
  </g>
  <g stroke="rgba(255,255,255,0.32)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 272 44 L 272 54 M 214 15 L 214 58 M 103 15 L 103 56 C 102 70, 72 84, 42 82" />
  </g>
</svg>`.trim();

const loadImageSafe = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image();
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(() => resolve(img)).catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const traceRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.arcTo(x + w, y, x + w, y + rad, rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.arcTo(x + w, y + h, x + w - rad, y + h, rad);
  ctx.lineTo(x + rad, y + h);
  ctx.arcTo(x, y + h, x, y + h - rad, rad);
  ctx.lineTo(x, y + rad);
  ctx.arcTo(x, y, x + rad, y, rad);
  ctx.closePath();
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillStyle?: string | CanvasGradient,
  strokeStyle?: string,
  lineWidth = 1
) => {
  traceRoundedRect(ctx, x, y, w, h, r);
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle && lineWidth > 0) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
};

export async function renderFrontFlyerToCanvas(
  opts: RenderFrontFlyerOptions
): Promise<HTMLCanvasElement> {
  const {
    categories,
    items,
    restaurant,
    paperTheme,
    zoomLevel,
    isSquare,
    masterWidth,
    masterHeight,
    foodImages
  } = opts;

  if (document.fonts) {
    await document.fonts.ready;
    await Promise.all([
      document.fonts.load('900 18px Cairo').catch(() => {}),
      document.fonts.load('700 14px Cairo').catch(() => {})
    ]);
  }

  const badgeSrcByCat: Record<string, string> = {
    pizza: foodImages.pizza,
    'savory-pies': foodImages.feteer,
    'sweet-pies': foodImages.sweetFeteer,
    crepes: foodImages.crepeCloseUp,
    pasta: foodImages.pasta,
    sandwiches: foodImages.syrian
  };

  const wordmarkDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(WORDMARK_RED_WHITE_SVG)}`;
  const [wordmarkImg, ...loadedBadges] = await Promise.all([
    loadImageSafe(wordmarkDataUrl),
    ...Object.entries(badgeSrcByCat).map(async ([catId, src]) => [catId, await loadImageSafe(src)] as const)
  ]);

  const badgeImages: Record<string, HTMLImageElement | null> = {};
  for (const [catId, img] of loadedBadges) {
    badgeImages[catId] = img;
  }

  const maxDim = Math.max(masterWidth, masterHeight);
  const exportScale = Math.min(2.5, 4050 / maxDim);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(masterWidth * exportScale);
  canvas.height = Math.round(masterHeight * exportScale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('تعذر تهيئة سياق الرسم للصورة');
  }

  ctx.scale(exportScale, exportScale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const isSkyBlue = paperTheme === 'sky-blue';
  const isIceBlue = paperTheme === 'ice-blue';
  const isCleanWhite = paperTheme === 'clean-white';
  const isCalmCream = paperTheme === 'calm-cream';

  // Theme Palette matching PrintMenuView.tsx
  const theme = {
    pageBorder: isSkyBlue
      ? '#7dd3fc'
      : isIceBlue
      ? '#38bdf8'
      : isCleanWhite
      ? '#b91c1c'
      : isCalmCream
      ? '#cbaf8b'
      : '#730909',
    cardOuterBg: isSkyBlue
      ? '#09223d'
      : isIceBlue
      ? '#e0f2fe'
      : isCleanWhite
      ? '#ffffff'
      : isCalmCream
      ? '#fffaf0'
      : '#180202',
    cardBorder: isSkyBlue
      ? 'rgba(56, 189, 248, 0.85)'
      : isIceBlue
      ? '#38bdf8'
      : isCleanWhite
      ? 'rgba(185, 28, 28, 0.85)'
      : isCalmCream
      ? '#cbaf8b'
      : 'rgba(245, 158, 11, 0.7)',
    headerStops: isSkyBlue
      ? ['#03446a', '#0284c7', '#03446a']
      : isIceBlue
      ? ['#012f52', '#025b96', '#012f52']
      : isCleanWhite
      ? ['#981414', '#c61b1b', '#981414']
      : isCalmCream
      ? ['#8b4513', '#a0522d', '#8b4513']
      : ['#981414', '#c61b1b', '#981414'],
    headerBottomBorder: isIceBlue ? '#fbbf24' : isSkyBlue ? 'rgba(56, 189, 248, 0.5)' : 'rgba(127, 29, 29, 0.5)',
    cardBodyTop: isSkyBlue ? '#082038' : isIceBlue ? '#f0f9ff' : isCleanWhite ? '#ffffff' : isCalmCream ? '#fffaf0' : '#120101',
    cardBodyBot: isSkyBlue ? '#06192d' : isIceBlue ? '#f0f9ff' : isCleanWhite ? '#ffffff' : isCalmCream ? '#fffaf0' : '#120101',
    sizeRowBg: isSkyBlue ? '#041424' : isIceBlue ? '#bae6fd' : isCleanWhite ? '#f5f5f5' : isCalmCream ? '#fef3c7' : '#450a0a',
    sizeRowBorder: isSkyBlue ? '#0284c7' : isIceBlue ? '#38bdf8' : isCleanWhite ? '#d4d4d4' : isCalmCream ? '#fcd34d' : '#7f1d1d',
    sizeRowLabel: isSkyBlue ? '#bae6fd' : isIceBlue ? '#000000' : isCleanWhite ? '#000000' : '#fcd34d',
    sizeRowCol: isSkyBlue ? '#ffffff' : isIceBlue ? '#000000' : isCleanWhite ? '#000000' : '#fde68a',
    itemName: isSkyBlue ? '#ffffff' : isIceBlue ? '#000000' : isCleanWhite ? '#000000' : isCalmCream ? '#2b1704' : '#ffffff',
    priceColor: isSkyBlue ? '#facc18' : isIceBlue ? '#000000' : isCleanWhite ? '#b91c1c' : '#facc18',
    leaderColor: isSkyBlue
      ? 'rgba(56, 189, 248, 0.4)'
      : isIceBlue
      ? 'rgba(56, 189, 248, 0.72)'
      : isCleanWhite
      ? '#d4d4d4'
      : 'rgba(153, 27, 27, 0.45)',
    comboBg: isSkyBlue
      ? '#0e3459'
      : isIceBlue
      ? '#fef3c7'
      : isCleanWhite
      ? 'rgba(254, 243, 199, 0.92)'
      : 'rgba(120, 53, 15, 0.4)',
    comboBorder: isSkyBlue ? 'rgba(251, 191, 36, 0.8)' : isIceBlue ? '#fbbf24' : '#f59e0b',
    footerBorder: isIceBlue ? '#38bdf8' : isSkyBlue ? 'rgba(125, 211, 252, 0.7)' : 'rgba(185, 28, 28, 0.5)',
    footerText: isSkyBlue ? '#e0f2fe' : '#0f172a'
  };

  // 1. Page Background + Rounded Frame
  ctx.save();
  traceRoundedRect(ctx, 2, 2, masterWidth - 4, masterHeight - 4, 24);
  ctx.clip();

  if (isSkyBlue) {
    const bgGrad = ctx.createRadialGradient(
      masterWidth * 0.5,
      masterHeight * 0.1,
      20,
      masterWidth * 0.5,
      masterHeight * 0.25,
      masterWidth * 0.85
    );
    bgGrad.addColorStop(0, '#38bdf8');
    bgGrad.addColorStop(0.3, '#0ea5e9');
    bgGrad.addColorStop(0.65, '#0284c7');
    bgGrad.addColorStop(1, '#03537e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, masterWidth, masterHeight);
  } else if (isIceBlue) {
    const bgGrad = ctx.createRadialGradient(
      masterWidth * 0.5,
      masterHeight * 0.08,
      20,
      masterWidth * 0.5,
      masterHeight * 0.22,
      masterWidth * 0.85
    );
    bgGrad.addColorStop(0, '#e0f2fe');
    bgGrad.addColorStop(0.3, '#bae6fd');
    bgGrad.addColorStop(0.65, '#7dd3fc');
    bgGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, masterWidth, masterHeight);
  } else if (isCleanWhite) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, masterWidth, masterHeight);
  } else {
    ctx.fillStyle = '#fbf7f0';
    ctx.fillRect(0, 0, masterWidth, masterHeight);
  }

  // Subtle ambient dot pattern
  ctx.fillStyle = 'rgba(2, 132, 199, 0.12)';
  for (let gx = 12; gx < masterWidth; gx += 24) {
    for (let gy = 12; gy < masterHeight; gy += 24) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // Outer 4px border
  drawRoundedRect(ctx, 2, 2, masterWidth - 4, masterHeight - 4, 24, undefined, theme.pageBorder, 4);

  // 2. Layout Geometry (matches p-3 sm:p-4, 4 RTL columns, footer)
  const pagePad = isSquare ? 16 : 14;
  const footerHeight = 38;
  const footerGap = 8;
  const colGapX = 10;
  const colGapY = 8;
  const gridTop = pagePad;
  const gridHeight = masterHeight - pagePad * 2 - footerHeight - footerGap;
  const colWidth = (masterWidth - pagePad * 2 - colGapX * 3) / 4;

  // RTL Column Order: index 0 is FAR RIGHT
  const columnCategoryIds: Array<[string, string]> = [
    ['pizza', 'sides'], // Col 1 (far right)
    ['savory-pies', 'sweet-pies'], // Col 2
    ['pasta', 'sandwiches'], // Col 3
    ['crepes', 'sweet-crepes'] // Col 4 (far left)
  ];

  const majorIds = new Set([
    'pizza',
    'savory-pies',
    'sweet-pies',
    'pasta',
    'crepes',
    'sweet-crepes'
  ]);

  const drawCategoryCard = (
    cat: MenuCategory,
    catItems: MenuItem[],
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const isMajor = majorIds.has(cat.id);
    const hasMultipleSizes = Boolean(cat.sizeLabels && cat.sizeLabels.length > 1);

    // Card Shadow + Body
    ctx.save();
    ctx.shadowColor = isSkyBlue ? 'rgba(8, 47, 73, 0.5)' : 'rgba(15, 23, 42, 0.16)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    drawRoundedRect(ctx, x, y, w, h, 16, theme.cardOuterBg);
    ctx.restore();

    ctx.save();
    traceRoundedRect(ctx, x, y, w, h, 16);
    ctx.clip();

    // Header bar
    const headerH = isSquare ? 35 : 31;
    const hdrGrad = ctx.createLinearGradient(x, y, x + w, y);
    hdrGrad.addColorStop(0, theme.headerStops[0]);
    hdrGrad.addColorStop(0.5, theme.headerStops[1]);
    hdrGrad.addColorStop(1, theme.headerStops[2]);
    ctx.fillStyle = hdrGrad;
    ctx.fillRect(x, y, w, headerH);

    // Header bottom accent border
    ctx.fillStyle = theme.headerBottomBorder;
    ctx.fillRect(x, y + headerH - 2, w, 2);

    // Body background gradient
    const bodyGrad = ctx.createLinearGradient(x, y + headerH, x, y + h);
    bodyGrad.addColorStop(0, theme.cardBodyTop);
    bodyGrad.addColorStop(1, theme.cardBodyBot);
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(x, y + headerH, w, h - headerH);

    // Header content: centered ★ + badgeImg + title + ★
    const titleFontSize = !isSquare
      ? 16.5
      : isMajor
      ? 19
      : 17;
    ctx.font = `900 ${titleFontSize}px Cairo, sans-serif`;
    const titleWidth = ctx.measureText(cat.name).width;
    const badgeImg = badgeImages[cat.id];
    const badgeDiameter = badgeImg ? 23 : 0;
    const gap = 7;
    ctx.font = '900 13px Cairo, sans-serif';
    const starW = ctx.measureText('★').width;
    const totalHdrContentW =
      starW + gap + (badgeDiameter ? badgeDiameter + gap : 0) + titleWidth + gap + starW;
    // In RTL layout: right edge is star, then badge, then title, then left star
    const centerX = x + w / 2;
    const centerY = y + headerH / 2;
    let cursorX = centerX + totalHdrContentW / 2;

    // Right ★
    ctx.save();
    ctx.font = '900 13px Cairo, sans-serif';
    ctx.fillStyle = '#fcd34d';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', cursorX, centerY + 1);
    cursorX -= starW + gap;

    // Circular badge photo
    if (badgeImg && badgeDiameter > 0) {
      const cx = cursorX - badgeDiameter / 2;
      const cy = centerY;
      const rad = badgeDiameter / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.clip();
      const imgRatio = badgeImg.naturalWidth / Math.max(1, badgeImg.naturalHeight);
      let drawW = badgeDiameter;
      let drawH = badgeDiameter;
      if (imgRatio > 1) {
        drawW = badgeDiameter * imgRatio;
      } else {
        drawH = badgeDiameter / imgRatio;
      }
      ctx.drawImage(badgeImg, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#fcd34d';
      ctx.stroke();

      cursorX -= badgeDiameter + gap;
    }

    // Category title
    ctx.save();
    ctx.font = `900 ${titleFontSize}px Cairo, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;
    ctx.fillText(cat.name, cursorX, centerY + 1);
    ctx.restore();
    cursorX -= titleWidth + gap;

    // Left ★
    ctx.font = '900 13px Cairo, sans-serif';
    ctx.fillStyle = '#fcd34d';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', cursorX, centerY + 1);
    ctx.restore();

    // Card body content area
    const bodyPad = isSquare ? 6 : 5;
    const innerX = x + bodyPad;
    const innerW = w - bodyPad * 2;
    let curY = y + headerH + bodyPad;

    // Compute price column widths
    const isHuge = zoomLevel === 'huge';
    const isNormal = zoomLevel === 'normal';
    const baseColW = !isSquare
      ? isHuge
        ? 40
        : isNormal
        ? 36
        : 38
      : isHuge
      ? 43
      : isNormal
      ? 38
      : 41;
    const wideColW = isSquare ? 75 : 66;
    const isCrepesSplit = cat.id === 'crepes' && Boolean(cat.sizeLabels && cat.sizeLabels.length > 1);
    const colGap = isCrepesSplit ? 10 : 4;

    const sizeCols = hasMultipleSizes && cat.sizeLabels ? cat.sizeLabels : null;
    const getColWidth = (lbl: string) => (lbl.trim().length > 5 ? wideColW : baseColW);
    const maxItemPricesCount = catItems.reduce((mx, it) => Math.max(mx, it.prices.length), 1);
    const singleCatColW = cat.id === 'sides' ? baseColW + 14 : baseColW + 6;
    const totalPriceAreaW = sizeCols
      ? sizeCols.reduce((acc, lbl, idx) => acc + getColWidth(lbl) + (idx > 0 ? colGap : 0), 0)
      : maxItemPricesCount * singleCatColW + Math.max(0, maxItemPricesCount - 1) * colGap;

    // Size Header Row
    const sizeRowH = sizeCols ? 25 : 0;
    if (sizeCols) {
      drawRoundedRect(ctx, innerX, curY, innerW, sizeRowH, 5, theme.sizeRowBg);
      ctx.fillStyle = theme.sizeRowBorder;
      ctx.fillRect(innerX + 1, curY + sizeRowH - 2, innerW - 2, 2);

      // Right label: الصنف
      const sizeTitleSize = !isSquare ? 13.5 : 15;
      ctx.save();
      ctx.direction = 'rtl';
      ctx.font = `900 ${sizeTitleSize}px Cairo, sans-serif`;
      ctx.fillStyle = theme.sizeRowLabel;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('الصنف', innerX + innerW - 6, curY + sizeRowH / 2 + 0.5);

      // Left columns: rendered in RTL order (first sizeLabel is rightmost of price area)
      const sizeColFontSize = !isSquare
        ? isHuge
          ? 14
          : isNormal
          ? 12.5
          : 13.5
        : isHuge
        ? 16
        : isNormal
        ? 14.5
        : 15.5;
      ctx.font = `900 ${sizeColFontSize}px Cairo, sans-serif`;
      ctx.fillStyle = theme.sizeRowCol;
      ctx.textAlign = 'center';

      let colRightX = innerX + 4 + totalPriceAreaW;
      sizeCols.forEach((lbl, lblIdx) => {
        const cw = getColWidth(lbl);
        if (isCrepesSplit && lblIdx > 0) {
          const divX = colRightX + colGap / 2;
          ctx.fillStyle = theme.sizeRowBorder;
          ctx.fillRect(divX - 1, curY + 4, 2, sizeRowH - 9);
          ctx.fillStyle = theme.sizeRowCol;
        }
        ctx.fillText(lbl, colRightX - cw / 2, curY + sizeRowH / 2 + 0.5);
        colRightX -= cw + colGap;
      });
      ctx.restore();

      curY += sizeRowH + 3;
    }

    // Item Rows Area
    const itemsAreaH = y + h - bodyPad - curY;
    const count = Math.max(1, catItems.length);
    const rowStep = itemsAreaH / count;

    if (isCrepesSplit && sizeCols && sizeCols.length >= 2) {
      const firstColW = getColWidth(sizeCols[0]);
      const divX = innerX + 4 + totalPriceAreaW - firstColW - colGap / 2;
      ctx.save();
      ctx.fillStyle = theme.leaderColor;
      ctx.fillRect(divX - 0.8, curY + 2, 1.6, Math.max(0, itemsAreaH - 4));
      ctx.restore();
    }

    const baseItemFont = !isSquare
      ? isHuge
        ? 14.5
        : isNormal
        ? 13
        : 14
      : isHuge
      ? isMajor
        ? 16.8
        : 15.8
      : isNormal
      ? isMajor
        ? 14.8
        : 14
      : isMajor
      ? 15.8
      : 14.8;

    const basePriceFont = !isSquare
      ? isHuge
        ? 14.5
        : isNormal
        ? 13.5
        : 14.2
      : isHuge
      ? 17.5
      : isNormal
      ? 15.5
      : 16.8;

    catItems.forEach((item, idx) => {
      const rowTop = curY + idx * rowStep;
      const rowMidY = rowTop + rowStep / 2;
      const isCombo = Boolean(item.tags?.includes('combo'));

      if (isCombo) {
        const boxH = Math.min(rowStep - 1, Math.max(18, rowStep * 0.88));
        drawRoundedRect(
          ctx,
          innerX + 1,
          rowMidY - boxH / 2,
          innerW - 2,
          boxH,
          5,
          theme.comboBg,
          theme.comboBorder,
          1
        );
      }

      // Compute font size (mirrors isLong / isExtraLong + fits available width cleanly)
      const len = item.name.length;
      let itemFontSize = baseItemFont;
      if (len > 24) {
        itemFontSize = Math.max(11.5, baseItemFont - 2.6);
      } else if (len > 18) {
        itemFontSize = Math.max(12.2, baseItemFont - 1.4);
      }
      itemFontSize = Math.min(itemFontSize, Math.max(11, rowStep * 0.68));

      const rightEdgeX = innerX + innerW - 5;
      const priceAreaStartX = innerX + 4;
      const priceAreaEndX = priceAreaStartX + totalPriceAreaW;
      const maxNameWidth = Math.max(70, rightEdgeX - priceAreaEndX - 14);

      ctx.save();
      ctx.direction = 'rtl';
      ctx.font = `900 ${itemFontSize}px Cairo, sans-serif`;
      let measuredNameW = ctx.measureText(item.name).width;
      while (measuredNameW > maxNameWidth && itemFontSize > 10) {
        itemFontSize -= 0.5;
        ctx.font = `900 ${itemFontSize}px Cairo, sans-serif`;
        measuredNameW = ctx.measureText(item.name).width;
      }

      // Draw item name (RTL right-aligned)
      ctx.fillStyle = theme.itemName;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.name, rightEdgeX, rowMidY + 0.5);

      let leaderRightX = rightEdgeX - measuredNameW - 5;

      if (isCombo) {
        ctx.font = '700 10px Cairo, sans-serif';
        ctx.fillText('🔥', leaderRightX, rowMidY + 0.5);
        leaderRightX -= ctx.measureText('🔥').width + 4;
      }

      // Optional tags near left edge of name zone
      let leaderLeftX = priceAreaEndX + 5;
      if (item.tags?.includes('spicy')) {
        ctx.font = '700 10px Cairo, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🌶️', leaderLeftX, rowMidY + 0.5);
        leaderLeftX += ctx.measureText('🌶️').width + 3;
      }
      if (item.tags?.includes('popular') && !isCombo) {
        ctx.font = '900 10px Cairo, sans-serif';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'left';
        ctx.fillText('★', leaderLeftX, rowMidY + 0.5);
        leaderLeftX += ctx.measureText('★').width + 3;
      }

      // Dotted leader line
      if (leaderRightX - leaderLeftX >= 6) {
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([2, 3]);
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = theme.leaderColor;
        ctx.moveTo(leaderLeftX, rowMidY + 2);
        ctx.lineTo(leaderRightX, rowMidY + 2);
        ctx.stroke();
        ctx.restore();
      }

      // Prices
      const clampedPriceFont = Math.min(basePriceFont, Math.max(11.5, rowStep * 0.7));
      ctx.font = `900 ${clampedPriceFont}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (sizeCols) {
        let colRightX = priceAreaStartX + totalPriceAreaW;
        for (const sLabel of sizeCols) {
          const cw = getColWidth(sLabel);
          const colCenterX = colRightX - cw / 2;
          const priceObj = item.prices.find((pr) => pr.label.trim() === sLabel.trim());
          if (priceObj) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = theme.priceColor;
            ctx.fillText(String(priceObj.price), colCenterX, rowMidY + 0.5);
          } else {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = theme.priceColor;
            ctx.fillText('-', colCenterX, rowMidY + 0.5);
          }
          colRightX -= cw + colGap;
        }
        ctx.globalAlpha = 1;
      } else {
        let colRightX = priceAreaStartX + totalPriceAreaW;
        for (const p of item.prices) {
          const colCenterX = colRightX - singleCatColW / 2;
          ctx.fillStyle = theme.priceColor;
          const prefix =
            cat.id === 'sides' && item.prices.length > 1
              ? p.label === 'صغير'
                ? 'ص:'
                : p.label === 'وسط'
                ? 'و:'
                : 'ك:'
              : '';
          ctx.fillText(`${prefix}${p.price}`, colCenterX, rowMidY + 0.5);
          colRightX -= singleCatColW + colGap;
        }
      }

      ctx.restore();
    });

    ctx.restore(); // unclip card

    // Card 2px border
    drawRoundedRect(ctx, x, y, w, h, 16, undefined, theme.cardBorder, 2);
  };

  // Draw all 4 Columns
  columnCategoryIds.forEach(([topId, botId], colIdx) => {
    const colX = masterWidth - pagePad - colWidth * (colIdx + 1) - colGapX * colIdx;
    const topCat = categories.find((c) => c.id === topId);
    const botCat = categories.find((c) => c.id === botId);
    const topItems = topCat ? items.filter((i) => i.categoryId === topCat.id) : [];
    const botItems = botCat ? items.filter((i) => i.categoryId === botCat.id) : [];

    const activeCards: Array<{ cat: MenuCategory; catItems: MenuItem[]; weight: number }> = [];
    if (topCat && topItems.length > 0) {
      activeCards.push({ cat: topCat, catItems: topItems, weight: topItems.length });
    }
    if (botCat && botItems.length > 0) {
      activeCards.push({ cat: botCat, catItems: botItems, weight: botItems.length });
    }

    if (activeCards.length === 1) {
      drawCategoryCard(activeCards[0].cat, activeCards[0].catItems, colX, gridTop, colWidth, gridHeight);
    } else if (activeCards.length === 2) {
      const availH = gridHeight - colGapY;
      const overhead = (c: MenuCategory) => (c.sizeLabels && c.sizeLabels.length > 1 ? 66 : 42);
      const w0 = overhead(activeCards[0].cat) + activeCards[0].weight * 26;
      const w1 = overhead(activeCards[1].cat) + activeCards[1].weight * 26;
      const h0 = Math.round((availH * w0) / (w0 + w1));
      const h1 = availH - h0;

      drawCategoryCard(activeCards[0].cat, activeCards[0].catItems, colX, gridTop, colWidth, h0);
      drawCategoryCard(activeCards[1].cat, activeCards[1].catItems, colX, gridTop + h0 + colGapY, colWidth, h1);
    }
  });

  // 3. Footer Bar
  const footerTop = masterHeight - pagePad - footerHeight;
  ctx.fillStyle = theme.footerBorder;
  ctx.fillRect(pagePad, footerTop, masterWidth - pagePad * 2, 2);

  const footerMidY = footerTop + 2 + (footerHeight - 2) / 2;

  // Right side of footer: ★ بيتزا [Wordmark] • {tagline}
  ctx.save();
  ctx.direction = 'rtl';
  let fx = masterWidth - pagePad;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  ctx.font = '900 14px Cairo, sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('★', fx, footerMidY);
  fx -= ctx.measureText('★').width + 8;

  ctx.font = '900 14px Cairo, sans-serif';
  ctx.fillStyle = theme.footerText;
  ctx.fillText('بيتزا', fx, footerMidY);
  fx -= ctx.measureText('بيتزا').width + 6;

  if (wordmarkImg && wordmarkImg.naturalWidth > 0) {
    const wmH = 36;
    const wmW = (wordmarkImg.naturalWidth / Math.max(1, wordmarkImg.naturalHeight)) * wmH;
    ctx.drawImage(wordmarkImg, fx - wmW, footerMidY - wmH / 2, wmW, wmH);
    fx -= wmW + 8;
  }

  ctx.font = '900 12px Cairo, sans-serif';
  ctx.fillStyle = theme.footerText;
  ctx.fillText(`•  ${restaurant.tagline}`, fx, footerMidY);
  ctx.restore();

  // Left side of footer: Dark Navy Pill
  const pillText =
    '🔄 اقلب الصفحة لمشاهدة قسم الحواوشي الإيطالي والكالزوني الإيطالي وأرقام التليفونات والواتساب والموقع';
  ctx.save();
  ctx.direction = 'rtl';
  ctx.font = '900 12px Cairo, sans-serif';
  const pillTextW = ctx.measureText(pillText).width;
  const pillW = pillTextW + 28;
  const pillH = 26;
  const pillX = pagePad;
  const pillY = footerMidY - pillH / 2;

  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, pillH / 2, '#012b4a', 'rgba(251, 191, 36, 0.7)', 1);
  ctx.fillStyle = '#fcd34d';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pillText, pillX + pillW / 2, footerMidY + 0.5);
  ctx.restore();

  return canvas;
}
