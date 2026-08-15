"use client";
import Link, { LinkProps } from "next/link";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

/** How long the outgoing page fades before we navigate. Matches the body
 *  transition in globals.css. */
const FADE_OUT_MS = 500;

/** Absolute ceiling on staying faded out. A page that never finishes loading
 *  must not leave the site invisible. */
const MAX_FADE_MS = 4000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  ...props
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Set alongside startTransition so both land in the same render — the fade is
  // only cleared once a navigation we actually started has finished.
  const [navigating, setNavigating] = useState(false);
  const bailoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//");

  const endFade = () => {
    document.body.classList.remove("page-transition");
    if (bailoutRef.current) clearTimeout(bailoutRef.current);
    bailoutRef.current = null;
  };

  // The previous version faded back in on a fixed timer, so any navigation
  // slower than the timer showed the *old* page again before the new one
  // arrived — a visible double flash, worst on mobile where routes are slower.
  // Waiting on the transition ties the fade to the real thing.
  useEffect(() => {
    if (!navigating || isPending) return;
    endFade();
    setNavigating(false);
  }, [navigating, isPending]);

  useEffect(() => () => endFade(), []);

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    // Skip transitions for external links!
    if (isExternal) return;
    // Let the browser handle new-tab / download / modified clicks.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();
    if (navigating) return;

    document.body.classList.add("page-transition");
    bailoutRef.current = setTimeout(endFade, MAX_FADE_MS);

    await sleep(FADE_OUT_MS);

    setNavigating(true);
    startTransition(() => router.push(href));
  };

  return (
    <Link
      draggable={false}
      href={href}
      {...props}
      onClick={handleTransition}
      {...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {children}
    </Link>
  );
};
