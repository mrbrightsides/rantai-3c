import { NextRequest, NextResponse } from 'next/server';

// Pinata API credentials (hardcoded as per requirement - no .env file)
const PINATA_API_KEY = 'defe46eca26f7f1679ca';
const PINATA_API_SECRET = '2a933bf3a755f65797a7f73651a3d56c952584bc4402e5e47bb115593e0df3d5';
const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4YWE2ZDMxNC03NzRhLTRlY2UtYjhhMy04NGM4OTdmMDYxZmIiLCJlbWFpbCI6ImtodWRyaUBiaW5hZGFybWEuYWMuaWQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZGVmZTQ2ZWNhMjZmN2YxNjc5Y2EiLCJzY29wZWRLZXlTZWNyZXQiOiIyYTkzM2JmM2E3NTVmNjU3OTdhN2Y3MzY1MWEzZDU2Yzk1MjU4NGJjNDQwMmU1ZTQ3YmIxMTU1OTNlMGRmM2Q1IiwiZXhwIjoxNzk4MDMzMDYxfQ.jym33HQk73owNidXafW0z7TlIZc39dgHL4AdDUrGsRQ';

interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Prepare form data for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    // Optional: Add metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        app: 'RANTAI-3C',
        type: 'certificate',
        timestamp: new Date().toISOString(),
      }
    });
    pinataFormData.append('pinataMetadata', metadata);

    // Optional: Add pin options
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    pinataFormData.append('pinataOptions', pinataOptions);

    // Upload to Pinata using JWT authentication
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: pinataFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Pinata API error:', errorData);
      throw new Error(`Pinata API error: ${response.status}`);
    }

    const data: PinataUploadResponse = await response.json();

    return NextResponse.json({
      success: true,
      ipfsHash: data.IpfsHash,
      ipfsUrl: `ipfs://${data.IpfsHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
      pinSize: data.PinSize,
      timestamp: data.Timestamp,
    });

  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload to IPFS',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Upload JSON data to IPFS via Pinata
 */
export async function uploadJSON(data: object): Promise<{
  ipfsHash: string;
  ipfsUrl: string;
  gatewayUrl: string;
}> {
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: 'RANTAI-3C-Data',
          keyvalues: {
            app: 'RANTAI-3C',
            type: 'json',
            timestamp: new Date().toISOString(),
          }
        },
        pinataOptions: {
          cidVersion: 1,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Pinata JSON API error:', errorData);
      throw new Error(`Pinata API error: ${response.status}`);
    }

    const result: PinataUploadResponse = await response.json();

    return {
      ipfsHash: result.IpfsHash,
      ipfsUrl: `ipfs://${result.IpfsHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    };

  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    throw new Error('Failed to upload JSON to IPFS');
  }
}
