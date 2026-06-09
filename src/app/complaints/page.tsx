'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AreaSelector } from '@/components/forms/area-selector';
import { useAppStore } from '@/lib/store';
import { formatDate, getStatusColor, generateReferenceCode, INPUT_CLASS, TABLE_SCROLL_CLASS } from '@/lib/utils';
import type { Complaint, ComplaintChannel, CustomerType } from '@/types';
import { DeleteButton } from '@/components/ui/delete-button';
import { useTranslation } from '@/lib/i18n/use-translation';
import { Plus, Sparkles } from 'lucide-react';

const channels: ComplaintChannel[] = ['Walk-in', 'Email', 'Phone', 'Social Media', 'Website', 'WhatsApp'];
const customerTypes: CustomerType[] = ['Passenger', 'Airline', 'Tenant', 'Visitor', 'Staff'];
const complaintCategories = ['Long Queue Time', 'Toilet Cleanliness', 'Baggage Delay', 'Poor Signage', 'Staff Attitude', 'AC Temperature', 'WiFi Connectivity', 'Lost & Found', 'Accessibility Issues', 'Food Quality'];

export default function ComplaintsPage() {
  const { complaints, addComplaint, deleteComplaint } = useAppStore();
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [form, setForm] = useState({
    channel: '' as ComplaintChannel | '', customerType: '' as CustomerType | '',
    category: '', terminal: '', zone: '', area: '', description: '',
    aiAnalysis: '', customerImpact: '', rootCause: '', correctiveAction: '', preventiveAction: '',
  });

  const handleAreaChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const analyzeWithAI = async () => {
    if (!form.description) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setForm((f) => ({ ...f, ...data }));
    } catch {
      setForm((f) => ({
        ...f,
        aiAnalysis: 'Complaint indicates service gap in operational process',
        customerImpact: 'Moderate negative impact on passenger experience',
        rootCause: 'Process inefficiency during peak operational hours',
        correctiveAction: 'Immediate service recovery and process review',
        preventiveAction: 'Implement proactive monitoring and staff training',
      }));
    }
    setAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const complaint: Complaint = {
      id: Date.now().toString(),
      complaintNumber: generateReferenceCode('CMP', complaints.map((c) => c.complaintNumber)),
      date: new Date().toISOString().split('T')[0],
      channel: form.channel as ComplaintChannel,
      customerType: form.customerType as CustomerType,
      category: form.category, terminal: form.terminal, zone: form.zone, area: form.area,
      description: form.description, status: 'Open',
      aiAnalysis: form.aiAnalysis, customerImpact: form.customerImpact,
      rootCause: form.rootCause, correctiveAction: form.correctiveAction, preventiveAction: form.preventiveAction,
    };
    addComplaint(complaint);
    setShowForm(false);
  };



  return (
    <DashboardLayout title={t('complaints.title')} subtitle={t('complaints.subtitle')}>
      <div className="space-y-6">
        <div className="flex justify-between">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{complaints.filter(c => c.status === 'Open').length} Open Complaints</Badge>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> New Complaint</Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>Register Complaint</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Channel</label>
                    <select className={INPUT_CLASS} value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as ComplaintChannel })} required>
                      <option value="">Select Channel</option>
                      {channels.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Customer Type</label>
                    <select className={INPUT_CLASS} value={form.customerType} onChange={(e) => setForm({ ...form, customerType: e.target.value as CustomerType })} required>
                      <option value="">Select Type</option>
                      {customerTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Category</label>
                    <select className={INPUT_CLASS} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                      <option value="">Select Category</option>
                      {complaintCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <AreaSelector terminal={form.terminal} zone={form.zone} area={form.area} subArea="" onChange={handleAreaChange} showSubArea={false} />
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Description</label>
                  <textarea className={INPUT_CLASS + ' h-24 min-h-[96px]'} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>
                <Button type="button" variant="secondary" onClick={analyzeWithAI} disabled={analyzing}>
                  <Sparkles className="h-4 w-4" /> {analyzing ? 'Analyzing...' : 'AI Complaint Analysis'}
                </Button>
                {form.aiAnalysis && (
                  <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4 space-y-2 text-sm">
                    <p><strong className="text-purple-400">Analysis:</strong> {form.aiAnalysis}</p>
                    <p><strong className="text-purple-400">Customer Impact:</strong> {form.customerImpact}</p>
                    <p><strong className="text-purple-400">Root Cause:</strong> {form.rootCause}</p>
                    <p><strong className="text-purple-400">Corrective Action:</strong> {form.correctiveAction}</p>
                    <p><strong className="text-purple-400">Preventive Action:</strong> {form.preventiveAction}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button type="submit">Submit Complaint</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="text-left py-3 px-4">Complaint #</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Channel</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono text-purple-400 text-xs">{c.complaintNumber}</td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(c.date)}</td>
                    <td className="py-3 px-4">{c.channel}</td>
                    <td className="py-3 px-4">{c.category}</td>
                    <td className="py-3 px-4 text-slate-300">{c.terminal} → {c.area}</td>
                    <td className="py-3 px-4 text-center"><Badge className={getStatusColor(c.status)}>{c.status}</Badge></td>
                    <td className="py-3 px-4 text-center">
                      <DeleteButton
                        onDelete={() => deleteComplaint(c.id)}
                        confirmMessage={t('delete.complaint', { id: c.complaintNumber })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}