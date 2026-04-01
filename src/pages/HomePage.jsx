import ProductCard from "../components/ProductCard";

export default function HomePage() {
  return (
    <>
      <section className="hero p-4 d-flex flex-column justify-content-between align-items-start">
        <div>
          <h1>Titolo Hero provvisorio</h1>
          <p>Sottotitolo hero provvisorio</p>
        </div>
        <button className="btn btn-primary">Call To Action</button>
      </section>

      <section className="splash-products my-5 p-4">
        <h2>Nuovi prodotti</h2>
        <div>
          <div className="row row-cols-4 text-center my-5">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
        </div>
        <h2>Prodotti più venduti</h2>
        <div>
          <div className="row row-cols-4 text-center my-5">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
        </div>
      </section>
    </>
  );
}
