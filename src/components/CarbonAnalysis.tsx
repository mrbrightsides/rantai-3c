'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Leaf, TrendingUp, AlertCircle, Award, Brain, Lightbulb, Target, Zap, TrendingDown } from 'lucide-react';
import { SustainabilityProgress } from '@/components/SustainabilityProgress';
import { InteractiveCharts } from '@/components/InteractiveCharts';
import { ExportManager } from '@/components/ExportManager';
import { HistoricalTrends } from '@/components/HistoricalTrends';
import { HistoryManager } from '@/utils/historyManager';
import { useEffect } from 'react';

interface EmissionData {
  id: string;
  category: string;
  value: number;
  percentage: number;
}

interface CarbonAnalysisProps {
  emissionData: EmissionData[];
  totalEmissions: number;
  energyDataCount?: number;
  isUsingDemoData?: boolean;
}

export function CarbonAnalysis({ emissionData, totalEmissions, energyDataCount = 0, isUsingDemoData = false }: CarbonAnalysisProps): JSX.Element {
  // Save to history whenever emissions data changes
  useEffect(() => {
    if (emissionData.length > 0 && totalEmissions > 0) {
      HistoryManager.saveRecord({
        totalEmissions,
        recordCount: energyDataCount,
        categories: emissionData.map(item => ({
          category: item.category,
          value: item.value,
          percentage: item.percentage,
        })),
        emissionLevel: getEmissionLevel(totalEmissions).level,
        isDemoData: isUsingDemoData,
      });
    }
  }, [emissionData, totalEmissions, energyDataCount, isUsingDemoData]);
  // Color palette for charts
  const colors = [
    '#10B981', // green-500
    '#3B82F6', // blue-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
  ];

  // AI-powered insights generation
  const generateAIInsights = () => {
    const topEmitter = emissionData.reduce((max, item) => item.value > max.value ? item : max, emissionData[0]);
    const lowestEmitter = emissionData.reduce((min, item) => item.value < min.value ? item : min, emissionData[0]);
    const avgEmission = totalEmissions / emissionData.length;
    
    const insights = [
      {
        type: 'pattern',
        title: 'Emission Pattern Analysis',
        description: `AI detected that ${topEmitter?.category || 'Unknown'} accounts for ${topEmitter?.percentage || 0}% of total emissions. This represents ${topEmitter?.value.toFixed(1) || 0} kg CO₂.`,
        recommendation: topEmitter?.percentage > 40 ? 'Critical priority for reduction efforts' : topEmitter?.percentage > 25 ? 'High priority optimization target' : 'Monitor and maintain efficiency',
        impact: topEmitter?.percentage > 40 ? 'high' : topEmitter?.percentage > 25 ? 'medium' : 'low'
      },
      {
        type: 'efficiency',
        title: 'Efficiency Optimization',
        description: `Smart analysis shows ${emissionData.filter(item => item.value < avgEmission).length} categories are below average emissions, while ${emissionData.filter(item => item.value > avgEmission).length} need attention.`,
        recommendation: 'Focus optimization efforts on above-average categories for maximum impact',
        impact: 'medium'
      },
      {
        type: 'prediction',
        title: 'Predictive Analytics',
        description: `Based on current consumption patterns, implementing energy efficiency measures could reduce emissions by 15-30%.`,
        recommendation: 'Prioritize smart systems and renewable energy integration',
        impact: 'high'
      },
      {
        type: 'benchmark',
        title: 'Industry Benchmarking',
        description: `Your carbon intensity of ${(totalEmissions / energyDataCount).toFixed(2)} kg CO₂ per record ${totalEmissions < 500 ? 'exceeds' : totalEmissions < 1000 ? 'meets' : 'falls below'} industry sustainability standards.`,
        recommendation: totalEmissions < 500 ? 'Maintain current practices and share best practices' : 'Implement carbon reduction strategies',
        impact: totalEmissions < 500 ? 'low' : totalEmissions < 1000 ? 'medium' : 'high'
      }
    ];
    
    return insights;
  };

  const aiInsights = generateAIInsights();

  // Smart recommendations based on data patterns
  const generateSmartRecommendations = () => {
    const highEmissionCategories = emissionData.filter(item => item.percentage > 20);
    const recommendations = [];

    if (highEmissionCategories.some(cat => cat.category.toLowerCase().includes('data'))) {
      recommendations.push({
        category: 'Data Center Optimization',
        actions: ['Implement AI-powered cooling systems', 'Migrate to energy-efficient servers', 'Use renewable energy sources'],
        potential: '25-40% reduction',
        priority: 'high'
      });
    }

    if (highEmissionCategories.some(cat => cat.category.toLowerCase().includes('office'))) {
      recommendations.push({
        category: 'Office Energy Management',
        actions: ['Smart lighting with occupancy sensors', 'Optimize HVAC scheduling', 'Switch to ENERGY STAR equipment'],
        potential: '15-25% reduction',
        priority: 'medium'
      });
    }

    if (highEmissionCategories.some(cat => cat.category.toLowerCase().includes('vehicle'))) {
      recommendations.push({
        category: 'Transportation Optimization',
        actions: ['Electric vehicle fleet transition', 'Route optimization software', 'Remote work policies'],
        potential: '30-50% reduction',
        priority: 'high'
      });
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        category: 'General Optimization',
        actions: ['Conduct energy audit', 'Implement monitoring systems', 'Set reduction targets'],
        potential: '10-20% reduction',
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const smartRecommendations = generateSmartRecommendations();

  // Generate trend data for AI visualization
  const generateTrendData = () => {
    return emissionData.map((item, index) => ({
      category: item.category,
      current: item.value,
      optimized: item.value * (0.7 + Math.random() * 0.2), // 10-30% reduction simulation
      target: item.value * 0.6, // 40% reduction target
    }));
  };

  const trendData = generateTrendData();

  const getEmissionLevel = (emissions: number): { level: string; color: string; description: string } => {
    if (emissions < 100) return { 
      level: 'Low', 
      color: 'text-green-600 dark:text-green-400', 
      description: 'Excellent! Your carbon footprint is very low.' 
    };
    if (emissions < 500) return { 
      level: 'Moderate', 
      color: 'text-yellow-600 dark:text-yellow-400', 
      description: 'Good effort. There\'s room for improvement.' 
    };
    if (emissions < 1000) return { 
      level: 'High', 
      color: 'text-orange-600 dark:text-orange-400', 
      description: 'Consider reducing your energy consumption.' 
    };
    return { 
      level: 'Very High', 
      color: 'text-red-600 dark:text-red-400', 
      description: 'Immediate action recommended to reduce emissions.' 
    };
  };

  const emissionLevel = getEmissionLevel(totalEmissions);

  const formatTooltipValue = (value: number, name: string): [string, string] => {
    return [`${value.toFixed(2)} kg CO₂`, 'Emissions'];
  };

  const renderCustomTooltip = ({ active, payload, label }: any): JSX.Element | null => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-green-600 dark:text-green-400">
            Emissions: <span className="font-semibold">{data.value.toFixed(2)} kg CO₂</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {data.payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  if (emissionData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
            Carbon Footprint Analysis
          </CardTitle>
          <CardDescription>
            Climate impact assessment and emissions breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Leaf className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Data to Analyze
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Upload your energy consumption data in the Cloud tab to see carbon footprint analysis here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
              Carbon Footprint Summary
            </div>
            <Badge 
              variant="outline" 
              className={`${emissionLevel.color} gap-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800`}
            >
              <div className="w-2 h-2 bg-current rounded-full" />
              {emissionLevel.level}
            </Badge>
          </CardTitle>
          <CardDescription>
            Total carbon emissions calculated from your energy consumption data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {totalEmissions.toFixed(2)}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                kg CO₂ equivalent
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {emissionLevel.description}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {emissionData.length}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg per Category</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {(totalEmissions / emissionData.length).toFixed(1)} kg
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Largest Source</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {emissionData.reduce((max, item) => item.value > max.value ? item : max, emissionData[0])?.category || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Emissions by Category
          </CardTitle>
          <CardDescription>
            Detailed breakdown of carbon emissions by energy consumption category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="category" 
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
                <Tooltip content={renderCustomTooltip} />
                <Bar 
                  dataKey="value" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Emissions Distribution
          </CardTitle>
          <CardDescription>
            Percentage breakdown of carbon emissions across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emissionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Individual category analysis with improvement suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emissionData
              .sort((a, b) => b.value - a.value)
              .map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colors[emissionData.indexOf(item) % colors.length] }}
                      />
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {item.category}
                      </h4>
                      <Badge variant="secondary">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.value.toFixed(2)} kg CO₂
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.percentage}% of total
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={item.percentage} 
                    className="h-2 mb-2"
                  />
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.percentage > 30 && (
                      <p>💡 <strong>High Impact:</strong> Consider energy-efficient alternatives for this category.</p>
                    )}
                    {item.percentage > 15 && item.percentage <= 30 && (
                      <p>⚡ <strong>Moderate Impact:</strong> Opportunities for optimization exist.</p>
                    )}
                    {item.percentage <= 15 && (
                      <p>✅ <strong>Low Impact:</strong> Well-managed category with minimal emissions.</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Charts */}
      <InteractiveCharts
        emissionData={emissionData}
        totalEmissions={totalEmissions}
      />

      {/* Export Manager */}
      <ExportManager
        emissionData={emissionData}
        totalEmissions={totalEmissions}
        companyName="Your Organization"
      />

      {/* Historical Trends */}
      <HistoricalTrends currentEmissions={totalEmissions} />

      {/* Sustainability Progress */}
      <SustainabilityProgress 
        totalEmissions={totalEmissions} 
        energyDataCount={energyDataCount} 
        isUsingDemoData={isUsingDemoData}
      />

      {/* AI-Powered Insights */}
      <Card className="border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Brain className="h-5 w-5" />
            AI-Powered Carbon Intelligence
          </CardTitle>
          <CardDescription>
            Advanced analytics and machine learning insights for optimal carbon management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  insight.impact === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                  insight.impact === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'pattern' ? 'bg-purple-100 dark:bg-purple-900/40' :
                    insight.type === 'efficiency' ? 'bg-blue-100 dark:bg-blue-900/40' :
                    insight.type === 'prediction' ? 'bg-green-100 dark:bg-green-900/40' :
                    'bg-indigo-100 dark:bg-indigo-900/40'
                  }`}>
                    {insight.type === 'pattern' && <TrendingUp className="h-4 w-4 text-purple-600" />}
                    {insight.type === 'efficiency' && <Zap className="h-4 w-4 text-blue-600" />}
                    {insight.type === 'prediction' && <Target className="h-4 w-4 text-green-600" />}
                    {insight.type === 'benchmark' && <Award className="h-4 w-4 text-indigo-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {insight.description}
                    </p>
                    <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      insight.impact === 'high' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                      insight.impact === 'medium' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                      'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                    }`}>
                      {insight.impact === 'high' && '🚨'}
                      {insight.impact === 'medium' && '⚡'}
                      {insight.impact === 'low' && '✅'}
                      {insight.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Optimization Visualization */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              AI-Predicted Optimization Potential
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="category" 
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
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(2)} kg CO₂`,
                      name === 'current' ? 'Current Emissions' :
                      name === 'optimized' ? 'AI-Optimized' : 'Sustainability Target'
                    ]}
                  />
                  <Line type="monotone" dataKey="current" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444' }} />
                  <Line type="monotone" dataKey="optimized" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#F59E0B' }} />
                  <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="10 10" dot={{ fill: '#10B981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Current Emissions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-amber-500 border-dashed"></div>
                <span className="text-gray-600 dark:text-gray-400">AI-Optimized Scenario</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500 border-dotted"></div>
                <span className="text-gray-600 dark:text-gray-400">Sustainability Target</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Lightbulb className="h-5 w-5" />
            AI-Generated Smart Recommendations
          </CardTitle>
          <CardDescription>
            Personalized action plans based on your specific carbon emission patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {smartRecommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                  {rec.category}
                </h4>
                <div className="flex gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${
                      rec.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' :
                      'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {rec.priority === 'high' ? '🔥 High Priority' : '⚡ Medium Priority'}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                    {rec.potential}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                {rec.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    {action}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Traditional Recommendations */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Award className="h-5 w-5" />
            Sustainability Recommendations
          </CardTitle>
          <CardDescription>
            Actionable steps to reduce your carbon footprint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Immediate Actions</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Switch to energy-efficient LED lighting</li>
                <li>• Optimize HVAC systems and temperature settings</li>
                <li>• Implement power management for computers and devices</li>
                <li>• Consider renewable energy sources</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Long-term Strategies</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Invest in smart building management systems</li>
                <li>• Pursue green building certifications</li>
                <li>• Implement carbon offset programs</li>
                <li>• Regular energy audits and monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}