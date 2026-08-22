"use client";

import {
  ContactShadows,
  PerspectiveCamera,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  CanvasTexture,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera as ThreePerspectiveCamera,
  SRGBColorSpace,
} from "three";

const MODEL_URL = "/models/MES_Laptop.glb";
const LOGO_URL = "/brand/mes-logo.svg";
const DISPLAY_TEXTURE_SIZE = { width: 1246, height: 720 } as const;

type ScreenMode = "brand" | "colour" | "uv";
type CompositionMode = "monument" | "diagonal" | "rear";

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
  monument: {
    camera: [0, 3.65, 13.8],
    target: [0.2, 0.4, 0],
    fov: 31,
    modelPosition: [0.7, -1.35, 0],
    modelRotation: [0.035, -0.38, 0.012],
    modelScale: 0.225,
    shadowPosition: [0.55, -1.34, 0.65],
    shadowScale: 8,
  },
  diagonal: {
    camera: [0, 3.7, 12.5],
    target: [0.55, 0.45, 0],
    fov: 29,
    modelPosition: [1.25, -1.45, -0.1],
    modelRotation: [0.08, -0.57, -0.035],
    modelScale: 0.285,
    shadowPosition: [1.05, -1.44, 0.65],
    shadowScale: 9,
  },
  rear: {
    camera: [0, 3.6, 13.5],
    target: [0, 0.5, 0],
    fov: 30,
    modelPosition: [0, -1.35, 0],
    modelRotation: [0.03, 2.78, -0.015],
    modelScale: 0.25,
    shadowPosition: [-0.1, -1.34, 0.65],
    shadowScale: 8.5,
  },
};

const portraitComposition: Composition = {
  camera: [0, 3.8, 14.4],
  target: [0, -0.05, 0],
  fov: 35,
  modelPosition: [0, -2.15, 0],
  modelRotation: [0.045, -0.43, 0.012],
  modelScale: 0.145,
  shadowPosition: [-0.05, -2.14, 0.55],
  shadowScale: 5.25,
};

function useDevelopmentSceneOptions(): {
  screenMode: ScreenMode;
  compositionMode: CompositionMode;
} {
  const [{ screenMode, compositionMode }] = useState(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
      return {
        screenMode: "brand" as ScreenMode,
        compositionMode: "monument" as CompositionMode,
      };
    }

    const params = new URLSearchParams(window.location.search);
    const screen = params.get("screen");
    const view = params.get("view");

    return {
      screenMode:
        screen === "colour" || screen === "uv"
          ? (screen as ScreenMode)
          : "brand",
      compositionMode:
        view === "diagonal" || view === "rear"
          ? (view as CompositionMode)
          : "monument",
    };
  });

  return { screenMode, compositionMode };
}

function createBrandTexture(image: CanvasImageSource) {
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

function LaptopModel({ screenMode }: { screenMode: ScreenMode }) {
  const { scene } = useGLTF(MODEL_URL);
  const logoTexture = useTexture(LOGO_URL);

  const brandTexture = useMemo(
    () => createBrandTexture(logoTexture.image as CanvasImageSource),
    [logoTexture.image],
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

    return new MeshBasicMaterial({
      map: screenMode === "uv" ? uvTexture : brandTexture,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
  }, [brandTexture, screenMode, uvTexture]);

  const preparedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return;
      }

      object.castShadow = true;
      object.receiveShadow = true;
      object.material = Array.isArray(object.material)
        ? object.material.map((material) => material.clone())
        : object.material.clone();

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (material instanceof MeshStandardMaterial) {
          material.emissiveIntensity = 0.16;
          material.roughness = Math.max(material.roughness, 0.62);
        }
      });
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
      preparedScene.traverse((object) => {
        if (!(object instanceof Mesh)) {
          return;
        }

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          if (material !== screenMaterial) {
            material.dispose();
          }
        });
      });

      brandTexture.dispose();
      uvTexture.dispose();
      screenMaterial.dispose();
    },
    [brandTexture, preparedScene, screenMaterial, uvTexture],
  );

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
}: {
  screenMode: ScreenMode;
  compositionMode: CompositionMode;
}) {
  const size = useThree((state) => state.size);
  const isPortrait = size.width / Math.max(size.height, 1) < 0.76;
  const composition = isPortrait
    ? portraitComposition
    : desktopCompositions[compositionMode];

  return (
    <>
      <ArtDirectedCamera composition={composition} />

      <hemisphereLight
        intensity={1.4}
        color="#fff9ef"
        groundColor="#618c5d"
      />
      <directionalLight
        castShadow
        color="#fff4d9"
        intensity={2.15}
        position={[-5.5, 8, 7]}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00015}
      />

      <group
        position={composition.modelPosition}
        rotation={composition.modelRotation}
        scale={composition.modelScale}
      >
        <LaptopModel screenMode={screenMode} />
      </group>

      <ContactShadows
        frames={1}
        color="#013609"
        opacity={0.18}
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
  const { screenMode, compositionMode } = useDevelopmentSceneOptions();

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
      shadows
    >
      <LaptopScene
        screenMode={screenMode}
        compositionMode={compositionMode}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
useTexture.preload(LOGO_URL);
