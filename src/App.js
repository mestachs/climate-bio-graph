import React from "react";
import dataClimat from "./data/index.json";
import { ForceGraph } from "./components/forceGraph";
import "./App.css";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const NewLink = ({ href, children }) => {
  return (
    <div>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children || "Site"}
      </a>
    </div>
  );
};

const Details = ({ record }) => {
  return (
    <div style={{ margin: "15px", padding: "15px" }}>
      <h1>{record.name}</h1>
      {record.site && (
        <NewLink href={record.site}>
          <i
            class="fa-solid fa-square-up-right"
            style={{ paddingRight: "2px" }}
          ></i>
          Site
        </NewLink>
      )}
      {record.wikipedia && (
        <NewLink href={record.wikipedia}>
          <i class="fab fa-wikipedia-w" aria-hidden="true"></i>ikipedia
        </NewLink>
      )}

      {record.youtube && (
        <div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={record.youtube}
            style={{
              textDecoration: "none",
            }}
          >
            <i class="fab fa-youtube"></i>
            {record.youtube.replaceAll("https://www.youtube.com/", "")}
          </a>
        </div>
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
      {record.embedAcast && (
        <iframe
          src={record.embedAcast}
          frameBorder="0"
          width="100%"
          height="110px"
          allow="autoplay"
        ></iframe>
      )}
      {record.audioUrl && <audio src={record.audioUrl} controls></audio>}
      {record.coverUrl && (
        <img
          style={{ width: "350px", borderRadius: "5px" }}
          src={record.coverUrl}
        ></img>
      )}
      {record.youtubePlaylist && (
        <iframe
          width="460"
          height="315"
          src={"https://www.youtube.com/embed/" + record.youtubePlaylist}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      )}
    </div>
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
        {selectedNode == undefined && (
          <h1>
            Cliquer sur un des noeuds pour en savoir plus sur la transition
            énergétique, écologique.
          </h1>
        )}
        {selectedNode && (
          <div
            style={{
              alignSelf: "flex-start",
              position: "sticky",
              top: "10px",
              width: "500px",
            }}
          >
            <Details record={selectedNode.record} />
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
