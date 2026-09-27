"use client";

import { useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import type { MasterDegreeNode as PrismaNode } from "@prisma/client";

const NODE_TYPE_COLORS: Record<string, string> = {
  root: "var(--color-accent)",
  country: "var(--color-voyage-navy)",
  university: "var(--color-theme-voyage)",
  program: "var(--color-voyage-gold)",
};

type DecisionDetails = {
  cost?: string;
  requirements?: string;
  deadline?: string;
  pros?: string;
  cons?: string;
  rationale?: string;
  confidence?: number | null;
};

function toReactFlowNodes(
  dbNodes: PrismaNode[],
  selectedNodeId: string | null,
): Node[] {
  return dbNodes.map((n) => ({
    id: n.id,
    position: { x: n.positionX, y: n.positionY },
    data: { label: n.label },
    style: {
      background: NODE_TYPE_COLORS[n.nodeType] || "var(--color-bg-secondary)",
      color: "var(--color-text-primary)",
      border:
        n.id === selectedNodeId
          ? "2px solid var(--color-voyage-gold)"
          : "1px solid var(--color-border)",
      borderRadius: 8,
      padding: 10,
      fontSize: 13,
      boxShadow:
        n.id === selectedNodeId
          ? "0 0 0 4px color-mix(in srgb, var(--color-voyage-gold) 20%, transparent)"
          : undefined,
    },
    draggable: false,
  }));
}

function toReactFlowEdges(dbNodes: PrismaNode[]): Edge[] {
  return dbNodes
    .filter((n) => n.parentId)
    .map((n) => ({
      id: `${n.parentId}-${n.id}`,
      source: n.parentId!,
      target: n.id,
      style: { stroke: "var(--color-accent)" },
    }));
}

export default function MasterFlowchart({
  nodes: dbNodes,
}: {
  nodes: PrismaNode[];
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  if (dbNodes.length === 0) {
    return (
      <p className="text-text-muted text-center py-12">
        Masters degree flowchart coming soon.
      </p>
    );
  }

  const selectedNode = dbNodes.find((node) => node.id === selectedNodeId);
  const selectNode = (nodeId: string) => setSelectedNodeId(nodeId);

  return (
    <div className="bg-bg-secondary border border-border rounded-lg">
      <div className="h-[360px] sm:h-[500px]">
        <ReactFlow
          nodes={toReactFlowNodes(dbNodes, selectedNodeId)}
          edges={toReactFlowEdges(dbNodes)}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          onNodeClick={(_, node) => selectNode(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          fitView
        >
          <Background color="var(--color-border)" gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <details className="border-t border-border p-3">
        <summary className="cursor-pointer text-sm text-text-muted">
          View route as a list
        </summary>
        <ul className="mt-3 space-y-2">
          {dbNodes.map((node) => (
            <li key={node.id} className="text-sm text-text-primary break-words">
              <button
                type="button"
                onClick={() => selectNode(node.id)}
                aria-pressed={selectedNodeId === node.id}
                className={`w-full text-left rounded px-2 py-2 transition-colors ${
                  selectedNodeId === node.id
                    ? "bg-voyage-gold/15 text-text-primary"
                    : "hover:bg-bg-primary/60"
                }`}
              >
                <span className="text-text-muted">{node.nodeType}:</span>{" "}
                {node.label}
              </button>
            </li>
          ))}
        </ul>
      </details>
      <p
        className="border-t border-border px-4 py-3 text-sm text-text-muted"
        aria-live="polite"
      >
        {selectedNode
          ? `Selected route: ${selectedNode.label}`
          : "Select a route to inspect its decision note."}
      </p>
      {dbNodes.some((node) => node.details) && (
        <div className="border-t border-border p-4 space-y-4">
          <div>
            <h3 className="font-heading text-lg text-text-primary">
              Decision notes
            </h3>
            <p className="text-text-muted text-sm">
              Compare the options behind the flowchart, not just their labels.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbNodes.map((node) => {
              const details = (node.details ?? {}) as DecisionDetails;
              const hasDetails = Object.values(details).some(
                (value) => value !== "" && value != null,
              );
              if (!hasDetails) return null;

              return (
                <article
                  key={node.id}
                  className={`border rounded-lg p-4 transition-colors hover:border-voyage-teal/70 ${
                    selectedNodeId === node.id
                      ? "border-voyage-gold bg-voyage-gold/5"
                      : "border-border"
                  }`}
                  aria-current={selectedNodeId === node.id ? "true" : undefined}
                >
                  <div className="flex justify-between gap-3 mb-3">
                    <div>
                      <p className="text-text-muted text-xs uppercase">
                        {node.nodeType}
                      </p>
                      <h4 className="font-heading text-text-primary">
                        {node.label}
                      </h4>
                    </div>
                    {details.confidence != null && (
                      <span className="text-accent text-xs font-heading">
                        {details.confidence}% confidence
                      </span>
                    )}
                  </div>
                  {details.rationale && (
                    <p className="text-text-muted text-sm mb-3">
                      <strong className="text-text-primary">Why:</strong>{" "}
                      {details.rationale}
                    </p>
                  )}
                  <dl className="space-y-2 text-sm">
                    {details.cost && (
                      <div>
                        <dt className="text-text-muted">Cost</dt>
                        <dd className="text-text-primary">{details.cost}</dd>
                      </div>
                    )}
                    {details.requirements && (
                      <div>
                        <dt className="text-text-muted">Requirements</dt>
                        <dd className="text-text-primary">
                          {details.requirements}
                        </dd>
                      </div>
                    )}
                    {details.deadline && (
                      <div>
                        <dt className="text-text-muted">Deadline</dt>
                        <dd className="text-text-primary">
                          {details.deadline}
                        </dd>
                      </div>
                    )}
                    {details.pros && (
                      <div>
                        <dt className="text-text-muted">Pros</dt>
                        <dd className="text-green-300">{details.pros}</dd>
                      </div>
                    )}
                    {details.cons && (
                      <div>
                        <dt className="text-text-muted">Cons</dt>
                        <dd className="text-red-300">{details.cons}</dd>
                      </div>
                    )}
                  </dl>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
