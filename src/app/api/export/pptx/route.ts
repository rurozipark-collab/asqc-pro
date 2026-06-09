import { NextRequest, NextResponse } from 'next/server';
import { generatePPTXReport } from '@/lib/export/pptx-generator';

export async function POST(req: NextRequest) {
  const { reportType, period } = await req.json();
  const buffer = await generatePPTXReport(reportType || 'Monthly', period || new Date().toISOString().split('T')[0]);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="ASQC-${reportType}-Report.pptx"`,
    },
  });
}