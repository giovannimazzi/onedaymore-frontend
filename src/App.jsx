import { BrowserRouter, Routes, Route } from "react-router";

import DefaultLayout from "./layouts/DefaultLayout";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";

import { LoaderContextProvider } from "./contexts/LoaderContext";
import { NotificationContextProvider } from "./contexts/NotificationContext";

import { CartContextProvider } from "./contexts/CartContext";
import CartPage from "./pages/CartPage";

import { CompareContextProvider } from "./contexts/CompareContext";
import ComparePage from "./pages/ComparePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

import DevDemoPage from "./pages/DevDemoPage";

export default function App() {
  return (
    <CompareContextProvider>
      <NotificationContextProvider>
        <CartContextProvider>
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
                  {/* cart */}
                  <Route path="cart" element={<CartPage />} />
                  {/* Compare */}
                  <Route path="compare" element={<ComparePage />} />
                  {/* checkout */}
                  <Route path="/checkout" Component={CheckoutPage} />
                  {/* ordersuccess */}
                  <Route
                    path="/order-success/:id"
                    Component={OrderSuccessPage}
                  />

                  {/* DEV DEMO */}
                  {import.meta.env.DEV && (
                    <Route path="dev-demo" element={<DevDemoPage />} />
                  )}

                  {/* NOT FOUND */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </LoaderContextProvider>
        </CartContextProvider>
      </NotificationContextProvider>
    </CompareContextProvider>
  );
}
