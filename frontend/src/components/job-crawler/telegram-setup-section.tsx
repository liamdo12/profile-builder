import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTelegramConfig, saveTelegramConfig, verifyTelegram, deleteTelegramConfig } from '@/api/job-crawler-api'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Trash2, Send } from 'lucide-react'
import type { TelegramConfig } from '@/types/job-crawler'

export function TelegramSetupSection() {
  const [config, setConfig] = useState<TelegramConfig | null>(null)
  const [chatId, setChatId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  async function loadConfig() {
    try {
      const data = await getTelegramConfig()
      setConfig(data)
      if (data) setChatId(data.chatId)
    } catch {
      // No config yet
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!chatId.trim()) {
      toast.error('Chat ID is required')
      return
    }
    setSaving(true)
    try {
      const saved = await saveTelegramConfig({ chatId: chatId.trim() })
      setConfig(saved)
      toast.success('Telegram config saved')
    } catch {
      toast.error('Failed to save config')
    } finally {
      setSaving(false)
    }
  }

  async function handleVerify() {
    setVerifying(true)
    try {
      const result = await verifyTelegram()
      setConfig(result)
      if (result.verified) {
        toast.success('Telegram verified! Check your chat for a test message.')
      } else {
        toast.error('Verification failed. Check your Chat ID.')
      }
    } catch {
      toast.error('Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  async function handleDelete() {
    try {
      await deleteTelegramConfig()
      setConfig(null)
      setChatId('')
      toast.success('Telegram config removed')
    } catch {
      toast.error('Failed to remove config')
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Telegram Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Instructions */}
        <div className="rounded-md bg-muted p-3 text-sm space-y-1">
          <p className="font-medium">Setup Instructions:</p>
          <ol className="list-decimal pl-4 space-y-0.5 text-muted-foreground">
            <li>Search for the Profile Builder bot on Telegram</li>
            <li>Send <code className="bg-background px-1 rounded">/start</code> to the bot</li>
            <li>Send <code className="bg-background px-1 rounded">/myid</code> to get your Chat ID</li>
            <li>Enter your Chat ID below and verify</li>
          </ol>
        </div>

        {/* Status */}
        {config && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            {config.verified ? (
              <Badge className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" /> Verified</Badge>
            ) : (
              <Badge variant="secondary" className="gap-1"><XCircle className="h-3 w-3" /> Not Verified</Badge>
            )}
          </div>
        )}

        {/* Chat ID input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter your Telegram Chat ID"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? 'Saving...' : 'Save'}
          </Button>
          {config && !config.verified && (
            <Button onClick={handleVerify} disabled={verifying} size="sm" variant="outline">
              <Send className="mr-1 h-3 w-3" />
              {verifying ? 'Verifying...' : 'Verify'}
            </Button>
          )}
          {config && (
            <Button onClick={handleDelete} size="sm" variant="ghost" title="Remove config">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
