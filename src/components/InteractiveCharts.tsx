'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, Filter, SortAsc } from 'lucide-react';

interface EmissionData {
  id: string;
  category: string;
  value: number;
  percentage: number;
}

interface InteractiveChartsProps {
  emissionData: EmissionData[];
  totalEmissions: number;
}

type ChartType = 'bar' | 'pie' | 'line';
type SortOrder = 'highest' | 'lowest' | 'alphabetical';

export function InteractiveCharts({ emissionData, totalEmissions }: InteractiveChartsProps): JSX.Element {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [sortOrder, setSortOrder] = useState<SortOrder>('highest');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const colors = [
    '#10B981', '#3B82F6', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  ];

  // Sort data based on selection
  const sortedData = React.useMemo(() => {
    const data = [...emissionData];
    if (sortOrder === 'highest') {
      return data.sort((a, b) => b.value - a.value);
    } else if (sortOrder === 'lowest') {
      return data.sort((a, b) => a.value - b.value);
    } else {
      return data.sort((a, b) => a.category.localeCompare(b.category));
    }
  }, [emissionData, sortOrder]);

  // Filter data if category is selected
  const filteredData = selectedCategory
    ? sortedData.filter((item) => item.category === selectedCategory)
    : sortedData;

  // Enhanced tooltip
  const renderCustomTooltip = ({ active, payload, label }: any): JSX.Element | null => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-green-600 dark:text-green-400">
              <span className="font-semibold">Emissions:</span> {data.value.toFixed(2)} kg CO₂
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              <span className="font-semibold">Percentage:</span> {data.payload.percentage}% of total
            </p>
            <p className="text-purple-600 dark:text-purple-400">
              <span className="font-semibold">Rank:</span> #{sortedData.findIndex(item => item.category === label) + 1} of {sortedData.length}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click to view detailed analysis
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle bar/category click
  const handleCategoryClick = (data: any): void => {
    if (data && data.category) {
      setSelectedCategory(selectedCategory === data.category ? null : data.category);
    }
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <BarChart3 className="h-5 w-5" />
            Interactive Emissions Visualization
          </div>
          {selectedCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="gap-2"
            >
              Clear Filter
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Advanced chart interactions with filtering and drill-down capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chart Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Chart Type
            </label>
            <div className="flex gap-2">
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="flex-1 gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Bar
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('pie')}
                className="flex-1 gap-2"
              >
                <PieIcon className="h-4 w-4" />
                Pie
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
                className="flex-1 gap-2"
              >
                <LineIcon className="h-4 w-4" />
                Line
              </Button>
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              Sort Order
            </label>
            <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest">Highest First</SelectItem>
                <SelectItem value="lowest">Lowest First</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter Category
            </label>
            <Select
              value={selectedCategory || 'all'}
              onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {emissionData.map((item) => (
                  <SelectItem key={item.id} value={item.category}>
                    {item.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected Category Info */}
        {selectedCategory && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                  Viewing: {selectedCategory}
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {filteredData[0]?.value.toFixed(2)} kg CO₂ ({filteredData[0]?.percentage}% of total)
                </p>
              </div>
              <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700">
                Drill-down Active
              </Badge>
            </div>
          </div>
        )}

        {/* Chart Display */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' && (
              <BarChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                onClick={handleCategoryClick}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="category"
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={renderCustomTooltip} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  cursor="pointer"
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      opacity={selectedCategory ? (entry.category === selectedCategory ? 1 : 0.3) : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}

            {chartType === 'pie' && (
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handleCategoryClick}
                  cursor="pointer"
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      opacity={selectedCategory ? (entry.category === selectedCategory ? 1 : 0.3) : 1}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => (
                    <span style={{ color: entry.color }}>
                      {value} ({entry.payload.percentage}%)
                    </span>
                  )}
                />
              </PieChart>
            )}

            {chartType === 'line' && (
              <LineChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="category"
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={renderCustomTooltip} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 6 }}
                  activeDot={{ r: 8, cursor: 'pointer' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Chart Legend/Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Interactive Features</h5>
            <p className="text-blue-700 dark:text-blue-300 text-xs">
              Click on bars/slices to drill down. Hover for detailed tooltips with rankings.
            </p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h5 className="font-medium text-green-900 dark:text-green-100 mb-1">Data Insights</h5>
            <p className="text-green-700 dark:text-green-300 text-xs">
              {filteredData.length} categories displayed. Switch chart types for different perspectives.
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-1">Sorting & Filtering</h5>
            <p className="text-purple-700 dark:text-purple-300 text-xs">
              Use controls above to sort data and filter by specific categories.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
