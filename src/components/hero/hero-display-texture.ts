import {
  CanvasTexture,
  LinearFilter,
  MathUtils,
  SRGBColorSpace,
} from "three";

import { heroStatement } from "@/data/hero";

export const HERO_DISPLAY_TEXTURE_SIZE = {
  width: 1246,
  height: 720,
} as const;

const CREAM = "#f4ede2";
const GOLD = "#c29231";
const GREEN = "#013609";
const BRAND_TO_PHOTO = { start: 0.275, end: 0.34 } as const;
const PHOTO_ONE_TO_TWO = { start: 0.435, end: 0.5 } as const;
const PHOTO_TWO_TO_THREE = { start: 0.575, end: 0.645 } as const;
const PHOTO_TO_STATEMENT = { start: 0.705, end: 0.79 } as const;

export type HeroDisplayPhotographs = [
  HTMLImageElement | null,
  HTMLImageElement | null,
  HTMLImageElement | null,
];

type HeroDisplayAssets = {
  logo: HTMLImageElement;
  photographs: HeroDisplayPhotographs;
};

export type HeroDisplayTextureController = {
  texture: CanvasTexture;
  draw: (progress: number) => void;
  setPhotograph: (index: number, image: HTMLImageElement | null) => void;
};

type Destination = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CoverOptions = {
  focusX?: number;
  focusY?: number;
  zoom?: number;
};

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothSegment(value: number, start: number, end: number) {
  const progress = clamp((value - start) / (end - start));

  return progress * progress * (3 - 2 * progress);
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  destination: Destination,
  { focusX = 0.5, focusY = 0.5, zoom = 1 }: CoverOptions = {},
) {
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;

  if (
    imageWidth <= 0 ||
    imageHeight <= 0 ||
    destination.width <= 0 ||
    destination.height <= 0
  ) {
    return;
  }

  const scale =
    Math.max(
      destination.width / imageWidth,
      destination.height / imageHeight,
    ) * zoom;
  const sourceWidth = destination.width / scale;
  const sourceHeight = destination.height / scale;
  const sourceX = clamp(
    (imageWidth - sourceWidth) * focusX,
    0,
    imageWidth - sourceWidth,
  );
  const sourceY = clamp(
    (imageHeight - sourceHeight) * focusY,
    0,
    imageHeight - sourceHeight,
  );

  context.save();
  context.beginPath();
  context.rect(
    destination.x,
    destination.y,
    destination.width,
    destination.height,
  );
  context.clip();
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destination.x,
    destination.y,
    destination.width,
    destination.height,
  );
  context.restore();
}

function drawLogo(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  height: number,
) {
  context.drawImage(image, x, y, height * (560 / 610), height);
}

function drawBrandArtwork(
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement,
  fontFamily: string,
) {
  const { width, height } = HERO_DISPLAY_TEXTURE_SIZE;

  context.globalAlpha = 1;
  context.fillStyle = GREEN;
  context.fillRect(0, 0, 790, height);
  context.fillStyle = GOLD;
  context.fillRect(790, 0, 20, height);
  context.fillStyle = CREAM;
  context.fillRect(810, 0, width - 810, height);

  context.fillStyle = GOLD;
  context.fillRect(76, 108, 116, 8);
  context.fillStyle = CREAM;
  context.textBaseline = "alphabetic";
  context.font = `400 126px ${fontFamily}`;
  context.fillText("MUSLIM", 72, 303);
  context.font = `400 67px ${fontFamily}`;
  context.fillText("ENTREPRENEURS", 72, 405);

  context.strokeStyle = "rgba(244, 237, 226, 0.55)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(74, 555);
  context.lineTo(700, 555);
  context.stroke();

  const logoHeight = 400;
  const logoWidth = logoHeight * (560 / 610);
  drawLogo(
    context,
    logo,
    810 + (width - 810 - logoWidth) / 2,
    (height - logoHeight) / 2,
    logoHeight,
  );
}

function drawBrandedFallback(
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement,
) {
  const { width, height } = HERO_DISPLAY_TEXTURE_SIZE;

  context.fillStyle = GREEN;
  context.fillRect(0, 0, width, height);
  context.fillStyle = GOLD;
  context.fillRect(72, 104, 112, 8);
  context.globalAlpha = 0.92;
  drawLogo(context, logo, width / 2 - 128, height / 2 - 139, 278);
  context.globalAlpha = 1;
}

function drawAudienceArtwork(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  logo: HTMLImageElement,
  progress: number,
) {
  if (!image) {
    drawBrandedFallback(context, logo);
    return;
  }

  const movement = smoothSegment(progress, 0.3, 0.47);

  drawCover(
    context,
    image,
    { x: 0, y: 0, ...HERO_DISPLAY_TEXTURE_SIZE },
    {
      focusY: MathUtils.lerp(0.9, 0.78, movement),
      zoom: MathUtils.lerp(1.015, 1.075, movement),
    },
  );
}

function drawGroupArtwork(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  logo: HTMLImageElement,
  progress: number,
) {
  if (!image) {
    drawBrandedFallback(context, logo);
    return;
  }

  const movement = smoothSegment(progress, 0.46, 0.62);

  drawCover(
    context,
    image,
    { x: 0, y: 0, ...HERO_DISPLAY_TEXTURE_SIZE },
    {
      focusX: MathUtils.lerp(0.5, 0.56, movement),
      focusY: 0.9,
      zoom: MathUtils.lerp(1.035, 1.095, movement),
    },
  );
}

function drawBazaarArtwork(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  logo: HTMLImageElement,
  isPortrait: boolean,
) {
  const { width, height } = HERO_DISPLAY_TEXTURE_SIZE;
  const panelX = isPortrait ? 548 : 568;

  context.fillStyle = GREEN;
  context.fillRect(0, 0, width, height);
  context.globalAlpha = 0.9;
  drawLogo(context, logo, 154, 208, 304);
  context.globalAlpha = 1;
  context.fillStyle = GOLD;
  context.fillRect(panelX - 18, 0, 18, height);

  if (!image) {
    return;
  }

  drawCover(
    context,
    image,
    { x: panelX, y: 0, width: width - panelX, height },
    {
      focusY: isPortrait ? 0.56 : 0.52,
      zoom: isPortrait ? 1.035 : 1.015,
    },
  );
}

function drawStatementBackground(context: CanvasRenderingContext2D) {
  const { width, height } = HERO_DISPLAY_TEXTURE_SIZE;

  context.fillStyle = GREEN;
  context.fillRect(0, 0, 790, height);
  context.fillStyle = GOLD;
  context.fillRect(790, 0, 20, height);
  context.fillStyle = CREAM;
  context.fillRect(810, 0, width - 810, height);
}

function drawStatementContent(
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement,
  fontFamily: string,
  isPortrait: boolean,
  opacity = 1,
  offsetY = 0,
) {
  context.save();
  context.globalAlpha = opacity;
  context.textBaseline = "top";

  if (isPortrait) {
    context.fillStyle = GOLD;
    context.fillRect(820, 88 + offsetY, 82, 6);
    context.fillStyle = GREEN;
    context.font = `400 50px ${fontFamily}`;
    context.fillText(heroStatement.leadLines[0], 820, 143 + offsetY);
    context.font = `400 68px ${fontFamily}`;
    context.fillText(heroStatement.leadLines[1], 818, 195 + offsetY);

    context.strokeStyle = "rgba(1, 54, 9, 0.38)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(820, 298 + offsetY);
    context.lineTo(1054, 298 + offsetY);
    context.stroke();

    context.font = `400 33px ${fontFamily}`;
    context.fillText(heroStatement.closeLines[0], 820, 344 + offsetY);
    context.fillText(heroStatement.closeLines[1], 820, 382 + offsetY);
    drawLogo(context, logo, 890, 495 + offsetY, 172);
  } else {
    context.fillStyle = GOLD;
    context.fillRect(170, 108 + offsetY, 110, 8);
    context.fillStyle = CREAM;
    context.font = `400 82px ${fontFamily}`;
    context.fillText(heroStatement.leadLines[0], 166, 212 + offsetY);
    context.font = `400 110px ${fontFamily}`;
    context.fillText(heroStatement.leadLines[1], 164, 290 + offsetY);

    context.strokeStyle = "rgba(244, 237, 226, 0.55)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(168, 555 + offsetY);
    context.lineTo(718, 555 + offsetY);
    context.stroke();

    context.fillStyle = GREEN;
    context.font = `400 39px ${fontFamily}`;
    context.fillText(heroStatement.closeLines[0], 834, 236 + offsetY);
    context.fillText(heroStatement.closeLines[1], 834, 282 + offsetY);
    drawLogo(context, logo, 906, 438 + offsetY, 160);
  }

  context.restore();
}

function drawStatementArtwork(
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement,
  fontFamily: string,
  isPortrait: boolean,
) {
  drawStatementBackground(context);
  drawStatementContent(context, logo, fontFamily, isPortrait);
}

function drawDiagonalReveal(
  context: CanvasRenderingContext2D,
  progress: number,
  direction: "left" | "right",
  drawLayer: () => void,
) {
  const { width, height } = HERO_DISPLAY_TEXTURE_SIZE;
  const reveal = clamp(progress);

  if (reveal <= 0) {
    return;
  }

  if (reveal >= 1) {
    drawLayer();
    return;
  }

  const edge =
    direction === "left"
      ? MathUtils.lerp(-88, width + 88, reveal)
      : MathUtils.lerp(width + 88, -88, reveal);

  context.save();
  context.beginPath();

  if (direction === "left") {
    context.moveTo(0, 0);
    context.lineTo(edge + 72, 0);
    context.lineTo(edge - 72, height);
    context.lineTo(0, height);
  } else {
    context.moveTo(edge - 72, 0);
    context.lineTo(width, 0);
    context.lineTo(width, height);
    context.lineTo(edge + 72, height);
  }

  context.closePath();
  context.clip();
  drawLayer();
  context.restore();

  context.save();
  context.globalAlpha = 0.72;
  context.strokeStyle = GOLD;
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(direction === "left" ? edge + 72 : edge - 72, 0);
  context.lineTo(direction === "left" ? edge - 72 : edge + 72, height);
  context.stroke();
  context.restore();
}

function drawUpwardReveal(
  context: CanvasRenderingContext2D,
  progress: number,
  drawLayer: () => void,
) {
  const { width, height } = HERO_DISPLAY_TEXTURE_SIZE;
  const reveal = clamp(progress);

  if (reveal <= 0) {
    return;
  }

  if (reveal >= 1) {
    drawLayer();
    return;
  }

  const edge = MathUtils.lerp(height + 60, -60, reveal);

  context.save();
  context.beginPath();
  context.moveTo(0, edge + 34);
  context.lineTo(width, edge - 34);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.closePath();
  context.clip();
  drawLayer();
  context.restore();

  context.save();
  context.globalAlpha = 0.72;
  context.strokeStyle = GOLD;
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(0, edge + 34);
  context.lineTo(width, edge - 34);
  context.stroke();
  context.restore();
}

function drawStatementTransition(
  context: CanvasRenderingContext2D,
  assets: HeroDisplayAssets,
  fontFamily: string,
  isPortrait: boolean,
  progress: number,
) {
  const { width, height } = HERO_DISPLAY_TEXTURE_SIZE;
  const bazaarPanelX = isPortrait ? 548 : 568;
  const transition = clamp(progress);
  const greenEdge = MathUtils.lerp(bazaarPanelX, 790, transition);
  const creamEdge = MathUtils.lerp(width, 810, transition);
  const contentReveal = smoothSegment(transition, 0.34, 0.88);

  drawBazaarArtwork(
    context,
    assets.photographs[2],
    assets.logo,
    isPortrait,
  );
  context.fillStyle = GREEN;
  context.fillRect(bazaarPanelX, 0, greenEdge - bazaarPanelX, height);
  context.fillStyle = CREAM;
  context.fillRect(creamEdge, 0, width - creamEdge, height);

  context.globalAlpha = smoothSegment(transition, 0.28, 0.62);
  context.fillStyle = GOLD;
  context.fillRect(790, 0, 20, height);
  context.globalAlpha = 1;

  drawStatementContent(
    context,
    assets.logo,
    fontFamily,
    isPortrait,
    contentReveal,
    MathUtils.lerp(18, 0, contentReveal),
  );
}

export function getHeroDisplayDrawProgress(progress: number) {
  if (progress <= BRAND_TO_PHOTO.start) {
    return 0;
  }

  if (progress >= PHOTO_TO_STATEMENT.end) {
    return 1;
  }

  return Math.round(progress * 480) / 480;
}

export function createHeroDisplayTexture(
  logo: HTMLImageElement,
  isPortrait: boolean,
): HeroDisplayTextureController {
  const assets: HeroDisplayAssets = {
    logo,
    photographs: [null, null, null],
  };
  const canvas = document.createElement("canvas");
  canvas.width = HERO_DISPLAY_TEXTURE_SIZE.width;
  canvas.height = HERO_DISPLAY_TEXTURE_SIZE.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create the MES display texture.");
  }

  const displayFont = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-newsreader")
    .trim();
  const fontFamily = displayFont || "Georgia, serif";
  const texture = new CanvasTexture(canvas);

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = true;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  const draw = (rawProgress: number) => {
    const progress = clamp(rawProgress);

    context.globalAlpha = 1;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (progress < BRAND_TO_PHOTO.start) {
      drawBrandArtwork(context, assets.logo, fontFamily);
    } else if (progress < BRAND_TO_PHOTO.end) {
      drawBrandArtwork(context, assets.logo, fontFamily);
      drawDiagonalReveal(
        context,
        smoothSegment(progress, BRAND_TO_PHOTO.start, BRAND_TO_PHOTO.end),
        "left",
        () =>
          drawAudienceArtwork(
            context,
            assets.photographs[0],
            assets.logo,
            progress,
          ),
      );
    } else if (progress < PHOTO_ONE_TO_TWO.start) {
      drawAudienceArtwork(
        context,
        assets.photographs[0],
        assets.logo,
        progress,
      );
    } else if (progress < PHOTO_ONE_TO_TWO.end) {
      drawAudienceArtwork(
        context,
        assets.photographs[0],
        assets.logo,
        progress,
      );
      drawDiagonalReveal(
        context,
        smoothSegment(progress, PHOTO_ONE_TO_TWO.start, PHOTO_ONE_TO_TWO.end),
        "right",
        () =>
          drawGroupArtwork(
            context,
            assets.photographs[1],
            assets.logo,
            progress,
          ),
      );
    } else if (progress < PHOTO_TWO_TO_THREE.start) {
      drawGroupArtwork(
        context,
        assets.photographs[1],
        assets.logo,
        progress,
      );
    } else if (progress < PHOTO_TWO_TO_THREE.end) {
      drawGroupArtwork(
        context,
        assets.photographs[1],
        assets.logo,
        progress,
      );
      drawUpwardReveal(
        context,
        smoothSegment(progress, PHOTO_TWO_TO_THREE.start, PHOTO_TWO_TO_THREE.end),
        () =>
          drawBazaarArtwork(
            context,
            assets.photographs[2],
            assets.logo,
            isPortrait,
          ),
      );
    } else if (progress < PHOTO_TO_STATEMENT.start) {
      drawBazaarArtwork(
        context,
        assets.photographs[2],
        assets.logo,
        isPortrait,
      );
    } else if (progress < PHOTO_TO_STATEMENT.end) {
      drawStatementTransition(
        context,
        assets,
        fontFamily,
        isPortrait,
        smoothSegment(
          progress,
          PHOTO_TO_STATEMENT.start,
          PHOTO_TO_STATEMENT.end,
        ),
      );
    } else {
      drawStatementArtwork(context, assets.logo, fontFamily, isPortrait);
    }

    context.globalAlpha = 1;
    texture.needsUpdate = true;
  };

  draw(0);

  const setPhotograph = (index: number, image: HTMLImageElement | null) => {
    if (index >= 0 && index < assets.photographs.length) {
      assets.photographs[index] = image;
    }
  };

  return { texture, draw, setPhotograph };
}
