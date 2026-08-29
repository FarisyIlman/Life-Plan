"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import type { MasterDegreeNode as PrismaNode } from "@prisma/client";
import {
  createMasterDegreeNode,
  updateNodePosition,
  deleteMasterDegreeNode,
} from "@/lib/actions/master-degree-node";

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

export default function FlowchartEditor({
  initialNodes,
}: {
  initialNodes: PrismaNode[];
}) {
  const [dbNodes, setDbNodes] = useState(initialNodes);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    toReactFlowNodes(initialNodes),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    toReactFlowEdges(initialNodes),
  );

  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<
    "root" | "country" | "university" | "program"
  >("country");
  const [newParentId, setNewParentId] = useState("");

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);

      // Persist position changes on drag stop
      changes.forEach((change) => {
        if (
          change.type === "position" &&
          change.dragging === false &&
          change.position
        ) {
          updateNodePosition(change.id, change.position.x, change.position.y);
        }
      });
    },
    [onNodesChange],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const handleAddNode = async () => {
    if (!newLabel.trim()) return;

    const formData = new FormData();
    formData.set("label", newLabel);
    formData.set("nodeType", newType);
    formData.set("positionX", String(100 + Math.random() * 400));
    formData.set("positionY", String(100 + Math.random() * 300));
    if (newParentId) formData.set("parentId", newParentId);

    const res = await createMasterDegreeNode(formData);
    if (res?.success) {
      // Refetch is simplest here; reload page data
      window.location.reload();
    }
  };

  const handleDeleteSelected = async (nodeId: string) => {
    if (!confirm("Delete this node? Child nodes will need a new parent."))
      return;
    await deleteMasterDegreeNode(nodeId);
    window.location.reload();
  };

  return (
    <div>
      {/* Add node form */}
      <div className="flex gap-3 mb-4 flex-wrap items-end bg-bg-secondary border border-border rounded-lg p-4">
        <div>
          <label className="block text-text-muted text-xs mb-1">Label</label>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Singapore"
            className="p-2 rounded bg-bg-primary border border-border text-text-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-text-muted text-xs mb-1">Type</label>
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as typeof newType)}
            className="p-2 rounded bg-bg-primary border border-border text-text-primary text-sm"
          >
            <option value="root">Root</option>
            <option value="country">Country</option>
            <option value="university">University</option>
            <option value="program">Program</option>
          </select>
        </div>
        <div>
          <label className="block text-text-muted text-xs mb-1">
            Parent (optional)
          </label>
          <select
            value={newParentId}
            onChange={(e) => setNewParentId(e.target.value)}
            className="p-2 rounded bg-bg-primary border border-border text-text-primary text-sm"
          >
            <option value="">None</option>
            {dbNodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddNode}
          className="bg-accent text-white px-4 py-2 rounded text-sm font-heading hover:opacity-90"
        >
          + Add Node
        </button>
      </div>

      {/* React Flow canvas */}
      <div
        style={{ height: 600 }}
        className="bg-bg-secondary border border-border rounded-lg"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={(_, node) => handleDeleteSelected(node.id)}
          fitView
        >
          <Background color="#2A2E3F" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(n) => (n.style?.background as string) || "#2A2E3F"}
            style={{ background: "#1A1D29" }}
          />
        </ReactFlow>
      </div>

      <p className="text-text-muted text-xs mt-2">
        Double-click a node to delete it. Drag to reposition (auto-saves).
      </p>
    </div>
  );
}
