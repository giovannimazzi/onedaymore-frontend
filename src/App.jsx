import { BrowserRouter, Routes, Route } from "react-router";

import DefaultLayout from "./layouts/DefaultLayout";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";

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
                <Route index element={<ProductsPage />} />
                <Route path=":slug" element={<ProductDetailPage />} />
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
