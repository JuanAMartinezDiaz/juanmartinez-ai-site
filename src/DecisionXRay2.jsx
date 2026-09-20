import { useState } from 'react';

const layers = [
  { key: 'Operations', note: '17-step workflow • 3 actors • 2 systems' },
  { key: 'Decisions', note: 'D07 selected • consequential decision point' },
  { key: 'Authority', note: 'Human approval required before execution' },
  { key: 'Controls', note: 'Policy gate • scope check • escalation path' },
  { key: 'Evidence', note: 'Sources • approvals • actions • disposition retained' }
];

const nodes = [
  { id: 'D03', label: 'Classify', x: '18%', y: '64%' },
  { id: 'D05', label: 'Evaluate', x: '38%', y: '48%' },
  { id: 'D07', label: 'Authorize', x: '58%', y: '36%' },
  { id: 'D09', label: 'Execute', x: '78%', y: '23%' }
];

export default function DecisionXRay2() {
  const [depth, setDepth] = useState('Authority');
  const [selected, setSelected] = useState('D07');
  const [mode, setMode] = useState('current');
  const [running, setRunning] = useState(false);
  const run = () => { setRunning(true); window.setTimeout(() => setRunning(false), 1800); };

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan-300/25 bg-[#040b18] p-4 shadow-[inset_0_0_60px_rgba(39,198,255,.05)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[.28em] text-cyan-300">DECISION X-RAY 2.0</p>
          <p className="mt-1 text-xs text-slate-400">See the decision architecture hidden inside the workflow.</p>
        </div>        <button onClick={run} className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-[10px] font-semibold tracking-[.14em] text-cyan-200 hover:bg-cyan-300/20">
          {running ? 'SCANNING…' : 'RUN X-RAY'}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[92px_1fr_128px]">
        <div className="space-y-2">
          <p className="text-[9px] tracking-[.18em] text-slate-500">X-RAY DEPTH</p>
          {layers.map((layer) => (
            <button key={layer.key} onClick={() => setDepth(layer.key)}
              className={`block w-full rounded-lg border px-2 py-2 text-left text-[10px] transition ${depth === layer.key ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-200' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
              {layer.key}
            </button>
          ))}
        </div>

        <div className="relative min-h-[250px] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_55%_35%,rgba(40,205,255,.14),transparent_32%),linear-gradient(155deg,#071225,#030812)]">
          <div className="absolute inset-x-[8%] bottom-[13%] h-[58%] origin-bottom -skew-y-6 rounded-xl border border-cyan-300/20 bg-cyan-300/[.025] shadow-[0_0_28px_rgba(49,205,255,.08)]" />
          <div className="absolute inset-x-[13%] bottom-[22%] h-[48%] origin-bottom -skew-y-6 rounded-xl border border-blue-300/20 bg-blue-300/[.025]" />
          <div className="absolute inset-x-[18%] bottom-[31%] h-[38%] origin-bottom -skew-y-6 rounded-xl border border-amber-200/20 bg-amber-200/[.025]" />
          <div className="absolute left-[13%] right-[12%] top-[61%] h-px -rotate-[19deg] bg-gradient-to-r from-cyan-300/10 via-cyan-300/70 to-amber-200/60" />
          {nodes.map((node) => (
            <button key={node.id} onClick={() => setSelected(node.id)} style={{ left: node.x, top: node.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-2 text-[9px] font-semibold shadow-lg transition ${selected === node.id ? 'scale-110 border-amber-200/80 bg-amber-200/15 text-amber-100 shadow-amber-200/20' : 'border-cyan-200/35 bg-[#071225] text-cyan-200'}`}>
              {node.id}
            </button>
          ))}          <div className={`absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,transparent,rgba(77,220,255,.08),transparent)] transition-all duration-700 ${running ? 'translate-y-full opacity-100' : '-translate-y-full opacity-0'}`} />
          <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2 backdrop-blur">
            <p className="text-[9px] tracking-[.15em] text-slate-500">{depth.toUpperCase()} LAYER</p>
            <p className="mt-1 text-[10px] text-slate-300">{layers.find((x) => x.key === depth)?.note}</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[.025] p-3">
          <p className="text-[9px] tracking-[.18em] text-slate-500">DECISION X-RAY</p>
          <p className="mt-2 text-lg font-semibold text-white">{selected}</p>
          <p className="text-[10px] text-cyan-200">{nodes.find((x) => x.id === selected)?.label}</p>
          <dl className="mt-4 space-y-3 text-[9px]">
            <div><dt className="text-slate-500">AUTHORITY</dt><dd className="mt-1 text-amber-100">Human reserved</dd></div>
            <div><dt className="text-slate-500">RUNTIME GATE</dt><dd className="mt-1 text-emerald-200">Enforced</dd></div>
            <div><dt className="text-slate-500">EVIDENCE</dt><dd className="mt-1 text-slate-200">Retained</dd></div>
            <div><dt className="text-slate-500">EXCEPTION</dt><dd className="mt-1 text-slate-200">Escalate</dd></div>
          </dl>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-white/10 bg-black/20 p-1 text-[9px]">
          <button onClick={() => setMode('current')} className={`rounded-full px-3 py-1.5 ${mode === 'current' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>CURRENT STATE</button>
          <button onClick={() => setMode('sentinel')} className={`rounded-full px-3 py-1.5 ${mode === 'sentinel' ? 'bg-cyan-300/10 text-cyan-200' : 'text-slate-500'}`}>SENTINEL REDESIGN</button>
        </div>        <p className="text-right text-[9px] text-slate-500">
          {mode === 'current' ? 'Authority ambiguity exposed' : 'Authority boundary + evidence path made explicit'}
        </p>
      </div>
    </div>
  );
}
