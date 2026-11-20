export type TabId = 
  | 'dashboard' 
  | 'games' 
  | 'world-map' 
  | 'training' 
  | 'daily-challenge' 
  | 'stats' 
  | 'profile';

export interface NavigationItem {
  id: TabId;
  label: string;
  shortLabel?: string;
  icon: string;
  badge?: string;
  description: string;
}
