import { SigninPage } from '@/features/signin/components/SigninPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
  component: SigninPage,
})

