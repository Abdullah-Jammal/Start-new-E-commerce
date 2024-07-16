import { Card, CardContent, CardDescription, CardTitle ,CardHeader } from "@/components/ui/card"
import { db } from "@/server"
import { orderProduct } from "@/server/schema"
import { desc } from "drizzle-orm"
import Salse from "./sales"


export default async function Analytics() {
  const totalOrder = await db.query.orderProduct.findMany({
    orderBy : [desc(orderProduct.id)],
    limit : 10,
    with: {
      order: {with : {user : true}},
      product: true,
      productVariants: {with : {variantImages: true}}
    }
  })
  // if(totalOrder.length === 0)
  // return (
  //   <Card className="mt-12">
  //     <CardHeader>
  //       <CardTitle>No Orders Has Been Purchased</CardTitle>
  //     </CardHeader>
  //   </Card>
  // )
  if(totalOrder) return (
    <Card className="mt-12 p-6">
      <CardTitle>Your Analytics</CardTitle>
      <CardDescription>
        Check your sales, new customers and more
      </CardDescription>
      <CardContent className="mt-4">
        <Salse totalOrder = {totalOrder}/>
      </CardContent>
    </Card>
  )
}
