'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Table, FileSpreadsheet, Loader2, CheckCircle } from 'lucide-react';
import { ExportManager as ExportUtil, type EmissionData } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

interface ExportManagerProps {
  emissionData: EmissionData[];
  totalEmissions: number;
  companyName?: string;
}

export function ExportManager({ emissionData, totalEmissions, companyName }: ExportManagerProps): JSX.Element {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState<Record<string, boolean>>({});

  const handleExport = async (format: 'pdf' | 'csv' | 'excel' | 'all'): Promise<void> => {
    setIsExporting({ ...isExporting, [format]: true });

    try {
      const exportOptions = {
        totalEmissions,
        emissionData,
        companyName,
        reportDate: new Date().toISOString().split('T')[0],
      };

      if (format === 'pdf') {
        await ExportUtil.exportToPDF(exportOptions);
        toast({
          title: '📄 PDF Report Generated',
          description: 'Your carbon footprint analysis has been exported to PDF',
        });
      } else if (format === 'csv') {
        ExportUtil.exportToCSV(exportOptions);
        toast({
          title: '📊 CSV Report Generated',
          description: 'Your data has been exported to CSV format',
        });
      } else if (format === 'excel') {
        ExportUtil.exportToExcel(exportOptions);
        toast({
          title: '📈 Excel Report Generated',
          description: 'Your analysis has been exported to Excel format',
        });
      } else if (format === 'all') {
        await ExportUtil.exportAll(exportOptions);
        toast({
          title: '✅ All Reports Generated',
          description: 'PDF, CSV, and Excel reports have been exported successfully',
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: '❌ Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export report',
        variant: 'destructive',
      });
    } finally {
      setIsExporting({ ...isExporting, [format]: false });
    }
  };

  if (emissionData.length === 0) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Download className="h-5 w-5" />
            Export Analysis Reports
          </CardTitle>
          <CardDescription>
            Export your carbon footprint analysis in multiple formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              No data available to export. Please analyze your energy consumption data first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Download className="h-5 w-5" />
          Export Analysis Reports
        </CardTitle>
        <CardDescription>
          Download professional reports for compliance, audits, and stakeholder presentations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalEmissions.toFixed(2)}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">Total kg CO₂</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {emissionData.length}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Categories</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {new Date().toLocaleDateString()}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Report Date</div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Choose Export Format</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* PDF Export */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">PDF Report</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Professional formatted report with charts and analysis
                  </p>
                </div>
                <Button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting['pdf']}
                  className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  {isExporting['pdf'] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export PDF
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* CSV Export */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <Table className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">CSV Data</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Raw data for further analysis and processing
                  </p>
                </div>
                <Button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting['csv']}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  {isExporting['csv'] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export CSV
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Excel Export */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
                  <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Excel Workbook</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Multi-sheet workbook with summary and details
                  </p>
                </div>
                <Button
                  onClick={() => handleExport('excel')}
                  disabled={isExporting['excel']}
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                >
                  {isExporting['excel'] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export Excel
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Export All */}
            <div className="p-4 border-2 border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Export All</h5>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Generate all formats at once
                  </p>
                </div>
                <Button
                  onClick={() => handleExport('all')}
                  disabled={isExporting['all']}
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  {isExporting['all'] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export All
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Format Details */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">What's Included</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">📄 PDF Report</h5>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Executive summary</li>
                <li>• Emissions breakdown table</li>
                <li>• Company information</li>
                <li>• Professional formatting</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">📊 CSV Data</h5>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Raw emissions data</li>
                <li>• Category breakdown</li>
                <li>• Percentage analysis</li>
                <li>• Easy data import</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-emerald-600 dark:text-emerald-400 mb-2">📈 Excel Workbook</h5>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Multiple worksheets</li>
                <li>• Summary sheet</li>
                <li>• Detailed breakdown</li>
                <li>• Ready for analysis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <FileText className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            <div className="font-medium mb-1">💡 Export Tips</div>
            <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
              <li>• Use PDF for official reports and presentations</li>
              <li>• Use CSV for data integration with other systems</li>
              <li>• Use Excel for custom analysis and visualization</li>
              <li>• All exports include timestamp and full data integrity</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
