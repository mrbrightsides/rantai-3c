import type { IPFSUploadResult, NFTMetadata } from '@/types/nft';

/**
 * Upload JSON data to IPFS via Pinata API
 */
export async function uploadToIPFS(data: object): Promise<IPFSUploadResult> {
  try {
    // Convert data to JSON Blob
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', jsonBlob, 'data.json');
    
    // Upload to Pinata via our API route
    const response = await fetch('/api/pinata/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }
    
    const result = await response.json();
    
    return {
      ipfsHash: result.ipfsHash,
      ipfsUrl: result.ipfsUrl,
      gatewayUrl: result.gatewayUrl,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Upload NFT metadata to IPFS
 */
export async function uploadNFTMetadata(metadata: NFTMetadata): Promise<IPFSUploadResult> {
  return uploadToIPFS(metadata);
}

/**
 * Upload certificate document to IPFS
 */
export async function uploadCertificate(certificateData: object): Promise<IPFSUploadResult> {
  return uploadToIPFS(certificateData);
}

/**
 * Fetch data from IPFS via Pinata gateway
 */
export async function fetchFromIPFS(ipfsHash: string): Promise<any> {
  try {
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const response = await fetch(gatewayUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch from IPFS');
  }
}

/**
 * Upload file directly to IPFS (for PDFs, images, etc.)
 */
export async function uploadFileToIPFS(file: File): Promise<IPFSUploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/pinata/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }
    
    const result = await response.json();
    
    return {
      ipfsHash: result.ipfsHash,
      ipfsUrl: result.ipfsUrl,
      gatewayUrl: result.gatewayUrl,
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Verify IPFS hash by fetching and comparing content
 */
export async function verifyIPFSHash(
  ipfsHash: string, 
  expectedData: object
): Promise<boolean> {
  try {
    const fetchedData = await fetchFromIPFS(ipfsHash);
    const expectedString = JSON.stringify(expectedData);
    const fetchedString = JSON.stringify(fetchedData);
    
    return expectedString === fetchedString;
  } catch (error) {
    console.error('Error verifying IPFS hash:', error);
    return false;
  }
}

/**
 * Get IPFS gateway URL from hash
 */
export function getIPFSGatewayUrl(ipfsHash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}

/**
 * Extract IPFS hash from IPFS URL
 */
export function extractIPFSHash(ipfsUrl: string): string {
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', '');
  }
  if (ipfsUrl.includes('/ipfs/')) {
    return ipfsUrl.split('/ipfs/')[1];
  }
  return ipfsUrl;
}
