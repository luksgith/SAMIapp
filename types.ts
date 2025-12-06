
export interface Outing {
  id: string;
  day: string;
  time: string;
  group?: string;
  meetingPlace: string;
  address: string;
  territories: string;
  conductor: string;
  mapsLink: string;
  notes?: string;
}

export type SuggestionCategory = 'scripture' | 'presentation' | 'practical' | 'safety';

export interface Suggestion {
  id: string;
  category: SuggestionCategory;
  text: string;
  reference?: string; // e.g., "Filipenses 4:13" or "jw.org"
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'settings' | 'announcement';
  description: string;
}

export interface AppTheme {
  primaryColor: string;
  headerTextColor: string;
  headerImageUrl: string;
}

export interface Announcement {
  message: string;
  isActive: boolean;
  duration: number; // seconds
}
