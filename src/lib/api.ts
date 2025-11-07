// Re-export from Supabase implementation
export type { FeedItem } from './supabase/posts';
export { fetchFeedPage } from './supabase/posts';

// Keep mock implementation as fallback for development without database
export async function fetchMockFeedPage(page = 0, pageSize = 5): Promise<{ items: import('./supabase/posts').FeedItem[]; hasMore: boolean }> {
  let counter = page * pageSize;
  const captions = ['Minimal drop','Tech-house groove','EDM pop hook','Deep house vibe','Bassline roller','Crunchy clap','Shimmer lead'];

  const items = Array.from({ length: pageSize }, () => {
    counter += 1;
    const id = String(counter);
    return {
      id,
      src: '/loops/demo_loop.mp3',
      user: `@demo${id}`,
      caption: captions[counter % captions.length] || 'New drop',
      loves: Math.floor(Math.random() * 100),
      has_loved: false
    };
  });
  return { items, hasMore: counter < 1000 };
}
