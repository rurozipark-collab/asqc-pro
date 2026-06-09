'use client';

import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeleteButton } from '@/components/ui/delete-button';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/use-translation';
import { formatDate, getStatusColor, INPUT_CLASS, TABLE_SCROLL_CLASS } from '@/lib/utils';
import type { Document, DocumentType } from '@/types';
import { Plus, FileText, AlertTriangle, Clock, Upload, Download, X } from 'lucide-react';

const DOCUMENT_TYPES: DocumentType[] = ['SOP', 'SLA', 'SLG', 'Service Standard', 'Audit Report', 'QC Report', 'CX Report'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';

export default function DocumentsPage() {
  const { documents, addDocument, deleteDocument } = useAppStore();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: '' as DocumentType | '',
    version: '1.0',
    status: 'Draft' as Document['status'],
    uploadedBy: 'QC Team',
    effectiveDate: '',
    reviewDate: '',
    expiryDate: '',
    file: null as { name: string; size: number; mimeType: string; dataUrl: string } | null,
  });

  const expiringSoon = documents.filter(d => {
    const days = (new Date(d.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days < 30 && days > 0;
  });



  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(t('documents.supportedFormats'));
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f) => ({
        ...f,
        file: {
          name: file.name,
          size: file.size,
          mimeType: file.type,
          dataUrl: ev.target?.result as string,
        },
        title: f.title || file.name.replace(/\.[^/.]+$/, ''),
      }));
      setUploading(false);
    };
    reader.onerror = () => {
      setUploading(false);
      alert('Gagal membaca file.');
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file) {
      alert(t('documents.selectFile'));
      return;
    }

    const doc: Document = {
      id: Date.now().toString(),
      title: form.title,
      type: form.type as DocumentType,
      version: form.version,
      status: form.status,
      uploadedBy: form.uploadedBy,
      effectiveDate: form.effectiveDate,
      reviewDate: form.reviewDate,
      expiryDate: form.expiryDate,
      fileUrl: form.file.dataUrl,
      fileName: form.file.name,
      fileSize: form.file.size,
      mimeType: form.file.mimeType,
    };
    addDocument(doc);
    setShowForm(false);
    setForm({
      title: '', type: '', version: '1.0', status: 'Draft', uploadedBy: 'QC Team',
      effectiveDate: '', reviewDate: '', expiryDate: '', file: null,
    });
  };

  const downloadDocument = (doc: Document) => {
    if (!doc.fileUrl) return;
    const a = document.createElement('a');
    a.href = doc.fileUrl;
    a.download = doc.fileName || doc.title;
    a.click();
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout title={t('documents.title')} subtitle={t('documents.subtitle')}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {expiringSoon.length > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                <AlertTriangle className="h-3 w-3" /> {expiringSoon.length} {t('documents.expiringSoon')}
              </Badge>
            )}
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" /> {t('documents.uploadDocument')}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{t('documents.uploadForm')}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-2">{t('documents.selectFile')} *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES}
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      <Upload className="h-4 w-4" />
                      {uploading ? '...' : t('documents.selectFile')}
                    </Button>
                    <span className="text-xs text-slate-500">{t('documents.supportedFormats')}</span>
                  </div>
                  {form.file && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                      <FileText className="h-5 w-5 text-emerald-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 truncate">{form.file.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(form.file.size)}</p>
                      </div>
                      <button type="button" onClick={() => setForm({ ...form, file: null })} className="text-red-400 hover:text-red-300">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('documents.documentTitle')} *</label>
                    <input className={INPUT_CLASS} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('documents.documentType')} *</label>
                    <select className={INPUT_CLASS} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DocumentType })} required>
                      <option value="">{t('common.select')}</option>
                      {DOCUMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('common.version')}</label>
                    <input className={INPUT_CLASS} value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('common.status')}</label>
                    <select className={INPUT_CLASS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Document['status'] })}>
                      <option value="Draft">{t('common.draft')}</option>
                      <option value="Under Review">{t('documents.underReview')}</option>
                      <option value="Approved">{t('common.approved')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('documents.effectiveDate')}</label>
                    <input type="date" className={INPUT_CLASS} value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('documents.reviewDate')}</label>
                    <input type="date" className={INPUT_CLASS} value={form.reviewDate} onChange={(e) => setForm({ ...form, reviewDate: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('documents.expiryDate')}</label>
                    <input type="date" className={INPUT_CLASS} value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('documents.uploadedBy')}</label>
                    <input className={INPUT_CLASS} value={form.uploadedBy} onChange={(e) => setForm({ ...form, uploadedBy: e.target.value })} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={!form.file}>{t('documents.submitDocument')}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:border-cyan-500/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-slate-800 p-2.5"><FileText className="h-5 w-5 text-cyan-400" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-slate-200 text-sm truncate">{doc.title}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        {doc.fileUrl && (
                          <Button variant="ghost" size="sm" onClick={() => downloadDocument(doc)} title={t('common.download')}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <DeleteButton
                          onDelete={() => deleteDocument(doc.id)}
                          confirmMessage={t('delete.document', { title: doc.title })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge className="bg-slate-700 text-slate-300">{doc.type}</Badge>
                      <Badge className="bg-slate-700 text-slate-300">v{doc.version}</Badge>
                    </div>
                    <Badge className={`mt-2 ${getStatusColor(doc.status)}`}>{doc.status}</Badge>
                    {doc.fileName ? (
                      <p className="mt-2 text-xs text-emerald-400 truncate">📎 {doc.fileName} ({formatFileSize(doc.fileSize)})</p>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">{t('documents.noFile')}</p>
                    )}
                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <p>{t('common.effective')}: {formatDate(doc.effectiveDate)}</p>
                      <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t('common.review')}: {formatDate(doc.reviewDate)}</p>
                      <p>{t('common.expires')}: {formatDate(doc.expiryDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}