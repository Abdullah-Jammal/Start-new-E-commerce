import Products from "@/components/products/products";
import { db } from "@/server";
import { productVariant } from "@/server/schema";

export default async function Home() {
  const data = await db.query.productVariant.findMany({
    with: {
      variantImages : true,
      variantTags: true,
      product : true
    },
    orderBy: (productVariant, {desc}) => [desc(productVariant.id)]
  })
  return (
    <main>
      <Products variants={data}/>
    </main>
  );
}
