import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import CreateProduct from "./products-form"

export default async function AddProduct() {
  const session = await auth()
  if(session?.user.role !== 'admin') return redirect('/dashboard/settings')
  return (
    <CreateProduct/>
  )
}
