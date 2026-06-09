'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeleteButton } from '@/components/ui/delete-button';
import { AreaSelector } from '@/components/forms/area-selector';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/use-translation';
import { AUDIT_TYPES, ALL_AUDIT_TYPES } from '@/lib/data/master-areas';
import { AUDIT_SCORE_GUIDE, getAuditTypeLabel } from '@/lib/data/audit-labels';
import { FieldHelp } from '@/components/ui/field-help';
import { formatDate, getStatusColor, generateReferenceCode, INPUT_CLASS, TABLE_SCROLL_CLASS } from '@/lib/utils';
import type { Audit, AuditType } from '@/types';
import { FileSearch, Shield, Plus, Eye, ArrowRight, Info, ClipboardCheck } from 'lucide-react';

export default function AuditsPage() {
  const { audits, findings, addAudit, deleteAudit } = useAppStore();
  const { t, locale } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [form, setForm] = useState({
    auditType: '' as AuditType | '',
    date: new Date().toISOString().split('T')[0],
    terminal: '', zone: '', area: '',
    auditor: '',
    score: 85,
    nonConformance: 0,
    observation: 0,
    opportunityForImprovement: 0,
    status: 'Scheduled' as Audit['status'],
    findings: '',
    linkedFindingIds: [] as string[],
    notes: '',
  });

  const handleAreaChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleLinkedFinding = (id: string) => {
    setForm((f) => ({
      ...f,
      linkedFindingIds: f.linkedFindingIds.includes(id)
        ? f.linkedFindingIds.filter((x) => x !== id)
        : [...f.linkedFindingIds, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const linkedFindings = findings.filter((f) => form.linkedFindingIds.includes(f.id));
    const audit: Audit = {
      id: Date.now().toString(),
      auditNumber: generateReferenceCode('AUD', audits.map((a) => a.auditNumber)),
      auditType: form.auditType as AuditType,
      date: form.date,
      terminal: form.terminal,
      zone: form.zone,
      area: form.area,
      auditor: form.auditor,
      score: form.score,
      nonConformance: form.nonConformance,
      observation: form.observation,
      opportunityForImprovement: form.opportunityForImprovement,
      status: form.status,
      findings: form.findings
        ? form.findings.split('\n').filter(Boolean)
        : linkedFindings.map((f) => f.description),
      linkedFindingIds: form.linkedFindingIds,
      notes: form.notes,
    };
    addAudit(audit);
    setShowForm(false);
    setForm({
      auditType: '', date: new Date().toISOString().split('T')[0],
      terminal: '', zone: '', area: '', auditor: '',
      score: 85, nonConformance: 0, observation: 0, opportunityForImprovement: 0,
      status: 'Scheduled', findings: '', linkedFindingIds: [], notes: '',
    });
  };

  const getLinkedFindingLabels = (audit: Audit) =>
    findings.filter((f) => audit.linkedFindingIds?.includes(f.id));

  return (
    <DashboardLayout title={t('audits.title')} subtitle={t('audits.subtitle')}>
      <div className="space-y-6">
        {/* Penjelasan fungsi Audit */}
        <Card className="border-cyan-500/30 bg-cyan-500/5">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-cyan-400">{t('audits.whatIsAudit')}</h3>
                <p className="text-sm text-slate-300">{t('audits.auditExplanation')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardCheck className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400 uppercase">{t('nav.inspections')}</span>
                </div>
                <p className="text-xs text-slate-400">{t('audits.inspectionDesc')}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileSearch className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400 uppercase">{t('nav.audits')}</span>
                </div>
                <p className="text-xs text-slate-400">{t('audits.auditDesc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ArrowRight className="h-3 w-3" />
              <span>{t('audits.flow')}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mr-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-red-400" /> {t('audits.regulatory')}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {AUDIT_TYPES.Regulatory.map((type) => <Badge key={type} className="bg-red-500/20 text-red-400 border-red-500/30">{getAuditTypeLabel(type, locale)}</Badge>)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileSearch className="h-4 w-4 text-cyan-400" /> {t('audits.internal')}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {AUDIT_TYPES.Internal.map((type) => <Badge key={type} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{getAuditTypeLabel(type, locale)}</Badge>)}
                </div>
              </CardContent>
            </Card>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="shrink-0 ml-4">
            <Plus className="h-4 w-4" /> {t('audits.newAudit')}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{t('audits.registerAudit')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('audits.auditType')}</label>
                    <select className={INPUT_CLASS} value={form.auditType} onChange={(e) => setForm({ ...form, auditType: e.target.value as AuditType })} required>
                      <option value="">{t('common.select')}</option>
                      {ALL_AUDIT_TYPES.map((type) => <option key={type} value={type}>{getAuditTypeLabel(type, locale)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('common.date')}</label>
                    <input type="date" className={INPUT_CLASS} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('common.auditor')}</label>
                    <input className={INPUT_CLASS} value={form.auditor} onChange={(e) => setForm({ ...form, auditor: e.target.value })} required />
                  </div>
                </div>

                <AreaSelector terminal={form.terminal} zone={form.zone} area={form.area} subArea="" onChange={handleAreaChange} showSubArea={false} />

                <Card className="border-slate-700 bg-slate-900/30">
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs font-semibold text-amber-400">{t('audits.scoreGuideTitle')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {(locale === 'id' ? AUDIT_SCORE_GUIDE.id : AUDIT_SCORE_GUIDE.en).map((g) => (
                        <FieldHelp key={g.field} label={g.field} description={g.desc} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('audits.auditScore')} (%)</label>
                    <input type="number" min={0} max={100} className={INPUT_CLASS} value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('audits.nc')}</label>
                    <input type="number" min={0} className={INPUT_CLASS} value={form.nonConformance} onChange={(e) => setForm({ ...form, nonConformance: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('audits.obs')}</label>
                    <input type="number" min={0} className={INPUT_CLASS} value={form.observation} onChange={(e) => setForm({ ...form, observation: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('audits.ofi')}</label>
                    <input type="number" min={0} className={INPUT_CLASS} value={form.opportunityForImprovement} onChange={(e) => setForm({ ...form, opportunityForImprovement: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('common.status')}</label>
                    <select className={INPUT_CLASS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Audit['status'] })}>
                      <option value="Scheduled">{t('audits.scheduled')}</option>
                      <option value="In Progress">{t('common.inProgress')}</option>
                      <option value="Completed">{t('audits.completed')}</option>
                      <option value="Closed">{t('common.closed')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-2">{t('audits.linkedFindings')}</label>
                  <p className="text-xs text-slate-500 mb-2">{t('audits.linkedFindingsHint')}</p>
                  <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800/50 p-3 space-y-2">
                    {findings.length === 0 ? (
                      <p className="text-xs text-slate-500">{t('common.noData')}</p>
                    ) : (
                      findings.map((f) => (
                        <label key={f.id} className="flex items-start gap-2 cursor-pointer hover:bg-slate-800 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={form.linkedFindingIds.includes(f.id)}
                            onChange={() => toggleLinkedFinding(f.id)}
                            className="mt-1"
                          />
                          <div>
                            <span className="text-xs font-mono text-cyan-400">{f.findingNumber}</span>
                            <p className="text-xs text-slate-400">{f.description.slice(0, 80)}...</p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('audits.auditFindings')} ({t('common.description')})</label>
                  <textarea
                    className={INPUT_CLASS + ' h-24 min-h-[96px]'}
                    value={form.findings}
                    onChange={(e) => setForm({ ...form, findings: e.target.value })}
                    placeholder="Satu temuan per baris (opsional jika sudah memilih temuan inspeksi)"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit">{t('audits.submitAudit')}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className={TABLE_SCROLL_CLASS + ' p-0 md:p-0'}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="text-left py-3 px-4">{t('audits.auditNumber')}</th>
                  <th className="text-left py-3 px-4">{t('common.type')}</th>
                  <th className="text-left py-3 px-4">{t('common.date')}</th>
                  <th className="text-left py-3 px-4">{t('common.location')}</th>
                  <th className="text-center py-3 px-4">{t('common.score')}</th>
                  <th className="text-center py-3 px-4">{t('audits.nc')}</th>
                  <th className="text-center py-3 px-4">{t('audits.obs')}</th>
                  <th className="text-center py-3 px-4">{t('audits.ofi')}</th>
                  <th className="text-center py-3 px-4">{t('common.status')}</th>
                  <th className="text-center py-3 px-4">{t('common.action')}</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((a) => (
                  <tr key={a.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{a.auditNumber}</td>
                    <td className="py-3 px-4"><Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{getAuditTypeLabel(a.auditType, locale)}</Badge></td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(a.date)}</td>
                    <td className="py-3 px-4 text-slate-300">{a.terminal} → {a.area}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${a.score >= 90 ? 'text-emerald-400' : a.score >= 80 ? 'text-amber-400' : 'text-red-400'}`}>{a.score}%</span>
                    </td>
                    <td className="py-3 px-4 text-center text-red-400">{a.nonConformance}</td>
                    <td className="py-3 px-4 text-center text-amber-400">{a.observation}</td>
                    <td className="py-3 px-4 text-center text-cyan-400">{a.opportunityForImprovement}</td>
                    <td className="py-3 px-4 text-center"><Badge className={getStatusColor(a.status)}>{a.status}</Badge></td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAudit(a)}><Eye className="h-4 w-4" /></Button>
                        <DeleteButton
                          onDelete={() => { deleteAudit(a.id); if (selectedAudit?.id === a.id) setSelectedAudit(null); }}
                          confirmMessage={t('delete.audit', { id: a.auditNumber })}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {selectedAudit && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{selectedAudit.auditNumber} — {getAuditTypeLabel(selectedAudit.auditType, locale)}</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAudit(null)}>{t('common.close')}</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><span className="text-slate-400">{t('common.location')}:</span> <p>{selectedAudit.terminal} → {selectedAudit.zone} → {selectedAudit.area}</p></div>
                <div><span className="text-slate-400">{t('common.auditor')}:</span> <p>{selectedAudit.auditor}</p></div>
                <div><span className="text-slate-400">{t('common.score')}:</span> <p className="font-bold text-cyan-400">{selectedAudit.score}%</p></div>
                <div><span className="text-slate-400">NC / OBS / OFI:</span> <p>{selectedAudit.nonConformance} / {selectedAudit.observation} / {selectedAudit.opportunityForImprovement}</p></div>
              </div>

              <div>
                <p className="text-slate-400 mb-2">{t('audits.linkedFindings')}</p>
                {getLinkedFindingLabels(selectedAudit).length > 0 ? (
                  <ul className="space-y-1">
                    {getLinkedFindingLabels(selectedAudit).map((f) => (
                      <li key={f.id} className="text-slate-300 flex items-center gap-2">
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">{f.findingNumber}</Badge>
                        {f.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-xs">{t('audits.noLinkedFindings')}</p>
                )}
              </div>

              <div>
                <p className="text-slate-400 mb-2">{t('audits.auditFindings')}</p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {selectedAudit.findings.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}