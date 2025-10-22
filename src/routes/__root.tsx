import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { ModeToggle } from '@/features/init/components/ModeToggle'

export const Route = createRootRoute({
  component: RootComponent,
})

console.log('Loaded __root route')

function RootComponent() {
  return (
    <React.Fragment>
      <div>Hello "__root"!</div>
      <ModeToggle />
      <Outlet />
    </React.Fragment>
  )
}
