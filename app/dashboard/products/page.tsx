import { db } from "@/server"
import placeholderImage from '@/public/360_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg'
import { DataTable } from "./data-table" 
import { columns } from "./columns"

export default async function Products() {
  const products = await db.query.products.findMany({
    orderBy: (products, {desc}) => [desc(products.id)]
  })
  if(!products) throw new Error('Products not found')

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholderImage.src,
    }
  })
  if(!dataTable) throw new Error
  return (
    <div>
      <DataTable columns={columns} data={dataTable}/>
    </div>
  )
}
