"use client";
import Link, { LinkProps } from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  ...props
}) => {
  const router = useRouter();
  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//");

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    // Skip transitions for external links!
    if (isExternal) return;

    e.preventDefault();

    document.body.classList.add("page-transition");

    await sleep(500);
    router.push(href);
    await sleep(500);

    document.body.classList.remove("page-transition");
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
