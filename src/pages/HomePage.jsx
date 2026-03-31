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

      <section className="splash-products">
        <div>
          <div className="row row-cols-2">
            <div className="col"></div>
            <div className="col"></div>
          </div>
        </div>
      </section>
    </>
  );
}
