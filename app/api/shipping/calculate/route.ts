import { NextResponse } from 'next/server'

// Simple shipping calculator - in production, integrate with FedEx API
export async function POST(req: Request) {
  try {
    const { destination, weight } = await req.json()
    
    // Origin: Victoria, TX 77905
    const origin = { zip: '77905', state: 'TX' }
    
    // Simple distance-based calculation
    // In production, use FedEx Rate API: https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html
    
    const baseRate = 15
    const perPoundRate = 0.75
    const shippingCost = baseRate + (weight * perPoundRate)
    
    // Add state-based multiplier
    const stateMultipliers: Record<string, number> = {
      'TX': 1.0,
      'LA': 1.1,
      'OK': 1.1,
      'AR': 1.2,
      'NM': 1.2,
      'MS': 1.3,
      'AL': 1.4,
      'TN': 1.4,
      'KS': 1.3,
      'MO': 1.4,
      'CO': 1.5,
      'AZ': 1.6,
      'CA': 1.8,
      'FL': 1.7,
      'GA': 1.6,
      'NC': 1.7,
      'SC': 1.7,
      'VA': 1.8,
      'WV': 1.8,
      'KY': 1.6,
      'IN': 1.7,
      'OH': 1.8,
      'MI': 1.9,
      'IL': 1.6,
      'WI': 1.9,
      'MN': 2.0,
      'IA': 1.7,
      'NE': 1.7,
      'SD': 2.0,
      'ND': 2.2,
      'MT': 2.3,
      'WY': 2.0,
      'ID': 2.2,
      'UT': 1.9,
      'NV': 2.0,
      'OR': 2.3,
      'WA': 2.4,
      'AK': 3.5,
      'HI': 4.0,
      'NY': 2.0,
      'PA': 1.9,
      'NJ': 2.0,
      'DE': 2.0,
      'MD': 1.9,
      'DC': 1.9,
      'CT': 2.1,
      'RI': 2.2,
      'MA': 2.2,
      'VT': 2.3,
      'NH': 2.3,
      'ME': 2.4
    }
    
    const multiplier = stateMultipliers[destination.state?.toUpperCase()] || 1.5
    const finalCost = Math.round(shippingCost * multiplier * 100) / 100
    
    return NextResponse.json({
      cost: finalCost,
      origin: 'Victoria, TX 77905',
      destination: `${destination.city}, ${destination.state} ${destination.zip}`,
      weight: weight,
      carrier: 'FedEx Ground (Estimated)'
    })
  } catch (error) {
    console.error('Shipping calculation error:', error)
    return NextResponse.json({ error: 'Failed to calculate shipping', cost: 25 }, { status: 500 })
  }
}
