import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { description, category, channel } = await req.json();

  return NextResponse.json({
    aiAnalysis: `Complaint received via ${channel || 'unknown channel'} regarding ${category || 'service issue'}. Analysis indicates recurring pattern in airport service delivery requiring systematic review.`,
    customerImpact: category?.includes('Queue') || category?.includes('Delay')
      ? 'High - Significant time loss and potential missed connections affecting passenger journey'
      : 'Medium - Negative impact on passenger satisfaction and airport perception',
    rootCause: `Primary root cause identified in ${category || 'operational'} process: insufficient resource allocation and lack of proactive monitoring during peak periods.`,
    correctiveAction: 'Immediate service recovery contact with affected passenger. Deploy additional resources to address current situation.',
    preventiveAction: 'Implement predictive analytics for demand forecasting. Update SOP for peak hour resource allocation. Conduct staff training on service recovery protocols.',
  });
}