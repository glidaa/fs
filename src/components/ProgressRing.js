import React, { useMemo } from "react"
import styledComponents from "styled-components"

const ProgressRing = (props) => {
  const { radius, stroke, progress } = props;
  const normalizedRadius = useMemo(() => radius - stroke * 2, [radius, stroke]);
  const circumference = useMemo(() => normalizedRadius * 2 * Math.PI, [normalizedRadius]);
  const strokeDashoffset = useMemo(() => circumference - progress / 100 * circumference, [circumference, progress]);

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
    >
      {progress < 100 && <>
        <InnerRing
          stroke="none"
          fill="#FFFFFF"
          strokeWidth={stroke / 2}
          strokeDasharray={`${circumference} ${circumference}`}
          r={normalizedRadius - stroke / 2}
          cx={radius}
          cy={radius}
        />
        <OuterRing
          stroke={`hsl(${progress},100%,50%)`}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          fontWeight={600}
          fill={`hsl(${progress},100%,50%)`}
          stroke="none"
          dy=".3em"
        >
          {progress}%
        </text>
      </>}
      {progress === 100 && <>
        <circle
          stroke="none"
          fill="#00E676"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </>}
    </svg>
    );
}

const OuterRing = styledComponents.circle`
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  stroke-linecap: round;
`

const InnerRing = styledComponents.circle`
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  opacity: 0.25;
`

export default ProgressRing