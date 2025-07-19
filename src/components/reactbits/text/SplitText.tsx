import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: "chars" | "words";
  textAlign?: React.CSSProperties["textAlign"];
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 0.05,
  duration = 0.6,
  splitType = "words",
  textAlign = "center",
}) => {
  const splits = splitType === "words" ? text.split(" ") : text.split("");

  return (
    <div
      className={`split-text ${className}`}
      style={{
        textAlign,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: textAlign === "center" ? "center" : "flex-start",
      }}
    >
      {splits.map((item, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: index * delay,
            ease: "easeOut",
          }}
          style={{
            display: "inline-block",
            marginRight: splitType === "words" ? "0.25em" : undefined,
          }}
        >
          {item}
          {splitType === "words" && " "}
        </motion.span>
      ))}
    </div>
  );
};

export default SplitText;
export { SplitText };