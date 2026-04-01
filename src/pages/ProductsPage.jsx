import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";

const OneDayMoreProductsEndpoint = "http://localhost:3000/products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    axios.get(OneDayMoreProductsEndpoint).then((res) => {
      setProducts(res.data.result);
    });
  };

  useEffect(fetchProducts, []);

  return (
    <>
      <div className="container my-4">
        <h1>I nostri prodotti</h1>

        <div className="row row-cols-6 my-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productName={product.name}
              productImage={product.image_url}
              productCategorySlug={product.category_slug}
              productPrice={product.price}
              productShortDescr={product.short_description}
              productLink={
                product.slug ? `/products/${product.slug}` : "/products"
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
