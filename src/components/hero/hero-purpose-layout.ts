const ARTBOARD_WIDTH = 1246;
const ARTBOARD_HEIGHT = 720;

type ArtworkLine = {
  fontSize: number;
  tracking: number;
  x: number;
  y: number;
};

type PurposeArtworkLayout = {
  creamStart: number;
  divider: {
    width: number;
    x: number;
  };
  greenEnd: number;
  label: ArtworkLine;
  labelRule: {
    height: number;
    width: number;
    x: number;
    y: number;
  };
  lead: readonly [ArtworkLine, ArtworkLine];
  logo: {
    height: number;
    x: number;
    y: number;
  };
  stackRule: {
    height: number;
    width: number;
    x: number;
    y: number;
  } | null;
  support: {
    fontSize: number;
    lineGap: number;
    tracking: number;
    x: number;
    y: number;
  };
};

export const HERO_PURPOSE_ARTBOARD_SIZE = {
  height: ARTBOARD_HEIGHT,
  width: ARTBOARD_WIDTH,
} as const;

export const HERO_PURPOSE_COLORS = {
  cream: "#f4ede2",
  gold: "#c29231",
  green: "#01500b",
} as const;

export const HERO_PURPOSE_LAYOUTS = {
  desktop: {
    greenEnd: 804,
    divider: { x: 804, width: 6 },
    creamStart: 810,
    labelRule: { x: 132, y: 106, width: 38, height: 2 },
    label: { x: 177, y: 101, fontSize: 13, tracking: 1 },
    lead: [
      { x: 166, y: 220, fontSize: 88, tracking: 0 },
      { x: 164, y: 298, fontSize: 144, tracking: 0 },
    ],
    stackRule: null,
    support: { x: 852, y: 192, fontSize: 50, lineGap: 50, tracking: -0.75 },
    logo: { x: 950, y: 470, height: 86 },
  },
  mobile: {
    greenEnd: 804,
    divider: { x: 804, width: 7 },
    creamStart: 811,
    labelRule: { x: 820, y: 88, width: 42, height: 2 },
    label: { x: 870, y: 84, fontSize: 12, tracking: 1.8 },
    lead: [
      { x: 820, y: 163, fontSize: 50, tracking: 0 },
      { x: 818, y: 220, fontSize: 71, tracking: 0 },
    ],
    stackRule: { x: 820, y: 304, width: 236, height: 2 },
    support: { x: 820, y: 348, fontSize: 40, lineGap: 40, tracking: -0.6 },
    logo: { x: 907, y: 491, height: 101 },
  },
} as const satisfies Record<"desktop" | "mobile", PurposeArtworkLayout>;

// The capped HTML artboard has a narrower cream panel on portrait tablets.
export const HERO_PURPOSE_TABLET_SUPPORT = {
  ...HERO_PURPOSE_LAYOUTS.desktop.support,
  fontSize: 40,
  lineGap: 40,
  tracking: -0.6,
} as const;

export const HERO_PURPOSE_CANVAS_LAYOUTS = {
  desktop: HERO_PURPOSE_LAYOUTS.desktop,
  mobile: {
    ...HERO_PURPOSE_LAYOUTS.mobile,
    lead: [
      HERO_PURPOSE_LAYOUTS.mobile.lead[0],
      {
        ...HERO_PURPOSE_LAYOUTS.mobile.lead[1],
        fontSize: 65,
      },
    ],
  },
} as const satisfies Record<"desktop" | "mobile", PurposeArtworkLayout>;

// Mirror the HTML artboard's 132vw cap at tablet aspect ratios.
// The final HTML layout and the mobile artwork coordinates stay unchanged.
export function getHeroPurposeCanvasWidthScale(width: number, height: number) {
  if (width < 768) return 1;
  return Math.min(1, (1.32 * width) / (1.074 * height * ARTBOARD_WIDTH / ARTBOARD_HEIGHT));
}

export function getHeroPurposeCanvasLayout(
  isPortrait: boolean,
  width: number,
  height: number,
  projectionOverscan = 1.074,
): PurposeArtworkLayout {
  const layout = isPortrait
    ? HERO_PURPOSE_CANVAS_LAYOUTS.mobile
    : HERO_PURPOSE_CANVAS_LAYOUTS.desktop;
  if (isPortrait) return layout;

  const support = width >= 768 && width <= height
    ? HERO_PURPOSE_TABLET_SUPPORT
    : layout.support;
  const htmlHeight = Math.max(1.074 * height, 0.62061 * width);
  const htmlWidth = Math.min(Math.max(1.074 * width, 1.858627 * height), 1.32 * width);
  const projectedHeight = projectionOverscan * height;
  const scale = htmlWidth / (projectedHeight * ARTBOARD_WIDTH / ARTBOARD_HEIGHT);
  const verticalScale = htmlHeight / projectedHeight;
  const fontScale = Math.min(scale, verticalScale);
  const x = (value: number) => ARTBOARD_WIDTH / 2 + (value - ARTBOARD_WIDTH / 2) * scale;
  const y = (value: number) => ARTBOARD_HEIGHT / 2 + (value - ARTBOARD_HEIGHT / 2) * verticalScale;
  const projectedSupport = {
    ...support, x: x(support.x), y: y(support.y), fontSize: support.fontSize * fontScale,
    lineGap: support.lineGap * fontScale, tracking: support.tracking * fontScale,
  };
  // Preserve the approved desktop left artwork. Compensate only the new right
  // statement for the existing camera's overscan so its HTML handoff stays still.
  if (getHeroPurposeCanvasWidthScale(width, height) === 1) {
    return { ...layout, support: projectedSupport };
  }
  const lead = (line: ArtworkLine) => ({
    ...line, x: x(line.x), fontSize: line.fontSize * fontScale,
    tracking: line.tracking * fontScale,
  });
  return {
    ...layout,
    greenEnd: x(layout.greenEnd),
    creamStart: x(layout.creamStart),
    divider: { x: x(layout.divider.x), width: layout.divider.width * scale },
    labelRule: { ...layout.labelRule, x: x(layout.labelRule.x), width: layout.labelRule.width * scale },
    label: { ...layout.label, x: x(layout.label.x) },
    lead: [lead(layout.lead[0]), lead(layout.lead[1])],
    support: projectedSupport,
    logo: { ...layout.logo, x: x(layout.logo.x) },
  };
}

export const HERO_PURPOSE_HANDOFF_WINDOWS = {
  desktop: {
    canvasContentOut: { start: 0.96555, end: 0.9657 },
    domContentIn: { start: 0.96555, end: 0.9657 },
    domDividerIn: { start: 0.985, end: 0.99 },
  },
  mobile: {
    canvasContentOut: { start: 0.9343, end: 0.93445 },
    domContentIn: { start: 0.9343, end: 0.93445 },
    domDividerIn: { start: 0.965, end: 0.97 },
  },
} as const;

function horizontalPercent(value: number) {
  return `${((value / ARTBOARD_WIDTH) * 100).toFixed(4)}%`;
}

function verticalPercent(value: number) {
  return `${((value / ARTBOARD_HEIGHT) * 100).toFixed(4)}%`;
}

function fontPercent(value: number) {
  return `${((value / ARTBOARD_HEIGHT) * 100).toFixed(4)}cqh`;
}

function trackingEm(tracking: number, fontSize: number) {
  return `${(tracking / fontSize).toFixed(4)}em`;
}

function createSupportVariables(
  prefix: "desktop" | "mobile" | "tablet",
  support: PurposeArtworkLayout["support"],
) {
  return {
    [`--purpose-${prefix}-support-x`]: horizontalPercent(support.x),
    [`--purpose-${prefix}-support-y`]: verticalPercent(support.y),
    [`--purpose-${prefix}-support-size`]: fontPercent(
      support.fontSize,
    ),
    [`--purpose-${prefix}-support-line-gap`]: fontPercent(
      support.lineGap,
    ),
    [`--purpose-${prefix}-support-width-size`]: `${(support.fontSize / ARTBOARD_WIDTH * 100).toFixed(4)}cqw`,
    [`--purpose-${prefix}-support-width-gap`]: `${(support.lineGap / ARTBOARD_WIDTH * 100).toFixed(4)}cqw`,
    [`--purpose-${prefix}-support-tracking`]: trackingEm(
      support.tracking,
      support.fontSize,
    ),
  };
}

function createArtboardVariables(
  prefix: "desktop" | "mobile",
  layout: PurposeArtworkLayout,
) {
  const variables: Record<string, string> = {
    [`--purpose-${prefix}-green-end`]: horizontalPercent(layout.greenEnd),
    [`--purpose-${prefix}-cream-start`]: horizontalPercent(layout.creamStart),
    [`--purpose-${prefix}-divider-x`]: horizontalPercent(layout.divider.x),
    [`--purpose-${prefix}-divider-width`]: horizontalPercent(layout.divider.width),
    [`--purpose-${prefix}-label-rule-x`]: horizontalPercent(layout.labelRule.x),
    [`--purpose-${prefix}-label-rule-y`]: verticalPercent(layout.labelRule.y),
    [`--purpose-${prefix}-label-rule-width`]: horizontalPercent(
      layout.labelRule.width,
    ),
    [`--purpose-${prefix}-label-rule-height`]: verticalPercent(
      layout.labelRule.height,
    ),
    [`--purpose-${prefix}-label-x`]: horizontalPercent(layout.label.x),
    [`--purpose-${prefix}-label-y`]: verticalPercent(layout.label.y),
    [`--purpose-${prefix}-label-size`]: fontPercent(layout.label.fontSize),
    [`--purpose-${prefix}-label-tracking`]: trackingEm(
      layout.label.tracking,
      layout.label.fontSize,
    ),
    [`--purpose-${prefix}-lead-one-x`]: horizontalPercent(layout.lead[0].x),
    [`--purpose-${prefix}-lead-one-y`]: verticalPercent(layout.lead[0].y),
    [`--purpose-${prefix}-lead-one-size`]: fontPercent(
      layout.lead[0].fontSize,
    ),
    [`--purpose-${prefix}-lead-two-x`]: horizontalPercent(layout.lead[1].x),
    [`--purpose-${prefix}-lead-two-y`]: verticalPercent(layout.lead[1].y),
    [`--purpose-${prefix}-lead-two-size`]: fontPercent(
      layout.lead[1].fontSize,
    ),
    [`--purpose-${prefix}-lead-two-tracking`]: trackingEm(
      layout.lead[1].tracking,
      layout.lead[1].fontSize,
    ),
    ...createSupportVariables(prefix, layout.support),
    [`--purpose-${prefix}-logo-x`]: horizontalPercent(layout.logo.x),
    [`--purpose-${prefix}-logo-y`]: verticalPercent(layout.logo.y),
    [`--purpose-${prefix}-logo-height`]: verticalPercent(layout.logo.height),
  };

  if (layout.stackRule) {
    variables[`--purpose-${prefix}-stack-rule-x`] = horizontalPercent(
      layout.stackRule.x,
    );
    variables[`--purpose-${prefix}-stack-rule-y`] = verticalPercent(
      layout.stackRule.y,
    );
    variables[`--purpose-${prefix}-stack-rule-width`] = horizontalPercent(
      layout.stackRule.width,
    );
    variables[`--purpose-${prefix}-stack-rule-height`] = verticalPercent(
      layout.stackRule.height,
    );
  }

  return variables;
}

export const HERO_PURPOSE_ARTBOARD_STYLE = {
  ...createArtboardVariables("desktop", HERO_PURPOSE_LAYOUTS.desktop),
  ...createArtboardVariables("mobile", HERO_PURPOSE_LAYOUTS.mobile),
  ...createSupportVariables("tablet", HERO_PURPOSE_TABLET_SUPPORT),
};
