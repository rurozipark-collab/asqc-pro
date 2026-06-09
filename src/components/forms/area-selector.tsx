'use client';

import { TERMINALS, getZones, getAreas, getSubAreas } from '@/lib/data/master-areas';

interface AreaSelectorProps {
  terminal: string;
  zone: string;
  area: string;
  subArea: string;
  onChange: (field: string, value: string) => void;
  showSubArea?: boolean;
}

export function AreaSelector({ terminal, zone, area, subArea, onChange, showSubArea = true }: AreaSelectorProps) {
  const zones = terminal ? getZones(terminal) : [];
  const areas = terminal && zone ? getAreas(terminal, zone) : [];
  const subAreas = terminal && zone && area ? getSubAreas(terminal, zone, area) : [];

  const selectClass = 'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Terminal</label>
        <select className={selectClass} value={terminal} onChange={(e) => { onChange('terminal', e.target.value); onChange('zone', ''); onChange('area', ''); onChange('subArea', ''); }}>
          <option value="">Select Terminal</option>
          {TERMINALS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Zone</label>
        <select className={selectClass} value={zone} onChange={(e) => { onChange('zone', e.target.value); onChange('area', ''); onChange('subArea', ''); }} disabled={!terminal}>
          <option value="">Select Zone</option>
          {zones.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Area</label>
        <select className={selectClass} value={area} onChange={(e) => { onChange('area', e.target.value); onChange('subArea', ''); }} disabled={!zone}>
          <option value="">Select Area</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      {showSubArea && (
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Sub Area</label>
          <select className={selectClass} value={subArea} onChange={(e) => onChange('subArea', e.target.value)} disabled={!area}>
            <option value="">Select Sub Area</option>
            {subAreas.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}