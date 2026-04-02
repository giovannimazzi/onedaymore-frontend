import axios from "axios";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useLoaderContext } from "../contexts/LoaderContext";

const OneDayMoreProductsEndpoint = "http://localhost:3000/products";

export default function ProductsPage() {
  const { startLoading, endLoading } = useLoaderContext();
  const [products, setProducts] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    startLoading();
    setHasError(false);

    axios
      .get(OneDayMoreProductsEndpoint)
      .then((res) => {
        setProducts(res.data.result);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        endLoading();
      });
  }, []);

  return (
    <>
      <div className="container my-4">
        <h1>I nostri prodotti</h1>

        <div className="row row-cols-6 my-4">
          {hasError && (
            <p className="text-center fs-5">
              Non siamo riusciti a caricare i prodotti.
            </p>
          )}
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
