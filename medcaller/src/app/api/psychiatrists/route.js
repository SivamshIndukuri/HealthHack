import { NextResponse } from 'next/server'

async function fetchPsychiatristsByLocation(city, state) {
    const taxonomy = '2084P0800X';
    const url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&taxonomy=${taxonomy}&city=${city}&state=${state}&limit=25`;

    
    const res = await fetch(url);
    const data = await res.json();
    return data.results?.map((p) => ({
    name: `${p.basic?.authorized_official_first_name || ''} ${p.basic?.authorized_official_last_name || ''}`.trim(),
    npi: p.number,
    phone: p.addresses?.[0]?.telephone_number,
    address: p.addresses?.[0]?.address_1,
    city: p.addresses?.[0]?.city,
    state: p.addresses?.[0]?.state,
    zip: p.addresses?.[0]?.postal_code,
  })) || [];
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || 'Newark';
    const state = searchParams.get('state') || 'NJ';
    //const insurance = searchParams.get('insurance') || 'Cigna';

    const baseProviders = await fetchPsychiatristsByLocation(city, state)

    return NextResponse.json({ psychiatrists: baseProviders })


}



