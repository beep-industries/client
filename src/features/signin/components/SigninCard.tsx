import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { SigninForm } from "./SigninForm.tsx"

export function SigninCard() {
  return (
    <Card className="from-secondary via-secondary to-primary/40 overflow-hidden bg-radial-[at_100%_100%]">
      <CardHeader className="flex items-start">
        <CardTitle className="text-2xl font-medium">Beep</CardTitle>
      </CardHeader>
      <CardContent>
        <SigninForm />
      </CardContent>
    </Card>
  )
}
