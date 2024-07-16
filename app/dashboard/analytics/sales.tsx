"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TotalOrders } from "@/lib/infer-type"
import Image from "next/image"

export default function Salse({totalOrder} : {totalOrder : TotalOrders[]}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Sales</CardTitle>
        <CardDescription>History of your recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customers</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrder.map(({order, product, quantity}) => (
              <TableRow key={order.id}>
                <TableCell>
                  {order.user.image && order.user.name ? 
                  <div>
                    <Image src={order.user.image} alt={order.user.name} width={25} height={25}/>
                    <p>{order.user.name}</p>
                  </div>
                    : null }
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
