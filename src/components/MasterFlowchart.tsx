"use client";

import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import type { MasterDegreeNode as PrismaNode } from "@prisma/client";

const NODE_TYPE_COLORS: Record<string, string> = {
  root: "#7C6FEF",
  country: "#1E3A8A",
  university: "#0D9488",
  program: "#D97706",
};

function toReactFlowNodes(dbNodes: PrismaNode[]): Node[] {
  return dbNodes.map((n) => ({
    id: n.id,
    position: { x: n.positionX, y: n.positionY },
    data: { label: n.label },
    style: {
      background: NODE_TYPE_COLORS[n.nodeType] || "#2A2E3F",
      color: "#E8E9ED",
      border: "1px solid #2A2E3F",
      borderRadius: 8,
      padding: 10,
      fontSize: 13,
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
      style: { stroke: "#7C6FEF" },
    }));
}

export default function MasterFlowchart({
  nodes: dbNodes,
}: {
  nodes: PrismaNode[];
}) {
  if (dbNodes.length === 0) {
    return (
      <p className="text-text-muted text-center py-12">
        Masters degree flowchart coming soon.
      </p>
    );
  }

  return (
    <div
      style={{ height: 500 }}
      className="bg-bg-secondary border border-border rounded-lg"
    >
      <ReactFlow
        nodes={toReactFlowNodes(dbNodes)}
        edges={toReactFlowEdges(dbNodes)}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
      >
        <Background color="#2A2E3F" gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
