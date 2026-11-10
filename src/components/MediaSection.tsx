import React, { useState } from 'react';
import { YouTubeVideo, ArticlePaper, Diagram } from '../types/curriculum';
import { Youtube, FileText, Image as ImageIcon, ExternalLink, Maximize2 } from 'lucide-react';

interface MediaSectionProps {
  videos: YouTubeVideo[];
  papers: ArticlePaper[];
  diagrams: Diagram[];
}

export const MediaSection: React.FC<MediaSectionProps> = ({ videos, papers, diagrams }) => {
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);

  return (
    <div className="space-y-8">
      {/* 1. Curated Architecture Diagrams */}
      {diagrams.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base border-b border-slate-800 pb-2">
            <ImageIcon className="w-5 h-5 text-sky-400" />
            <span>Production Architecture Blueprints</span>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {diagrams.map((diag) => (
              <div
                key={diag.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-sky-500/40 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">{diag.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{diag.caption}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDiagram(diag)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Expand Blueprint"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <div
                  className="w-full overflow-x-auto rounded-xl bg-slate-950 p-2"
                  dangerouslySetInnerHTML={{ __html: diag.svgMarkup }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. YouTube Lectures & Tech Talks */}
      {videos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base border-b border-slate-800 pb-2">
            <Youtube className="w-5 h-5 text-rose-500" />
            <span>Essential Tech Talks & Conference Presentations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((vid, idx) => (
              <div
                key={idx}
                className="flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-rose-500/40 transition-all"
              >
                <div className="relative aspect-video w-full bg-slate-950">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${vid.videoId}`}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-white line-clamp-2">{vid.title}</h4>
                      <a
                        href={vid.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-rose-400 transition-colors flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1 font-mono">
                      <span>{vid.channel}</span>
                      <span>•</span>
                      <span>{vid.duration}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs text-slate-300">
                    <span className="font-semibold text-rose-400">Why Watch: </span>
                    {vid.whyWatch}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Landmark Research Papers & Standards */}
      {papers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base border-b border-slate-800 pb-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Landmark Research Papers & Engineering Specifications</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {papers.map((paper, idx) => (
              <a
                key={idx}
                href={paper.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-slate-900 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                      {paper.type}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                    {paper.title}
                  </h4>
                </div>
                <div className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                  <span className="text-slate-300 font-medium">Key Takeaway: </span>
                  {paper.keyTakeaway}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Diagram Fullscreen Modal */}
      {selectedDiagram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedDiagram.title}</h3>
                <p className="text-xs text-slate-400">{selectedDiagram.caption}</p>
              </div>
              <button
                onClick={() => setSelectedDiagram(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div
              className="w-full overflow-auto max-h-[75vh]"
              dangerouslySetInnerHTML={{ __html: selectedDiagram.svgMarkup }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
