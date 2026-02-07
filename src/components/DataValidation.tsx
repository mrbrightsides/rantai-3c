'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import type { EnergyData } from '@/types/carbon';

interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: ValidationStats;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationWarning {
  type: string;
  message: string;
  affectedRows: number;
}

interface ValidationStats {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  missingOptional: number;
  completenessScore: number;
  qualityScore: number;
}

interface DataValidationProps {
  data: EnergyData[];
  onValidationComplete: (result: ValidationResult) => void;
}

export function DataValidation({ data, onValidationComplete }: DataValidationProps): JSX.Element {
  const validateData = (): ValidationResult => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let validRows = 0;
    let missingOptional = 0;

    data.forEach((row, index) => {
      let rowValid = true;

      // Required field validation
      if (!row.date || row.date.trim() === '') {
        errors.push({
          row: index + 1,
          field: 'date',
          message: 'Date field is required',
          severity: 'error',
        });
        rowValid = false;
      }

      if (!row.category || row.category.trim() === '') {
        errors.push({
          row: index + 1,
          field: 'category',
          message: 'Category field is required',
          severity: 'error',
        });
        rowValid = false;
      }

      if (row.consumption <= 0 || isNaN(row.consumption)) {
        errors.push({
          row: index + 1,
          field: 'consumption',
          message: 'Consumption must be a positive number',
          severity: 'error',
        });
        rowValid = false;
      }

      // Optional field warnings
      if (!row.location || row.location.trim() === '') {
        missingOptional++;
      }

      if (!row.source || row.source.trim() === '') {
        missingOptional++;
      }

      if (rowValid) {
        validRows++;
      }
    });

    // Generate warnings
    if (missingOptional > 0) {
      warnings.push({
        type: 'missing_optional',
        message: `${missingOptional} optional fields are missing (location/source). Including these improves analysis accuracy.`,
        affectedRows: Math.ceil(missingOptional / 2),
      });
    }

    // Check for date format consistency
    const dateFormats = data.map(row => {
      const date = row.date;
      if (date.includes('-')) return 'dash';
      if (date.includes('/')) return 'slash';
      return 'unknown';
    });
    const uniqueFormats = [...new Set(dateFormats)];
    if (uniqueFormats.length > 1) {
      warnings.push({
        type: 'inconsistent_dates',
        message: 'Multiple date formats detected. Use consistent YYYY-MM-DD format.',
        affectedRows: data.length,
      });
    }

    // Check for duplicate entries
    const duplicates = data.reduce((acc: Array<{ date: string; category: string; count: number }>, row) => {
      const key = `${row.date}_${row.category}`;
      const existing = acc.find(item => `${item.date}_${item.category}` === key);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ date: row.date, category: row.category, count: 1 });
      }
      return acc;
    }, []);
    const duplicateCount = duplicates.filter(d => d.count > 1).length;
    if (duplicateCount > 0) {
      warnings.push({
        type: 'duplicate_entries',
        message: `${duplicateCount} potential duplicate entries found (same date + category).`,
        affectedRows: duplicateCount,
      });
    }

    // Calculate scores
    const completenessScore = Math.round(
      ((data.length * 5 - missingOptional) / (data.length * 5)) * 100
    );
    const qualityScore = Math.round(
      (validRows / data.length) * 100 * (1 - warnings.length * 0.1)
    );
    const overallScore = Math.round((completenessScore + qualityScore) / 2);

    const result: ValidationResult = {
      isValid: errors.length === 0,
      score: Math.max(0, overallScore),
      errors,
      warnings,
      stats: {
        totalRows: data.length,
        validRows,
        invalidRows: data.length - validRows,
        missingOptional,
        completenessScore: Math.max(0, completenessScore),
        qualityScore: Math.max(0, qualityScore),
      },
    };

    onValidationComplete(result);
    return result;
  };

  const validation = validateData();
  const { score, errors, warnings, stats } = validation;

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <Card className="border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <CheckCircle className="h-5 w-5" />
            Data Quality Validation
          </div>
          <Badge
            variant="outline"
            className={`text-lg px-4 py-1 ${getScoreColor(score)}`}
          >
            {score}/100 - {getScoreBadge(score)}
          </Badge>
        </CardTitle>
        <CardDescription>
          Comprehensive validation and quality assessment of your uploaded data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalRows}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Records</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.validRows}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">Valid Records</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.invalidRows}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">Invalid Records</div>
          </div>
          <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.missingOptional}
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-300">Missing Optional</div>
          </div>
        </div>

        {/* Quality Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Completeness Score
              </span>
              <span className={`text-sm font-bold ${getScoreColor(stats.completenessScore)}`}>
                {stats.completenessScore}%
              </span>
            </div>
            <Progress value={stats.completenessScore} className="h-3" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Measures how complete your data is with optional fields
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quality Score
              </span>
              <span className={`text-sm font-bold ${getScoreColor(stats.qualityScore)}`}>
                {stats.qualityScore}%
              </span>
            </div>
            <Progress value={stats.qualityScore} className="h-3" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Measures data validity and consistency
            </p>
          </div>
        </div>

        {/* Errors Section */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Found {errors.length} validation errors:</div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {errors.slice(0, 5).map((error, index) => (
                  <div key={index} className="text-sm">
                    • Row {error.row}, Field "{error.field}": {error.message}
                  </div>
                ))}
                {errors.length > 5 && (
                  <div className="text-sm font-medium">
                    ... and {errors.length - 5} more errors
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Warnings Section */}
        {warnings.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Data Quality Warnings
            </h4>
            {warnings.map((warning, index) => (
              <Alert key={index} className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  <div className="font-medium text-amber-900 dark:text-amber-100">
                    {warning.message}
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Affects approximately {warning.affectedRows} records
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Success Message */}
        {errors.length === 0 && warnings.length === 0 && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900 dark:text-green-100">
              <div className="font-medium">Validation Passed!</div>
              <div className="text-sm mt-1">
                All data is valid and ready for carbon footprint analysis.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendations */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Improvement Recommendations
          </h4>
          <div className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
            {score < 90 && (
              <>
                {stats.missingOptional > 0 && (
                  <p>• Include location and energy source fields for more accurate carbon calculations</p>
                )}
                {errors.length > 0 && (
                  <p>• Fix validation errors to ensure all records are processed correctly</p>
                )}
                {warnings.some(w => w.type === 'inconsistent_dates') && (
                  <p>• Standardize date format to YYYY-MM-DD for better consistency</p>
                )}
                {warnings.some(w => w.type === 'duplicate_entries') && (
                  <p>• Review and remove duplicate entries to avoid skewed analysis</p>
                )}
              </>
            )}
            {score >= 90 && (
              <p>✅ Your data quality is excellent! No improvements needed.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
