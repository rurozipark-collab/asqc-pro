'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InfoPanel } from '@/components/ui/field-help';
import { useAppStore } from '@/lib/store';
import { RCA_CATEGORIES } from '@/lib/data/master-areas';
import { EmptyWorkflowGuide } from '@/components/ui/empty-workflow';
import { formatDate, getStatusColor, INPUT_CLASS } from '@/lib/utils';
import type { RCA } from '@/types';
import { DeleteButton } from '@/components/ui/delete-button';
import { useTranslation } from '@/lib/i18n/use-translation';
import { Plus, Sparkles, GitBranch } from 'lucide-react';

type RefType = 'Finding' | 'Complaint' | 'Audit';

export default function RCAPage() {
  const { rcas, findings, complaints, audits, addRCA, deleteRCA } = useAppStore();
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [selectedRCA, setSelectedRCA] = useState<RCA | null>(null);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    referenceType: 'Finding' as RefType,
    selectedRefs: [] as string[],
    customReference: '',
    title: '',
  });

  const getRefList = () => {
    if (form.referenceType === 'Finding') {
      return findings.map((f) => ({ id: f.id, code: f.findingNumber, desc: f.description }));
    }
    if (form.referenceType === 'Complaint') {
      return complaints.map((c) => ({ id: c.id, code: c.complaintNumber, desc: c.description }));
    }
    return audits.map((a) => ({ id: a.id, code: a.auditNumber, desc: `${a.auditType} - ${a.terminal} ${a.area}` }));
  };

  const toggleRef = (code: string) => {
    setForm((f) => ({
      ...f,
      selectedRefs: f.selectedRefs.includes(code)
        ? f.selectedRefs.filter((r) => r !== code)
        : [...f.selectedRefs, code],
    }));
  };

  const getSourceDescription = () => {
    const refs = form.selectedRefs;
    const parts: string[] = [];

    if (form.referenceType === 'Finding') {
      findings.filter((f) => refs.includes(f.findingNumber)).forEach((f) => parts.push(f.description));
    } else if (form.referenceType === 'Complaint') {
      complaints.filter((c) => refs.includes(c.complaintNumber)).forEach((c) => parts.push(c.description));
    } else {
      audits.filter((a) => refs.includes(a.auditNumber)).forEach((a) => {
        parts.push(`Audit ${a.auditNumber}: ${a.findings.join('; ')}`);
      });
    }

    if (form.customReference) parts.push(form.customReference);
    return parts.join('\n');
  };

  const generateRCA = async () => {
    if (form.selectedRefs.length === 0 && !form.customReference.trim()) {
      alert(t('rca.noReferenceSelected'));
      return;
    }
    setGenerating(true);
    const refLabel = [...form.selectedRefs, form.customReference.trim()].filter(Boolean).join(', ');

    try {
      const res = await fetch('/api/ai/generate-rca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: getSourceDescription() || form.title,
          type: form.referenceType,
        }),
      });
      const data = await res.json();
      const rca: RCA = {
        id: Date.now().toString(),
        referenceId: refLabel,
        referenceIds: form.selectedRefs,
        customReference: form.customReference.trim() || undefined,
        referenceType: form.referenceType,
        title: form.title || `RCA - ${form.selectedRefs[0] || 'Manual'}`,
        fiveWhy: data.fiveWhy || [],
        fishbone: data.fishbone || {},
        rootCause: data.rootCause || '',
        correctiveAction: data.correctiveAction || '',
        preventiveAction: data.preventiveAction || '',
        recommendation: data.recommendation || '',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Draft',
      };
      addRCA(rca);
      setSelectedRCA(rca);
      setForm({ referenceType: 'Finding', selectedRefs: [], customReference: '', title: '' });
      setShowForm(false);
    } catch { /* handled in API */ }
    setGenerating(false);
  };

  const refCount = getRefList().length;
  const hasRefs = refCount > 0;

  return (
    <DashboardLayout title={t('rca.title')} subtitle={t('rca.subtitle')}>
      <div className="space-y-6">
        <InfoPanel title={t('rca.codeFormat')}>
          <p>FND-08jun2026 = {t('nav.inspections')} 8 Juni 2026</p>
          <p>CMP-08jun2026 = {t('nav.complaints')} 8 Juni 2026</p>
          <p>AUD-08jun2026 = {t('nav.audits')} 8 Juni 2026</p>
        </InfoPanel>

        {!hasRefs && <EmptyWorkflowGuide variant="rca" />}

        <div className="flex justify-between">
          <p className="text-sm text-slate-400">{rcas.length} RCA</p>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> {t('rca.generateRCA')}</Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{t('rca.generateFromRef')}</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('rca.referenceType')}</label>
                  <select
                    className={INPUT_CLASS}
                    value={form.referenceType}
                    onChange={(e) => setForm({ referenceType: e.target.value as RefType, selectedRefs: [], customReference: '', title: '' })}
                  >
                    <option value="Finding">{t('nav.inspections')}</option>
                    <option value="Complaint">{t('nav.complaints')}</option>
                    <option value="Audit">{t('nav.audits')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('rca.referenceSource')}</label>
                  <p className="text-[11px] text-slate-500">{t(`rca.sourceDesc.${form.referenceType}`)}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('rca.selectReferences')}</label>
                <p className="text-[11px] text-slate-500 mb-2">{t('rca.selectReferencesHint')}</p>
                <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800/50 p-3 space-y-2">
                  {refCount === 0 ? (
                    <div className="text-xs text-slate-500 space-y-1">
                      <p className="font-medium text-amber-400/90">{t('rca.emptyRefsTitle')}</p>
                      <p>{t('rca.emptyRefsDesc')}</p>
                    </div>
                  ) : (
                    getRefList().map((item) => (
                      <label key={item.id} className="flex items-start gap-2 cursor-pointer hover:bg-slate-800 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={form.selectedRefs.includes(item.code)}
                          onChange={() => toggleRef(item.code)}
                          className="mt-1"
                        />
                        <div>
                          <span className="text-xs font-mono text-cyan-400">{item.code}</span>
                          <p className="text-xs text-slate-400">{item.desc.slice(0, 100)}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {form.selectedRefs.length > 0 && (
                  <p className="text-xs text-emerald-400 mt-2">{t('rca.selectedCount', { count: String(form.selectedRefs.length) })}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('rca.customReference')}</label>
                <p className="text-[11px] text-slate-500 mb-2">{t('rca.customReferenceHint')}</p>
                <textarea
                  className={INPUT_CLASS + ' h-24 min-h-[96px]'}
                  value={form.customReference}
                  onChange={(e) => setForm({ ...form, customReference: e.target.value })}
                  placeholder={t('rca.customReferencePlaceholder')}
                />
              </div>

              <Button onClick={generateRCA} disabled={generating}>
                <Sparkles className="h-4 w-4" /> {generating ? t('inspections.analyzing') : 'AI Generate RCA'}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rcas.map((rca) => (
            <Card key={rca.id} className="cursor-pointer hover:border-cyan-500/50 transition-colors" onClick={() => setSelectedRCA(rca)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-slate-200">{rca.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{rca.referenceType}: {rca.referenceId}</p>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Badge className={getStatusColor(rca.status)}>{rca.status}</Badge>
                    <DeleteButton
                      onDelete={() => {
                        deleteRCA(rca.id);
                        if (selectedRCA?.id === rca.id) setSelectedRCA(null);
                      }}
                      confirmMessage={t('delete.rca', { title: rca.title })}
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-3 line-clamp-2">{rca.rootCause}</p>
                <p className="text-xs text-slate-500 mt-2">{formatDate(rca.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedRCA && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-cyan-400" /> {selectedRCA.title}</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRCA(null)}>{t('common.close')}</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-xs text-slate-400 mb-2">{t('rca.references')}</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedRCA.referenceIds || [selectedRCA.referenceId]).map((ref) => (
                    <Badge key={ref} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 font-mono text-[10px]">{ref}</Badge>
                  ))}
                  {selectedRCA.customReference && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">{selectedRCA.customReference}</Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-3">{t('rca.fiveWhy')}</h4>
                <div className="space-y-2">
                  {selectedRCA.fiveWhy.map((why, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-600/20 text-cyan-400 text-xs font-bold">{i + 1}</span>
                      <p className="text-sm text-slate-300">{why}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-purple-400 mb-3">{t('rca.fishbone')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {RCA_CATEGORIES.map((cat) => (
                    <div key={cat} className="rounded-lg border border-slate-700 p-3">
                      <p className="text-xs font-bold text-purple-400 mb-2">{cat}</p>
                      <ul className="space-y-1">
                        {(selectedRCA.fishbone[cat] || []).map((item, i) => (
                          <li key={i} className="text-xs text-slate-400">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                  <p className="text-sm font-medium text-red-400">{t('rca.rootCause')}</p>
                  <p className="text-sm text-slate-300 mt-1">{selectedRCA.rootCause}</p>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                  <p className="text-sm font-medium text-amber-400">{t('rca.correctiveAction')}</p>
                  <p className="text-sm text-slate-300 mt-1">{selectedRCA.correctiveAction}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <p className="text-sm font-medium text-emerald-400">{t('rca.preventiveAction')}</p>
                  <p className="text-sm text-slate-300 mt-1">{selectedRCA.preventiveAction}</p>
                </div>
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
                  <p className="text-sm font-medium text-cyan-400">{t('rca.recommendation')}</p>
                  <p className="text-sm text-slate-300 mt-1">{selectedRCA.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}