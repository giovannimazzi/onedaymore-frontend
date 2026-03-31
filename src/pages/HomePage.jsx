export default function HomePage() {
  return (
    <div className=" row flex-lg-row-reverse align-items-center g-5 py-5">
      <div className=" col-10 col-sm-8 col-lg-6">
        <img
          src="https://www.distrettobiologicofiesole.it/wp-content/uploads/2026/02/Newsletter-013_2026.png"
          className=" d-block mx-lg-auto img-fluid"
          alt="Bootstrap Themes"
          width="700"
          height="500"
          loading="lazy"
        />
      </div>
      <div className=" col-lg-6">
        <h1 className="h1 display-5 fw-bold lh-1 mb-3">
          Preparati oggi per ogni domani
        </h1>
        <h2 className="h2 lead display-6 my-4 ">
          Cibo a lunga conservazione per emergenze, viaggi e situazioni
          impreviste.
        </h2>
        <div className=" d-grid gap-2 d-md-flex justify-content-md-start">
          <button
            type="button"
            className=" btn btn-primary btn-lg px-4 me-md-2"
          >
            Scopri i prodotti
          </button>
        </div>
      </div>
    </div>
  );
}
