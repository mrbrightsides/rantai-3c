import type { BadgeDefinition, BadgeType } from '@/types/nft';

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDefinition> = {
  FIRST_OFFSET: {
    type: 'FIRST_OFFSET',
    name: 'First Offset Champion',
    description: 'Completed your first carbon offset purchase',
    icon: '🌱',
    color: 'green',
    requirement: 'Purchase any carbon offset',
  },
  CARBON_NEUTRAL: {
    type: 'CARBON_NEUTRAL',
    name: 'Carbon Neutral Achiever',
    description: 'Achieved carbon neutrality by offsetting 100% of emissions',
    icon: '🎯',
    color: 'emerald',
    requirement: 'Offset 100% of your carbon footprint',
  },
  DATA_QUALITY_CHAMPION: {
    type: 'DATA_QUALITY_CHAMPION',
    name: 'Data Quality Champion',
    description: 'Maintained 95%+ data quality score for 6 months',
    icon: '📊',
    color: 'blue',
    requirement: 'Data quality score ≥95% for 6 months',
  },
  EARLY_ADOPTER: {
    type: 'EARLY_ADOPTER',
    name: 'Early Adopter',
    description: 'One of the first 100 users of RANTAI 3C',
    icon: '🚀',
    color: 'purple',
    requirement: 'Be among the first 100 registered users',
  },
  NET_ZERO_HERO: {
    type: 'NET_ZERO_HERO',
    name: 'Net Zero Hero',
    description: 'Maintained net-zero status for 12 consecutive months',
    icon: '🏆',
    color: 'yellow',
    requirement: 'Net-zero carbon for 12 months',
  },
  BLOCKCHAIN_CERTIFIED: {
    type: 'BLOCKCHAIN_CERTIFIED',
    name: 'Blockchain Certified',
    description: 'Successfully certified carbon data on blockchain',
    icon: '⛓️',
    color: 'indigo',
    requirement: 'Complete blockchain certification',
  },
  '100_TONNES_REDUCED': {
    type: '100_TONNES_REDUCED',
    name: '100 Tonnes Warrior',
    description: 'Reduced or offset 100+ tonnes of CO₂ emissions',
    icon: '💪',
    color: 'red',
    requirement: 'Total offset/reduction ≥100 tonnes CO₂',
  },
  CONSISTENCY_MASTER: {
    type: 'CONSISTENCY_MASTER',
    name: 'Consistency Master',
    description: 'Tracked carbon footprint for 24 consecutive months',
    icon: '📅',
    color: 'teal',
    requirement: 'Track emissions for 24 months',
  },
};

/**
 * Check if user qualifies for a badge based on their activity
 */
export function checkBadgeEligibility(
  badgeType: BadgeType,
  userStats: {
    totalOffsets: number;
    netZeroMonths: number;
    dataQualityStreak: number;
    isEarlyAdopter: boolean;
    hasBlockchainCert: boolean;
    trackingMonths: number;
    totalReduction: number;
  }
): boolean {
  switch (badgeType) {
    case 'FIRST_OFFSET':
      return userStats.totalOffsets >= 1;
    
    case 'CARBON_NEUTRAL':
      return userStats.netZeroMonths >= 1;
    
    case 'DATA_QUALITY_CHAMPION':
      return userStats.dataQualityStreak >= 6;
    
    case 'EARLY_ADOPTER':
      return userStats.isEarlyAdopter;
    
    case 'NET_ZERO_HERO':
      return userStats.netZeroMonths >= 12;
    
    case 'BLOCKCHAIN_CERTIFIED':
      return userStats.hasBlockchainCert;
    
    case '100_TONNES_REDUCED':
      return userStats.totalReduction >= 100000; // 100 tonnes = 100,000 kg
    
    case 'CONSISTENCY_MASTER':
      return userStats.trackingMonths >= 24;
    
    default:
      return false;
  }
}

/**
 * Get color class for badge
 */
export function getBadgeColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300',
    blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300',
    purple: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300',
    red: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300',
    teal: 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300',
  };
  
  return colorMap[color] || colorMap['blue'];
}
