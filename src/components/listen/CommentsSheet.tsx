import { useState } from 'react'
import { Send, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export interface Comment {
  id: string
  user: string
  avatar?: string
  text: string
  timestamp: string
  likes?: number
}

interface CommentsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comments: Comment[]
  onAddComment?: (text: string) => void
}

// Mock comments data
const MOCK_COMMENTS: Comment[] = [
  { id: '1', user: '@beatmaker', text: 'This drop is insane! 🔥', timestamp: '2m ago', likes: 24 },
  { id: '2', user: '@djsara', text: 'The transition at 0:15 is so smooth', timestamp: '5m ago', likes: 18 },
  { id: '3', user: '@vibecheck', text: 'Added to my playlist instantly', timestamp: '12m ago', likes: 7 },
  { id: '4', user: '@nightowl', text: 'Perfect for late night sessions', timestamp: '1h ago', likes: 45 },
  { id: '5', user: '@basshead', text: 'That bassline though 👀', timestamp: '2h ago', likes: 32 },
  { id: '6', user: '@producer101', text: 'What synth did you use for the lead?', timestamp: '3h ago', likes: 5 },
  { id: '7', user: '@clubqueen', text: 'Playing this at my set tonight!', timestamp: '5h ago', likes: 89 },
  { id: '8', user: '@newbie', text: 'Just started making beats, this is inspiring', timestamp: '8h ago', likes: 12 },
]

export function CommentsSheet({ open, onOpenChange, comments = MOCK_COMMENTS, onAddComment }: CommentsSheetProps) {
  const [newComment, setNewComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment?.(newComment.trim())
      setNewComment('')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-zinc-950 border-l border-zinc-800 p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-4 py-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-white">
              Comments ({comments.length})
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {/* Comments List */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                    {comment.user.charAt(1)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{comment.user}</span>
                    <span className="text-xs text-zinc-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-0.5 break-words">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                      Reply
                    </button>
                    {comment.likes && comment.likes > 0 && (
                      <span className="text-xs text-zinc-500">{comment.likes} likes</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator className="bg-zinc-800" />

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-pink-500 text-black text-xs font-bold">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-500"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 text-black" />
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
