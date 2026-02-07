'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap, Leaf, Award, TrendingDown } from 'lucide-react';

interface SustainabilityProgressProps {
  totalEmissions: number;
  energyDataCount: number;
  isUsingDemoData: boolean;
}

export function SustainabilityProgress({ totalEmissions, energyDataCount, isUsingDemoData }: SustainabilityProgressProps): JSX.Element {
  // Define sustainability goals and achievements
  const goals = {
    dataPoints: { target: 10, current: energyDataCount, label: 'Data Points Tracked' },
    lowCarbon: { target: 500, current: Math.max(0, 500 - totalEmissions), label: 'Carbon Reduction (kg CO₂)' },
    efficiency: { target: 100, current: energyDataCount * 10, label: 'Efficiency Score' }
  };

  const achievements = [
    { 
      id: 'first-upload', 
      name: 'Carbon Tracker', 
      description: 'First step towards sustainability', 
      unlocked: energyDataCount > 0,
      icon: Leaf
    },
    { 
      id: 'data-collector', 
      name: 'Data Collector', 
      description: 'Tracked 5+ energy sources', 
      unlocked: energyDataCount >= 5,
      icon: Target
    },
    { 
      id: 'efficiency-expert', 
      name: 'Efficiency Expert', 
      description: 'Maintained low carbon footprint', 
      unlocked: totalEmissions > 0 && totalEmissions < 300,
      icon: Zap
    },
    { 
      id: 'sustainability-champion', 
      name: 'Sustainability Champion', 
      description: 'Comprehensive carbon tracking', 
      unlocked: energyDataCount >= 10 && totalEmissions < 500,
      icon: Trophy
    },
  ];

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSustainabilityLevel = (): { level: string; color: string; nextGoal: string } => {
    if (totalEmissions === 0) return { 
      level: 'Getting Started', 
      color: 'text-gray-600 dark:text-gray-400', 
      nextGoal: 'Upload your first energy data' 
    };
    if (totalEmissions < 200) return { 
      level: 'Eco Champion', 
      color: 'text-green-600 dark:text-green-400', 
      nextGoal: 'Maintain excellent carbon management' 
    };
    if (totalEmissions < 500) return { 
      level: 'Carbon Conscious', 
      color: 'text-blue-600 dark:text-blue-400', 
      nextGoal: 'Reduce emissions below 200 kg CO₂' 
    };
    if (totalEmissions < 1000) return { 
      level: 'Improving', 
      color: 'text-yellow-600 dark:text-yellow-400', 
      nextGoal: 'Target below 500 kg CO₂ emissions' 
    };
    return { 
      level: 'High Impact', 
      color: 'text-red-600 dark:text-red-400', 
      nextGoal: 'Significant reduction opportunities exist' 
    };
  };

  const sustainabilityLevel = getSustainabilityLevel();
  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);

  if (totalEmissions === 0 && energyDataCount === 0) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Trophy className="h-5 w-5" />
            Sustainability Dashboard
          </CardTitle>
          <CardDescription>
            Track your progress towards carbon neutrality and unlock achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Start Your Sustainability Journey
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Upload energy data to begin tracking your carbon footprint and unlock achievements!
            </p>
            <Badge variant="outline" className="gap-2">
              <Leaf className="h-4 w-4" />
              Ready to begin
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sustainability Level */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
              Sustainability Level
            </div>
            <Badge variant="outline" className={`${sustainabilityLevel.color} gap-2`}>
              <Award className="h-4 w-4" />
              {sustainabilityLevel.level}
            </Badge>
          </CardTitle>
          <CardDescription>
            Your current environmental impact status
            {isUsingDemoData && (
              <span className="block mt-1 text-yellow-600 dark:text-yellow-400 text-sm">
                Based on demo data - Connect your real energy consumption for accurate tracking
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${sustainabilityLevel.color} mb-2`}>
                {totalEmissions.toFixed(1)} kg CO₂
              </div>
              <p className="text-gray-600 dark:text-gray-400">Total Carbon Footprint</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Next Goal:</strong> {sustainabilityLevel.nextGoal}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Progress Goals
          </CardTitle>
          <CardDescription>
            Track your sustainability milestones and targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(goals).map(([key, goal]) => {
              const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
              const progressColor = getProgressColor(percentage);
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {goal.label}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {goal.current} / {goal.target}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={percentage} 
                      className="h-3"
                    />
                    <div 
                      className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={percentage >= 100 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                      {percentage}% complete
                    </span>
                    {percentage >= 100 && (
                      <Badge variant="outline" className="gap-1 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <Trophy className="h-3 w-3 text-green-600" />
                        Goal Reached!
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </CardTitle>
          <CardDescription>
            Unlock achievements by improving your sustainability practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        achievement.unlocked 
                          ? 'text-green-900 dark:text-green-100' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm ${
                        achievement.unlocked 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <Badge variant="outline" className="mt-2 gap-1 bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700">
                          <Trophy className="h-3 w-3 text-green-600" />
                          Unlocked!
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <TrendingDown className="h-5 w-5" />
            Impact Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {energyDataCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Energy Sources</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalEmissions > 0 ? (totalEmissions / energyDataCount).toFixed(1) : '0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg per Source</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {unlockedAchievements.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(((500 - Math.min(totalEmissions, 500)) / 500) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}