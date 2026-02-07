// Historical data management utilities for tracking carbon footprint over time

export interface HistoricalRecord {
  id: string;
  timestamp: number;
  date: string;
  totalEmissions: number;
  recordCount: number;
  categories: Array<{
    category: string;
    value: number;
    percentage: number;
  }>;
  emissionLevel: string;
  isDemoData: boolean;
}

export interface HistoryStats {
  totalRecords: number;
  firstRecord: HistoricalRecord | null;
  latestRecord: HistoricalRecord | null;
  averageEmissions: number;
  trend: 'improving' | 'stable' | 'worsening';
  percentageChange: number;
}

const HISTORY_STORAGE_KEY = 'rantai_carbon_history';
const MAX_HISTORY_RECORDS = 50; // Keep last 50 records

export class HistoryManager {
  static saveRecord(record: Omit<HistoricalRecord, 'id' | 'timestamp' | 'date'>): void {
    try {
      const history = this.getAllRecords();
      
      const newRecord: HistoricalRecord = {
        ...record,
        id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
      };

      history.unshift(newRecord);
      
      // Keep only the most recent records
      const trimmedHistory = history.slice(0, MAX_HISTORY_RECORDS);
      
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Failed to save history record:', error);
    }
  }

  static getAllRecords(): HistoricalRecord[] {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve history:', error);
      return [];
    }
  }

  static getStats(): HistoryStats {
    const records = this.getAllRecords();
    
    if (records.length === 0) {
      return {
        totalRecords: 0,
        firstRecord: null,
        latestRecord: null,
        averageEmissions: 0,
        trend: 'stable',
        percentageChange: 0,
      };
    }

    const totalEmissions = records.reduce((sum, r) => sum + r.totalEmissions, 0);
    const averageEmissions = totalEmissions / records.length;
    
    const latestRecord = records[0];
    const firstRecord = records[records.length - 1];
    
    // Calculate trend
    let trend: 'improving' | 'stable' | 'worsening' = 'stable';
    let percentageChange = 0;
    
    if (records.length >= 2) {
      const recentAvg = records.slice(0, Math.min(3, records.length))
        .reduce((sum, r) => sum + r.totalEmissions, 0) / Math.min(3, records.length);
      
      const olderAvg = records.slice(-Math.min(3, records.length))
        .reduce((sum, r) => sum + r.totalEmissions, 0) / Math.min(3, records.length);
      
      percentageChange = ((recentAvg - olderAvg) / olderAvg) * 100;
      
      if (percentageChange < -5) {
        trend = 'improving';
      } else if (percentageChange > 5) {
        trend = 'worsening';
      }
    }

    return {
      totalRecords: records.length,
      firstRecord,
      latestRecord,
      averageEmissions,
      trend,
      percentageChange,
    };
  }

  static getRecentRecords(count: number = 10): HistoricalRecord[] {
    const records = this.getAllRecords();
    return records.slice(0, count);
  }

  static deleteRecord(id: string): void {
    try {
      const history = this.getAllRecords();
      const filtered = history.filter(r => r.id !== id);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete history record:', error);
    }
  }

  static clearAllHistory(): void {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  static getTrendData(): Array<{ date: string; emissions: number }> {
    const records = this.getAllRecords();
    return records
      .slice()
      .reverse()
      .map(r => ({
        date: r.date,
        emissions: r.totalEmissions,
      }));
  }
}
