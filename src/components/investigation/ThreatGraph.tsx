'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
  type OnSelectionChangeFunc,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { IntelNode, type IntelNodeData } from '@/components/graph/IntelNode';
import { useIntelligence } from '@/context/IntelligenceContext';
import { GraphNode as GraphNodeType, GraphEdge as GraphEdgeType, Entity } from '@/types/intelligence';
import { Layers, Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ThreatGraphProps {
  graphNodes: GraphNodeType[];
  graphEdges: GraphEdgeType[];
}

const nodeTypes = {
  intel: IntelNode,
};

function buildFlowNodes(src: GraphNodeType[]): Node[] {
  return src.map((n) => ({
    id: n.id,
    type: 'intel',
    position: { x: n.x * 1.3, y: n.y * 1.15 },
    data: {
      label: n.label,
      sublabel: n.sublabel,
      entityType: n.type,
      severity: n.severity,
      riskScore: n.riskScore,
    } satisfies IntelNodeData,
    draggable: true,
  }));
}

function buildFlowEdges(src: GraphEdgeType[]): Edge[] {
  return src.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: e.animated ?? false,
    type: 'default',
    style: {
      stroke: e.animated ? '#06b6d4' : '#334155',
      strokeWidth: e.animated ? 2 : 1.5,
    },
    labelStyle: {
      fill: '#94a3b8',
      fontSize: 10,
      fontFamily: 'monospace',
      fontWeight: 500,
    },
    labelBgStyle: {
      fill: '#0a0e17',
      stroke: '#1e293b',
      strokeWidth: 1,
    },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 4,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: e.animated ? '#06b6d4' : '#475569',
      width: 16,
      height: 16,
    },
  }));
}

export function ThreatGraph({ graphNodes, graphEdges }: ThreatGraphProps) {
  const { selectedEntity, setSelectedEntity, entities } = useIntelligence();

  const initialNodes = useMemo(() => buildFlowNodes(graphNodes), [graphNodes]);
  const initialEdges = useMemo(() => buildFlowEdges(graphEdges), [graphEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#06b6d4' } }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const matched = entities.find(
        (e) =>
          e.name.toLowerCase() === (node.data as IntelNodeData).label.toLowerCase() ||
          (node.data as IntelNodeData).label.toLowerCase().includes(e.name.toLowerCase()) ||
          e.name.toLowerCase().includes((node.data as IntelNodeData).label.toLowerCase())
      );
      if (matched) {
        setSelectedEntity(matched);
      }
    },
    [entities, setSelectedEntity]
  );

  const minimapNodeColor = useCallback((node: Node) => {
    const d = node.data as IntelNodeData;
    switch (d.severity) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f59e0b';
      case 'MEDIUM': return '#3b82f6';
      default: return '#10b981';
    }
  }, []);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#080b12] overflow-hidden h-[560px] relative shadow-xl">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2.5 bg-[#080b12]/90 backdrop-blur-sm border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
            Entity Relationship Graph
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {graphNodes.length} nodes · {graphEdges.length} edges
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          Drag nodes · Scroll to zoom · Click to inspect
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
        defaultEdgeOptions={{
          type: 'default',
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(255,255,255,0.04)"
        />
        <Controls
          position="bottom-right"
          showInteractive={false}
          className="!bg-[#0a0e17] !border-white/[0.06] !shadow-xl [&>button]:!bg-[#0d1220] [&>button]:!border-white/[0.06] [&>button]:!text-slate-400 [&>button:hover]:!bg-slate-800 [&>button:hover]:!text-white [&>button>svg]:!fill-current"
        />
        <MiniMap
          position="bottom-left"
          nodeColor={minimapNodeColor}
          maskColor="rgba(7, 9, 14, 0.85)"
          className="!bg-[#0a0e17] !border-white/[0.06] !shadow-xl !rounded-lg"
          pannable
          zoomable
        />
      </ReactFlow>

      {/* Bottom selected indicator */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 py-2 bg-[#080b12]/90 backdrop-blur-sm border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Select any node to inspect intelligence in the right panel</span>
        </div>
        {selectedEntity && (
          <span className="text-cyan-300 font-medium">
            Inspecting: {selectedEntity.name}
          </span>
        )}
      </div>
    </div>
  );
}
