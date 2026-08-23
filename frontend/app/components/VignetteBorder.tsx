// Inline SVG border frames for the vignette masks.
//
// The stroke uses `vector-effect="non-scaling-stroke"` so the border renders at a
// constant device-pixel width (8px portrait, 2px landscape) regardless of how the
// frame is scaled responsively — the path stretches, the stroke does not.

type Props = { className?: string }

// Portrait-stroke gradient palettes (same offsets/geometry, different colors).
const portraitGradients = {
  peach: [
    ["0.100962", "#B03B1F"],
    ["0.259615", "white"],
    ["0.408654", "#D9C8AE"],
    ["0.552885", "white"],
    ["0.740385", "#D39370"],
    ["0.850962", "white"],
    ["1", "#B03F2B"],
  ],
  rose: [
    ["0.100962", "#EEAA9A"],
    ["0.259615", "white"],
    ["0.408654", "#CCB0A0"],
    ["0.552885", "white"],
    ["0.740385", "#C0937E"],
    ["0.850962", "white"],
    ["1", "#EFB0A2"],
  ],
} as const

export type PortraitGradient = keyof typeof portraitGradients

/** Portrait frame — gradient stroke, always 8px by default.
 *  `uid` must be unique per rendered instance: the gradient/filter ids are
 *  derived from it, so two instances on one page don't collide (a duplicate id
 *  makes the second instance reference the first — which breaks if that one is
 *  in a display:none subtree). */
export function VignetteBorderPortrait({
  className = "",
  uid = "portrait",
  strokeWidth = 8,
  variant = "peach",
}: Props & { uid?: string; strokeWidth?: number; variant?: PortraitGradient }) {
  const filterId = `vignette-portrait-texture-${uid}`
  const gradientId = `vignette-portrait-gradient-${uid}`
  return (
    <svg
      viewBox="0 0 480 909.745"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g filter={`url(#${filterId})`}>
        <path
          d="M434.016 8C434.043 18.6997 438.304 28.9551 445.872 36.523C452.873 43.5242 462.174 47.6933 472 48.3003V861.514C462.174 862.121 452.873 866.29 445.872 873.291C438.32 880.842 434.062 891.07 434.017 901.745H49.4944C49.4491 891.07 45.1912 880.842 37.6397 873.291C30.0477 865.699 19.7505 861.434 9.01376 861.434C8.6755 861.434 8.33732 861.438 8 861.446V48.3675C8.33734 48.3759 8.67547 48.3803 9.01376 48.3803C19.7505 48.3802 30.0477 44.115 37.6397 36.523C45.2074 28.9552 49.4682 18.6997 49.4952 8H434.016Z"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinejoin="bevel"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="480"
          height="909.745"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.999 0.999" numOctaves="3" seed="781" />
          <feDisplacementMap
            in="shape"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displacedImage"
            width="100%"
            height="100%"
          />
          <feMerge result="effect1_texture">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <linearGradient
          id={gradientId}
          x1="240"
          y1="8"
          x2="240"
          y2="901.745"
          gradientUnits="userSpaceOnUse"
        >
          {portraitGradients[variant].map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
    </svg>
  )
}

/** Portrait content frame — solid stroke, always 2px. Light by default
 *  (frames on dark grounds); pages on light paper pass black. */
export function VignetteBorderContentPortrait({
  className = "",
  stroke = "#D9D9D9",
}: Props & { stroke?: string }) {
  return (
    <svg
      viewBox="0 0 612.476 888.803"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g transform="translate(2, 2)">
        <path
          d="M567.184 0C567.263 10.6274 571.516 20.8025 579.037 28.3232C586.629 35.9153 596.926 40.1807 607.663 40.1807C607.934 40.1807 608.205 40.1753 608.476 40.1699V847.129C597.739 847.129 587.442 851.393 579.85 858.985C572.922 865.913 568.767 875.092 568.092 884.803H40.418C39.737 875.103 35.5826 865.934 28.6621 859.014C21.0701 851.422 10.7728 847.156 0.0361328 847.156C0.0241557 847.156 0.011976 847.156 0 847.156V40.3369C10.6061 40.2423 20.7579 35.9911 28.2646 28.4844C35.8232 20.9257 40.0818 10.6856 40.1191 0H567.184Z"
          stroke={stroke}
          strokeWidth={2}
          strokeLinejoin="bevel"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  )
}

/** Landscape frame — solid stroke, always 2px. Light by default (the frames sit
 *  on dark grounds); pages on light paper (Policies) pass black. */
export function VignetteBorderLandscape({
  className = "",
  stroke = "#D9D9D9",
}: Props & { stroke?: string }) {
  return (
    <svg
      viewBox="0 0 612.48 406.431"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M569.981 2C569.983 12.735 574.248 23.0301 581.839 30.6211C589.431 38.2131 599.728 42.4784 610.465 42.4785C610.47 42.4785 610.475 42.4775 610.48 42.4775V364.231C599.843 364.304 589.658 368.559 582.131 376.086C574.605 383.612 570.351 393.795 570.277 404.431H42.5166C42.5095 393.704 38.2447 383.418 30.6592 375.832C23.0671 368.24 12.77 363.975 2.0332 363.975C2.0222 363.975 2.011 363.975 2 363.975V42.4814C12.7279 42.475 23.0153 38.2122 30.6016 30.626C38.1936 23.034 42.4589 12.7367 42.459 2H569.981Z"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="bevel"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
