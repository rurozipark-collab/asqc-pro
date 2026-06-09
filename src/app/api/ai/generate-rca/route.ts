import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { description, type } = await req.json();

  return NextResponse.json({
    fiveWhy: [
      `Why 1: Issue occurred → ${description?.slice(0, 80) || 'Service gap identified'}`,
      'Why 2: Service gap exists → Process not followed or inadequate resources',
      'Why 3: Process/resources inadequate → No proactive monitoring system in place',
      'Why 4: No monitoring system → Lack of integrated data analytics platform',
      'Why 5: No analytics platform → Absence of digital transformation in quality management',
    ],
    fishbone: {
      Man: ['Insufficient trained staff', 'Lack of accountability', 'Inadequate supervision'],
      Machine: ['Outdated equipment', 'System downtime', 'Insufficient automation'],
      Method: ['SOP not followed', 'No escalation protocol', 'Manual processes'],
      Material: ['Supply shortage', 'Quality of materials below standard'],
      Environment: ['Peak hour congestion', 'Weather impact', 'Construction disruption'],
      Management: ['Delayed decision making', 'Insufficient KPI monitoring', 'Resource allocation gaps'],
    },
    rootCause: 'Systemic gap in proactive quality management due to lack of integrated monitoring and predictive analytics',
    correctiveAction: 'Immediate deployment of resources to address current issue and restore service to SLA levels',
    preventiveAction: 'Implement ASQC PRO digital monitoring with AI-powered predictive analytics and automated escalation',
    recommendation: `Based on ${type || 'Finding'} analysis: Integrate real-time monitoring, establish KPI dashboards, and implement automated CAPA workflow`,
  });
}