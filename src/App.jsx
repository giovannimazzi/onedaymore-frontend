import { BrowserRouter, Routes, Route } from "react-router";

import DefaultLayout from "./layouts/DefaultLayout";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetailPage from "./pages/ProductDetailPage";

import { LoaderContextProvider } from "./contexts/LoaderContext";
import { NotificationContextProvider } from "./contexts/NotificationContext";

export default function App() {
  return (
    <NotificationContextProvider>
      <LoaderContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout />}>
              {/* HOME */}
              <Route index element={<HomePage />} />

              {/* PRODUCT ROUTES */}
              <Route path="products">
                {/* se vuoi lista prodotti */}
                <Route index element={<h1>Lista prodotti</h1>} />

                {/* DETTAGLIO PRODOTTO */}
                <Route path=":slug" element={<ProductDetailPage />} />
              </Route>

              {/* ALTRE ROUTE */}
              <Route path="---">
                <Route index element={<h1>Pagina ---</h1>} />
                <Route path=":slug" element={<h1>Dettaglio ---</h1>} />
              </Route>

              {/* NOT FOUND */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoaderContextProvider>
    </NotificationContextProvider>
  );
}
