import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { Link } from "react-router";

const OneDayMoreProductsEndpoint = "http://localhost:3000/products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const fetchProducts = () => {
    axios.get(OneDayMoreProductsEndpoint).then((res) => {
      setProducts(res.data);
    });
  };

  useEffect(fetchProducts, []);

  return (
    <>
      <h1>I nostri prodotti</h1>
      <div className="row row-cols-6">
        {products.map((product, index) => {
          <ProductCard key={index} />;
        })}
      </div>
    </>
  );
}
