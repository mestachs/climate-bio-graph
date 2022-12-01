import React from "react";
import dataClimat from "./data/index.json";
import { ForceGraph } from "./components/forceGraph";
import "./App.css";

function App() {
  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div style="width:100%">     
      <b>${node.name}</b>
      <pre>${JSON.stringify(node.record, undefined, 4)}
      </pre>
    </div>`;
  }, []);

  const climateData = {
    nodes: [],
    links: [],
  };

  const types = [
    { what: "content", links: ["authors"] },
    { what: "persons", links: [] },
    { what: "organisations", links: ["members"] },
  ];

  for (const type of types) {
    for (const id of Object.keys(dataClimat[type.what])) {
      const item = dataClimat[type.what][id];
      climateData.nodes.push({
        id: id,
        name: item.meta.name,
        gender: "male",
        record: item.meta,
      });
      for (const link of type.links) {
        if (item.meta[link]) {
          for (const linkid of item.meta[link]) {
            climateData.links.push({
              source: id,
              target: linkid,
            });
          }
        }
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">Force Graph Example</header>
      <section className="Main">
        <ForceGraph
          linksData={climateData.links}
          nodesData={climateData.nodes}
          nodeHoverTooltip={nodeHoverTooltip}
        />
      </section>
    </div>
  );
}

export default App;
