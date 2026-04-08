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
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

export default function App() {
  return (
    <CartContextProvider>
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
                {/* cart */}
                <Route path="cart" element={<CartPage />} />
                {/* checkout */}
                <Route path="/checkout" Component={CheckoutPage} />
                {/* ordersuccess */}
                <Route path="/order-success/:id" Component={OrderSuccessPage} />
                {/* NOT FOUND */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LoaderContextProvider>
      </NotificationContextProvider>
    </CartContextProvider>
  );
}
