import { NextRequest, NextResponse } from 'next/server';
import { generateExcelReport } from '@/lib/export/excel-generator';

export async function POST(req: NextRequest) {
  const { reportType, period } = await req.json();
  const buffer = generateExcelReport(reportType || 'Monthly', period || new Date().toISOString().split('T')[0]);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="ASQC-${reportType}-Report.xlsx"`,
    },
  });
}