export type HeroProgressListener = () => void;

export type HeroProgressSignal = {
  readonly value: number;
  set: (nextValue: number) => void;
  subscribe: (listener: HeroProgressListener) => () => void;
};

export function createHeroProgressSignal(): HeroProgressSignal {
  let value = 0;
  const listeners = new Set<HeroProgressListener>();

  return {
    get value() {
      return value;
    },
    set(nextValue) {
      if (Math.abs(nextValue - value) < 0.0001) {
        return;
      }

      value = nextValue;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => listeners.delete(listener);
    },
  };
}
