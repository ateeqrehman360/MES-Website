"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  networkEntries,
  networkRows,
  type NetworkEntry,
} from "@/data/network";

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function NetworkLogo({
  entry,
  loadAssets,
  decorative = false,
}: {
  entry: NetworkEntry;
  loadAssets: boolean;
  decorative?: boolean;
}) {
  return (
    <li className={`network-logo network-logo--${entry.shape}`}>
      <Image
        src={loadAssets ? entry.logo.src : TRANSPARENT_PIXEL}
        alt={decorative ? "" : entry.alt}
        width={entry.logo.width}
        height={entry.logo.height}
        sizes="(min-width: 64rem) 12rem, 10rem"
        loading={loadAssets ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        unoptimized
      />
    </li>
  );
}

function NetworkSequence({
  entries,
  loadAssets,
  decorative = false,
}: {
  entries: readonly NetworkEntry[];
  loadAssets: boolean;
  decorative?: boolean;
}) {
  return (
    <ul
      className="network-marquee__sequence"
      aria-hidden={decorative || undefined}
    >
      {entries.map((entry) => (
        <NetworkLogo
          key={`${decorative ? "duplicate" : "primary"}-${entry.id}`}
          entry={entry}
          loadAssets={loadAssets}
          decorative={decorative}
        />
      ))}
    </ul>
  );
}

function NetworkMarqueeRow({
  entries,
  direction,
  loadAssets,
}: {
  entries: readonly NetworkEntry[];
  direction: "left" | "right";
  loadAssets: boolean;
}) {
  return (
    <div className={`network-marquee network-marquee--${direction}`}>
      <div className="network-marquee__track">
        <NetworkSequence entries={entries} loadAssets={loadAssets} />
        <NetworkSequence entries={entries} loadAssets={loadAssets} decorative />
      </div>
    </div>
  );
}

export function OurNetworkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [loadAssets, setLoadAssets] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const Observer = window.IntersectionObserver;

    if (typeof Observer !== "function") {
      const fallback = globalThis.setTimeout(() => setLoadAssets(true), 0);

      return () => globalThis.clearTimeout(fallback);
    }

    const observer = new Observer(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setLoadAssets(true);
        observer.disconnect();
      },
      { rootMargin: "100% 0px" },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-network"
      className="our-network"
      aria-labelledby="our-network-title"
      data-network-assets={loadAssets ? "ready" : "pending"}
    >
      <div className="our-network__header site-container">
        <h2 id="our-network-title">Our Network</h2>
        <p>Businesses, organisations and speakers who have worked with MES.</p>
      </div>

      <div className="our-network__marquees">
        <NetworkMarqueeRow
          entries={networkRows[0]}
          direction="left"
          loadAssets={loadAssets}
        />
        <NetworkMarqueeRow
          entries={networkRows[1]}
          direction="right"
          loadAssets={loadAssets}
        />
      </div>

      <ul className="our-network__static-grid site-container">
        {networkEntries.map((entry) => (
          <NetworkLogo
            key={`static-${entry.id}`}
            entry={entry}
            loadAssets={loadAssets}
          />
        ))}
      </ul>
    </section>
  );
}
