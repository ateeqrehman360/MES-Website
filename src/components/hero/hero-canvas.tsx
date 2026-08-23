"use client";

import {
  ContactShadows,
  Environment,
  Lightformer,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  Group,
  Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera as ThreePerspectiveCamera,
  SRGBColorSpace,
  Vector3,
} from "three";

import type { HeroProgressSignal } from "./hero-progress";

const MODEL_URL = "/models/MES_Laptop.glb";
const LOGO_URL = "/brand/mes-logo.svg";
const DISPLAY_TEXTURE_SIZE = { width: 1246, height: 720 } as const;
const DISPLAY_LOCAL_CENTER = {
  x: -0.0006706475396640599,
  y: 10.722437858581543,
  z: -10.537602424621582,
} as const;
const DISPLAY_LOCAL_SIZE = {
  width: 29.302825927734375,
  height: 16.937835693359375,
} as const;
const DISPLAY_ASPECT = DISPLAY_TEXTURE_SIZE.width / DISPLAY_TEXTURE_SIZE.height;
const SCREEN_OVERSCAN = 1.074;
const FOCUS_CAMERA = { x: 0.12, y: 1.85, z: 9.5 } as const;
const FOCUS_TARGET_Z_OFFSET = 0.95;
const TAKEOVER_CAMERA_DISTANCE = 5.82;
const MOBILE_FOCUS_CAMERA = { x: 0.08, y: 1.05, z: 8.65 } as const;
const MOBILE_FOCUS_TARGET_Z_OFFSET = 0.82;
const FRAME_SURFACE_MAP_NAME = "MES_Frame_Surface_Map";

type BrandTextureController = {
  texture: CanvasTexture;
  draw: (progress: number) => void;
};

type Composition = {
  camera: [number, number, number];
  target: [number, number, number];
  fov: number;
  modelPosition: [number, number, number];
  modelRotation: [number, number, number];
  modelScale: number;
  shadowPosition: [number, number, number];
  shadowScale: number;
};

const desktopComposition: Composition = {
  camera: [0, 3.75, 14.1],
  target: [0.25, -0.1, 0],
  fov: 31,
  modelPosition: [0.8, -2.25, 0],
  modelRotation: [0.045, -0.42, 0.008],
  modelScale: 0.205,
  shadowPosition: [0.55, -2.24, 0.65],
  shadowScale: 7.4,
};

const portraitComposition: Composition = {
  camera: [0, 4.55, 15.8],
  target: [0.2, -0.5, 0],
  fov: 34,
  modelPosition: [-0.4, -3.1, 0],
  modelRotation: [0.095, -0.58, -0.024],
  modelScale: 0.134,
  shadowPosition: [-0.2, -3.09, 0.5],
  shadowScale: 4.8,
};

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothSegment(value: number, start: number, end: number) {
  const progress = clamp((value - start) / (end - start));

  return progress * progress * (3 - 2 * progress);
}

function createBrandTexture(image: CanvasImageSource): BrandTextureController {
  const canvas = document.createElement("canvas");
  canvas.width = DISPLAY_TEXTURE_SIZE.width;
  canvas.height = DISPLAY_TEXTURE_SIZE.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create the MES display texture.");
  }

  const displayFont = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-newsreader")
    .trim();
  const fontFamily = displayFont || "Georgia, serif";
  const landscapeTitleFont = `400 126px ${fontFamily}`;
  const landscapeSubtitleFont = `400 67px ${fontFamily}`;
  const portraitTitleFont = `400 67px ${fontFamily}`;
  const portraitSubtitleFont = `400 27px ${fontFamily}`;
  const initialLogoHeight = 400;
  const initialLogoWidth = initialLogoHeight * (560 / 610);
  const initialLogoX = 810 + (canvas.width - 810 - initialLogoWidth) / 2;
  const initialLogoY = (canvas.height - initialLogoHeight) / 2;
  const finalLogoX = 825;
  const finalLogoY = 360;
  const finalLogoHeight = 260;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = true;

  const draw = (progress: number) => {
    const originalFade = 1 - smoothSegment(progress, 0.49, 0.78);
    const markMorph = smoothSegment(progress, 0.47, 0.9);
    const portraitReveal = smoothSegment(progress, 0.54, 0.86);

    context.globalAlpha = 1;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#013609";
    context.fillRect(0, 0, 790, canvas.height);
    context.fillStyle = "#c29231";
    context.fillRect(790, 0, 20, canvas.height);
    context.fillStyle = "#f4ede2";
    context.fillRect(810, 0, canvas.width - 810, canvas.height);

    context.globalAlpha = originalFade;
    context.fillStyle = "#c29231";
    context.fillRect(76, 108, 116, 8);

    context.fillStyle = "#f4ede2";
    context.textBaseline = "alphabetic";
    context.font = landscapeTitleFont;
    context.fillText("MUSLIM", 72, 303);
    context.font = landscapeSubtitleFont;
    context.fillText("ENTREPRENEURS", 72, 405);

    context.strokeStyle = "rgba(244, 237, 226, 0.55)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(74, 555);
    context.lineTo(700, 555);
    context.stroke();
    context.globalAlpha = 1;

    const logoHeight = MathUtils.lerp(
      initialLogoHeight,
      finalLogoHeight,
      markMorph,
    );
    const logoWidth = logoHeight * (560 / 610);

    context.drawImage(
      image,
      MathUtils.lerp(initialLogoX, finalLogoX, markMorph),
      MathUtils.lerp(initialLogoY, finalLogoY, markMorph),
      logoWidth,
      logoHeight,
    );

    const settle = MathUtils.lerp(16, 0, portraitReveal);

    context.globalAlpha = portraitReveal;
    context.fillStyle = "#c29231";
    context.fillRect(820, 88 + settle, 82, 6);
    context.fillStyle = "#013609";
    context.textBaseline = "top";
    context.font = portraitTitleFont;
    context.fillText("MUSLIM", 818, 148 + settle);
    context.font = portraitSubtitleFont;
    context.fillText("ENTREPRENEURS", 820, 226 + settle);
    context.strokeStyle = "rgba(1, 54, 9, 0.38)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(820, 295 + settle);
    context.lineTo(1055, 295 + settle);
    context.stroke();
    context.globalAlpha = 1;

    texture.needsUpdate = true;
  };

  draw(0);

  return { texture, draw };
}

function createLaptopMaterial(source: MeshStandardMaterial) {
  const isFrame = source.name === "ComputerFrame.001";
  const surfaceMap = isFrame ? createFrameSurfaceMap(source) : null;
  const material = new MeshPhysicalMaterial({
    alphaTest: source.alphaTest,
    color: isFrame ? "#fff9ee" : "#f0eee8",
    depthWrite: source.depthWrite,
    dithering: true,
    emissive: source.emissive,
    emissiveIntensity: isFrame ? 0.055 : 0.025,
    emissiveMap: source.emissiveMap,
    map: source.map,
    metalness: isFrame ? (surfaceMap ? 1 : 0.34) : 0.2,
    metalnessMap: surfaceMap ?? source.metalnessMap,
    opacity: source.opacity,
    roughness: isFrame ? (surfaceMap ? 1 : 0.34) : 0.4,
    roughnessMap: surfaceMap ?? source.roughnessMap,
    side: source.side,
    transparent: source.transparent,
    clearcoat: isFrame ? 0.28 : 0.14,
    clearcoatRoughness: isFrame ? 0.24 : 0.32,
    envMapIntensity: isFrame ? 1.35 : 0.75,
  });

  material.name = source.name;

  if (isFrame) {
    material.color.setRGB(1.16, 1.12, 1.06);
  }

  [material.map, material.emissiveMap, material.metalnessMap, material.roughnessMap]
    .filter((texture) => texture !== null)
    .forEach((texture) => {
      texture.anisotropy = 8;
    });

  return material;
}

function createFrameSurfaceMap(source: MeshStandardMaterial) {
  const image = source.map?.image as CanvasImageSource | undefined;

  if (!image) {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return null;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < pixels.data.length; index += 4) {
    const red = pixels.data[index] / 255;
    const green = pixels.data[index + 1] / 255;
    const blue = pixels.data[index + 2] / 255;
    const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
    const threshold = Math.min(1, Math.max(0, (luminance - 0.24) / 0.34));
    const chassis = threshold * threshold * (3 - 2 * threshold);
    const roughness = 0.78 - chassis * 0.48;
    const metalness = chassis * 0.78;

    pixels.data[index] = 0;
    pixels.data[index + 1] = Math.round(roughness * 255);
    pixels.data[index + 2] = Math.round(metalness * 255);
    pixels.data[index + 3] = 255;
  }

  context.putImageData(pixels, 0, 0);

  const texture = new CanvasTexture(canvas);
  texture.name = FRAME_SURFACE_MAP_NAME;
  texture.flipY = source.map?.flipY ?? false;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}

function disposePreparedLaptop(
  scene: Group,
  screenMaterial: MeshBasicMaterial,
) {
  const disposedMaterials = new Set<Material>();
  const disposedSurfaceMaps = new Set<CanvasTexture>();

  scene.traverse((object) => {
    if (!(object instanceof Mesh)) {
      return;
    }

    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    materials.forEach((material) => {
      if (material === screenMaterial || disposedMaterials.has(material)) {
        return;
      }

      if (
        material instanceof MeshPhysicalMaterial &&
        material.metalnessMap instanceof CanvasTexture &&
        material.metalnessMap === material.roughnessMap &&
        material.metalnessMap.name === FRAME_SURFACE_MAP_NAME &&
        !disposedSurfaceMaps.has(material.metalnessMap)
      ) {
        material.metalnessMap.dispose();
        disposedSurfaceMaps.add(material.metalnessMap);
      }

      material.dispose();
      disposedMaterials.add(material);
    });
  });
}

function LaptopModel({
  isPortrait,
  progress,
  onReady,
  onUnavailable,
}: {
  isPortrait: boolean;
  progress: HeroProgressSignal;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const lastArtworkProgress = useRef(0);

  useEffect(() => {
    let isActive = true;
    const image = new Image();

    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => {
      if (isActive) {
        setLogoImage(image);
      }
    };
    image.onerror = () => {
      if (isActive) {
        onUnavailable();
      }
    };
    image.src = LOGO_URL;

    return () => {
      isActive = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [onUnavailable]);

  const brandTexture = useMemo(
    () => (logoImage ? createBrandTexture(logoImage) : null),
    [logoImage],
  );

  useEffect(
    () => () => {
      brandTexture?.texture.dispose();
    },
    [brandTexture],
  );

  useFrame(() => {
    if (!brandTexture) {
      return;
    }

    const rawArtworkProgress = isPortrait ? progress.value : 0;
    const artworkProgress =
      rawArtworkProgress <= 0.47
        ? 0
        : Math.min(rawArtworkProgress, 0.9);

    if (Math.abs(artworkProgress - lastArtworkProgress.current) < 0.001) {
      return;
    }

    brandTexture.draw(artworkProgress);
    lastArtworkProgress.current = artworkProgress;
  });

  useEffect(() => {
    if (brandTexture) {
      onReady();
    }
  }, [brandTexture, onReady]);

  const screenMaterial = useMemo(() => {
    if (!brandTexture) {
      return null;
    }

    return new MeshBasicMaterial({
      map: brandTexture.texture,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
  }, [brandTexture]);

  useEffect(
    () => () => {
      screenMaterial?.dispose();
    },
    [screenMaterial],
  );

  const preparedScene = useMemo(() => {
    if (!screenMaterial) {
      return null;
    }

    const clone = scene.clone(true);
    const materialClones = new Map<Material, Material>();

    clone.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return;
      }

      object.castShadow = true;
      object.receiveShadow = true;
      const sourceMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      const materials = sourceMaterials.map((material) => {
        const existingClone = materialClones.get(material);

        if (existingClone) {
          return existingClone;
        }

        const clonedMaterial =
          material instanceof MeshStandardMaterial
            ? createLaptopMaterial(material)
            : material.clone();

        materialClones.set(material, clonedMaterial);
        return clonedMaterial;
      });

      object.material = Array.isArray(object.material) ? materials : materials[0];
    });

    const display = clone.getObjectByName("MES_Display");

    if (!(display instanceof Mesh)) {
      throw new Error("MES_Display was not found in MES_Laptop.glb.");
    }

    const replacedMaterials = Array.isArray(display.material)
      ? display.material
      : [display.material];

    replacedMaterials.forEach((material) => material.dispose());
    display.material = screenMaterial;

    return clone;
  }, [scene, screenMaterial]);

  useEffect(
    () => () => {
      if (preparedScene && screenMaterial) {
        disposePreparedLaptop(preparedScene, screenMaterial);
      }
    },
    [preparedScene, screenMaterial],
  );

  return preparedScene ? <primitive object={preparedScene} /> : null;
}

function WebGLContextLifecycle({
  onUnavailable,
}: {
  onUnavailable: () => void;
}) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };

    canvas.addEventListener("webglcontextlost", handleContextLoss, {
      once: true,
    });

    return () =>
      canvas.removeEventListener("webglcontextlost", handleContextLoss);
  }, [gl, onUnavailable]);

  return null;
}

function LaptopScene({
  progress,
  onReady,
  onUnavailable,
}: {
  progress: HeroProgressSignal;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const modelRef = useRef<Group>(null);
  const shadowRef = useRef<Group>(null);
  const cameraTarget = useMemo(() => new Vector3(), []);
  const aspect = size.width / Math.max(size.height, 1);
  const isPortrait = aspect < 0.64;
  const portraitScale = Math.min(1.16, Math.max(1, aspect / 0.462));
  const composition = isPortrait
    ? {
        ...portraitComposition,
        modelPosition: [
          portraitComposition.modelPosition[0],
          portraitComposition.modelPosition[1] - (portraitScale - 1) * 2.7,
          portraitComposition.modelPosition[2],
        ] as [number, number, number],
        modelScale: portraitComposition.modelScale * portraitScale,
        shadowPosition: [
          portraitComposition.shadowPosition[0],
          portraitComposition.shadowPosition[1] - (portraitScale - 1) * 2.7,
          portraitComposition.shadowPosition[2],
        ] as [number, number, number],
        shadowScale: portraitComposition.shadowScale * portraitScale,
      }
    : desktopComposition;

  useEffect(() => progress.subscribe(invalidate), [invalidate, progress]);

  useFrame(() => {
    const camera = cameraRef.current;
    const model = modelRef.current;
    const shadow = shadowRef.current;

    if (!camera || !model || !shadow) {
      return;
    }

    if (isPortrait) {
      const scrollProgress = progress.value;
      const orientation = smoothSegment(scrollProgress, 0.08, 0.64);
      const framing = smoothSegment(scrollProgress, 0.08, 0.52);
      const approach = smoothSegment(scrollProgress, 0.5, 0.92);
      const lift =
        smoothSegment(scrollProgress, 0.08, 0.42) *
        (1 - smoothSegment(scrollProgress, 0.48, 0.72)) *
        0.44;
      const modelY = composition.modelPosition[1] + lift;
      const displayCenterX = DISPLAY_LOCAL_CENTER.x * composition.modelScale;
      const displayCenterY =
        modelY + DISPLAY_LOCAL_CENTER.y * composition.modelScale;
      const displayCenterZ =
        composition.modelPosition[2] +
        DISPLAY_LOCAL_CENTER.z * composition.modelScale;
      const visibleScreenHalf =
        aspect / (2 * DISPLAY_ASPECT * SCREEN_OVERSCAN);
      const portalAnchor = clamp(0.635 + visibleScreenHalf, 0.74, 0.8);
      const displayAnchorX =
        displayCenterX +
        (portalAnchor - 0.5) * DISPLAY_LOCAL_SIZE.width * composition.modelScale;
      const takeoverDistance =
        (DISPLAY_LOCAL_SIZE.height * composition.modelScale) /
        (2 * Math.tan(MathUtils.degToRad(composition.fov / 2)) * SCREEN_OVERSCAN);
      const focusTargetX = MathUtils.lerp(
        displayCenterX,
        displayAnchorX,
        0.16,
      );
      const focusTargetY = displayCenterY + 0.18;
      const focusTargetZ = displayCenterZ + MOBILE_FOCUS_TARGET_Z_OFFSET;

      model.position.set(
        MathUtils.lerp(composition.modelPosition[0], 0, orientation),
        modelY,
        composition.modelPosition[2],
      );
      model.rotation.set(
        MathUtils.lerp(composition.modelRotation[0], 0, orientation),
        MathUtils.lerp(composition.modelRotation[1], 0, orientation),
        MathUtils.lerp(composition.modelRotation[2], 0, orientation),
      );
      model.scale.setScalar(composition.modelScale);

      shadow.position.set(
        MathUtils.lerp(composition.shadowPosition[0], 0, orientation),
        composition.shadowPosition[1] + lift,
        composition.shadowPosition[2],
      );
      shadow.scale.setScalar(1);

      if (scrollProgress < 0.5) {
        camera.position.set(
          MathUtils.lerp(
            composition.camera[0],
            MOBILE_FOCUS_CAMERA.x,
            framing,
          ),
          MathUtils.lerp(
            composition.camera[1],
            MOBILE_FOCUS_CAMERA.y,
            framing,
          ),
          MathUtils.lerp(
            composition.camera[2],
            MOBILE_FOCUS_CAMERA.z,
            framing,
          ),
        );
        cameraTarget.set(
          MathUtils.lerp(composition.target[0], focusTargetX, framing),
          MathUtils.lerp(composition.target[1], focusTargetY, framing),
          MathUtils.lerp(composition.target[2], focusTargetZ, framing),
        );
      } else {
        camera.position.set(
          MathUtils.lerp(MOBILE_FOCUS_CAMERA.x, displayAnchorX, approach),
          MathUtils.lerp(MOBILE_FOCUS_CAMERA.y, displayCenterY, approach),
          MathUtils.lerp(
            MOBILE_FOCUS_CAMERA.z,
            displayCenterZ + takeoverDistance,
            approach,
          ),
        );
        cameraTarget.set(
          MathUtils.lerp(focusTargetX, displayAnchorX, approach),
          MathUtils.lerp(focusTargetY, displayCenterY, approach),
          MathUtils.lerp(focusTargetZ, displayCenterZ, approach),
        );
      }

      camera.lookAt(cameraTarget);
      return;
    }

    const scrollProgress = progress.value;
    const orientation = smoothSegment(scrollProgress, 0.12, 0.72);
    const openingMove = smoothSegment(scrollProgress, 0.12, 0.58);
    const approach = smoothSegment(scrollProgress, 0.58, 0.94);
    const displayCenterX = DISPLAY_LOCAL_CENTER.x * composition.modelScale;
    const displayCenterY =
      composition.modelPosition[1] +
      DISPLAY_LOCAL_CENTER.y * composition.modelScale;
    const displayCenterZ =
      composition.modelPosition[2] +
      DISPLAY_LOCAL_CENTER.z * composition.modelScale;
    const focusTargetX = displayCenterX + 0.08;
    const focusTargetZ = displayCenterZ + FOCUS_TARGET_Z_OFFSET;

    model.position.set(
      MathUtils.lerp(composition.modelPosition[0], 0, orientation),
      composition.modelPosition[1],
      composition.modelPosition[2],
    );
    model.rotation.set(
      MathUtils.lerp(composition.modelRotation[0], 0, orientation),
      MathUtils.lerp(composition.modelRotation[1], 0, orientation),
      MathUtils.lerp(composition.modelRotation[2], 0, orientation),
    );
    model.scale.setScalar(composition.modelScale);

    shadow.position.set(
      MathUtils.lerp(composition.shadowPosition[0], 0, orientation),
      composition.shadowPosition[1],
      composition.shadowPosition[2],
    );
    shadow.scale.setScalar(1);

    if (scrollProgress < 0.58) {
      camera.position.set(
        MathUtils.lerp(composition.camera[0], FOCUS_CAMERA.x, openingMove),
        MathUtils.lerp(composition.camera[1], FOCUS_CAMERA.y, openingMove),
        MathUtils.lerp(composition.camera[2], FOCUS_CAMERA.z, openingMove),
      );
      cameraTarget.set(
        MathUtils.lerp(composition.target[0], focusTargetX, openingMove),
        MathUtils.lerp(composition.target[1], displayCenterY, openingMove),
        MathUtils.lerp(composition.target[2], focusTargetZ, openingMove),
      );
    } else {
      camera.position.set(
        MathUtils.lerp(FOCUS_CAMERA.x, displayCenterX, approach),
        MathUtils.lerp(FOCUS_CAMERA.y, displayCenterY, approach),
        MathUtils.lerp(
          FOCUS_CAMERA.z,
          displayCenterZ + TAKEOVER_CAMERA_DISTANCE,
          approach,
        ),
      );
      cameraTarget.set(
        MathUtils.lerp(focusTargetX, displayCenterX, approach),
        displayCenterY,
        MathUtils.lerp(focusTargetZ, displayCenterZ, approach),
      );
    }

    camera.lookAt(cameraTarget);
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={composition.camera}
        fov={composition.fov}
        near={0.05}
        far={100}
      />

      <hemisphereLight
        intensity={0.8}
        color="#fff9ef"
        groundColor="#30352f"
      />
      <directionalLight
        castShadow={!isPortrait}
        color="#fff4d9"
        intensity={2.85}
        position={[-5.5, 8.5, 6.5]}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00015}
      />
      <directionalLight
        color="#dfeae2"
        intensity={0.85}
        position={[5, 3.5, 8]}
      />
      <Environment resolution={isPortrait ? 64 : 128} frames={1}>
        <Lightformer
          form="rect"
          color="#fffaf1"
          intensity={4.5}
          position={[0, 5, -5]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 8, 1]}
        />
        <Lightformer
          form="rect"
          color="#d3b06b"
          intensity={2.3}
          position={[-5, 1, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[3, 7, 1]}
        />
        <Lightformer
          form="rect"
          color="#dce9df"
          intensity={2.8}
          position={[5, 0, 1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[4, 8, 1]}
        />
      </Environment>

      <group
        ref={modelRef}
        position={composition.modelPosition}
        rotation={composition.modelRotation}
        scale={composition.modelScale}
      >
        <LaptopModel
          isPortrait={isPortrait}
          progress={progress}
          onReady={onReady}
          onUnavailable={onUnavailable}
        />
      </group>

      <group ref={shadowRef} position={composition.shadowPosition}>
        <ContactShadows
          frames={1}
          color="#013609"
          opacity={0.15}
          scale={composition.shadowScale}
          blur={2.7}
          far={4.5}
          resolution={isPortrait ? 256 : 512}
        />
      </group>
    </>
  );
}

function useMobileCanvasQuality() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(max-width: 47.999rem)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 47.999rem)");
    const update = () => setIsMobile(query.matches);

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function HeroCanvas({
  progress,
  onReady,
  onUnavailable,
}: {
  progress: HeroProgressSignal;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const isMobile = useMobileCanvasQuality();

  return (
    <Canvas
      frameloop="demand"
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      camera={{ fov: 30, near: 0.1, far: 100 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.12;
      }}
      shadows={!isMobile}
    >
      <WebGLContextLifecycle onUnavailable={onUnavailable} />
      <LaptopScene
        progress={progress}
        onReady={onReady}
        onUnavailable={onUnavailable}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
