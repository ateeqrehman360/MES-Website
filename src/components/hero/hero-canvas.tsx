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
  Vector3,
} from "three";

import { heroPhotography } from "@/data/hero";

import {
  createHeroDisplayTexture,
  getHeroDisplayDrawProgress,
  HERO_DISPLAY_TEXTURE_SIZE,
  type HeroDisplayPhotographs,
} from "./hero-display-texture";
import type { HeroProgressSignal } from "./hero-progress";

const MODEL_URL = "/models/MES_Laptop.glb";
const LOGO_URL = "/brand/mes-logo.svg";
const DISPLAY_LOCAL_CENTER = {
  x: -0.0006706475396640599,
  y: 10.722437858581543,
  z: -10.537602424621582,
} as const;
const DISPLAY_LOCAL_SIZE = {
  width: 29.302825927734375,
  height: 16.937835693359375,
} as const;
const DISPLAY_ASPECT =
  HERO_DISPLAY_TEXTURE_SIZE.width / HERO_DISPLAY_TEXTURE_SIZE.height;
const SCREEN_OVERSCAN = 1.074;
const FOCUS_CAMERA = { x: 0.12, y: 1.85, z: 9.5 } as const;
const FOCUS_TARGET_Z_OFFSET = 0.95;
const TAKEOVER_CAMERA_DISTANCE = 5.82;
const MOBILE_FOCUS_CAMERA = { x: 0.08, y: 1.05, z: 8.65 } as const;
const MOBILE_FOCUS_TARGET_Z_OFFSET = 0.82;
const FRAME_SURFACE_MAP_NAME = "MES_Frame_Surface_Map";

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
  camera: [0, 0, 15.8],
  target: [0.8, -1.05, 0],
  fov: 30,
  modelPosition: [2.1, -3.72, 0],
  modelRotation: [0.004, -1, 0.025],
  modelScale: 0.205,
  shadowPosition: [2.18, -3.84, -0.05],
  shadowScale: 9,
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

function loadDisplayImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => {
      image.onload = null;
      image.onerror = null;
      resolve(image);
    };
    image.onerror = () => {
      image.onload = null;
      image.onerror = null;
      reject(new Error(`Unable to load hero display asset: ${source}`));
    };
    image.src = source;
  });
}

function createLaptopMaterial(
  source: MeshStandardMaterial,
  useDesktopProductTreatment: boolean,
) {
  const isFrame = source.name === "ComputerFrame.001";
  const surfaceMap = isFrame ? createFrameSurfaceMap(source) : null;
  const material = new MeshPhysicalMaterial({
    alphaTest: source.alphaTest,
    color: isFrame
      ? useDesktopProductTreatment
        ? "#ffffff"
        : "#fff9ee"
      : useDesktopProductTreatment
        ? "#0d0f10"
        : "#f0eee8",
    depthWrite: source.depthWrite,
    dithering: true,
    emissive: source.emissive,
    emissiveIntensity: isFrame
      ? useDesktopProductTreatment
        ? 0.035
        : 0.055
      : useDesktopProductTreatment
        ? 0
        : 0.025,
    emissiveMap: source.emissiveMap,
    map: source.map,
    metalness: isFrame
      ? surfaceMap
        ? 1
        : useDesktopProductTreatment
          ? 0.48
          : 0.34
      : useDesktopProductTreatment
        ? 0.04
        : 0.2,
    metalnessMap: surfaceMap ?? source.metalnessMap,
    opacity: source.opacity,
    roughness: isFrame
      ? surfaceMap
        ? 1
        : useDesktopProductTreatment
          ? 0.3
          : 0.34
      : useDesktopProductTreatment
        ? 0.68
        : 0.4,
    roughnessMap: surfaceMap ?? source.roughnessMap,
    side: source.side,
    transparent: source.transparent,
    clearcoat: isFrame
      ? useDesktopProductTreatment
        ? 0.2
        : 0.28
      : useDesktopProductTreatment
        ? 0.05
        : 0.14,
    clearcoatRoughness: isFrame
      ? useDesktopProductTreatment
        ? 0.3
        : 0.24
      : useDesktopProductTreatment
        ? 0.52
        : 0.32,
    envMapIntensity: isFrame
      ? useDesktopProductTreatment
        ? 1.72
        : 1.35
      : useDesktopProductTreatment
        ? 0.3
        : 0.75,
  });

  material.name = source.name;

  if (isFrame) {
    if (useDesktopProductTreatment) {
      material.color.setRGB(1.56, 1.58, 1.62);
    } else {
      material.color.setRGB(1.16, 1.12, 1.06);
    }
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
  useDesktopProductTreatment,
  progress,
  onReady,
  onUnavailable,
}: {
  isPortrait: boolean;
  useDesktopProductTreatment: boolean;
  progress: HeroProgressSignal;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const invalidate = useThree((state) => state.invalidate);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [photographyRevision, setPhotographyRevision] = useState(0);
  const photographs = useRef<HeroDisplayPhotographs>([
    null,
    null,
    null,
  ]);
  const lastArtworkProgress = useRef(Number.NaN);

  useEffect(() => {
    let isActive = true;

    loadDisplayImage(LOGO_URL).then(
      (image) => {
        if (isActive) {
          setLogoImage(image);
        }
      },
      () => {
        if (isActive) {
          onUnavailable();
        }
      },
    );

    heroPhotography.forEach((photograph, index) => {
      loadDisplayImage(photograph.src).then(
        (image) => {
          if (!isActive) {
            return;
          }

          photographs.current[index] = image;
          setPhotographyRevision((revision) => revision + 1);
        },
        () => {
          // The display renderer keeps a branded fallback for a failed photo.
        },
      );
    });

    return () => {
      isActive = false;
    };
  }, [onUnavailable]);

  const displayTexture = useMemo(
    () =>
      logoImage
        ? createHeroDisplayTexture(logoImage, isPortrait)
        : null,
    [isPortrait, logoImage],
  );

  useEffect(
    () => () => {
      displayTexture?.texture.dispose();
    },
    [displayTexture],
  );

  useEffect(() => {
    if (!displayTexture) {
      return;
    }

    photographs.current.forEach((image, index) => {
      displayTexture.setPhotograph(index, image);
    });

    const artworkProgress = getHeroDisplayDrawProgress(progress.value);

    displayTexture.draw(artworkProgress);
    lastArtworkProgress.current = artworkProgress;
    invalidate();
  }, [displayTexture, invalidate, photographyRevision, progress]);

  useFrame(() => {
    if (!displayTexture) {
      return;
    }

    const artworkProgress = getHeroDisplayDrawProgress(progress.value);

    if (Math.abs(artworkProgress - lastArtworkProgress.current) < 0.001) {
      return;
    }

    displayTexture.draw(artworkProgress);
    lastArtworkProgress.current = artworkProgress;
  });

  useEffect(() => {
    if (displayTexture) {
      onReady();
    }
  }, [displayTexture, onReady]);

  const screenMaterial = useMemo(() => {
    if (!displayTexture) {
      return null;
    }

    return new MeshBasicMaterial({
      map: displayTexture.texture,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
  }, [displayTexture]);

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

      object.castShadow = object.name === "Frame_ComputerFrame_0";
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
            ? createLaptopMaterial(material, useDesktopProductTreatment)
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
  }, [scene, screenMaterial, useDesktopProductTreatment]);

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
  isMobile,
  progress,
  onReady,
  onUnavailable,
}: {
  isMobile: boolean;
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
  const useDesktopProductTreatment = !isMobile;
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
        intensity={useDesktopProductTreatment ? 1.06 : 0.8}
        color={useDesktopProductTreatment ? "#fffdf8" : "#fff9ef"}
        groundColor={useDesktopProductTreatment ? "#747773" : "#30352f"}
      />
      <directionalLight
        castShadow={!isPortrait}
        color={useDesktopProductTreatment ? "#fffdf8" : "#fff4d9"}
        intensity={useDesktopProductTreatment ? 3.45 : 2.85}
        position={[-5.5, 8.5, 6.5]}
        shadow-mapSize={[512, 512]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-bias={-0.00015}
        shadow-radius={18}
        shadow-blurSamples={24}
      />
      <directionalLight
        color={useDesktopProductTreatment ? "#edf3f2" : "#dfeae2"}
        intensity={useDesktopProductTreatment ? 1.16 : 0.85}
        position={[5, 3.5, 8]}
      />
      <Environment resolution={isPortrait ? 64 : 128} frames={1}>
        <Lightformer
          form="rect"
          color={useDesktopProductTreatment ? "#ffffff" : "#fffaf1"}
          intensity={useDesktopProductTreatment ? 5.8 : 4.5}
          position={[0, 5, -5]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 8, 1]}
        />
        <Lightformer
          form="rect"
          color={useDesktopProductTreatment ? "#f4eadc" : "#d3b06b"}
          intensity={useDesktopProductTreatment ? 3.15 : 2.3}
          position={[-5, 1, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[3, 7, 1]}
        />
        <Lightformer
          form="rect"
          color={useDesktopProductTreatment ? "#edf3f2" : "#dce9df"}
          intensity={useDesktopProductTreatment ? 3.4 : 2.8}
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
          useDesktopProductTreatment={useDesktopProductTreatment}
          progress={progress}
          onReady={onReady}
          onUnavailable={onUnavailable}
        />
      </group>

      <group ref={shadowRef} position={composition.shadowPosition}>
        {isPortrait ? (
          <ContactShadows
            frames={1}
            color="#013609"
            opacity={0.15}
            scale={composition.shadowScale}
            blur={2.7}
            far={4.5}
            resolution={256}
          />
        ) : (
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry
              args={[composition.shadowScale, composition.shadowScale]}
            />
            <shadowMaterial
              color="#252a26"
              opacity={0.5}
              transparent
              depthWrite={false}
            />
          </mesh>
        )}
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
      shadows={isMobile ? false : "variance"}
    >
      <WebGLContextLifecycle onUnavailable={onUnavailable} />
      <LaptopScene
        isMobile={isMobile}
        progress={progress}
        onReady={onReady}
        onUnavailable={onUnavailable}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
