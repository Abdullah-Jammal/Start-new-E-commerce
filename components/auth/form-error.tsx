import { AlertCircle } from "lucide-react"

export const FormError = ({message} : {message : string}) => {
  if(!message) return null
  return (
    <div className="bg-destructive-500/25 text-sm flex font-medium items-center gap-2 text-secondary-foreground p-3">
      <AlertCircle className="w-4 h-4"/>
      <p>{message}</p>
    </div>
  )
}
