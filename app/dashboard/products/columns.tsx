"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { deleteProduct } from "@/server/actions/delete-product"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"


type ProductColumn = {
  title: string,
  id: number,
  image: string,
  variants: any,
  price: number
}

async function deleteProdutcWrapper(id: number) {
  const res = await deleteProduct({id})
  if(!res?.data) return new Error('product not found')
  if(res.data) {
    toast.success(res.data.success)
  }
  if(res.data.error) {
    toast.error('Faild to delete product')
  }
}

const ActionCell = ({row} : {row: Row<ProductColumn>}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {execute, status} = useAction(deleteProduct, {
    onSuccess: (data) => {
      if(data.data?.error) {
        toast.error('Faild to delete product')
      }
      if(data.data?.success) {
        toast.success(data.data?.success)
      }
    }
  })
  const product = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} ><MoreHorizontal className="h-4 w-4"/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => execute({id: product.id})}  className="dark:focus:bg-destructive cursor-pointer focus:bg-destructive/50">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey : 'id',
    header : 'ID'
  },
  {
    accessorKey : 'title',
    header : 'Title'
  },
  {
    accessorKey : 'variants',
    header : 'Variants'
  },
  {
    accessorKey : 'price',
    header : 'Price',
    cell: ({row}) => {
      const price = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('en-US', {
        currency : 'USD',
        style: 'currency',
      }).format(price)
      return <div className="font-medium text-xs">
        {formatted}
      </div>
    }
  },
  {
    accessorKey : 'image',
    header : 'Image',
    cell : ({row}) => {
      const cellImage = row.getValue('image') as string
      const cellTitle = row.getValue('title') as string
      return (
        <div>
          <Image className="rounded-md" src={cellImage} alt={cellTitle} width={50} height={50}/>
        </div> 
      )
    }
  },
  {
    accessorKey : 'actions',
    header : 'Actions',
    cell: ActionCell,
  },
]

