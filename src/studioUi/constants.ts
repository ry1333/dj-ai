import { Track } from './types';

export const MOCK_TRACKS: Track[] = [
  { id: '1', title: 'Deep House Groove', artist: 'House Master', bpm: 124.0, key: 'Am', length: '00:15', genre: 'Deep House', audioUrl: '/loops/deep_house_124.wav' },
  { id: '2', title: 'Tech Groove', artist: 'Tech King', bpm: 128.0, key: 'Cm', length: '00:15', genre: 'Techno', audioUrl: '/loops/tech_groove_128.wav' },
  { id: '3', title: 'EDM Drop', artist: 'Festival Vibes', bpm: 128.0, key: 'G', length: '00:15', genre: 'EDM', audioUrl: '/loops/edm_drop_128.wav' },
  { id: '4', title: 'Lo-Fi Chill', artist: 'Chill Beats', bpm: 80.0, key: 'Dm', length: '00:15', genre: 'Lo-Fi', audioUrl: '/loops/lofi_chill_80.wav' },
  { id: '5', title: 'Hip-Hop Beat', artist: 'Beats By Mo', bpm: 90.0, key: 'Em', length: '00:15', genre: 'Hip-Hop', audioUrl: '/loops/hiphop_beat_90.wav' },
  { id: '6', title: 'Groovy Vibes', artist: 'Bensound', bpm: 110.0, key: 'F', length: '02:00', genre: 'Funk', audioUrl: '/loops/bensound_groovy.mp3' },
];

export const GENRES = ['Deep House', 'Techno', 'Lo-Fi', 'Hip-Hop', 'EDM', 'Jazz'];
