"use client";

import {
  ContactShadows,
  Environment,
  Lightformer,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  CanvasTexture,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera as ThreePerspectiveCamera,
  SRGBColorSpace,
} from "three";

const MODEL_URL = "/models/MES_Laptop.glb";
const LOGO_URL = "/brand/mes-logo.svg";
const DISPLAY_TEXTURE_SIZE = { width: 1246, height: 720 } as const;

type ScreenMode = "brand" | "mark" | "colour" | "uv";
type CompositionMode = "poster" | "offset" | "gallery" | "baseline";
type MaterialMode = "studio" | "satin" | "baseline";

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

const desktopCompositions: Record<CompositionMode, Composition> = {
  poster: {
    camera: [0, 3.75, 14.1],
    target: [0.25, -0.1, 0],
    fov: 31,
    modelPosition: [0.8, -2.25, 0],
    modelRotation: [0.045, -0.42, 0.008],
    modelScale: 0.205,
    shadowPosition: [0.55, -2.24, 0.65],
    shadowScale: 7.4,
  },
  offset: {
    camera: [0, 3.8, 14],
    target: [0.5, -0.2, 0],
    fov: 31,
    modelPosition: [1.35, -2.1, 0],
    modelRotation: [0.06, -0.5, -0.015],
    modelScale: 0.212,
    shadowPosition: [1.05, -2.09, 0.65],
    shadowScale: 7.6,
  },
  gallery: {
    camera: [0, 4.05, 14.8],
    target: [0.15, -0.45, 0],
    fov: 31,
    modelPosition: [0.3, -2.2, 0],
    modelRotation: [0.08, -0.31, 0.02],
    modelScale: 0.195,
    shadowPosition: [0.2, -2.19, 0.55],
    shadowScale: 7.1,
  },
  baseline: {
    camera: [0, 3.65, 13.8],
    target: [0.2, 0.4, 0],
    fov: 31,
    modelPosition: [0.7, -1.35, 0],
    modelRotation: [0.035, -0.38, 0.012],
    modelScale: 0.225,
    shadowPosition: [0.55, -1.34, 0.65],
    shadowScale: 8,
  },
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

function useDevelopmentSceneOptions(): {
  screenMode: ScreenMode;
  compositionMode: CompositionMode;
  materialMode: MaterialMode;
} {
  const [{ screenMode, compositionMode, materialMode }] = useState(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
      return {
        screenMode: "brand" as ScreenMode,
        compositionMode: "poster" as CompositionMode,
        materialMode: "studio" as MaterialMode,
      };
    }

    const params = new URLSearchParams(window.location.search);
    const screen = params.get("screen");
    const view = params.get("view");
    const material = params.get("material");

    return {
      screenMode:
        screen === "mark" || screen === "colour" || screen === "uv"
          ? (screen as ScreenMode)
          : "brand",
      compositionMode:
        view === "offset" || view === "gallery" || view === "baseline"
          ? (view as CompositionMode)
          : "poster",
      materialMode:
        material === "satin" || material === "baseline"
          ? (material as MaterialMode)
          : "studio",
    };
  });

  return { screenMode, compositionMode, materialMode };
}

function createMarkTexture(image: CanvasImageSource) {
  const canvas = document.createElement("canvas");
  canvas.width = DISPLAY_TEXTURE_SIZE.width;
  canvas.height = DISPLAY_TEXTURE_SIZE.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create the MES display texture.");
  }

  context.fillStyle = "#eae2d4";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const logoHeight = 230;
  const logoWidth = logoHeight * (560 / 610);
  context.drawImage(
    image,
    (canvas.width - logoWidth) / 2,
    (canvas.height - logoHeight) / 2,
    logoWidth,
    logoHeight,
  );

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = true;
  texture.needsUpdate = true;

  return texture;
}

function createBrandTexture(image: CanvasImageSource) {
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

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.fillStyle = "#013609";
  context.fillRect(0, 0, 790, canvas.height);
  context.fillStyle = "#c29231";
  context.fillRect(790, 0, 20, canvas.height);
  context.fillStyle = "#f4ede2";
  context.fillRect(810, 0, canvas.width - 810, canvas.height);

  context.fillStyle = "#c29231";
  context.fillRect(76, 108, 116, 8);

  context.fillStyle = "#f4ede2";
  context.textBaseline = "alphabetic";
  context.font = `400 126px ${displayFont || "Georgia, serif"}`;
  context.fillText("MUSLIM", 72, 303);
  context.font = `400 67px ${displayFont || "Georgia, serif"}`;
  context.fillText("ENTREPRENEURS", 72, 405);

  context.strokeStyle = "rgba(244, 237, 226, 0.55)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(74, 555);
  context.lineTo(700, 555);
  context.stroke();

  const logoHeight = 400;
  const logoWidth = logoHeight * (560 / 610);
  context.drawImage(
    image,
    810 + (canvas.width - 810 - logoWidth) / 2,
    (canvas.height - logoHeight) / 2,
    logoWidth,
    logoHeight,
  );

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = true;
  texture.needsUpdate = true;

  return texture;
}

function createUvTestTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = DISPLAY_TEXTURE_SIZE.width;
  canvas.height = DISPLAY_TEXTURE_SIZE.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create the MES display test texture.");
  }

  const swatches = ["#c29231", "#01500b", "#618c5d", "#013609"];
  const labels = ["TOP LEFT", "TOP RIGHT", "BOTTOM LEFT", "BOTTOM RIGHT"];

  swatches.forEach((swatch, index) => {
    const x = index % 2 === 0 ? 0 : canvas.width / 2;
    const y = index < 2 ? 0 : canvas.height / 2;
    context.fillStyle = swatch;
    context.fillRect(x, y, canvas.width / 2, canvas.height / 2);
    context.fillStyle = index === 0 || index === 2 ? "#013609" : "#f4ede2";
    context.font = "600 42px sans-serif";
    context.fillText(labels[index], x + 46, y + 72);
  });

  context.strokeStyle = "#f4ede2";
  context.lineWidth = 12;
  context.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = true;
  texture.needsUpdate = true;

  return texture;
}

function createLaptopMaterial(
  source: MeshStandardMaterial,
  materialMode: MaterialMode,
) {
  if (materialMode === "baseline") {
    const material = source.clone();
    material.emissiveIntensity = 0.16;
    material.roughness = Math.max(material.roughness, 0.62);
    return material;
  }

  const isFrame = source.name === "ComputerFrame.001";
  const isSatin = materialMode === "satin";
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
    metalness: isFrame ? (surfaceMap ? 1 : isSatin ? 0.18 : 0.34) : 0.2,
    metalnessMap: surfaceMap ?? source.metalnessMap,
    opacity: source.opacity,
    roughness: isFrame ? (surfaceMap ? 1 : isSatin ? 0.27 : 0.34) : 0.4,
    roughnessMap: surfaceMap ?? source.roughnessMap,
    side: source.side,
    transparent: source.transparent,
    clearcoat: isFrame ? (isSatin ? 0.46 : 0.28) : 0.14,
    clearcoatRoughness: isFrame ? 0.24 : 0.32,
    envMapIntensity: isFrame ? (isSatin ? 1 : 1.35) : 0.75,
  });

  material.name = source.name;

  if (isFrame) {
    material.color.setRGB(
      isSatin ? 1.08 : 1.16,
      isSatin ? 1.06 : 1.12,
      isSatin ? 1.02 : 1.06,
    );
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
  texture.flipY = source.map?.flipY ?? false;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}

function LaptopModel({
  screenMode,
  materialMode,
}: {
  screenMode: ScreenMode;
  materialMode: MaterialMode;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

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
    image.src = LOGO_URL;

    return () => {
      isActive = false;
      image.onload = null;
    };
  }, []);

  const brandTexture = useMemo(
    () => (logoImage ? createBrandTexture(logoImage) : null),
    [logoImage],
  );
  const markTexture = useMemo(
    () => (logoImage ? createMarkTexture(logoImage) : null),
    [logoImage],
  );
  const uvTexture = useMemo(() => createUvTestTexture(), []);

  const screenMaterial = useMemo(() => {
    if (screenMode === "colour") {
      return new MeshBasicMaterial({
        color: new Color("#c29231"),
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
    }

    const selectedTexture =
      screenMode === "uv"
        ? uvTexture
        : screenMode === "mark"
          ? markTexture
          : brandTexture;

    if (!selectedTexture) {
      return new MeshBasicMaterial({
        color: new Color("#013609"),
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
    }

    return new MeshBasicMaterial({
      map: selectedTexture,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
  }, [brandTexture, markTexture, screenMode, uvTexture]);

  const preparedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return;
      }

      object.castShadow = true;
      object.receiveShadow = true;
      const sourceMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      const materials = sourceMaterials.map((material) =>
        material instanceof MeshStandardMaterial
          ? createLaptopMaterial(material, materialMode)
          : material.clone(),
      );

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
  }, [materialMode, scene, screenMaterial]);

  return <primitive object={preparedScene} />;
}

function ArtDirectedCamera({ composition }: { composition: Composition }) {
  const rotation = useMemo(() => {
    const camera = new ThreePerspectiveCamera();
    camera.position.set(...composition.camera);
    camera.lookAt(...composition.target);

    return [camera.rotation.x, camera.rotation.y, camera.rotation.z] as const;
  }, [composition]);

  return (
    <PerspectiveCamera
      makeDefault
      position={composition.camera}
      rotation={rotation}
      fov={composition.fov}
      near={0.1}
      far={100}
    />
  );
}

function LaptopScene({
  screenMode,
  compositionMode,
  materialMode,
}: {
  screenMode: ScreenMode;
  compositionMode: CompositionMode;
  materialMode: MaterialMode;
}) {
  const size = useThree((state) => state.size);
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
    : desktopCompositions[compositionMode];

  return (
    <>
      <ArtDirectedCamera composition={composition} />

      <hemisphereLight
        intensity={0.8}
        color="#fff9ef"
        groundColor="#30352f"
      />
      <directionalLight
        castShadow
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
      <Environment resolution={128} frames={1}>
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
        position={composition.modelPosition}
        rotation={composition.modelRotation}
        scale={composition.modelScale}
      >
        <LaptopModel screenMode={screenMode} materialMode={materialMode} />
      </group>

      <ContactShadows
        frames={1}
        color="#013609"
        opacity={0.15}
        position={composition.shadowPosition}
        scale={composition.shadowScale}
        blur={2.7}
        far={4.5}
        resolution={512}
      />
    </>
  );
}

export function HeroCanvas() {
  const {
    screenMode,
    compositionMode,
    materialMode,
  } = useDevelopmentSceneOptions();

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ fov: 30, near: 0.1, far: 100 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.12;
      }}
      shadows
    >
      <LaptopScene
        screenMode={screenMode}
        compositionMode={compositionMode}
        materialMode={materialMode}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
