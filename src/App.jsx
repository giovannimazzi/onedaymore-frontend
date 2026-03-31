import { BrowserRouter, Routes, Route } from "react-router";

import DefaultLayout from "./layouts/DefaultLayout";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

import { LoaderContextProvider } from "./contexts/LoaderContext";
import { NotificationContextProvider } from "./contexts/NotificationContext";

export default function App() {
  return (
    <NotificationContextProvider>
      <LoaderContextProvider>
        <BrowserRouter>
          <Routes>
            <Route Component={DefaultLayout}>
              {/* SITE ROUTES*/}
              <Route index Component={HomePage} />

              {/* PRODUCT ROUTES*/}
              <Route path="products">
                <Route index /* Component={} */ />
                <Route path=":slug" /* Component={}  */ />
              </Route>

              {/* --- ROUTES*/}
              <Route path="---">
                <Route index /* Component={} */ />
                <Route path=":---" /* Component={}  */ />
              </Route>

              {/*Not Found Page*/}
              <Route path="*" Component={NotFoundPage} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoaderContextProvider>
    </NotificationContextProvider>
  );
}
