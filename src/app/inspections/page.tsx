'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteButton } from '@/components/ui/delete-button';
import { AreaSelector } from '@/components/forms/area-selector';
import { PhotoUpload } from '@/components/forms/photo-upload';
import { useAppStore } from '@/lib/store';
import { FINDING_CATEGORIES, AIRPORT_CODE } from '@/lib/data/master-areas';
import { formatDate, getCreatedAtDisplay, getRiskColor, getStatusColor, generateReferenceCode, INPUT_CLASS, TABLE_SCROLL_CLASS } from '@/lib/utils';
import type { Finding, RiskLevel, Priority } from '@/types';
import { useTranslation } from '@/lib/i18n/use-translation';
import { Plus, MapPin, Sparkles, Eye } from 'lucide-react';

export default function InspectionsPage() {
  const { findings, addFinding, deleteFinding } = useAppStore();
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [form, setForm] = useState({
    terminal: '', zone: '', area: '', subArea: '',
    category: '', description: '', pic: '', stakeholder: '', dueDate: '',
    riskLevel: 'Medium' as RiskLevel, priority: 'Medium' as Priority,
    serviceImpact: '', aiAnalysis: '', aiRecommendation: '',
    photoEvidence: [] as string[],
    gpsLocation: undefined as { lat: number; lng: number } | undefined,
  });

  const handleAreaChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert('GPS tidak tersedia di perangkat ini.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((f) => ({ ...f, gpsLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude } })),
      () => alert('Gagal mendapatkan lokasi GPS. Pastikan izin lokasi diaktifkan.'),
    );
  };

  const analyzeWithAI = async () => {
    if (!form.description) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-finding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: form.description, category: form.category, location: `${form.terminal} - ${form.area}` }),
      });
      const data = await res.json();
      setForm((f) => ({
        ...f,
        riskLevel: data.riskLevel || f.riskLevel,
        priority: data.priority || f.priority,
        serviceImpact: data.serviceImpact || f.serviceImpact,
        aiAnalysis: data.analysis || '',
        aiRecommendation: data.recommendation || '',
      }));
    } catch {
      setForm((f) => ({
        ...f,
        serviceImpact: 'Moderate impact on passenger service experience',
        aiAnalysis: 'AI analysis based on finding description and category patterns',
        aiRecommendation: 'Implement immediate corrective action and monitor for 7 days',
      }));
    }
    setAnalyzing(false);
  };

  const resetForm = () => ({
    terminal: '', zone: '', area: '', subArea: '',
    category: '', description: '', pic: '', stakeholder: '', dueDate: '',
    riskLevel: 'Medium' as RiskLevel, priority: 'Medium' as Priority,
    serviceImpact: '', aiAnalysis: '', aiRecommendation: '',
    photoEvidence: [] as string[],
    gpsLocation: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const finding: Finding = {
      id: Date.now().toString(),
      findingNumber: generateReferenceCode('FND', findings.map((f) => f.findingNumber)),
      createdAt: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      airport: AIRPORT_CODE,
      terminal: form.terminal, zone: form.zone, area: form.area, subArea: form.subArea, asset: '',
      category: form.category, riskLevel: form.riskLevel, priority: form.priority,
      serviceImpact: form.serviceImpact, description: form.description,
      photoEvidence: form.photoEvidence, videoEvidence: [],
      gpsLocation: form.gpsLocation,
      pic: form.pic, stakeholder: form.stakeholder,
      dueDate: form.dueDate, status: 'Open',
      aiAnalysis: form.aiAnalysis, aiRecommendation: form.aiRecommendation,
    };
    addFinding(finding);
    setShowForm(false);
    setForm(resetForm());
  };

  const handleDelete = (id: string) => {
    deleteFinding(id);
    if (selectedFinding?.id === id) setSelectedFinding(null);
  };



  return (
    <DashboardLayout title={t('inspections.title')} subtitle={t('inspections.subtitle')}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{findings.filter(f => f.status === 'Open').length} Open</Badge>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{findings.filter(f => f.status === 'In Progress').length} In Progress</Badge>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{findings.filter(f => f.status === 'Overdue').length} Overdue</Badge>
          </div>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> {t('inspections.newFinding')}</Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{t('inspections.registerFinding')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <AreaSelector
                  terminal={form.terminal}
                  zone={form.zone}
                  area={form.area}
                  subArea={form.subArea}
                  onChange={handleAreaChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                    <select className={INPUT_CLASS} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                      <option value="">Select Category</option>
                      {FINDING_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">PIC</label>
                    <input className={INPUT_CLASS} value={form.pic} onChange={(e) => setForm({ ...form, pic: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">{t('common.stakeholder')}</label>
                    <input
                      className={INPUT_CLASS}
                      value={form.stakeholder}
                      onChange={(e) => setForm({ ...form, stakeholder: e.target.value })}
                      placeholder={t('inspections.stakeholderPlaceholder')}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Finding Description</label>
                  <textarea className={INPUT_CLASS + ' h-24 min-h-[96px]'} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Photo Evidence</label>
                  <PhotoUpload
                    photos={form.photoEvidence}
                    onChange={(photos) => setForm({ ...form, photoEvidence: photos })}
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button type="button" variant="secondary" onClick={analyzeWithAI} disabled={analyzing}>
                    <Sparkles className="h-4 w-4" /> {analyzing ? 'Analyzing...' : 'AI Analyze'}
                  </Button>
                  <Button type="button" variant="outline" onClick={captureGPS}>
                    <MapPin className="h-4 w-4" />
                    {form.gpsLocation ? `GPS: ${form.gpsLocation.lat.toFixed(4)}, ${form.gpsLocation.lng.toFixed(4)}` : 'GPS Location'}
                  </Button>
                </div>

                {(form.aiAnalysis || form.riskLevel) && (
                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2"><Sparkles className="h-4 w-4" /> AI Analysis Result</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-xs text-slate-400">Risk Level:</span> <Badge className={getRiskColor(form.riskLevel)}>{form.riskLevel}</Badge></div>
                      <div><span className="text-xs text-slate-400">Priority:</span> <Badge className={getRiskColor(form.priority)}>{form.priority}</Badge></div>
                    </div>
                    {form.serviceImpact && <p className="text-sm text-slate-300"><strong>Service Impact:</strong> {form.serviceImpact}</p>}
                    {form.aiAnalysis && <p className="text-sm text-slate-300"><strong>Analysis:</strong> {form.aiAnalysis}</p>}
                    {form.aiRecommendation && <p className="text-sm text-slate-300"><strong>Recommendation:</strong> {form.aiRecommendation}</p>}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
                    <input type="date" className={INPUT_CLASS} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Submit Finding</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(resetForm()); }}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="text-left py-3 px-4">Finding #</th>
                    <th className="text-left py-3 px-4">{t('inspections.inputTime')}</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-center py-3 px-4">Risk</th>
                    <th className="text-center py-3 px-4">Priority</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Stakeholder</th>
                    <th className="text-center py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {findings.map((f) => (
                    <tr key={f.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{f.findingNumber}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">{getCreatedAtDisplay(f)}</td>
                      <td className="py-3 px-4 text-slate-400">{formatDate(f.date)}</td>
                      <td className="py-3 px-4 text-slate-300">{f.terminal} → {f.area}</td>
                      <td className="py-3 px-4">{f.category}</td>
                      <td className="py-3 px-4 text-center"><Badge className={getRiskColor(f.riskLevel)}>{f.riskLevel}</Badge></td>
                      <td className="py-3 px-4 text-center"><Badge className={getRiskColor(f.priority)}>{f.priority}</Badge></td>
                      <td className="py-3 px-4 text-center"><Badge className={getStatusColor(f.status)}>{f.status}</Badge></td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{f.stakeholder}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedFinding(f)}><Eye className="h-4 w-4" /></Button>
                          <DeleteButton
                            onDelete={() => handleDelete(f.id)}
                            confirmMessage={t('delete.finding', { id: f.findingNumber })}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {selectedFinding && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{selectedFinding.findingNumber}</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFinding(null)}>Close</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">{selectedFinding.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-slate-400">Location:</span> <p>{selectedFinding.terminal} → {selectedFinding.zone} → {selectedFinding.area} → {selectedFinding.subArea}</p></div>
                <div><span className="text-slate-400">{t('inspections.inputTime')}:</span> <p>{getCreatedAtDisplay(selectedFinding)}</p></div>
                <div><span className="text-slate-400">PIC:</span> <p>{selectedFinding.pic}</p></div>
                <div><span className="text-slate-400">Due Date:</span> <p>{formatDate(selectedFinding.dueDate)}</p></div>
                <div><span className="text-slate-400">Stakeholder:</span> <p>{selectedFinding.stakeholder}</p></div>
              </div>
              {selectedFinding.photoEvidence.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Photo Evidence ({selectedFinding.photoEvidence.length})</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedFinding.photoEvidence.map((photo, i) => (
                      <img key={i} src={photo} alt={`Evidence ${i + 1}`} className="rounded-lg border border-slate-700 aspect-video object-cover" />
                    ))}
                  </div>
                </div>
              )}
              {selectedFinding.gpsLocation && (
                <p className="text-sm text-slate-400">
                  GPS: {selectedFinding.gpsLocation.lat.toFixed(6)}, {selectedFinding.gpsLocation.lng.toFixed(6)}
                </p>
              )}
              {selectedFinding.aiRecommendation && (
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
                  <p className="text-sm text-cyan-400 font-medium">AI Recommendation</p>
                  <p className="text-sm text-slate-300 mt-1">{selectedFinding.aiRecommendation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}