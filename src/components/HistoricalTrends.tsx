'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingDown, TrendingUp, Minus, History, Trash2, Info } from 'lucide-react';
import { HistoryManager, type HistoricalRecord, type HistoryStats } from '@/utils/historyManager';

interface HistoricalTrendsProps {
  currentEmissions?: number;
}

export function HistoricalTrends({ currentEmissions }: HistoricalTrendsProps): JSX.Element {
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [recentRecords, setRecentRecords] = useState<HistoricalRecord[]>([]);
  const [trendData, setTrendData] = useState<Array<{ date: string; emissions: number }>>([]);

  useEffect(() => {
    loadHistoricalData();
  }, [currentEmissions]);

  const loadHistoricalData = (): void => {
    const historyStats = HistoryManager.getStats();
    const recent = HistoryManager.getRecentRecords(10);
    const trend = HistoryManager.getTrendData();

    setStats(historyStats);
    setRecentRecords(recent);
    setTrendData(trend);
  };

  const handleClearHistory = (): void => {
    if (confirm('Are you sure you want to clear all historical data? This cannot be undone.')) {
      HistoryManager.clearAllHistory();
      loadHistoricalData();
    }
  };

  const handleDeleteRecord = (id: string): void => {
    HistoryManager.deleteRecord(id);
    loadHistoricalData();
  };

  const getTrendIcon = (trend: 'improving' | 'stable' | 'worsening'): JSX.Element => {
    if (trend === 'improving') return <TrendingDown className="h-5 w-5 text-green-600" />;
    if (trend === 'worsening') return <TrendingUp className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-gray-600" />;
  };

  const getTrendBadge = (trend: 'improving' | 'stable' | 'worsening'): JSX.Element => {
    const colors = {
      improving: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
      stable: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
      worsening: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    };

    const labels = {
      improving: '📉 Improving',
      stable: '➡️ Stable',
      worsening: '📈 Worsening',
    };

    return (
      <Badge variant="outline" className={colors[trend]}>
        {labels[trend]}
      </Badge>
    );
  };

  if (!stats || stats.totalRecords === 0) {
    return (
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <History className="h-5 w-5" />
            Historical Progress Tracking
          </CardTitle>
          <CardDescription>
            Track your carbon footprint progress over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No historical data available yet. Your analysis records will be saved automatically and displayed here over time.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <History className="h-5 w-5" />
              Historical Progress Tracking
            </div>
            {getTrendBadge(stats.trend)}
          </CardTitle>
          <CardDescription>
            Your carbon footprint history and trends over {stats.totalRecords} recorded analyses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalRecords}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Total Records</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.averageEmissions.toFixed(1)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Avg kg CO₂</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                {getTrendIcon(stats.trend)}
                {Math.abs(stats.percentageChange).toFixed(1)}%
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Change</div>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.latestRecord?.totalEmissions.toFixed(1) || 0}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300">Latest kg CO₂</div>
            </div>
          </div>

          {/* Trend Message */}
          <Alert className={
            stats.trend === 'improving' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
            stats.trend === 'worsening' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
            'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }>
            {getTrendIcon(stats.trend)}
            <AlertDescription className={
              stats.trend === 'improving' ? 'text-green-900 dark:text-green-100' :
              stats.trend === 'worsening' ? 'text-red-900 dark:text-red-100' :
              'text-gray-900 dark:text-gray-100'
            }>
              {stats.trend === 'improving' && (
                <div>
                  <strong>Great progress!</strong> Your carbon emissions have decreased by {Math.abs(stats.percentageChange).toFixed(1)}% compared to earlier records.
                </div>
              )}
              {stats.trend === 'worsening' && (
                <div>
                  <strong>Attention needed:</strong> Your carbon emissions have increased by {Math.abs(stats.percentageChange).toFixed(1)}%. Review your energy consumption patterns.
                </div>
              )}
              {stats.trend === 'stable' && (
                <div>
                  <strong>Stable emissions:</strong> Your carbon footprint has remained relatively consistent.
                </div>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Emissions Trend Over Time</CardTitle>
            <CardDescription>
              Visual representation of your carbon footprint history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                    label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(2)} kg CO₂`, 'Emissions']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    stroke="#10B981"
                    strokeWidth={3}
                    fill="url(#emissionsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Analysis History</CardTitle>
              <CardDescription>
                Your most recent carbon footprint analysis records
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div
                key={record.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {record.date}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {record.recordCount} records
                      </Badge>
                      {record.isDemoData && (
                        <Badge variant="secondary" className="text-xs">Demo</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {record.totalEmissions.toFixed(2)} kg CO₂
                      </span>
                      <span>•</span>
                      <span>{record.categories.length} categories</span>
                      <span>•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(record.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRecord(record.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
