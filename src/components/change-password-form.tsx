'use client'

import { useActionState, useEffect, useRef } from 'react'
import { updatePassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const initialState = {
  error: '',
  success: '',
}

export function ChangePasswordForm() {
  const [state, action, isPending] = useActionState(updatePassword, initialState)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success',
        description: state.success,
      })
      formRef.current?.reset()
    }
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      })
    }
  }, [state, toast])

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Password
      </Button>
    </form>
  )
}
