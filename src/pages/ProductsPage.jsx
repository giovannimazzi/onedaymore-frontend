import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const OneDayMoreProducts = "ENDPOINT"; // DA SOSTITUIRE

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    axios.get(OneDayMoreProducts).then((res) => {
      console.log(res.data);
      setProducts(res.data);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="row row-cols-4 my-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
