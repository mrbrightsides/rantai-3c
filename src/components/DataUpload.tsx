'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, Cloud, Server, Database, Activity, Zap, HardDrive, Cpu, Network } from 'lucide-react';
import Papa from 'papaparse';
import type { EnergyData, UploadedFileData } from '@/types/carbon';
import { DataValidation } from '@/components/DataValidation';
import { useState as useStateReact } from 'react';

interface DataUploadProps {
  onDataUpload: (data: EnergyData[]) => void;
  isUsingDemoData?: boolean;
  energyDataCount?: number;
}

export function DataUpload({ onDataUpload, isUsingDemoData = false, energyDataCount = 0 }: DataUploadProps): JSX.Element {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileData[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [showValidation, setShowValidation] = useState<boolean>(false);
  const [validationData, setValidationData] = useState<EnergyData[]>([]);

  const parseCSVData = useCallback((csvContent: string): EnergyData[] => {
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const data: EnergyData[] = results.data.map((row: any, index: number) => ({
              id: `energy-${index}`,
              date: row.date || row.Date || new Date().toISOString().split('T')[0],
              category: row.category || row.Category || 'General',
              consumption: parseFloat(row.consumption || row.Consumption || row.kWh || '0'),
              location: row.location || row.Location || '',
              source: row.source || row.Source || '',
            }));

            // Filter out invalid entries
            const validData = data.filter(item => 
              item.consumption > 0 && 
              item.date && 
              item.category
            );

            resolve(validData);
          } catch (error) {
            reject(new Error('Failed to parse CSV data'));
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  }, []);

  const parseJSONData = useCallback((jsonContent: string): EnergyData[] => {
    try {
      const rawData = JSON.parse(jsonContent);
      let dataArray: any[] = [];

      // Handle different JSON structures
      if (Array.isArray(rawData)) {
        dataArray = rawData;
      } else if (rawData.data && Array.isArray(rawData.data)) {
        dataArray = rawData.data;
      } else if (rawData.energyData && Array.isArray(rawData.energyData)) {
        dataArray = rawData.energyData;
      } else {
        throw new Error('JSON must contain an array of energy consumption data');
      }

      const data: EnergyData[] = dataArray.map((item: any, index: number) => ({
        id: item.id || `energy-${index}`,
        date: item.date || new Date().toISOString().split('T')[0],
        category: item.category || 'General',
        consumption: parseFloat(item.consumption || item.kWh || '0'),
        location: item.location || '',
        source: item.source || '',
      }));

      // Filter out invalid entries
      return data.filter(item => 
        item.consumption > 0 && 
        item.date && 
        item.category
      );
    } catch (error) {
      throw new Error('Invalid JSON format or structure');
    }
  }, []);

  const processFile = useCallback(async (file: File): Promise<EnergyData[]> => {
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });

    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    if (fileExtension === 'csv') {
      return await parseCSVData(content);
    } else if (fileExtension === 'json') {
      return parseJSONData(content);
    } else {
      throw new Error('Unsupported file format. Please upload CSV or JSON files.');
    }
  }, [parseCSVData, parseJSONData]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setProcessingStatus('Starting upload...');

    try {
      const newFiles: UploadedFileData[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingStatus(`Processing ${file.name}...`);
        setUploadProgress(((i + 1) / files.length) * 50);

        try {
          const content = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
          });

          const data = await processFile(file);
          
          newFiles.push({
            file,
            content,
            data,
            processed: true,
          });

          setUploadProgress(((i + 1) / files.length) * 100);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          newFiles.push({
            file,
            content: '',
            data: [],
            processed: false,
          });
        }
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Combine all valid data and notify parent
      const allValidData = newFiles
        .filter(fileData => fileData.processed && fileData.data.length > 0)
        .flatMap(fileData => fileData.data);

      if (allValidData.length > 0) {
        setValidationData(allValidData);
        setShowValidation(true);
        onDataUpload(allValidData);
        setProcessingStatus(`Successfully processed ${allValidData.length} records!`);
      } else {
        setProcessingStatus('No valid data found in uploaded files.');
      }

    } catch (error) {
      setProcessingStatus(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      
      // Clear the input
      event.target.value = '';
    }
  }, [processFile, onDataUpload]);

  const removeFile = useCallback((index: number): void => {
    setUploadedFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      
      // Recalculate combined data
      const allValidData = updated
        .filter(fileData => fileData.processed && fileData.data.length > 0)
        .flatMap(fileData => fileData.data);
      
      onDataUpload(allValidData);
      return updated;
    });
  }, [onDataUpload]);

  const clearAllFiles = useCallback((): void => {
    setUploadedFiles([]);
    onDataUpload([]);
    setProcessingStatus('');
    setUploadProgress(0);
  }, [onDataUpload]);

  // Template download functionality
  const downloadTemplate = useCallback((format: 'csv' | 'json'): void => {
    const templateData = [
      {
        date: '2024-01-15',
        category: 'Office',
        consumption: 150.5,
        location: 'Jakarta',
        source: 'Grid'
      },
      {
        date: '2024-01-15',
        category: 'Manufacturing',
        consumption: 2840.2,
        location: 'Surabaya',
        source: 'Solar'
      },
      {
        date: '2024-01-16',
        category: 'Data Center',
        consumption: 1200.0,
        location: 'Bandung',
        source: 'Grid'
      },
      {
        date: '2024-01-16',
        category: 'Vehicle',
        consumption: 85.3,
        location: 'Medan',
        source: 'Generator'
      }
    ];

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      content = 'date,category,consumption,location,source\n' + 
        templateData.map(row => 
          `${row.date},${row.category},${row.consumption},${row.location},${row.source}`
        ).join('\n');
      filename = 'rantai_energy_template.csv';
      mimeType = 'text/csv;charset=utf-8;';
    } else {
      content = JSON.stringify(templateData, null, 2);
      filename = 'rantai_energy_template.json';
      mimeType = 'application/json;charset=utf-8;';
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const getTotalRecords = (): number => {
    return uploadedFiles
      .filter(fileData => fileData.processed)
      .reduce((total, fileData) => total + fileData.data.length, 0);
  };

  // Cloud storage metrics (simulated)
  const getStorageMetrics = () => {
    const totalFiles = uploadedFiles.length;
    const totalDataSize = uploadedFiles.reduce((sum, file) => sum + file.file.size, 0);
    const processedFiles = uploadedFiles.filter(f => f.processed).length;
    const totalRecords = getTotalRecords();
    
    // For demo data, simulate metrics
    const demoRecords = isUsingDemoData && energyDataCount > 0 ? energyDataCount : 0;
    const effectiveRecords = Math.max(totalRecords, demoRecords);
    const effectiveFiles = Math.max(totalFiles, isUsingDemoData && energyDataCount > 0 ? 1 : 0);
    const effectiveDataSize = Math.max(totalDataSize, isUsingDemoData && energyDataCount > 0 ? 2048 : 0); // 2KB simulated demo data size
    
    return {
      storageUsed: effectiveDataSize,
      storageCapacity: 10 * 1024 * 1024 * 1024, // 10GB simulated capacity
      filesStored: effectiveFiles,
      recordsProcessed: effectiveRecords,
      processingSpeed: effectiveRecords > 0 ? Math.round(effectiveRecords / Math.max(1, effectiveFiles)) : 0,
      uptime: '99.9%',
      scalabilityScore: Math.min(100, Math.round((effectiveRecords / 10) * 100)), // More realistic scaling
    };
  };
  
  const storageMetrics = getStorageMetrics();
  const storageUsagePercent = (storageMetrics.storageUsed / storageMetrics.storageCapacity) * 100;

  return (
    <div className="space-y-6">
      {/* Data Validation Component */}
      {showValidation && validationData.length > 0 && (
        <DataValidation
          data={validationData}
          onValidationComplete={(result) => {
            console.log('Validation result:', result);
          }}
        />
      )}
      {/* Cloud Infrastructure Dashboard */}
      {(uploadedFiles.length > 0 || (isUsingDemoData && energyDataCount > 0)) && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Cloud className="h-5 w-5" />
              Cloud Storage Dashboard - Real-time Infrastructure
            </CardTitle>
            <CardDescription>
              Monitoring scalable cloud infrastructure performance and data processing capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Storage Metrics */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Storage</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {storageMetrics.storageUsed < 1024 ? 
                      `${storageMetrics.storageUsed}B` :
                      storageMetrics.storageUsed < 1024 * 1024 ?
                        `${(storageMetrics.storageUsed / 1024).toFixed(1)}KB` :
                        `${(storageMetrics.storageUsed / (1024 * 1024)).toFixed(1)}MB`
                    }
                  </div>
                  <Progress value={storageUsagePercent} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {storageUsagePercent.toFixed(1)}% of 10GB capacity
                  </p>
                </div>
              </div>

              {/* Processing Speed */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Processing</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {storageMetrics.processingSpeed}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    avg records/file
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Zap className="h-3 w-3" />
                    High Performance
                  </div>
                </div>
              </div>

              {/* Scalability Score */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Scalability</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {storageMetrics.scalabilityScore}/100
                  </div>
                  <Progress value={storageMetrics.scalabilityScore} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Auto-scaling ready
                  </p>
                </div>
              </div>

              {/* System Uptime */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Reliability</h4>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {storageMetrics.uptime}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">system uptime</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    Operational
                  </div>
                </div>
              </div>
            </div>

            {/* Infrastructure Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Data Flow Diagram */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Data Processing Pipeline
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                        <Upload className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">File Upload</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      {storageMetrics.filesStored} files
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                        <Cpu className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">Data Processing</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      {storageMetrics.recordsProcessed} records
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                        <Database className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">Cloud Storage</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      Ready for Analysis
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Cloud Infrastructure Insights
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded">
                    <span className="text-gray-600 dark:text-gray-400">🚀 Auto-scaling capability</span>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded">
                    <span className="text-gray-600 dark:text-gray-400">⚡ Load balancing</span>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200">
                      Optimized
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded">
                    <span className="text-gray-600 dark:text-gray-400">🛡️ Data redundancy</span>
                    <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-200">
                      3x Backup
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded">
                    <span className="text-gray-600 dark:text-gray-400">📊 Real-time monitoring</span>
                    <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200">
                      24/7
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
            Data Upload - Cloud Infrastructure
          </CardTitle>
          <CardDescription>
            Upload your energy consumption data in CSV or JSON format for carbon footprint analysis
            {isUsingDemoData && (
              <span className="block mt-2 text-yellow-600 dark:text-yellow-400 font-medium">
                ⚡ Currently using demo data - Upload your own files to replace sample data
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-400 dark:hover:border-green-500 transition-colors">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {isUsingDemoData ? 'Upload your own data to replace demo samples' : 'Drop your files here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Supports CSV and JSON files up to 10MB each
            </p>
            {isUsingDemoData && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                  💡 Demo data includes: Office, Manufacturing, Data Center, and Vehicle energy consumption from various Indonesian cities
                </p>
              </div>
            )}
            <input
              type="file"
              accept=".csv,.json"
              multiple
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="hidden"
              id="file-upload"
            />
            <Button 
              asChild 
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                {isProcessing ? 'Processing...' : 'Select Files'}
              </label>
            </Button>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{processingStatus}</span>
                <span className="text-gray-600 dark:text-gray-400">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Status Message */}
          {processingStatus && !isProcessing && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{processingStatus}</AlertDescription>
            </Alert>
          )}

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFiles}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-2">
                {uploadedFiles.map((fileData, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {fileData.file.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {fileData.file.size < 1024 ? 
                            `${fileData.file.size} bytes` : 
                            fileData.file.size < 1024 * 1024 ? 
                              `${(fileData.file.size / 1024).toFixed(1)} KB` : 
                              `${(fileData.file.size / (1024 * 1024)).toFixed(1)} MB`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {fileData.processed ? (
                        <>
                          <Badge variant="outline" className="gap-1 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {fileData.data.length} records
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Preview */}
              {getTotalRecords() > 0 && (
                <div className="space-y-4">
                  <Card className="border-emerald-200 dark:border-emerald-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-5 w-5" />
                        Data Processing Summary
                      </CardTitle>
                      <CardDescription>
                        Your uploaded data has been processed and validated
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {getTotalRecords()}
                          </div>
                          <div className="text-sm text-emerald-700 dark:text-emerald-300">Valid Records</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {uploadedFiles.filter(f => f.processed).length}
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">Files Processed</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {uploadedFiles
                              .filter(f => f.processed)
                              .flatMap(f => f.data.map(d => d.category))
                              .filter((v, i, arr) => arr.indexOf(v) === i)
                              .length
                            }
                          </div>
                          <div className="text-sm text-purple-700 dark:text-purple-300">Categories</div>
                        </div>
                        <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {Math.round(
                              uploadedFiles
                                .filter(f => f.processed)
                                .flatMap(f => f.data)
                                .reduce((sum, d) => sum + d.consumption, 0)
                            ).toLocaleString()}
                          </div>
                          <div className="text-sm text-amber-700 dark:text-amber-300">Total kWh</div>
                        </div>
                      </div>
                      
                      {/* Sample Data Preview */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">📊 Data Preview (First 5 Records)</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th className="p-2 text-left font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Date</th>
                                <th className="p-2 text-left font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Category</th>
                                <th className="p-2 text-left font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Consumption (kWh)</th>
                                <th className="p-2 text-left font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Location</th>
                                <th className="p-2 text-left font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Source</th>
                              </tr>
                            </thead>
                            <tbody>
                              {uploadedFiles
                                .filter(f => f.processed)
                                .flatMap(f => f.data)
                                .slice(0, 5)
                                .map((record, index) => (
                                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="p-2 text-gray-900 dark:text-gray-100">{record.date}</td>
                                    <td className="p-2">
                                      <Badge variant="outline" className="text-xs">
                                        {record.category}
                                      </Badge>
                                    </td>
                                    <td className="p-2 font-medium text-gray-900 dark:text-gray-100">
                                      {record.consumption.toFixed(2)}
                                    </td>
                                    <td className="p-2 text-gray-600 dark:text-gray-400">
                                      {record.location || 'N/A'}
                                    </td>
                                    <td className="p-2 text-gray-600 dark:text-gray-400">
                                      {record.source || 'N/A'}
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                        
                        {getTotalRecords() > 5 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            ... and {getTotalRecords() - 5} more records ready for analysis
                          </p>
                        )}
                      </div>
                      
                      {/* Data Quality Insights */}
                      <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                        <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
                          ✨ Data Quality Assessment
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-indigo-700 dark:text-indigo-300">📅 Date coverage:</span>
                              <span className="font-medium text-indigo-900 dark:text-indigo-100">
                                {(() => {
                                  const dates = uploadedFiles
                                    .filter(f => f.processed)
                                    .flatMap(f => f.data.map(d => d.date))
                                    .sort();
                                  return dates.length > 0 ? 
                                    `${dates[0]} to ${dates[dates.length - 1]}` : 
                                    'No dates';
                                })()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-indigo-700 dark:text-indigo-300">🏢 Unique locations:</span>
                              <span className="font-medium text-indigo-900 dark:text-indigo-100">
                                {uploadedFiles
                                  .filter(f => f.processed)
                                  .flatMap(f => f.data.map(d => d.location))
                                  .filter((v, i, arr) => v && arr.indexOf(v) === i)
                                  .length || 'Not specified'}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-indigo-700 dark:text-indigo-300">⚡ Energy sources:</span>
                              <span className="font-medium text-indigo-900 dark:text-indigo-100">
                                {uploadedFiles
                                  .filter(f => f.processed)
                                  .flatMap(f => f.data.map(d => d.source))
                                  .filter((v, i, arr) => v && arr.indexOf(v) === i)
                                  .length || 'Not specified'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-indigo-700 dark:text-indigo-300">📊 Data completeness:</span>
                              <span className="font-medium text-indigo-900 dark:text-indigo-100">
                                {Math.round(
                                  (uploadedFiles
                                    .filter(f => f.processed)
                                    .flatMap(f => f.data)
                                    .filter(d => d.location && d.source)
                                    .length / Math.max(1, getTotalRecords())) * 100
                                )}% complete
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Comprehensive Data Format Documentation */}
          <Card className="border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <FileText className="h-5 w-5" />
                Data Format Specification
              </CardTitle>
              <CardDescription>
                Complete guide to supported data formats and field requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Required vs Optional Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    ✅ Required Fields (Minimum)
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="font-medium text-red-900 dark:text-red-100">date</div>
                      <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Format: YYYY-MM-DD (e.g., "2024-01-15")<br/>
                        Alternative names: Date
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="font-medium text-red-900 dark:text-red-100">category</div>
                      <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Energy type (e.g., "Office", "Manufacturing", "Data Center")<br/>
                        Alternative names: Category
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="font-medium text-red-900 dark:text-red-100">consumption</div>
                      <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Energy value in kWh (e.g., 150.5, 2000)<br/>
                        Alternative names: Consumption, kWh
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    ⚡ Optional Fields (Maximum)
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="font-medium text-blue-900 dark:text-blue-100">location</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Geographic location (e.g., "Jakarta", "Surabaya")<br/>
                        Used for regional carbon factor analysis
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="font-medium text-blue-900 dark:text-blue-100">source</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Energy source (e.g., "Grid", "Solar", "Generator")<br/>
                        Used for carbon intensity calculations
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="font-medium text-green-900 dark:text-green-100">✨ Additional Fields</div>
                      <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Any other fields will be ignored during processing<br/>
                        Feel free to include extra metadata!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* File Format Examples */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">📋 Format Examples</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* CSV Example */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200">📄 CSV Format</h5>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadTemplate('csv')}
                        className="text-xs"
                      >
                        Download Template
                      </Button>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto">
                      <code className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre">
{`date,category,consumption,location,source
2024-01-15,Office,150.5,Jakarta,Grid
2024-01-15,Manufacturing,2840.2,Surabaya,Solar
2024-01-16,Data Center,1200.0,Bandung,Grid`}
                      </code>
                    </div>
                  </div>
                  
                  {/* JSON Example */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200">📋 JSON Format</h5>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadTemplate('json')}
                        className="text-xs"
                      >
                        Download Template
                      </Button>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto">
                      <code className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre">
{`[
  {
    "date": "2024-01-15",
    "category": "Office", 
    "consumption": 150.5,
    "location": "Jakarta",
    "source": "Grid"
  },
  {
    "date": "2024-01-16",
    "category": "Manufacturing",
    "consumption": 2840.2,
    "location": "Surabaya", 
    "source": "Solar"
  }
]`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Validation Rules */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                  ⚠️ Validation Rules
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800 dark:text-amber-200">
                  <div className="space-y-1">
                    <p>• <strong>Consumption values</strong> must be greater than 0</p>
                    <p>• <strong>Date field</strong> cannot be empty</p>
                    <p>• <strong>Category field</strong> cannot be empty</p>
                  </div>
                  <div className="space-y-1">
                    <p>• <strong>File size limit:</strong> 10MB per file</p>
                    <p>• <strong>Supported formats:</strong> .csv, .json only</p>
                    <p>• <strong>Records with invalid data</strong> will be filtered out</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                🌱 Energy Categories
              </h4>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <p>• <strong>Office:</strong> General office building consumption</p>
                <p>• <strong>Manufacturing:</strong> Industrial production facilities</p>
                <p>• <strong>Data Center:</strong> IT infrastructure and servers</p>
                <p>• <strong>Vehicle:</strong> Transportation and fleet operations</p>
                <p>• <strong>HVAC:</strong> Heating, ventilation, air conditioning</p>
                <p>• <strong>Lighting:</strong> Indoor and outdoor lighting systems</p>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                💡 Pro Tips
              </h4>
              <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                <p>• <strong>Consistent naming:</strong> Use standard category names for better analysis</p>
                <p>• <strong>Regular intervals:</strong> Daily or monthly data provides best insights</p>
                <p>• <strong>Include location:</strong> Enables regional carbon factor analysis</p>
                <p>• <strong>Specify energy source:</strong> Solar/renewable vs grid electricity</p>
                <p>• <strong>Multiple files:</strong> Upload separate files for different time periods</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}