import ProductType from "@/components/products/product-type"
import { db } from "@/server"
import { productVariant } from "@/server/schema"
import { eq } from "drizzle-orm"
import { Separator } from "@/components/ui/separator"
import formatPrice from "@/lib/format-price"
import ProductPick from "@/components/products/product-pick"
import ProductShowCase from "@/components/products/product-show-case"
import Reviews from "@/components/reviews/reviews"


export async function generateStaticParams() {
  const data = await db.query.productVariant.findMany({
    with : {
      variantImages : true,
      variantTags : true,
      product : true,
    },
    orderBy: (productVariant, {desc}) => [desc(productVariant.id)]
  })
  if(data) {
    const slugID = data.map((variant) => ({slug: variant.id.toString()}))
    return slugID
  }
  return []
}


export default async function page({params} : { params : {slug: string}}) {
  const variant = await db.query.productVariant.findFirst({
    where : eq(productVariant.id, Number(params.slug)),
    with : {product : {
      with : {
        productVariants : {
          with : {variantImages : true, variantTags: true}
        }
      }
    }}
  })
  if(variant) {
    return (
      <main className="container mx-auto">
        <section className="flex flex-col lg:flex-row gap-4 lg:gap-12 mt-12">
          <div>
            <ProductShowCase variants={variant.product.productVariants}/>
          </div>
          <div className="flex flex-col">
            <h2 className="font-medium text-2xl">{variant?.product.title}</h2>
            <div>
              <ProductType variants={variant.product.productVariants}/>
            </div>
            <Separator className="my-2"/>
            <p className="font-medium py-2">{formatPrice(variant.product.price)}</p>
            <div dangerouslySetInnerHTML={{__html: variant.product.description}}></div>
            <p className="text-secondary-foreground font-medium my-2">Available colors</p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((prodVariant, ind) => (
                <ProductPick key={prodVariant.id} productID={variant.productID} productType={prodVariant.productType}
                id={prodVariant.id} color={prodVariant.color} price={variant.product.price}
                title={variant.product.title} image={prodVariant.variantImages[0].url}
                />
              ))}
            </div>
          </div>
        </section>
        <Reviews productID={variant.productID}/>
      </main>
    )
  }
}

