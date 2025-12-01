import { useState } from 'react'
import { Circle, Upload, Sparkles } from 'lucide-react'
import { useDJ } from '../store'
import { uploadAudio } from '../../lib/supabase/storage'
import { createPost } from '../../lib/supabase/posts'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

export function StudioFooter() {
  const nav = useNavigate()
  const { recording, lastRecording, recordStart, recordStop, decks } = useDJ()

  const [showPublishModal, setShowPublishModal] = useState(false)
  const [caption, setCaption] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)

  const handleRecordToggle = async () => {
    if (recording === 'idle') {
      // Start recording
      const anyPlaying = decks.A.playing || decks.B.playing
      if (!anyPlaying) {
        toast.error('Start playing a deck first!')
        return
      }

      await recordStart()
      toast.success('Recording started!')
    } else if (recording === 'recording') {
      // Stop recording
      await recordStop()
      toast.success('Recording stopped! Click "Publish" to share your mix.')
    }
  }

  const handlePublish = async () => {
    if (!lastRecording) return

    setIsPublishing(true)
    try {
      toast.info('Uploading mix...')
      const audioUrl = await uploadAudio(lastRecording)

      // Detect BPM from loaded tracks
      const loadedDecks = [decks.A, decks.B].filter(d => d.loaded)
      const avgBPM = loadedDecks.length > 0
        ? Math.round(loadedDecks.reduce((acc, d) => acc + d.bpm, 0) / loadedDecks.length)
        : 120

      await createPost({
        audio_url: audioUrl,
        bpm: avgBPM,
        style: 'Live Mix',
        caption: caption || 'Live DJ mix from the studio'
      })

      toast.success('Mix published!')
      setShowPublishModal(false)
      setCaption('')

      // Navigate to stream to see the post
      setTimeout(() => nav('/stream'), 1000)
    } catch (error) {
      console.error('Publishing error:', error)
      toast.error('Failed to publish. Please sign in first.')
    }
    setIsPublishing(false)
  }

  const handleQuickGenerate = () => {
    // Navigate to Create page for AI generation
    nav('/create')
    toast.info('Opening AI Mix Generator...')
  }

  return (
    <>
      {/* Footer Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-ink/95 backdrop-blur-lg border-t border-line p-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Recording Status */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRecordToggle}
              variant={recording === 'recording' ? 'destructive' : recording === 'stopped' ? 'default' : 'outline'}
              className={`gap-2 ${
                recording === 'recording'
                  ? 'animate-pulse'
                  : recording === 'stopped'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : ''
              }`}
            >
              <Circle
                className={`w-4 h-4 ${
                  recording === 'recording' ? 'fill-white' : ''
                }`}
              />
              {recording === 'recording' ? 'STOP REC' : recording === 'stopped' ? 'RECORDED' : 'RECORD'}
            </Button>

            {recording === 'stopped' && lastRecording && (
              <Button
                onClick={() => setShowPublishModal(true)}
                className="gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-black font-bold hover:scale-105 transition-transform"
              >
                <Upload className="w-4 h-4" />
                Publish Mix
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleQuickGenerate}
              variant="outline"
              className="gap-2 hover:border-pink-500 hover:bg-pink-500/10"
            >
              <Sparkles className="w-4 h-4 text-pink-500" />
              AI Generate Mix
            </Button>

            <Badge variant="secondary" className="text-xs">
              {decks.A.loaded && decks.B.loaded
                ? 'Both decks loaded'
                : decks.A.loaded || decks.B.loaded
                ? 'One deck loaded'
                : 'Load tracks to start'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Publish Dialog */}
      <Dialog open={showPublishModal && !!lastRecording} onOpenChange={setShowPublishModal}>
        <DialogContent className="bg-gradient-to-br from-surface via-ink to-surface border-line text-text sm:max-w-lg">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 flex items-center justify-center">
              <Upload className="w-8 h-8 text-black" />
            </div>
            <DialogTitle className="text-2xl">Publish Your Mix</DialogTitle>
            <DialogDescription>
              Share your live DJ performance with the community
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Live mix from the studio..."
                className="bg-surface border-line"
                disabled={isPublishing}
              />
            </div>

            <Card className="bg-surface border-line">
              <CardContent className="p-3 text-sm text-muted">
                <div className="font-semibold text-text mb-2">Mix Info</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>BPM:</span>
                    <Badge variant="secondary">{Math.round((decks.A.bpm + decks.B.bpm) / 2)} avg</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <Badge variant="secondary">Live Recording</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="default" className="bg-emerald-500">Ready to publish</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowPublishModal(false)}
              disabled={isPublishing}
              className="border-line hover:bg-surface"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-gradient-to-r from-pink-500 to-cyan-400 text-black font-bold hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
