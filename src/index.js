import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { withScrollToTop as withScrollTop, withAuth } from "./hoc";
import { instantiate } from "./util";
import * as Page from "./pages";

import "./index.css";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/login",
    element: instantiate(withScrollTop(Page.Auth.LoginPage)),
  },
  {
    path: "/register",
    element: instantiate(withScrollTop(Page.Auth.RegisterPage)),
  },
  {
    path: "/",
    element: instantiate(withAuth(withScrollTop(Page.HomePage))),
  },
  {
    path: "/admin/register",
    element: instantiate(withAuth(withScrollTop(Page.User.RegisterAdminPage))),
  },
  {
    path: "/profile",
    element: instantiate(withAuth(withScrollTop(Page.User.ProfilePage))),
  },
  {
    path: "/role",
    element: instantiate(withAuth(withScrollTop(Page.User.ActivateRolePage))),
  },
  {
    path: "/fundraisings",
    element: instantiate(
      withAuth(withScrollTop(Page.Investment.ListFundraisingPage)),
    ),
  },
  {
    path: "/fundraisings/:id",
    element: instantiate(
      withAuth(withScrollTop(Page.Investment.DetailFundraisingPage)),
    ),
  },
  {
    path: "/investments",
    element: instantiate(
      withAuth(withScrollTop(Page.Investment.ListInvestmentPage)),
    ),
  },
  {
    path: "/investments/:id",
    element: instantiate(
      withAuth(withScrollTop(Page.Investment.DetailInvestmentPage)),
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  //   <QueryClientProvider client={queryClient}>
  //     <RouterProvider router={router} />
  //   </QueryClientProvider>
  // </React.StrictMode>,
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
