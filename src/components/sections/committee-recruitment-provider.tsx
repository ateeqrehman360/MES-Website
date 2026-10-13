"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  isRecruitmentOpen,
  isRecruitmentPage,
  recruitmentDelay,
  recruitmentSessionKey,
} from "@/lib/committee-recruitment";
import { CommitteeRecruitmentModal } from "./committee-recruitment-modal";
import { CommitteeRecruitmentPopup } from "./committee-recruitment-popup";

const ApplicationContext = createContext<((trigger: HTMLElement) => void) | null>(null);
type ModalState = {
  view: "invitation" | "application";
  pathname: string;
} | null;

export function useCommitteeApplication() {
  const openApplication = useContext(ApplicationContext);
  if (!openApplication) {
    throw new Error("Committee application requires its provider.");
  }
  return openApplication;
}

export function CommitteeRecruitmentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [modal, setModal] = useState<ModalState>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const seenRef = useRef(false);
  const view = modal?.pathname === pathname ? modal.view : null;

  // Discard route-owned dialogs during navigation so Back cannot resurrect one.
  if (modal && modal.pathname !== pathname) setModal(null);

  const rememberEncounter = useCallback(() => {
    seenRef.current = true;
    try {
      sessionStorage.setItem(recruitmentSessionKey, "true");
    } catch {
      // Storage may be disabled. Still suppress repeats during client navigation.
    }
  }, []);

  const openApplication = useCallback(
    (trigger: HTMLElement) => {
      rememberEncounter();
      triggerRef.current = trigger;
      setModal({ view: "application", pathname });
    },
    [pathname, rememberEncounter],
  );

  const close = useCallback(() => setModal(null), []);
  const applyFromInvitation = useCallback(() => {
    // The invitation finishes its exit and unmounts before showModal() runs for
    // the application. Preserve the pre-invitation focus destination.
    setModal({ view: "application", pathname });
  }, [pathname]);

  useEffect(() => {
    if (!isRecruitmentPage(pathname) || !isRecruitmentOpen() || seenRef.current) {
      return;
    }
    try {
      if (sessionStorage.getItem(recruitmentSessionKey)) return;
    } catch {
      // Use the in-memory session fallback above.
    }
    if (
      typeof HTMLDialogElement === "undefined" ||
      !("showModal" in HTMLDialogElement.prototype)
    ) {
      return;
    }

    let timer: number;
    const showInvitation = () => {
      if (seenRef.current || !isRecruitmentOpen()) return;
      // Never interrupt an open navigation/application dialog or an inactive tab.
      // Retry only while this eligible route is still mounted.
      if (
        document.visibilityState !== "visible" ||
        document.querySelector("dialog[open]")
      ) {
        timer = window.setTimeout(showInvitation, 500);
        return;
      }
      const active = document.activeElement;
      triggerRef.current =
        active instanceof HTMLElement && active !== document.body
          ? active
          : document.getElementById("main-content");
      rememberEncounter();
      setModal({ view: "invitation", pathname });
    };
    timer = window.setTimeout(showInvitation, recruitmentDelay);
    return () => window.clearTimeout(timer);
  }, [pathname, rememberEncounter]);

  return (
    <ApplicationContext.Provider value={openApplication}>
      {children}
      {view === "invitation" && (
        <CommitteeRecruitmentPopup
          triggerRef={triggerRef}
          onDismiss={close}
          onApply={applyFromInvitation}
        />
      )}
      {view === "application" && (
        <CommitteeRecruitmentModal isOpen onClose={close} triggerRef={triggerRef} />
      )}
    </ApplicationContext.Provider>
  );
}
