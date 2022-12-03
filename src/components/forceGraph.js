import React from "react";
import { runForceGraph } from "./forceGraphGenerator";
import styles from "./forceGraph.module.css";

export function ForceGraph({
  linksData,
  nodesData,
  nodeHoverTooltip,
  setHover,
}) {
  const containerRef = React.useRef("g");

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        nodeHoverTooltip,
        setHover
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [containerRef]);

  return <div key="g" id="g" ref={containerRef} className={styles.container} />;
}
