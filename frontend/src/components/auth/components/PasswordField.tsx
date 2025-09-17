import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export const PasswordField = ({ field, invalid }: { field: any; invalid?: boolean }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex gap-1">
      <Input
        type={showPassword ? "text" : "password"}
        {...field}
        placeholder="••••••"
        className={invalid ? "border-destructive ring-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive" : ""}
      />
      <Button type="button" className="cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}
