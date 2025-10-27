import { SigninPage } from '@/features/singin/components/SigninPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
  component: SigninPage,
})

