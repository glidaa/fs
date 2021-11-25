import React, { useMemo } from "react"
import styles from "./ProgressRing.module.scss"

const ProgressRing = (props) => {
  const { radius, stroke } = props;
  const progress = isNaN(props.progress) ? 100 : parseInt(props.progress)
  const normalizedRadius = useMemo(() => radius - stroke * 2, [radius, stroke]);
  const circumference = useMemo(() => normalizedRadius * 2 * Math.PI, [normalizedRadius]);
  const strokeDashoffset = useMemo(() => circumference - progress / 100 * circumference, [circumference, progress]);

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
    >
      <circle
        className={styles.InnerRing}
        stroke="none"
        fill="#FFFFFF"
        strokeWidth={stroke / 2}
        strokeDasharray={`${circumference} ${circumference}`}
        r={(normalizedRadius - stroke / 2) + 3}
        cx={radius}
        cy={radius}
      />
      <circle
        className={styles.OuterRing}
        stroke={`hsl(${progress},100%,50%)`}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        r={normalizedRadius - 3}
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
    </svg>
    );
}

export default ProgressRing