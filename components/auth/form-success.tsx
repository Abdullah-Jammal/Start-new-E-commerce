import { CheckCircle2 } from "lucide-react"

export const FormError = ({message} : {message : string}) => {
  if(!message) return null
  return (
    <div className="bg-teal-500 text-secondary-foreground p-3">
      <CheckCircle2 className="w-4 h-4"/>
      <p>{message}</p>
    </div>
  )
}
