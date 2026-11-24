import React, { useState, useRef, useEffect } from 'react';
import { MenuCategory, MenuItem, RestaurantInfo } from '../types/menu';
import { toCanvas, toSvg } from 'html-to-image';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { SalsabeelWordmark } from './SalsabeelWordmark';
import { renderFrontFlyerToCanvas } from '../utils/renderFrontFlyerCanvas';
import { 
  Phone, 
  MapPin, 
  Sparkles, 
  Printer, 
  Edit3, 
  Palette, 
  FileDown, 
  X, 
  Image as ImageIcon, 
  ExternalLink, 
  Loader2, 
  Eye, 
  Maximize2,
  ZoomIn,
  CheckCircle2,
  Square,
  RectangleHorizontal,
  Wallet,
  MessageCircle,
  BookOpen
} from 'lucide-react';

export type PaperTheme = 'sky-blue' | 'ice-blue' | 'radial-burgundy' | 'clean-white' | 'calm-cream';
export type ZoomLevel = 'normal' | 'large' | 'huge';
export type FlyerShape = 'square' | 'original';
export type SideViewMode = 'both' | 'front' | 'back';

// Authentic Customer Food Photos & Brand Cover
export const FOOD_IMAGES = {
  pizza: '/assets/aistudio/image_86369f0e.png',
  feteer: '/assets/aistudio/image_10b572b6.png',
  sweetFeteer: '/assets/aistudio/image_f37f8769.png',
  crepeWheel: '/assets/aistudio/image_a420f58d.png',
  crepeCloseUp: '/assets/aistudio/WhatsApp_Image_2026-11-02_at_4.22.17_PM_653e5048.jpeg',
  pasta: '/assets/aistudio/image_37498677.png',
  syrian: '/assets/aistudio/image_56a48c70.png',
  burger: '/assets/aistudio/image_924d197e.png',
  pizzaPullBg: '/assets/aistudio/image_37d749be.png',
  brandCover: '/assets/aistudio/image_0776653d.png',
  brandBanner: '/assets/aistudio/brand_banner_navy_pizza.png',
  brandLogoCoin: '/assets/aistudio/WhatsApp_Image_2026-11-17_at_4.54.01_PM_27ba9516.jpeg',
  juicesBanner: '/assets/aistudio/image_dcb1bb24.png',
};

interface PrintMenuViewProps {
  restaurant: RestaurantInfo;
  categories: MenuCategory[];
  items: MenuItem[];
  isEditMode: boolean;
  onEditItem: (item: MenuItem) => void;
  onUpdatePrice: (itemId: string, variantIndex: number, newPrice: number) => void;
  onPrint: () => void;
}

export const PrintMenuView: React.FC<PrintMenuViewProps> = ({
  restaurant,
  categories,
  items,
  isEditMode,
  onEditItem,
  onUpdatePrice
}) => {
  const [flyerShape, setFlyerShape] = useState<FlyerShape>('square');
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('ice-blue');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('large');
  const [screenScale, setScreenScale] = useState<'fit' | '100'>('fit');
  const [sideView, setSideView] = useState<SideViewMode>('both');

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState<string>('الوش');
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'png-front' | 'png-back' | 'preview' | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [fitScaleRatio, setFitScaleRatio] = useState<number>(0.85);

  const isSquare = flyerShape === 'square';
  const masterWidth = isSquare ? 1500 : 1620;
  const masterHeight = isSquare ? 1360 : 1050;

  // Calculate fit scale for the flyers on screens
  useEffect(() => {
    const updateFitRatio = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth - 24;
        if (containerWidth < masterWidth) {
          const ratio = Math.max(0.32, Math.min(1, containerWidth / masterWidth));
          setFitScaleRatio(ratio);
        } else {
          setFitScaleRatio(1);
        }
      }
    };

    updateFitRatio();
    window.addEventListener('resize', updateFitRatio);
    return () => window.removeEventListener('resize', updateFitRatio);
  }, [masterWidth, flyerShape, sideView]);

  const exportBgColor =
    paperTheme === 'sky-blue'
      ? '#0ea5e9'
      : paperTheme === 'ice-blue'
      ? '#38bdf8'
      : paperTheme === 'clean-white'
      ? '#ffffff'
      : paperTheme === 'calm-cream'
      ? '#fbf7f0'
      : '#150101';

  const formatExportError = (err: unknown): string => {
    if (err instanceof Error && err.message) {
      return err.message;
    }
    if (typeof Event !== 'undefined' && err instanceof Event) {
      return 'تعذر تحميل أو رسم أحد عناصر التصميم في المتصفح';
    }
    return String(err || 'خطأ غير متوقع');
  };

  // Pre-inline all already-loaded <img> tags into crisp, compact in-memory data URLs
  // so html-to-image never needs network fetch() and tiny 28x28 icons don't bloat SVG size.
  const inlineLoadedImages = async (node: HTMLDivElement): Promise<() => void> => {
    const imgs = Array.from(node.querySelectorAll('img'));
    const originals: Array<{ img: HTMLImageElement; src: string }> = [];

    await Promise.all(
      imgs.map(async (img) => {
        if (!img.complete) {
          await new Promise<void>((res) => {
            img.addEventListener('load', () => res(), { once: true });
            img.addEventListener('error', () => res(), { once: true });
          });
        }
        if (typeof img.decode === 'function') {
          await img.decode().catch(() => {});
        }
        if (!img.complete || img.naturalWidth <= 0 || !img.src || img.src.startsWith('data:')) {
          return;
        }
        try {
          const rect = img.getBoundingClientRect();
          const dispW = rect.width || img.clientWidth || img.naturalWidth;
          const dispH = rect.height || img.clientHeight || img.naturalHeight;
          const isSmallBadge = dispW <= 96 && dispH <= 96;
          const maxTarget = isSmallBadge ? 160 : 2000;
          const scaleFactor = Math.min(1, maxTarget / Math.max(img.naturalWidth, img.naturalHeight));
          const cw = Math.max(1, Math.round(img.naturalWidth * scaleFactor));
          const ch = Math.max(1, Math.round(img.naturalHeight * scaleFactor));

          const offscreen = document.createElement('canvas');
          offscreen.width = cw;
          offscreen.height = ch;
          const ctx = offscreen.getContext('2d');
          if (!ctx) return;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, cw, ch);

          const isJpeg = /\.(jpe?g)(\?|$)/i.test(img.src);
          const dataUrl = isJpeg
            ? offscreen.toDataURL('image/jpeg', 0.94)
            : offscreen.toDataURL('image/png');

          if (dataUrl && dataUrl.startsWith('data:image/') && dataUrl.length > 32) {
            originals.push({ img, src: img.getAttribute('src') || img.src });
            img.src = dataUrl;
          }
        } catch {
          // Leave original src untouched if canvas conversion fails
        }
      })
    );

    return () => {
      for (const entry of originals) {
        entry.img.src = entry.src;
      }
    };
  };

  // Verify a rendered canvas actually contains visible artwork (not blank or solid background color)
  const assertCanvasHasContent = (canvas: HTMLCanvasElement, expectedBg: string) => {
    const probeW = 48;
    const probeH = 48;
    const probe = document.createElement('canvas');
    probe.width = probeW;
    probe.height = probeH;
    const pctx = probe.getContext('2d');
    if (!pctx) return;

    pctx.drawImage(canvas, 0, 0, probeW, probeH);
    const { data } = pctx.getImageData(0, 0, probeW, probeH);

    // Reference color from top-left pixel + expectedBg fallback
    const refR = data[0];
    const refG = data[1];
    const refB = data[2];

    const tmpCtx = document.createElement('canvas').getContext('2d');
    let bgR = refR;
    let bgG = refG;
    let bgB = refB;
    if (tmpCtx) {
      tmpCtx.fillStyle = expectedBg;
      const hex = tmpCtx.fillStyle;
      if (/^#[0-9a-f]{6}$/i.test(hex)) {
        bgR = parseInt(hex.slice(1, 3), 16);
        bgG = parseInt(hex.slice(3, 5), 16);
        bgB = parseInt(hex.slice(5, 7), 16);
      }
    }

    let variedPixels = 0;
    const total = probeW * probeH;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const diffCorner = Math.abs(r - refR) + Math.abs(g - refG) + Math.abs(b - refB);
      const diffBg = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
      if (diffCorner > 30 && diffBg > 30) {
        variedPixels++;
      }
    }

    // A full menu flyer always has rich cards/text (>3% distinct pixels); <1.5% indicates blank foreignObject
    if (variedPixels < Math.max(20, Math.floor(total * 0.015))) {
      throw new Error('SVG rasterization produced blank content');
    }
  };

  // Cache compact Arabic-only Cairo @font-face CSS (~90KB instead of 2.5MB all-subsets embed)
  const cairoFontCssCacheRef = useRef<string | null>(null);
  const getCompactCairoFontCss = async (): Promise<string | undefined> => {
    if (cairoFontCssCacheRef.current !== null) {
      return cairoFontCssCacheRef.current || undefined;
    }
    try {
      const linkEl = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find((el) =>
        (el as HTMLLinkElement).href?.includes('Cairo')
      ) as HTMLLinkElement | undefined;
      const cssUrl =
        linkEl?.href ||
        'https://fonts.googleapis.com/css2?family=Cairo:wght@700;800;900&display=swap';
      const resp = await fetch(cssUrl);
      if (!resp.ok) throw new Error('Font CSS fetch failed');
      const rawCss = await resp.text();

      // Keep only Cairo @font-face blocks that cover Arabic (U+0600-06FF) or latin digits
      const faceBlocks = rawCss.match(/@font-face\s*\{[^}]+\}/g) || [];
      const neededBlocks = faceBlocks.filter(
        (blk) =>
          /font-family:\s*['"]?Cairo/i.test(blk) &&
          (/U\+0600/i.test(blk) || /U\+0000-00FF/i.test(blk)) &&
          /font-weight:\s*(700|800|900)/i.test(blk)
      );

      if (neededBlocks.length === 0) {
        cairoFontCssCacheRef.current = '';
        return undefined;
      }

      const inlinedBlocks = await Promise.all(
        neededBlocks.map(async (blk) => {
          const urlMatch = blk.match(/url\(([^)]+)\)/);
          if (!urlMatch) return blk;
          const fontUrl = urlMatch[1].replace(/['"]/g, '');
          try {
            const fontResp = await fetch(fontUrl);
            const blob = await fontResp.blob();
            const b64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result || ''));
              reader.onerror = () => reject(new Error('FileReader failed'));
              reader.readAsDataURL(blob);
            });
            return blk.replace(urlMatch[0], `url(${b64})`);
          } catch {
            return '';
          }
        })
      );

      const finalCss = inlinedBlocks.filter(Boolean).join('\n');
      cairoFontCssCacheRef.current = finalCss;
      return finalCss || undefined;
    } catch {
      cairoFontCssCacheRef.current = '';
      return undefined;
    }
  };

  // Decode an SVG string and rasterize natively onto a targetWidth x targetHeight canvas
  const renderSvgToHighDpiCanvas = async (
    svgDataUrl: string,
    masterW: number,
    masterH: number,
    targetW: number,
    targetH: number,
    bgColor: string
  ): Promise<HTMLCanvasElement> => {
    const rawPrefix = 'data:image/svg+xml;charset=utf-8,';
    const b64Prefix = 'data:image/svg+xml;base64,';
    let svgMarkup: string;

    if (svgDataUrl.startsWith(rawPrefix)) {
      svgMarkup = decodeURIComponent(svgDataUrl.slice(rawPrefix.length));
    } else if (svgDataUrl.startsWith(b64Prefix)) {
      svgMarkup = decodeURIComponent(escape(atob(svgDataUrl.slice(b64Prefix.length))));
    } else {
      svgMarkup = decodeURIComponent(svgDataUrl);
    }

    const scaledSvgMarkup = svgMarkup.replace(
      /<svg\b([^>]*)>/i,
      (_match, attrs: string) => {
        let updatedAttrs = attrs;
        if (/\bwidth="[^"]*"/i.test(updatedAttrs)) {
          updatedAttrs = updatedAttrs.replace(/\bwidth="[^"]*"/i, `width="${targetW}"`);
        } else {
          updatedAttrs += ` width="${targetW}"`;
        }
        if (/\bheight="[^"]*"/i.test(updatedAttrs)) {
          updatedAttrs = updatedAttrs.replace(/\bheight="[^"]*"/i, `height="${targetH}"`);
        } else {
          updatedAttrs += ` height="${targetH}"`;
        }
        if (!/\bviewBox=/i.test(updatedAttrs)) {
          updatedAttrs += ` viewBox="0 0 ${masterW} ${masterH}"`;
        }
        return `<svg${updatedAttrs}>`;
      }
    );

    const drawSvgSourceToCanvas = async (imgSrc: string): Promise<HTMLCanvasElement> => {
      const svgImage = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          if (typeof image.decode === 'function') {
            image.decode().then(() => resolve(image)).catch(() => resolve(image));
          } else {
            resolve(image);
          }
        };
        image.onerror = () => reject(new Error('تعذر رسم التصميم كصورة عالية الدقة'));
        image.src = imgSrc;
      });

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('تعذر تهيئة سياق الرسم للصورة');
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(svgImage, 0, 0, targetW, targetH);
      // Verify canvas is not tainted AND actually rendered visible flyer content
      ctx.getImageData(0, 0, 1, 1);
      assertCanvasHasContent(canvas, bgColor);
      return canvas;
    };

    // Base64 SVG URL is ~40% shorter than encodeURIComponent, preventing browser data-URI truncation on dense flyers
    try {
      const b64Svg = btoa(unescape(encodeURIComponent(scaledSvgMarkup)));
      return await drawSvgSourceToCanvas(`${b64Prefix}${b64Svg}`);
    } catch {
      try {
        const scaledDataUrl = `${rawPrefix}${encodeURIComponent(scaledSvgMarkup)}`;
        return await drawSvgSourceToCanvas(scaledDataUrl);
      } catch {
        const svgBlob = new Blob([scaledSvgMarkup], { type: 'image/svg+xml;charset=utf-8' });
        const blobUrl = URL.createObjectURL(svgBlob);
        try {
          return await drawSvgSourceToCanvas(blobUrl);
        } finally {
          URL.revokeObjectURL(blobUrl);
        }
      }
    }
  };

  // Capture any side node onto a crisp native high-DPI Canvas with multi-tier reliability
  const captureNodeCanvas = async (node: HTMLDivElement): Promise<HTMLCanvasElement> => {
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Front side has 120+ menu items across 4 columns where mobile Chromium SVG <foreignObject>
    // drops flow content mid-grid; render directly via native high-DPI Canvas 2D for 100% reliability.
    if (node === frontRef.current) {
      const actualFrontH =
        node.scrollHeight > masterHeight + 12 ? node.scrollHeight : masterHeight;
      return await renderFrontFlyerToCanvas({
        categories,
        items,
        restaurant,
        paperTheme,
        zoomLevel,
        isSquare,
        masterWidth,
        masterHeight: actualFrontH,
        foodImages: FOOD_IMAGES
      });
    }

    const scalerNode = node.parentElement;
    const outerNode = scalerNode?.parentElement;
    const originalTransform = node.style.transform;
    const originalTransformOrigin = node.style.transformOrigin;
    const originalScalerTransform = scalerNode ? scalerNode.style.transform : '';
    const originalScalerMargin = scalerNode ? scalerNode.style.margin : '';
    const originalOuterScrollLeft = outerNode ? outerNode.scrollLeft : 0;

    if (scalerNode) {
      scalerNode.style.transform = 'none';
    }
    if (outerNode) {
      outerNode.scrollLeft = 0;
    }
    node.style.transform = 'none';
    node.style.transformOrigin = 'top right';

    // Let layout and paint settle completely across 2 frames after removing scale transform
    await new Promise<void>((res) =>
      requestAnimationFrame(() => requestAnimationFrame(() => res()))
    );

    const restoreImages = await inlineLoadedImages(node);

    try {
      const actualHeight = node.scrollHeight > masterHeight + 12 ? node.scrollHeight : masterHeight;
      // Keep canvas under 4096px on every axis for 100% sharp support on mobile iOS/Android & Desktop
      const maxDim = Math.max(masterWidth, actualHeight);
      const exportScale = Math.min(2.5, 4050 / maxDim);
      const targetWidth = Math.round(masterWidth * exportScale);
      const targetHeight = Math.round(actualHeight * exportScale);

      const filterFn = (domNode: HTMLElement) => {
        if (domNode instanceof HTMLElement && domNode.classList?.contains('canvas-ignore')) {
          return false;
        }
        return true;
      };

      const safeFallbackPixel =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

      const rootResetStyle: Partial<CSSStyleDeclaration> = {
        transform: 'none',
        transformOrigin: 'top right',
        margin: '0',
        left: '0',
        top: '0',
        right: 'auto',
        bottom: 'auto'
      };

      // Tier 1: Native High-DPI SVG with compact Arabic Cairo font CSS (~90KB)
      try {
        const compactFontCss = await getCompactCairoFontCss();
        const svgWithFonts = await toSvg(node, {
          width: masterWidth,
          height: actualHeight,
          backgroundColor: exportBgColor,
          filter: filterFn,
          imagePlaceholder: safeFallbackPixel,
          fontEmbedCSS: compactFontCss,
          skipFonts: !compactFontCss,
          style: rootResetStyle
        });
        return await renderSvgToHighDpiCanvas(
          svgWithFonts,
          masterWidth,
          actualHeight,
          targetWidth,
          targetHeight,
          exportBgColor
        );
      } catch (err1) {
        console.warn('Tier 1 (SVG+compactFonts) failed, retrying Tier 2 (SVG skipFonts):', err1);
      }

      // Tier 2: Native High-DPI SVG without font CSS embedding
      try {
        const svgNoFonts = await toSvg(node, {
          width: masterWidth,
          height: actualHeight,
          skipFonts: true,
          backgroundColor: exportBgColor,
          filter: filterFn,
          imagePlaceholder: safeFallbackPixel,
          style: rootResetStyle
        });
        return await renderSvgToHighDpiCanvas(
          svgNoFonts,
          masterWidth,
          actualHeight,
          targetWidth,
          targetHeight,
          exportBgColor
        );
      } catch (err2) {
        console.warn('Tier 2 (SVG skipFonts) failed, retrying Tier 3 (toCanvas):', err2);
      }

      // Tier 3: Direct html-to-image toCanvas at high pixelRatio
      try {
        const c3 = await toCanvas(node, {
          width: masterWidth,
          height: actualHeight,
          pixelRatio: exportScale,
          skipFonts: true,
          skipAutoScale: true,
          backgroundColor: exportBgColor,
          filter: filterFn,
          imagePlaceholder: safeFallbackPixel,
          style: rootResetStyle
        });
        assertCanvasHasContent(c3, exportBgColor);
        return c3;
      } catch (err3) {
        console.warn('Tier 3 (toCanvas) failed, retrying Tier 4 (html2canvas):', err3);
      }

      // Tier 4: html2canvas fallback with full balanced-paren Tailwind v4 color normalization
      return await html2canvas(node, {
        scale: exportScale,
        width: masterWidth,
        height: actualHeight,
        windowWidth: masterWidth + 80,
        windowHeight: actualHeight + 80,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: exportBgColor,
        useCORS: true,
        logging: false,
        ignoreElements: (el) => el.classList?.contains('canvas-ignore'),
        onclone: (clonedDoc, clonedNode) => {
          const clonedScaler = clonedNode.parentElement;
          if (clonedScaler) {
            clonedScaler.style.transform = 'none';
            clonedScaler.style.margin = '0';
          }
          clonedNode.style.transform = 'none';
          clonedNode.style.margin = '0';

          const probeCanvas = clonedDoc.createElement('canvas');
          const probeCtx = probeCanvas.getContext('2d');
          const normalizeColor = (expr: string, fallback = '#0ea5e9'): string => {
            if (!probeCtx) return fallback;
            probeCtx.fillStyle = fallback;
            probeCtx.fillStyle = expr;
            return probeCtx.fillStyle || fallback;
          };

          const replaceBalancedFn = (input: string, fnName: string, resolver: (expr: string) => string): string => {
            let out = '';
            let idx = 0;
            const lower = input.toLowerCase();
            const needle = `${fnName.toLowerCase()}(`;
            while (idx < input.length) {
              const found = lower.indexOf(needle, idx);
              if (found === -1) {
                out += input.slice(idx);
                break;
              }
              out += input.slice(idx, found);
              let depth = 0;
              let end = found;
              for (; end < input.length; end++) {
                const ch = input[end];
                if (ch === '(') depth++;
                else if (ch === ')') {
                  depth--;
                  if (depth === 0) {
                    end++;
                    break;
                  }
                }
              }
              const expr = input.slice(found, end);
              out += resolver(expr);
              idx = end;
            }
            return out;
          };

          const sanitizeCss = (css: string): string => {
            let next = replaceBalancedFn(css, 'oklch', (m) => normalizeColor(m, '#0ea5e9'));
            next = replaceBalancedFn(next, 'oklab', (m) => normalizeColor(m, '#0ea5e9'));
            next = replaceBalancedFn(next, 'color-mix', (m) => normalizeColor(m, 'rgba(14, 165, 233, 0.35)'));
            return next;
          };

          for (const st of Array.from(clonedDoc.querySelectorAll('style'))) {
            if (st.textContent && /oklch|oklab|color-mix/i.test(st.textContent)) {
              st.textContent = sanitizeCss(st.textContent);
            }
          }

          for (const el of Array.from(clonedDoc.querySelectorAll('[style]'))) {
            const rawAttr = el.getAttribute('style');
            if (rawAttr && /oklch|oklab|color-mix/i.test(rawAttr)) {
              el.setAttribute('style', sanitizeCss(rawAttr));
            }
          }

          for (const sheet of Array.from(clonedDoc.styleSheets)) {
            try {
              const owner = sheet.ownerNode;
              if (owner instanceof HTMLLinkElement && sheet.cssRules) {
                const rawCss = Array.from(sheet.cssRules).map((r) => r.cssText).join('\n');
                if (/oklch|oklab|color-mix/i.test(rawCss)) {
                  const sanitizedStyle = clonedDoc.createElement('style');
                  sanitizedStyle.textContent = sanitizeCss(rawCss);
                  owner.replaceWith(sanitizedStyle);
                }
              }
            } catch {
              // Skip cross-origin font stylesheets
            }
          }
        }
      });
    } finally {
      restoreImages();
      if (outerNode) {
        outerNode.scrollLeft = originalOuterScrollLeft;
      }
      if (scalerNode) {
        scalerNode.style.transform = originalScalerTransform;
        scalerNode.style.margin = originalScalerMargin;
      }
      node.style.transform = originalTransform;
      node.style.transformOrigin = originalTransformOrigin;
    }
  };

  const captureNodeDataUrl = async (node: HTMLDivElement): Promise<string> => {
    const canvas = await captureNodeCanvas(node);
    return canvas.toDataURL('image/png', 1.0);
  };

  const addImagePageToPdf = async (pdf: jsPDF, dataUrl: string, isFirstPage: boolean) => {
    if (!isFirstPage) {
      pdf.addPage();
    }

    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('فشل تحميل بيانات الصورة داخل مستند الـ PDF'));
    });

    if (isSquare) {
      const margin = 3;
      const availSize = 210 - margin * 2;
      let renderWidth = availSize;
      let renderHeight = (img.height * renderWidth) / img.width;
      if (renderHeight > availSize) {
        renderHeight = availSize;
        renderWidth = (img.width * renderHeight) / img.height;
      }
      const posX = margin + (availSize - renderWidth) / 2;
      const posY = margin + (availSize - renderHeight) / 2;
      pdf.addImage(dataUrl, 'PNG', posX, posY, renderWidth, renderHeight);
    } else {
      const pageWidth = 297;
      const pageHeight = 210;
      const margin = 3.5;
      const availWidth = pageWidth - margin * 2;
      const availHeight = pageHeight - margin * 2;

      let renderWidth = availWidth;
      let renderHeight = (img.height * renderWidth) / img.width;

      if (renderHeight > availHeight) {
        renderHeight = availHeight;
        renderWidth = (img.width * renderHeight) / img.height;
      }

      const posX = margin + (availWidth - renderWidth) / 2;
      const posY = margin + (availHeight - renderHeight) / 2;
      pdf.addImage(dataUrl, 'PNG', posX, posY, renderWidth, renderHeight);
    }
  };

  // Direct PDF Download (2 Pages: Front + Back when both visible, or active side)
  const handleDownloadPdf = async () => {
    const frontNode = frontRef.current;
    const backNode = backRef.current;
    if ((!frontNode && !backNode) || isExporting) return;

    setIsExporting(true);
    setExportType('pdf');
    setExportStatus(
      frontNode && backNode
        ? 'جارٍ توليد ملف PDF وش وظهر (صفحتين) فائق الوضوح للمطبعة...'
        : 'جارٍ توليد ملف PDF فائق الوضوح للطباعة...'
    );

    try {
      const pdf = new jsPDF({
        orientation: isSquare ? 'portrait' : 'landscape',
        unit: 'mm',
        format: isSquare ? [210, 210] : 'a4'
      });

      let pageAdded = false;

      if (frontNode) {
        const frontDataUrl = await captureNodeDataUrl(frontNode);
        await addImagePageToPdf(pdf, frontDataUrl, true);
        pageAdded = true;
      }

      if (backNode) {
        const backDataUrl = await captureNodeDataUrl(backNode);
        await addImagePageToPdf(pdf, backDataUrl, !pageAdded);
      }

      const fileName =
        frontNode && backNode
          ? 'منيو_بيتزا_سلسبيل_وش_وظهر.pdf'
          : frontNode
          ? 'منيو_بيتزا_سلسبيل_الوش.pdf'
          : 'منيو_بيتزا_سلسبيل_الظهر.pdf';

      pdf.save(fileName);
      setExportStatus('✅ تم تحميل ملف PDF وش وظهر بنجاح بأعلى جودة للطباعة!');
      setTimeout(() => setExportStatus(''), 5000);
    } catch (err: unknown) {
      const msg = formatExportError(err);
      console.error('PDF export failed:', err);
      setExportStatus(`تعذر إنشاء PDF (${msg}). يمكنك حفظ الصور أو استخدام الطباعة المباشرة.`);
      setTimeout(() => setExportStatus(''), 7000);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Download Front or Back High-Res Lossless PNG via Blob ObjectURL
  const handleDownloadSidePng = async (side: 'front' | 'back') => {
    const targetNode = side === 'front' ? frontRef.current : backRef.current;
    if (!targetNode || isExporting) return;

    setIsExporting(true);
    setExportType(side === 'front' ? 'png-front' : 'png-back');
    setExportStatus(
      side === 'front'
        ? 'جارٍ تجهيز وحفظ صورة الوش بأعلى دقة ممكنة للمطبعة...'
        : 'جارٍ تجهيز وحفظ صورة الظهر بأعلى دقة ممكنة للمطبعة...'
    );

    try {
      const canvas = await captureNodeCanvas(targetNode);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png', 1.0)
      );

      const fileName =
        side === 'front'
          ? 'منيو_بيتزا_سلسبيل_الوش_فائق_الوضوح.png'
          : 'منيو_بيتزا_سلسبيل_الظهر_فائق_الوضوح.png';

      const link = document.createElement('a');
      link.download = fileName;

      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      } else {
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setExportStatus(
        side === 'front'
          ? `✅ تم تنزيل صورة الوش بدقة (${canvas.width} × ${canvas.height} بكسل) بنجاح!`
          : `✅ تم تنزيل صورة الظهر بدقة (${canvas.width} × ${canvas.height} بكسل) بنجاح!`
      );
      setTimeout(() => setExportStatus(''), 6000);
    } catch (err: unknown) {
      const msg = formatExportError(err);
      console.error('PNG export failed:', err);
      setExportStatus(`حدثت مشكلة أثناء تنزيل الصورة (${msg}).`);
      setTimeout(() => setExportStatus(''), 7000);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Preview Front or Back Image
  const handlePreviewSide = async (side: 'front' | 'back') => {
    const targetNode = side === 'front' ? frontRef.current : backRef.current;
    if (!targetNode || isExporting) return;

    setIsExporting(true);
    setExportType('preview');
    setExportStatus(
      side === 'front'
        ? 'جارٍ تجهيز معاينة الوش بدقة المطبعة...'
        : 'جارٍ تجهيز معاينة الظهر بدقة المطبعة...'
    );

    try {
      const dataUrl = await captureNodeDataUrl(targetNode);
      setPreviewLabel(side === 'front' ? 'الوجه الأول (الوش)' : 'الوجه الثاني (الظهر)');
      setPreviewImage(dataUrl);
      setExportStatus('');
    } catch (err: unknown) {
      const msg = formatExportError(err);
      console.error('Preview failed:', err);
      setExportStatus(`تعذر تجهيز المعاينة (${msg}).`);
      setTimeout(() => setExportStatus(''), 5000);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Standalone 2-Page Vector Print (Front Page 1 + Back Page 2)
  const handleStandalonePrint = () => {
    const frontNode = frontRef.current;
    const backNode = backRef.current;
    if (!frontNode && !backNode) return;

    try {
      let pagesHtml = '';
      if (frontNode) {
        const cloneF = frontNode.cloneNode(true) as HTMLElement;
        cloneF.style.transform = 'none';
        cloneF.style.margin = '0 auto';
        pagesHtml += `<div class="print-page">${cloneF.outerHTML}</div>`;
      }
      if (backNode) {
        const cloneB = backNode.cloneNode(true) as HTMLElement;
        cloneB.style.transform = 'none';
        cloneB.style.margin = '0 auto';
        pagesHtml += `<div class="print-page">${cloneB.outerHTML}</div>`;
      }

      const printWindow = window.open('', '_blank', 'width=1400,height=1100');
      if (!printWindow) {
        window.print();
        return;
      }

      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>طباعة منيو بيتزا سلسبيل - وش وظهر</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 4mm;
              background: #fff;
              font-family: 'Cairo', sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: ${isSquare ? '210mm 210mm' : 'A4 landscape'};
              margin: 4mm;
            }
            .print-page {
              page-break-after: always;
              break-after: page;
              margin-bottom: 12mm;
            }
            .print-page:last-child {
              page-break-after: auto;
              break-after: auto;
              margin-bottom: 0;
            }
            .printable-flyer-page {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 auto !important;
              box-shadow: none !important;
              transform: none !important;
            }
          </style>
        </head>
        <body>
          ${pagesHtml}
          <script>
            document.fonts.ready.then(() => {
              setTimeout(() => {
                window.print();
              }, 450);
            });
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      console.warn('Popup print fallback:', e);
      window.print();
    }
  };

  // Categories for Front & Back
  const pizzaCategory = categories.find((c) => c.id === 'pizza');
  const sidesCategory = categories.find((c) => c.id === 'sides');
  const savoryPiesCategory = categories.find((c) => c.id === 'savory-pies');
  const sweetPiesCategory = categories.find((c) => c.id === 'sweet-pies');
  const pastaCategory = categories.find((c) => c.id === 'pasta');
  const sandwichesCategory = categories.find((c) => c.id === 'sandwiches');
  const crepesCategory = categories.find((c) => c.id === 'crepes');
  const sweetCrepesCategory = categories.find((c) => c.id === 'sweet-crepes');

  // New Categories for Back Side (الظهر)
  const hawawshiCategory = categories.find((c) => c.id === 'hawawshi');
  const calzoneCategory = categories.find((c) => c.id === 'calzone');
  const juicesCategory = categories.find((c) => c.id === 'juices');

  const getCatItems = (catId?: string) => {
    if (!catId) return [];
    return items.filter((i) => i.categoryId === catId);
  };

  const getCategoryBadgeImg = (catId: string) => {
    switch (catId) {
      case 'pizza':
        return FOOD_IMAGES.pizza;
      case 'savory-pies':
        return FOOD_IMAGES.feteer;
      case 'sweet-pies':
        return FOOD_IMAGES.sweetFeteer;
      case 'crepes':
        return FOOD_IMAGES.crepeCloseUp;
      case 'pasta':
        return FOOD_IMAGES.pasta;
      case 'sandwiches':
        return FOOD_IMAGES.syrian;
      default:
        return null;
    }
  };

  const renderSection = (category?: MenuCategory, opts?: { subtitleBadge?: string; spaciousBack?: boolean; compactBack?: boolean }) => {
    if (!category) return null;
    const catItems = getCatItems(category.id);
    if (catItems.length === 0) return null;

    const isHuge = zoomLevel === 'huge';
    const isNormal = zoomLevel === 'normal';
    const isBackSpacious = Boolean(opts?.spaciousBack);
    const isBackCompact = Boolean(opts?.compactBack);

    const isMajorCategory = [
      'pizza',
      'savory-pies',
      'sweet-pies',
      'pasta',
      'crepes',
      'sweet-crepes',
      'hawawshi',
      'calzone',
      'juices'
    ].includes(category.id);

    const itemFontClass = isBackCompact
      ? 'text-[13px] sm:text-[14px] font-black leading-tight'
      : isBackSpacious
      ? 'text-[17px] sm:text-[18px] font-black leading-tight'
      : !isSquare
      ? isHuge
        ? 'text-[14.5px] sm:text-[15px] font-black leading-tight'
        : isNormal
        ? 'text-[13px] sm:text-[13.5px] font-black leading-tight'
        : 'text-[13.5px] sm:text-[14.5px] font-black leading-tight'
      : isHuge
      ? isMajorCategory
        ? 'text-[16.5px] sm:text-[17.5px] font-black leading-tight'
        : 'text-[15.5px] sm:text-[16.5px] font-black leading-tight'
      : isNormal
      ? isMajorCategory
        ? 'text-[14.5px] sm:text-[15.5px] font-black leading-tight'
        : 'text-[14px] sm:text-[14.5px] font-black leading-tight'
      : isMajorCategory
      ? 'text-[15.5px] sm:text-[16.5px] font-black leading-tight'
      : 'text-[14.5px] sm:text-[15.5px] font-black leading-tight';

    const isHawawshi = category.id === 'hawawshi';

    const priceFontClass = isBackCompact
      ? 'w-[38px] text-[14px]'
      : isBackSpacious
      ? 'w-[48px] text-[17.5px]'
      : isHawawshi
      ? !isSquare
        ? 'w-[48px] text-[16.5px]'
        : 'w-[52px] sm:w-[56px] text-[18.5px] sm:text-[20px]'
      : !isSquare
      ? isHuge
        ? 'w-[40px] text-[15px]'
        : isNormal
        ? 'w-[36px] text-[13.5px]'
        : 'w-[38px] text-[14.5px]'
      : isHuge
      ? 'w-[42px] sm:w-[44px] text-[17.5px] sm:text-[18.5px]'
      : isNormal
      ? 'w-[37px] sm:w-[39px] text-[15px] sm:text-[16px]'
      : 'w-[40px] sm:w-[42px] text-[16.5px] sm:text-[17.5px]';

    const sizeHeaderClass = isHawawshi
      ? !isSquare
        ? 'w-[48px] text-[14.5px]'
        : 'w-[52px] sm:w-[56px] text-[15.5px] sm:text-[16.5px]'
      : !isSquare
      ? isHuge
        ? 'w-[40px] text-[14px]'
        : isNormal
        ? 'w-[36px] text-[12.5px]'
        : 'w-[38px] text-[13.5px]'
      : isHuge
      ? 'w-[42px] sm:w-[44px] text-[15.5px] sm:text-[16.5px]'
      : isNormal
      ? 'w-[37px] sm:w-[39px] text-[14px] sm:text-[15px]'
      : 'w-[40px] sm:w-[42px] text-[15px] sm:text-[16px]';

    const hasMultipleSizes = category.sizeLabels && category.sizeLabels.length > 1;

    const isSkyBlue = paperTheme === 'sky-blue';
    const isIceBlue = paperTheme === 'ice-blue';
    const isCleanWhite = paperTheme === 'clean-white';
    const isCalmCream = paperTheme === 'calm-cream';
    const isRadialBurgundy = paperTheme === 'radial-burgundy';

    const cardOuterClass = isSkyBlue
      ? 'bg-[#09223d] border-2 border-sky-400/80 shadow-xl shadow-sky-950/60'
      : isIceBlue
      ? 'bg-[#e0f2fe] border-2 border-sky-400 shadow-md'
      : isCleanWhite
      ? 'bg-white border-2 border-red-700/80 shadow-md'
      : isCalmCream
      ? 'bg-[#fffaf0] border-2 border-[#cbaf8b]'
      : 'bg-[#180202] border-2 border-amber-500/70 shadow-md';

    const categoryHeaderClass = isSkyBlue
      ? 'bg-gradient-to-r from-[#03446a] via-[#0284c7] to-[#03446a] border-sky-400/50'
      : isIceBlue
      ? 'bg-gradient-to-r from-[#012f52] via-[#025b96] to-[#012f52] border-b-2 border-amber-400 shadow-md'
      : isCleanWhite
      ? 'bg-gradient-to-r from-[#981414] via-[#c61b1b] to-[#981414] border-red-900/40'
      : isCalmCream
      ? 'bg-gradient-to-r from-[#8b4513] to-[#a0522d]'
      : 'bg-gradient-to-r from-[#981414] via-[#c61b1b] to-[#981414] border-red-900/40';

    const cardBodyClass = isSkyBlue
      ? 'bg-gradient-to-b from-[#082038] via-[#0a2744] to-[#06192d]'
      : isIceBlue
      ? 'bg-[#f0f9ff]'
      : isCleanWhite
      ? 'bg-white'
      : isCalmCream
      ? 'bg-[#fffaf0]'
      : 'bg-[#120101]';

    const sizeHeaderRowClass = isSkyBlue
      ? 'border-sky-600/80 bg-[#041424] text-white font-black'
      : isIceBlue
      ? 'border-sky-400 bg-sky-200 text-black font-black shadow-xs'
      : isCleanWhite
      ? 'border-neutral-300 bg-neutral-100 text-black font-black'
      : isCalmCream
      ? 'border-amber-300 bg-amber-100 text-black font-black'
      : 'border-red-900 bg-red-950/90 text-amber-200 font-black';

    const sizeLabelTitleClass = isSkyBlue
      ? 'text-sky-200 text-[14.5px] sm:text-[15.5px]'
      : isIceBlue
      ? 'text-black font-black text-[14.5px] sm:text-[15.5px] tracking-wide'
      : isCleanWhite
      ? 'text-black font-black text-[14.5px] sm:text-[15.5px]'
      : 'text-amber-300 font-black text-[14.5px] sm:text-[15.5px]';

    const sizeColClass = isSkyBlue
      ? 'text-white font-black'
      : isIceBlue
      ? 'text-black font-black'
      : isCleanWhite
      ? 'text-black font-black'
      : 'text-amber-200 font-black';

    const itemNameColor = isSkyBlue
      ? 'text-white'
      : isIceBlue
      ? 'text-black'
      : isCleanWhite
      ? 'text-[#000000]'
      : isRadialBurgundy
      ? 'text-white'
      : 'text-[#2b1704]';

    const leaderLineClass = isSkyBlue
      ? 'border-sky-400/35'
      : isIceBlue
      ? 'border-sky-400/70'
      : isCleanWhite
      ? 'border-neutral-300'
      : 'border-red-800/40';

    const priceColor = isSkyBlue
      ? 'text-[#facc18]'
      : isIceBlue
      ? 'text-black'
      : isCleanWhite
      ? 'text-[#b91c1c]'
      : 'text-[#facc18]';

    const badgeImg = getCategoryBadgeImg(category.id);

    return (
      <div
        style={{ flexGrow: catItems.length }}
        className={`flex flex-col rounded-2xl shadow-lg overflow-hidden transition-all ${cardOuterClass}`}
      >
        {/* Category Header */}
        <div className={`text-white ${isSquare ? 'py-1' : 'py-0.5'} px-3 flex items-center justify-between border-b shadow-sm flyer-cat-title ${categoryHeaderClass}`}>
          <div className="flex items-center gap-2 text-center font-black mx-auto">
            <span className="text-amber-300 text-sm font-black select-none">★</span>
            {badgeImg && (
              <img
                src={badgeImg}
                alt={category.name}
                className="w-6 h-6 rounded-full object-cover border-2 border-amber-300 shadow-xs shrink-0 bg-slate-900"
              />
            )}
            <h3
              className={`tracking-wide font-black font-['Cairo'] text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] ${
                isBackCompact
                  ? 'text-[16px] sm:text-[17.5px]'
                  : isBackSpacious
                  ? 'text-[20px] sm:text-[22px]'
                  : isHawawshi
                  ? isSquare
                    ? 'text-[19.5px] sm:text-[21px]'
                    : 'text-[17.5px] sm:text-[18.5px]'
                  : !isSquare
                  ? 'text-[16px] sm:text-[17px]'
                  : isMajorCategory
                  ? 'text-[18.5px] sm:text-[19.5px]'
                  : 'text-[16.5px] sm:text-[17.5px]'
              }`}
            >
              {category.name}
            </h3>
            {opts?.subtitleBadge && (
              <span className="bg-amber-400 text-slate-950 text-[12px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                {opts.subtitleBadge}
              </span>
            )}
            <span className="text-amber-300 text-sm font-black select-none">★</span>
          </div>
        </div>

        {/* Card Body */}
        <div className={`${isSquare ? 'p-1 sm:p-1.5' : 'p-1'} flex-1 flex flex-col justify-between ${cardBodyClass}`}>
          {/* Size Header Row */}
          {hasMultipleSizes && category.sizeLabels && (
            <div className={`flex items-center justify-between py-1 px-1.5 border-b-2 mb-0.5 font-['Cairo'] font-black rounded ${sizeHeaderRowClass}`}>
              <span
                className={`text-right font-['Cairo'] font-black [text-shadow:0_0_0.55px_currentColor] ${
                  !isSquare ? '!text-[13.5px] sm:!text-[14px]' : ''
                } ${sizeLabelTitleClass}`}
              >
                الصنف
              </span>
              <div className="flex items-center gap-1 text-center shrink-0">
                {category.sizeLabels.map((lbl, idx) => {
                  const isWideLabel = lbl.trim().length > 5;
                  return (
                    <React.Fragment key={idx}>
                      {idx > 0 && category.id === 'crepes' && (
                        <span
                          className={`w-[2px] h-4 rounded-full mx-0.5 shrink-0 ${
                            isSkyBlue
                              ? 'bg-sky-400/70'
                              : isIceBlue
                              ? 'bg-sky-600/80'
                              : isCleanWhite
                              ? 'bg-neutral-400'
                              : 'bg-amber-400/70'
                          }`}
                        />
                      )}
                      <span
                        className={`text-center font-['Cairo'] font-black whitespace-nowrap [text-shadow:0_0_0.6px_currentColor] ${sizeColClass} ${sizeHeaderClass} ${
                          isWideLabel
                            ? isSquare
                              ? '!w-[72px] sm:!w-[78px]'
                              : '!w-[64px] sm:!w-[68px]'
                            : ''
                        }`}
                      >
                        {lbl}
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {(isBackSpacious || isBackCompact) && (
            <div className={`flex items-center justify-between py-1 px-1.5 border-b-2 mb-0.5 font-['Cairo'] font-black rounded ${sizeHeaderRowClass}`}>
              <span className={`text-right font-['Cairo'] font-black [text-shadow:0_0_0.55px_currentColor] ${sizeLabelTitleClass}`}>
                الصنف
              </span>
              <span className={`text-center font-['Cairo'] font-black text-[13.5px] px-1 [text-shadow:0_0_0.55px_currentColor] ${sizeColClass}`}>
                السعر
              </span>
            </div>
          )}

          {/* Item Rows */}
          <div className="flex-1 flex flex-col justify-evenly">
            {catItems.map((item) => {
              const isCombo = item.tags?.includes('combo');
              const nameLen = item.name.length;
              const isExtraLong = nameLen > 24;
              const isLong = nameLen > 18;

              const currentItemFontClass = isHawawshi
                ? isSquare
                  ? 'text-[17px] sm:text-[18.5px] font-black leading-tight [text-shadow:0_0_0.55px_currentColor]'
                  : 'text-[15px] sm:text-[16px] font-black leading-tight [text-shadow:0_0_0.5px_currentColor]'
                : (isBackSpacious || isBackCompact)
                ? itemFontClass
                : !isSquare
                ? isExtraLong
                  ? 'text-[11.5px] font-black leading-tight'
                  : isLong
                  ? 'text-[12.5px] font-black leading-tight'
                  : itemFontClass
                : isExtraLong
                ? isMajorCategory
                  ? 'text-[13px] sm:text-[13.5px] font-black leading-tight'
                  : 'text-[12.5px] sm:text-[13px] font-black leading-tight'
                : isLong
                ? isMajorCategory
                  ? 'text-[14px] sm:text-[15px] font-black leading-tight'
                  : 'text-[13.5px] sm:text-[14.5px] font-black leading-tight'
                : itemFontClass;

              const itemRowClass = isSkyBlue
                ? isCombo
                  ? 'bg-[#0e3459] border border-amber-400/80 shadow-2xs'
                  : 'hover:bg-sky-900/40'
                : isIceBlue
                ? isCombo
                  ? 'bg-amber-100 border border-amber-400'
                  : 'hover:bg-sky-100/60'
                : isCleanWhite
                ? isCombo
                  ? 'bg-amber-100/90 border border-amber-400/80 shadow-2xs'
                  : 'hover:bg-amber-50/80'
                : isCombo
                ? 'bg-amber-900/40 border border-amber-500'
                : 'hover:bg-red-950/40';

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-1 leading-tight ${
                    isSquare ? 'py-[1.5px] px-1' : 'py-[1px] px-1'
                  } rounded transition-colors flyer-item-row group ${itemRowClass}`}
                >
                  <div className="flex-1 min-w-0 flex items-center gap-1 overflow-visible">
                    {isEditMode && (
                      <button
                        onClick={() => onEditItem(item)}
                        className="text-amber-500 hover:text-amber-600 p-0.5 cursor-pointer shrink-0"
                        title="تعديل الصنف"
                      >
                        <Edit3 size={11} />
                      </button>
                    )}

                    <span
                      className={`font-black font-['Cairo'] ${itemNameColor} ${currentItemFontClass}`}
                      title={item.name}
                    >
                      {item.name}
                    </span>

                    {isCombo && (
                      <span className="text-[10px] shrink-0 leading-none" title="ميكس نص ونص">
                        🔥
                      </span>
                    )}

                    <span className={`flex-1 min-w-[4px] border-b-2 border-dotted mx-0.5 ${leaderLineClass}`}></span>

                    {item.tags?.includes('popular') && !isCombo && (
                      <span className="text-[10px] text-amber-500 font-black shrink-0">★</span>
                    )}
                    {item.tags?.includes('spicy') && <span className="text-[10px] shrink-0">🌶️</span>}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 font-mono">
                    {category.sizeLabels && category.sizeLabels.length > 1 ? (
                      category.sizeLabels.map((sizeLabel, sIdx) => {
                        const isWideLabel = sizeLabel.trim().length > 5;
                        const wideColOverride = isWideLabel
                          ? isSquare
                            ? '!w-[72px] sm:!w-[78px]'
                            : '!w-[64px] sm:!w-[68px]'
                          : '';
                        const colDivider =
                          sIdx > 0 && category.id === 'crepes' ? (
                            <span
                              className={`w-[1.5px] h-4 rounded-full mx-0.5 shrink-0 ${
                                isSkyBlue
                                  ? 'bg-sky-400/60'
                                  : isIceBlue
                                  ? 'bg-sky-500/80'
                                  : isCleanWhite
                                  ? 'bg-neutral-300'
                                  : 'bg-amber-400/60'
                              }`}
                            />
                          ) : null;
                        const priceObj = item.prices.find((pr) => pr.label.trim() === sizeLabel.trim());
                        const priceIndex = priceObj ? item.prices.indexOf(priceObj) : -1;

                        if (!priceObj) {
                          return (
                            <React.Fragment key={sIdx}>
                              {colDivider}
                              <div
                                className={`text-center font-black font-mono select-none ${priceFontClass} ${wideColOverride} ${priceColor} opacity-30`}
                                title={`غير متاح لحجم ${sizeLabel}`}
                              >
                                -
                              </div>
                            </React.Fragment>
                          );
                        }

                        return (
                          <React.Fragment key={sIdx}>
                            {colDivider}
                            <div
                              className={`text-center font-black font-mono transition-transform ${priceFontClass} ${wideColOverride} ${priceColor} font-black tracking-tighter ${
                                isHawawshi ? '[text-shadow:0_0_0.6px_currentColor]' : '[text-shadow:0_0_0.4px_currentColor]'
                              } ${
                                isEditMode
                                  ? isSkyBlue
                                    ? 'hover:bg-sky-800/80 rounded px-0.5 ring-1 ring-amber-400 cursor-pointer'
                                    : 'hover:bg-amber-100 rounded px-0.5 ring-1 ring-amber-400 cursor-pointer'
                                  : ''
                              }`}
                              title={isEditMode ? 'اضغط لتعديل السعر' : `${priceObj.label}: ${priceObj.price} ج.م`}
                              onClick={() => {
                                if (isEditMode && priceIndex >= 0) {
                                  const newVal = prompt(
                                    `أدخل السعر الجديد لـ ${item.name} (${priceObj.label}):`,
                                    priceObj.price.toString()
                                  );
                                  if (newVal !== null) {
                                    const parsed = parseFloat(newVal);
                                    if (!isNaN(parsed)) onUpdatePrice(item.id, priceIndex, parsed);
                                  }
                                }
                              }}
                            >
                              <span className="font-black">{priceObj.price}</span>
                            </div>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      item.prices.map((p, idx) => (
                        <div
                          key={idx}
                          className={`text-center font-black font-mono transition-transform ${priceFontClass} ${priceColor} font-black tracking-tighter ${
                            isBackSpacious || isBackCompact
                              ? isSkyBlue
                                ? 'bg-sky-900/60 border border-sky-400/50 rounded-md py-0.5'
                                : isIceBlue
                                ? 'bg-white border border-sky-300 rounded-md py-0.5 shadow-2xs'
                                : 'bg-red-50 border border-red-200 rounded-md py-0.5'
                              : ''
                          } ${
                            isEditMode
                              ? isSkyBlue
                                ? 'hover:bg-sky-800/80 rounded px-0.5 ring-1 ring-amber-400 cursor-pointer'
                                : 'hover:bg-amber-100 rounded px-0.5 ring-1 ring-amber-400 cursor-pointer'
                              : ''
                          }`}
                          title={isEditMode ? 'اضغط لتعديل السعر' : `${item.name}: ${p.price} ج.م`}
                          onClick={() => {
                            if (isEditMode) {
                              const newVal = prompt(`أدخل السعر الجديد لـ ${item.name}:`, p.price.toString());
                              if (newVal !== null) {
                                const parsed = parseFloat(newVal);
                                if (!isNaN(parsed)) onUpdatePrice(item.id, idx, parsed);
                              }
                            }
                          }}
                        >
                          {item.categoryId === 'sides' && item.prices.length > 1 && (
                            <span
                              className={`text-[10px] font-bold ml-0.5 ${
                                isSkyBlue ? 'text-[#facc18]' : isIceBlue ? 'text-black font-black' : 'text-neutral-500'
                              }`}
                            >
                              {p.label === 'صغير' ? 'ص:' : p.label === 'وسط' ? 'و:' : 'ك:'}
                            </span>
                          )}
                          <span className="font-extrabold">{p.price}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const pageBackgroundStyle =
    paperTheme === 'sky-blue'
      ? 'radial-gradient(circle at 50% 10%, #38bdf8 0%, #0ea5e9 30%, #0284c7 65%, #03537e 100%)'
      : paperTheme === 'ice-blue'
      ? 'radial-gradient(circle at 50% 8%, #e0f2fe 0%, #bae6fd 30%, #7dd3fc 65%, #38bdf8 100%)'
      : paperTheme === 'clean-white'
      ? '#ffffff'
      : '#fbf7f0';

  const pageBorderClass =
    paperTheme === 'sky-blue'
      ? 'border-sky-300/90 text-white shadow-sky-950/40'
      : paperTheme === 'ice-blue'
      ? 'border-sky-400 text-slate-900 shadow-xl'
      : paperTheme === 'clean-white'
      ? 'bg-white text-slate-900 border-red-700 shadow-xl'
      : paperTheme === 'calm-cream'
      ? 'bg-[#fbf7f0] text-[#331c07] border-[#cbaf8b]'
      : 'text-white border-[#730909]';

  return (
    <div className="max-w-[1560px] mx-auto px-2 sm:px-4 py-4" ref={previewContainerRef}>
      {/* Top Toolbar (Hidden on Print) */}
      <div className="no-print mb-6 p-4 rounded-3xl bg-slate-900 border border-amber-500/30 flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex flex-wrap items-center gap-2">
                <span>المنيو الورقي الاحترافي (وش وظهر للطباعة)</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-400/40">
                  الوش: المنيو الأساسي • الظهر: الحواوشي والكالزوني والعصائر والهوية
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                شاهد الشكل النهائي للوجهين (وش وظهر) أمامك، مع إمكانية تنزيلهما معاً كملف PDF من صفحتين أو حفظ كل وجه كصورة للمطبعة
              </p>
            </div>
          </div>

          {/* Side View Selector (Both / Front / Back) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border-2 border-emerald-500/50 gap-1 shadow-md">
            <button
              onClick={() => setSideView('both')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer text-xs flex items-center gap-1.5 ${
                sideView === 'both'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📄🔄 عرض الوش والظهر معاً</span>
            </button>
            <button
              onClick={() => setSideView('front')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                sideView === 'front'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الوش فقط
            </button>
            <button
              onClick={() => setSideView('back')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                sideView === 'back'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الظهر فقط
            </button>
          </div>
        </div>

        {/* Customization & Export Controls */}
        <div className="flex items-center flex-wrap justify-center md:justify-between gap-2 text-xs pt-2 border-t border-slate-800">
          <div className="flex items-center flex-wrap justify-center gap-2">
            {/* Shape Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-amber-500/40 gap-1">
              <span className="text-[11px] text-amber-300 px-2 font-black">📐 المقاس:</span>
              <button
                onClick={() => setFlyerShape('square')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs flex items-center gap-1 ${
                  flyerShape === 'square'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Square size={12} />
                <span>مربع 1:1</span>
              </button>
              <button
                onClick={() => setFlyerShape('original')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs flex items-center gap-1 ${
                  flyerShape === 'original'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <RectangleHorizontal size={13} />
                <span>عريض A4</span>
              </button>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
              <span className="text-[11px] text-slate-400 px-2 font-bold flex items-center gap-1">
                <Palette size={12} className="text-amber-400" />
                <span>الخلفية:</span>
              </span>
              <button
                onClick={() => setPaperTheme('ice-blue')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                  paperTheme === 'ice-blue'
                    ? 'bg-gradient-to-r from-sky-300 to-blue-200 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ❄️ سماوي فاتح
              </button>
              <button
                onClick={() => setPaperTheme('sky-blue')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                  paperTheme === 'sky-blue'
                    ? 'bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🌊 أزرق ملكي
              </button>
              <button
                onClick={() => setPaperTheme('clean-white')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                  paperTheme === 'clean-white'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📄 ورق أبيض
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
              <button
                onClick={() => setZoomLevel('normal')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                  zoomLevel === 'normal' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                متوسط
              </button>
              <button
                onClick={() => setZoomLevel('large')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                  zoomLevel === 'large' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                كبير
              </button>
              <button
                onClick={() => setZoomLevel('huge')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                  zoomLevel === 'huge' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                ضخم 🔍
              </button>
            </div>

            {/* Screen Fit */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
              <button
                onClick={() => setScreenScale('fit')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs flex items-center gap-1 ${
                  screenScale === 'fit' ? 'bg-slate-700 text-white font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 size={12} />
                <span>ملاءمة</span>
              </button>
              <button
                onClick={() => setScreenScale('100')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs flex items-center gap-1 ${
                  screenScale === '100' ? 'bg-slate-700 text-white font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ZoomIn size={12} />
                <span>100%</span>
              </button>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center flex-wrap justify-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
            >
              {isExporting && exportType === 'pdf' ? (
                <Loader2 size={15} className="animate-spin text-white" />
              ) : (
                <FileDown size={15} />
              )}
              <span>
                {sideView === 'both' ? 'تحميل PDF وش وظهر (صفحتين) 📥' : 'تحميل PDF 📥'}
              </span>
            </button>

            <button
              onClick={handleStandalonePrint}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
            >
              <Printer size={15} />
              <span>طباعة فورية وش وظهر 🖨️</span>
            </button>

            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={14} className="text-amber-400" />
              <span>صفحة كاملة</span>
            </a>
          </div>
        </div>
      </div>

      {/* Export Status Banner */}
      {exportStatus && (
        <div className="no-print mb-4 p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/50 text-emerald-300 font-black text-xs sm:text-sm flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400 animate-spin" />
            <span>{exportStatus}</span>
          </div>
          <button onClick={() => setExportStatus('')} className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Modal: Fullscreen Image Preview */}
      {previewImage && (
        <div className="no-print fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={20} className="text-emerald-400" />
                <div>
                  <h3 className="font-black text-white text-sm sm:text-base">
                    معاينة {previewLabel} بدقة المطبعة (300+ DPI)
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewImage}
                  download={`منيو_بيتزا_سلسبيل_${previewLabel}.png`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <FileDown size={14} />
                  <span>تنزيل الصورة الآن 📥</span>
                </a>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center">
              <img
                src={previewImage}
                alt={`معاينة ${previewLabel}`}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SIDE 1: الوش (FRONT SIDE — الوجه الأول: المنيو الرئيسي 4 أعمدة)        */}
      {/* ===================================================================== */}
      {(sideView === 'both' || sideView === 'front') && (
        <div className="mb-10">
          {/* Front Side Bar */}
          <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-sky-500/40 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="bg-sky-500 text-slate-950 text-xs font-black px-3 py-1 rounded-xl">
                الوجه الأول (الوش)
              </span>
              <span className="text-sm font-black text-white">
                المنيو الأساسي (بيتزا إيطالي • فطاير حادق وحلو • مكرونات • سندوتشات • كريب وكونو وكريب حلو • إضافات)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePreviewSide('front')}
                disabled={isExporting}
                className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Eye size={13} />
                <span>معاينة الوش</span>
              </button>
              <button
                onClick={() => handleDownloadSidePng('front')}
                disabled={isExporting}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                {isExporting && exportType === 'png-front' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <ImageIcon size={13} />
                )}
                <span>حفظ صورة الوش 🖼️</span>
              </button>
            </div>
          </div>

          <div
            className="w-full overflow-x-auto pb-2 custom-scrollbar print-flyer-outer"
            style={{
              minHeight: screenScale === 'fit' && fitScaleRatio < 1 ? `${Math.round(masterHeight * fitScaleRatio)}px` : 'auto'
            }}
          >
            <div
              className="print-flyer-scaler"
              style={{
                transform: screenScale === 'fit' && fitScaleRatio < 1 ? `scale(${fitScaleRatio})` : 'none',
                transformOrigin: 'top right',
                width: `${masterWidth}px`,
                minWidth: `${masterWidth}px`,
                maxWidth: `${masterWidth}px`,
                margin: screenScale === 'fit' && fitScaleRatio < 1 ? '0' : '0 auto'
              }}
            >
              <div
                ref={frontRef}
                id="printable-flyer-front"
                className={`printable-flyer-page rounded-3xl p-3 sm:p-4 shadow-2xl transition-colors duration-300 relative border-4 ${pageBorderClass}`}
                style={{
                  width: `${masterWidth}px`,
                  minWidth: `${masterWidth}px`,
                  maxWidth: `${masterWidth}px`,
                  height: `${masterHeight}px`,
                  minHeight: `${masterHeight}px`,
                  background: pageBackgroundStyle,
                  printColorAdjust: 'exact',
                  WebkitPrintColorAdjust: 'exact',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden'
                }}
              >
                {/* Ambient Background Pattern */}
                <div
                  className="absolute inset-0 pointer-events-none select-none z-0 opacity-25"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(2, 132, 199, 0.45) 1.2px, transparent 1.2px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* Front 4 Columns — Full Height Balanced Alignment */}
                <div className="relative z-10 grid grid-cols-4 gap-2.5 items-stretch flex-1">
                  {/* Column 1 (Far Right): بيتزا إيطالي + السلطات والإضافات */}
                  <div className="flex flex-col gap-2">
                    {renderSection(pizzaCategory)}
                    {renderSection(sidesCategory)}
                  </div>

                  {/* Column 2: فطاير حادق + فطاير حلو */}
                  <div className="flex flex-col gap-2">
                    {renderSection(savoryPiesCategory)}
                    {renderSection(sweetPiesCategory)}
                  </div>

                  {/* Column 3: مكرونات + سندوتشات */}
                  <div className="flex flex-col gap-2">
                    {renderSection(pastaCategory)}
                    {renderSection(sandwichesCategory)}
                  </div>

                  {/* Column 4 (Far Left): كريب حادق + كريب حلو */}
                  <div className="flex flex-col gap-2">
                    {renderSection(crepesCategory)}
                    {renderSection(sweetCrepesCategory)}
                  </div>
                </div>

                {/* Front Clean Minimal Footer */}
                <div
                  className={`relative z-10 mt-2 pt-2 border-t-2 flex items-center justify-between text-xs font-black ${
                    paperTheme === 'ice-blue'
                      ? 'border-sky-400 text-slate-950'
                      : paperTheme === 'sky-blue'
                      ? 'border-sky-300/70 text-sky-100'
                      : 'border-red-700/50 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 text-sm">★</span>
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-black text-sm">بيتزا</span>
                      <SalsabeelWordmark variant="red-white" idPrefix="front-ftr" className="h-9 w-auto -my-1" />
                    </div>
                    <span>•</span>
                    <span>{restaurant.tagline}</span>
                  </div>
                  <div className="bg-[#012b4a] text-amber-300 px-3.5 py-1 rounded-full text-xs font-black border border-amber-400/70 shadow-xs">
                    🔄 اقلب الصفحة لمشاهدة قسم الحواوشي الإيطالي والكالزوني الإيطالي وأرقام التليفونات والواتساب والموقع
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SIDE 2: الظهر (BACK SIDE — الاسم الكبير + التليفون + الواتساب + الموقع + الحواوشي والكالزوني) */}
      {/* ===================================================================== */}
      {(sideView === 'both' || sideView === 'back') && (
        <div className="mb-8">
          {/* Back Side Bar */}
          <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-amber-500/50 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-xl">
                الوجه الثاني (الظهر)
              </span>
              <span className="text-sm font-black text-white">
                الحواوشي الإيطالي (ساده وموتزاريلا) والكالزوني الإيطالي جنب بعض + قسم العصائر والآيس كريم بعمودين + الهوية والأرقام
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePreviewSide('back')}
                disabled={isExporting}
                className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Eye size={13} />
                <span>معاينة الظهر</span>
              </button>
              <button
                onClick={() => handleDownloadSidePng('back')}
                disabled={isExporting}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                {isExporting && exportType === 'png-back' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <ImageIcon size={13} />
                )}
                <span>حفظ صورة الظهر 🖼️</span>
              </button>
            </div>
          </div>

          <div
            className="w-full overflow-x-auto pb-2 custom-scrollbar print-flyer-outer"
            style={{
              minHeight: screenScale === 'fit' && fitScaleRatio < 1 ? `${Math.round(masterHeight * fitScaleRatio)}px` : 'auto'
            }}
          >
            <div
              className="print-flyer-scaler"
              style={{
                transform: screenScale === 'fit' && fitScaleRatio < 1 ? `scale(${fitScaleRatio})` : 'none',
                transformOrigin: 'top right',
                width: `${masterWidth}px`,
                minWidth: `${masterWidth}px`,
                maxWidth: `${masterWidth}px`,
                margin: screenScale === 'fit' && fitScaleRatio < 1 ? '0' : '0 auto'
              }}
            >
              <div
                ref={backRef}
                id="printable-flyer-back"
                className={`printable-flyer-page rounded-3xl p-4 sm:p-5 shadow-2xl transition-colors duration-300 relative border-4 ${pageBorderClass}`}
                style={{
                  width: `${masterWidth}px`,
                  minWidth: `${masterWidth}px`,
                  maxWidth: `${masterWidth}px`,
                  height: `${masterHeight}px`,
                  minHeight: `${masterHeight}px`,
                  background: pageBackgroundStyle,
                  printColorAdjust: 'exact',
                  WebkitPrintColorAdjust: 'exact',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden'
                }}
              >
                {/* Ambient Background Pattern */}
                <div
                  className="absolute inset-0 pointer-events-none select-none z-0 opacity-25"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(2, 132, 199, 0.45) 1.2px, transparent 1.2px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* BACK SIDE SPLIT INTO 2 BALANCED HALVES MATCHING REFERENCE COMPOSITIONS */}
                <div className="relative z-10 grid grid-cols-2 gap-4 items-stretch flex-1">
                  
                  {/* =============================================================== */}
                  {/* HALF 1 (RIGHT HALF IN RTL): Menu Side — Hawawshi + Calzone Side-by-Side + 2-Col Juices */}
                  {/* =============================================================== */}
                  <div className="flex flex-col justify-between gap-3">
                    
                    {/* Top Block: حواوشي & كالزوني الاتنين جنب بعض بنفس مقاس الخط والحجم في الوش */}
                    <div className="grid grid-cols-2 gap-2.5 items-stretch">
                      <div className="flex flex-col [&>div]:mb-0 [&>div]:h-full">
                        {renderSection(hawawshiCategory)}
                      </div>
                      <div className="flex flex-col [&>div]:mb-0 [&>div]:h-full">
                        {renderSection(calzoneCategory)}
                      </div>
                    </div>

                    {/* Bottom Block: ★ عصائر و آيس كريم ★ in 2 Side-by-Side Columns with Clean White Price Strips */}
                    {juicesCategory && (() => {
                      const allJuiceItems = getCatItems('juices');
                      const splitIdx = Math.ceil(allJuiceItems.length / 2);
                      const rightJuiceCol = allJuiceItems.slice(0, splitIdx);
                      const leftJuiceCol = allJuiceItems.slice(splitIdx);

                      const renderJuiceColumn = (colItems: MenuItem[]) => (
                        <div className="flex flex-col justify-between space-y-1">
                          {colItems.map((jItem) => {
                            const priceObj = jItem.prices[0] || { label: 'السعر', price: 0 };
                            const secondPriceObj = jItem.prices[1];
                            const hasRange =
                              Boolean(secondPriceObj) &&
                              priceObj.price > 0 &&
                              secondPriceObj.price > 0 &&
                              secondPriceObj.price !== priceObj.price;
                            const hasPrice = priceObj.price > 0;
                            return (
                              <div
                                key={jItem.id}
                                className="flex items-center justify-between gap-1.5 group"
                              >
                                <div className="flex-1 min-w-0 flex items-center gap-1">
                                  {isEditMode && (
                                    <button
                                      onClick={() => onEditItem(jItem)}
                                      className="text-amber-400 hover:text-amber-300 p-0.5 cursor-pointer shrink-0"
                                      title="تعديل الصنف"
                                    >
                                      <Edit3 size={11} />
                                    </button>
                                  )}
                                  <span
                                    className={`font-black font-['Cairo'] text-[13px] sm:text-[14px] leading-tight whitespace-nowrap tracking-tight ${
                                      paperTheme === 'clean-white' ? 'text-slate-950' : 'text-white'
                                    }`}
                                    title={jItem.name}
                                  >
                                    {jItem.name}
                                  </span>
                                  <span
                                    className={`flex-1 min-w-[4px] border-b border-dotted mx-0.5 ${
                                      paperTheme === 'clean-white' ? 'border-slate-300' : 'border-sky-300/35'
                                    }`}
                                  />
                                </div>
                                <div
                                  dir="ltr"
                                  onClick={() => {
                                    if (isEditMode) {
                                      if (hasRange) {
                                        onEditItem(jItem);
                                      } else {
                                        const newVal = prompt(
                                          `أدخل السعر الجديد لـ ${jItem.name}:`,
                                          priceObj.price.toString()
                                        );
                                        if (newVal !== null) {
                                          const parsed = parseFloat(newVal);
                                          if (!isNaN(parsed)) onUpdatePrice(jItem.id, 0, parsed);
                                        }
                                      }
                                    }
                                  }}
                                  title={isEditMode ? 'اضغط لتحديد أو تعديل السعر' : `${jItem.name}`}
                                  className={`w-[50px] h-[24px] rounded-md flex items-center justify-center font-mono font-black ${
                                    hasRange ? 'text-[12.5px] tracking-tighter' : 'text-[14px]'
                                  } shrink-0 transition-all ${
                                    paperTheme === 'clean-white'
                                      ? 'bg-red-50 border border-red-200 text-[#981414]'
                                      : 'bg-white text-slate-950 border border-sky-200 shadow-2xs'
                                  } ${
                                    isEditMode
                                      ? 'ring-2 ring-amber-400 cursor-pointer hover:bg-amber-100'
                                      : ''
                                  }`}
                                >
                                  {hasPrice ? (
                                    <span>
                                      {hasRange ? `${priceObj.price}-${secondPriceObj.price}` : priceObj.price}
                                    </span>
                                  ) : isEditMode ? (
                                    <span className="text-[9px] font-['Cairo'] text-slate-400">+سعر</span>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );

                      return (
                        <div className="relative pt-4 flex-1 flex flex-col">
                          {/* Overlapping Top Ribbon Header ("★ عصائر و آيس كريم ★") */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                            <div
                              className={`px-6 py-1 rounded-full border-2 shadow-lg flex items-center gap-2 whitespace-nowrap ${
                                paperTheme === 'clean-white'
                                  ? 'bg-gradient-to-r from-[#981414] via-[#c61b1b] to-[#981414] border-amber-300 text-white'
                                  : 'bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#b91c1c] border-amber-300 text-white'
                              }`}
                            >
                              <span className="text-amber-300 text-sm font-black">★</span>
                              <span className="font-black font-['Cairo'] text-[19px] sm:text-[21px] tracking-wide drop-shadow">
                                {juicesCategory.name}
                              </span>
                              <span className="text-amber-300 text-sm font-black">★</span>
                            </div>
                          </div>

                          {/* 2-Column Drinks & Juices Card + Seamless Bottom Showcase Image */}
                          <div
                            className={`flex-1 rounded-2xl border-2 shadow-xl flex flex-col justify-between overflow-hidden ${
                              paperTheme === 'clean-white'
                                ? 'bg-white border-red-700/80'
                                : 'bg-gradient-to-b from-[#08223d] via-[#06213a] to-[#06213a] border-sky-300/70'
                            }`}
                          >
                            <div className="grid grid-cols-2 gap-3 items-start px-3 pt-6 pb-1.5">
                              {/* Right Juice Column */}
                              <div className="border-l border-dashed border-sky-400/25 pl-2.5">
                                {renderJuiceColumn(rightJuiceCol)}
                              </div>
                              {/* Left Juice Column */}
                              <div>
                                {renderJuiceColumn(leftJuiceCol)}
                              </div>
                            </div>

                            {/* Integrated Juices, Milkshakes, Ice Cream & Espresso Artwork Seamlessly Blended */}
                            <div
                              className={`relative w-full overflow-hidden flex items-end justify-center bg-[#06213a] ${
                                isSquare ? '' : 'h-[240px]'
                              }`}
                            >
                              <img
                                src={FOOD_IMAGES.juicesBanner}
                                alt="سموزي وميلك تشيك وعصائر فريش وآيس كريم وإسبريسو"
                                className={
                                  isSquare
                                    ? 'w-full h-auto block'
                                    : 'h-full w-auto max-w-full object-contain block'
                                }
                                style={
                                  isSquare
                                    ? undefined
                                    : {
                                        maskImage:
                                          'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
                                        WebkitMaskImage:
                                          'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)'
                                      }
                                }
                              />
                              <div
                                className="pointer-events-none absolute inset-x-0 top-0 h-5"
                                style={{
                                  background:
                                    paperTheme === 'clean-white'
                                      ? 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(6,33,58,0) 100%)'
                                      : 'linear-gradient(to bottom, #06213a 0%, rgba(6,33,58,0) 100%)'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* =============================================================== */}
                  {/* HALF 2 (LEFT HALF IN RTL): Circular Logo Above "بيتزا" + Brand Showcase Banner + Contacts */}
                  {/* =============================================================== */}
                  <div className="flex flex-col justify-between gap-3 py-0.5">
                    
                    {/* 1. Seamless Brand & Dishes Showcase Panel (Large Balanced Circular Logo + Prominent Wordmark + 4 Dishes) */}
                    <div
                      className={`rounded-3xl border-2 shadow-2xl overflow-hidden flex-1 flex flex-col items-center justify-evenly relative pt-3 pb-2 px-2 ${
                        paperTheme === 'clean-white'
                          ? 'border-red-700/80 bg-gradient-to-b from-[#a5dffc] via-[#c7ecfe] to-[#87d3fa]'
                          : 'border-white/95 bg-gradient-to-b from-[#a5dffc] via-[#c7ecfe] to-[#87d3fa]'
                      }`}
                    >
                      {/* Soft Radiant Halo Glow Behind the Logo */}
                      <div
                        className="absolute top-1 left-1/2 -translate-x-1/2 w-[430px] h-[430px] rounded-full pointer-events-none select-none z-0"
                        style={{
                          background:
                            'radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(255,230,0,0.24) 46%, transparent 74%)'
                        }}
                      />

                      {/* Large Polished Circular Embossed Logo Centered Above "بيتزا سلسبيل" */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="p-2 rounded-full bg-gradient-to-b from-[#ffe600] via-[#fbbf24] to-[#b45309] ring-4 ring-white shadow-[0_16px_38px_rgba(1,34,61,0.42)]">
                          <div
                            className={`rounded-full overflow-hidden bg-[#4a2612] border-2 border-[#01223d]/40 ${
                              isSquare ? 'w-[350px] h-[350px]' : 'w-[252px] h-[252px]'
                            }`}
                          >
                            <img
                              src={FOOD_IMAGES.brandLogoCoin}
                              alt="شعار بيتزا سلسبيل تأسست عام 1999م"
                              className="w-full h-full object-cover scale-[1.15] brightness-[1.06] contrast-[1.09] saturate-[1.08]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Large Bold "بيتزا سلسبيل + نحن لا نرضى إلا بالأفضل" Layer */}
                      <div className="relative z-10 w-full flex flex-col items-center">
                        {/* Crisp Unclipped "بيتزا" Wordmark Centered Above "سلسبيل" */}
                        <div className="relative z-20 -mb-6 sm:-mb-7 pointer-events-none select-none">
                          <span
                            className={`inline-block font-['Cairo'] font-black leading-none tracking-wide ${
                              isSquare ? 'text-[42px]' : 'text-[35px]'
                            }`}
                            style={{
                              color: '#012b4a',
                              textShadow:
                                '2.5px 0 0 #ffffff, -2.5px 0 0 #ffffff, 0 2.5px 0 #ffffff, 0 -2.5px 0 #ffffff, 2px 2px 0 #ffffff, -2px -2px 0 #ffffff, 2px -2px 0 #ffffff, -2px 2px 0 #ffffff, 0 5px 12px rgba(1, 34, 61, 0.35)'
                            }}
                          >
                            بيتزا
                          </span>
                        </div>

                        <div
                          className={`relative z-10 w-full overflow-hidden ${
                            isSquare ? 'aspect-[2.52/1]' : 'aspect-[2.88/1]'
                          }`}
                          style={{
                            maskImage:
                              'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
                            WebkitMaskImage:
                              'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)'
                          }}
                        >
                          <img
                            src={FOOD_IMAGES.brandBanner}
                            alt="بيتزا سلسبيل - نحن لا نرضى إلا بالأفضل"
                            style={{
                              width: isSquare ? '182%' : '158%',
                              maxWidth: 'none',
                              height: 'auto',
                              position: 'absolute',
                              left: '50%',
                              top: 0,
                              transform: 'translate(-51%, -9.5%)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Bottom 4 Dishes Strip Unclipped at Full Width */}
                      <div
                        className="relative z-10 w-full overflow-hidden aspect-[4.1/1]"
                        style={{
                          maskImage: 'radial-gradient(ellipse 92% 88% at 50% 50%, black 68%, transparent 98%)',
                          WebkitMaskImage: 'radial-gradient(ellipse 92% 88% at 50% 50%, black 68%, transparent 98%)'
                        }}
                      >
                        <img
                          src={FOOD_IMAGES.brandBanner}
                          alt="بيتزا وكريب وفطير وسوري سلسبيل"
                          style={{
                            width: '115%',
                            maxWidth: 'none',
                            height: 'auto',
                            position: 'absolute',
                            left: '50%',
                            top: 0,
                            transform: 'translate(-51%, -51.5%)'
                          }}
                        />
                      </div>
                    </div>

                    {/* 2. Organized Contact & Delivery Numbers Card (WhatsApp + Vodafone Cash + Delivery Phone) */}
                    <div
                      className={`rounded-3xl border-2 px-4 py-3 shadow-xl flex flex-col gap-2.5 ${
                        paperTheme === 'clean-white'
                          ? 'bg-white border-red-700/80'
                          : 'bg-[#08223d]/95 border-sky-300/75'
                      }`}
                    >
                      {/* WhatsApp + Vodafone Cash Row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap" dir="ltr">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white border-2 border-white flex items-center justify-center shadow-md shrink-0">
                            <MessageCircle size={22} />
                          </div>
                          <span
                            className={`font-mono font-black text-3xl sm:text-[36px] tracking-wider leading-none tabular-nums ${
                              paperTheme === 'clean-white' ? 'text-[#b91c1c]' : 'text-[#ffe600]'
                            }`}
                          >
                            01094450011
                          </span>
                        </div>
                        <div className="flex items-center gap-2" dir="rtl">
                          <span className="bg-red-700 text-white rounded-xl px-2.5 py-1 inline-flex items-center gap-1 text-xs font-['Cairo'] font-black border border-amber-300/80 shadow-xs">
                            <Wallet size={13} className="text-amber-300 shrink-0" />
                            <span>فودافون كاش</span>
                          </span>
                          <span
                            className={`text-[11px] font-black px-2 py-1 rounded-lg ${
                              paperTheme === 'clean-white'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                            }`}
                          >
                            واتساب وطلبات
                          </span>
                        </div>
                      </div>

                      <div
                        className={`h-px w-full ${
                          paperTheme === 'clean-white' ? 'bg-red-100' : 'bg-sky-400/25'
                        }`}
                      />

                      {/* Delivery Phone Row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap" dir="ltr">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-md shrink-0 ${
                              paperTheme === 'clean-white'
                                ? 'bg-[#981414] text-[#ffe600] border-[#ffe600]'
                                : 'bg-[#ffe600] text-[#01223d] border-white'
                            }`}
                          >
                            <Phone size={20} />
                          </div>
                          <span
                            className={`font-mono font-black text-3xl sm:text-[36px] tracking-wider leading-none tabular-nums ${
                              paperTheme === 'clean-white' ? 'text-slate-950' : 'text-white'
                            }`}
                          >
                            01159001520
                          </span>
                        </div>
                        <span
                          dir="rtl"
                          className={`text-[11px] font-black px-2.5 py-1 rounded-lg ${
                            paperTheme === 'clean-white'
                              ? 'bg-amber-100 text-amber-950'
                              : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          }`}
                        >
                          خدمة الدليفري السريعة
                        </span>
                      </div>
                    </div>

                    {/* 3. Dark Navy Rounded Bottom Address & Facebook Strip */}
                    <div className="rounded-2xl bg-[#072238] border-2 border-sky-300/60 px-4 py-2 text-white shadow-xl flex flex-wrap items-center justify-between gap-3 text-base sm:text-lg font-black">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-[#dc2626] text-white flex items-center justify-center shadow-xs shrink-0 border border-white/50">
                          <MapPin size={18} />
                        </span>
                        <span className="tracking-tight">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-[#1877f2] text-white font-sans font-black text-lg flex items-center justify-center shadow-xs shrink-0 border border-white/50">
                          f
                        </span>
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-black font-['Cairo'] text-lg sm:text-xl text-white leading-none drop-shadow-xs">
                            بيتزا
                          </span>
                          <SalsabeelWordmark
                            variant="red-white"
                            idPrefix="back-fb"
                            className="h-11 sm:h-12 w-auto -my-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
