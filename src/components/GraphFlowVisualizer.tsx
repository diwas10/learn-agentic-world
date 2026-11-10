import React, { useState, useEffect } from 'react';
import { GraphSpec, GraphNode } from '../types/curriculum';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

interface GraphFlowVisualizerProps {
  spec: GraphSpec;
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  input: { bg: 'bg-sky-950/80', border: 'border-sky-500', text: 'text-sky-300', glow: 'shadow-sky-500/20' },
  llm: { bg: 'bg-indigo-950/80', border: 'border-indigo-500', text: 'text-indigo-300', glow: 'shadow-indigo-500/20' },
  tool: { bg: 'bg-emerald-950/80', border: 'border-emerald-500', text: 'text-emerald-300', glow: 'shadow-emerald-500/20' },
  verifier: { bg: 'bg-teal-950/80', border: 'border-teal-400', text: 'text-teal-200', glow: 'shadow-teal-500/20' },
  router: { bg: 'bg-amber-950/80', border: 'border-amber-500', text: 'text-amber-300', glow: 'shadow-amber-500/20' },
  worker: { bg: 'bg-purple-950/80', border: 'border-purple-500', text: 'text-purple-300', glow: 'shadow-purple-500/20' },
  output: { bg: 'bg-cyan-950/80', border: 'border-cyan-500', text: 'text-cyan-300', glow: 'shadow-cyan-500/20' },
  goal: { bg: 'bg-emerald-900/90', border: 'border-emerald-400', text: 'text-emerald-200', glow: 'shadow-emerald-400/30' },
  error: { bg: 'bg-rose-950/80', border: 'border-rose-500', text: 'text-rose-300', glow: 'shadow-rose-500/20' },
  hitl: { bg: 'bg-yellow-950/80', border: 'border-yellow-500', text: 'text-yellow-300', glow: 'shadow-yellow-500/20' },
  trusted: { bg: 'bg-blue-950/80', border: 'border-blue-500', text: 'text-blue-300', glow: 'shadow-blue-500/20' },
  untrusted: { bg: 'bg-orange-950/80', border: 'border-orange-500', text: 'text-orange-300', glow: 'shadow-orange-500/20' },
};

export const GraphFlowVisualizer: React.FC<GraphFlowVisualizerProps> = ({ spec }) => {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Bounds calculation
  const minX = Math.min(...spec.nodes.map((n) => n.x), 0);
  const maxX = Math.max(...spec.nodes.map((n) => n.x), 800);
  const minY = Math.min(...spec.nodes.map((n) => n.y), 0);
  const maxY = Math.max(...spec.nodes.map((n) => n.y), 300);

  const viewBoxWidth = Math.max(maxX + 180, 900);
  const viewBoxHeight = Math.max(maxY + 100, 360);

  useEffect(() => {
    setActiveStep(-1);
    setIsPlaying(false);
    setSelectedNode(null);
  }, [spec]);

  // Simulation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= spec.nodes.length - 1) {
          setIsPlaying(false);
          return -1;
        }
        return prev + 1;
      });
    }, 1100);
    return () => clearInterval(interval);
  }, [isPlaying, spec.nodes.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(-1);
  };

  const nodeMap = new Map(spec.nodes.map((n) => [n.id, n]));

  return (
    <div className="flex flex-col h-full bg-slate-950/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur z-10 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">{spec.title}</h3>
            <p className="text-xs text-slate-400 font-mono">Topology: {spec.graphType}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Simulation' : 'Simulate Execution'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex-1 min-h-[400px] w-full overflow-auto p-4 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto max-h-[500px]"
          style={{ minWidth: '700px' }}
        >
          <defs>
            <marker
              id="dag-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38BDF8" />
            </marker>
            <marker
              id="dag-arrow-red"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#F87171" />
            </marker>
          </defs>

          {/* Edges */}
          {spec.edges.map((edge) => {
            const src = nodeMap.get(edge.source);
            const tgt = nodeMap.get(edge.target);
            if (!src || !tgt) return null;

            const isRed = edge.style?.includes('red');
            const strokeColor = isRed ? '#F87171' : '#38BDF8';
            const marker = isRed ? 'url(#dag-arrow-red)' : 'url(#dag-arrow)';

            // Node width estimate is ~140, height ~50
            const x1 = src.x + 130;
            const y1 = src.y + 25;
            const x2 = tgt.x;
            const y2 = tgt.y + 25;
            const midX = (x1 + x2) / 2;

            return (
              <g key={edge.id} className="transition-opacity duration-300">
                <path
                  d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeDasharray={isRed ? '5,5' : undefined}
                  markerEnd={marker}
                  className="opacity-70 hover:opacity-100"
                />
                {edge.label && (
                  <text
                    x={midX}
                    y={(y1 + y2) / 2 - 8}
                    fill={isRed ? '#FCA5A5' : '#7DD3FC'}
                    fontFamily="monospace"
                    fontSize="9.5"
                    textAnchor="middle"
                    className="select-none bg-slate-900"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {spec.nodes.map((node, index) => {
            const theme = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.input;
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                {/* Node Box */}
                <rect
                  width="140"
                  height="50"
                  rx="8"
                  fill="#0F172A"
                  stroke={isActive ? '#34D399' : isCompleted ? '#38BDF8' : '#334155'}
                  strokeWidth={isActive ? '3' : '1.5'}
                  className={`transition-all duration-300 ${
                    isActive ? 'filter drop-shadow(0 0 12px rgba(52, 211, 153, 0.6))' : ''
                  }`}
                />

                {/* Status Dot */}
                <circle
                  cx="12"
                  cy="16"
                  r="4"
                  fill={isActive ? '#34D399' : isCompleted ? '#38BDF8' : '#64748B'}
                  className={isActive ? 'animate-ping' : ''}
                />
                <circle
                  cx="12"
                  cy="16"
                  r="4"
                  fill={isActive ? '#34D399' : isCompleted ? '#38BDF8' : '#64748B'}
                />

                {/* Category Badge */}
                <text
                  x="24"
                  y="18"
                  fill="#94A3B8"
                  fontFamily="monospace"
                  fontSize="8.5"
                  className="uppercase font-bold tracking-wider select-none"
                >
                  {node.category}
                </text>

                {/* Node Label */}
                <text
                  x="12"
                  y="36"
                  fill="#F8FAFC"
                  fontFamily="system-ui, sans-serif"
                  fontSize="10"
                  fontWeight="600"
                  className="select-none"
                >
                  {node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 z-20 w-72 bg-slate-900/95 border border-indigo-500/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                {selectedNode.category} Node
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs px-1 hover:bg-slate-800 rounded"
              >
                ✕
              </button>
            </div>
            <div className="text-sm font-bold text-white mb-1">{selectedNode.label}</div>
            <div className="text-[11px] font-mono text-slate-400">ID: {selectedNode.id}</div>
          </div>
        )}
      </div>
    </div>
  );
};
