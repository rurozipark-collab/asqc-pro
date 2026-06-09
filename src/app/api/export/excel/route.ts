import { NextRequest, NextResponse } from 'next/server';
import { buildExportPayload } from '@/lib/export/build-payload';
import { generateExcelReport } from '@/lib/export/excel-generator';

export async function POST(req: NextRequest) {
  const { reportType, period, data } = await req.json();
  const buffer = generateExcelReport(
    reportType || 'Monthly',
    period || new Date().toISOString().split('T')[0],
    buildExportPayload(data),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="ASQC-${reportType}-Report.xlsx"`,
    },
  });
}