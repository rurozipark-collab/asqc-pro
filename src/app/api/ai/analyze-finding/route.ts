import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { description, category, location } = await req.json();

  const riskKeywords = ['safety', 'security', 'critical', 'emergency', 'fire', 'injury'];
  const highKeywords = ['queue', 'delay', 'broken', 'unsanitary', 'missing'];
  const desc = (description || '').toLowerCase();

  let riskLevel = 'Medium';
  let priority = 'Medium';

  if (riskKeywords.some((k) => desc.includes(k))) {
    riskLevel = 'Critical';
    priority = 'Urgent';
  } else if (highKeywords.some((k) => desc.includes(k))) {
    riskLevel = 'High';
    priority = 'High';
  } else if (category === 'Cleanliness' || category === 'Accessibility') {
    riskLevel = 'Medium';
    priority = 'High';
  }

  const analysis = `Finding at ${location || 'CGK Airport'} categorized as ${category || 'Service Quality'} indicates operational gap requiring attention. Pattern analysis suggests ${riskLevel.toLowerCase()} risk based on service impact potential.`;

  const recommendation = riskLevel === 'Critical'
    ? 'Immediate containment action required. Escalate to management and implement emergency response protocol.'
    : riskLevel === 'High'
    ? 'Deploy corrective team within 24 hours. Implement temporary mitigation measures and monitor hourly.'
    : 'Schedule corrective action within SLA timeframe. Document progress and verify effectiveness after implementation.';

  return NextResponse.json({
    riskLevel,
    priority,
    serviceImpact: `${riskLevel} impact on passenger service at ${location || 'specified location'}. May affect operational SLA compliance.`,
    analysis,
    recommendation,
  });
}