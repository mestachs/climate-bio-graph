import React from "react";
import dataClimat from "./data/index.json";
import { ForceGraph } from "./components/forceGraph";
import "./App.css";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const NewLink = ({ href }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      Site
    </a>
  );
};

const Details = ({ record }) => {
  return (
    <>
      <h1>{record.name}</h1>
      {record.site && <NewLink href={record.site} />}
      {record.wikipedia && <NewLink href={record.wikipedia} />}
      {record.coverUrl && (
        <img style={{ width: "350px" }} src={record.coverUrl}></img>
      )}
      {record.twitter && (
        <div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={"https://twitter.com/" + record.twitter}
            style={{
              textDecoration: "none",
            }}
          >
            <i class="fab fa-twitter"></i>@{record.twitter}
          </a>
        </div>
      )}
      <div>
        <p>{record.bio}</p>
      </div>
      <div>
        <p>{record.description}</p>
      </div>
      <pre>{JSON.stringify(record, undefined, 4)}</pre>
    </>
  );
};

function App() {
  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div style="width:100%">     
      <b>${node.name}</b>
      <pre>${JSON.stringify(node.record, undefined, 4)}
      </pre>
    </div>`;
  }, []);

  const [selectedNode, setSelectedNode] = React.useState();

  const climateData = {
    nodes: [],
    links: [],
  };

  const types = [
    { what: "content", links: ["authors", "see_also", "appearance"] },
    { what: "persons", links: ["see_also", "appearance"] },
    { what: "organisations", links: ["members", "see_also", "appearance"] },
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
    <QueryClientProvider client={queryClient}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ForceGraph
          key="force"
          linksData={climateData.links}
          nodesData={climateData.nodes}
          nodeHoverTooltip={nodeHoverTooltip}
          setHover={setSelectedNode}
        />
        {selectedNode && (
          <div style={{ maxWidth: "300px" }}>
            <Details record={selectedNode.record} />
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
