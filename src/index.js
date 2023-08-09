import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "react-query";

import {
  withScrollToTop as withScrollTop,
  withAuth,
  withNavbar,
  withScrollToTop,
} from "./hoc";
import { instantiate, roles } from "./util";
import * as Page from "./pages";

import "./index.css";

const {
  ADMIN_SUPER,
  ADMIN_LANDOWNER,
  ADMIN_PROJECT,
  BUYER,
  INVESTOR,
  LANDOWNER,
  WORKER,
} = roles;

// const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "*", // ??
    element: instantiate(withScrollTop(Page.ErrorView.NotFoundPage)),
  },
  {
    path: "/",
    element: instantiate(withScrollTop(withAuth(Page.HomePage))),
  },
  {
    path: "/login", // DONE API
    element: instantiate(withScrollTop(Page.Auth.LoginPage)),
  },
  {
    path: "/register", // DONE API
    element: instantiate(withScrollTop(Page.Auth.RegisterPage)),
  },
  {
    path: "/admin/register", // DONE API
    element: instantiate(
      withScrollTop(withAuth(Page.User.RegisterAdminPage, ADMIN_SUPER)),
    ),
  },
  {
    path: "/profile", // DONE API
    element: instantiate(
      withScrollTop(
        withAuth(Page.User.ProfilePage, BUYER, INVESTOR, INVESTOR, WORKER),
      ),
    ),
  },
  {
    path: "/role", // DONE API
    element: instantiate(
      withScrollTop(
        withNavbar(
          withAuth(
            Page.User.ActivateRolePage,
            BUYER,
            INVESTOR,
            LANDOWNER,
            WORKER,
          ),
        ),
      ),
    ),
  },
  {
    path: "/fundraisings", // DONE API
    element: instantiate(
      withScrollTop(
        withNavbar(
          withAuth(
            Page.Investment.ListFundraisingPage,
            INVESTOR,
            ADMIN_SUPER,
            ADMIN_PROJECT,
          ),
        ),
      ),
    ),
  },
  {
    path: "/fundraisings/:id", // DONE API
    element: instantiate(
      withScrollTop(
        withNavbar(
          // withAuth(
          Page.Investment.DetailFundraisingPage,
          // INVESTOR,
          // ADMIN_SUPER,
          // ADMIN_PROJECT,
          // ),
        ),
      ),
    ),
  },
  {
    path: "/investments", // DONE API
    element: instantiate(
      withAuth(
        withScrollTop(
          withNavbar(withAuth(Page.Investment.ListInvestmentPage, INVESTOR)),
        ),
      ),
    ),
  },
  {
    path: "/investments/:id", // DONE API
    element: instantiate(
      withScrollTop(
        withNavbar(withAuth(Page.Investment.DetailInvestmentPage, INVESTOR)),
      ),
    ),
  },
  {
    path: "/projects/:id", // DONE API
    element: instantiate(
      withScrollTop(
        withNavbar(
          withAuth(
            Page.UserProject.DetailProjectPage,
            LANDOWNER,
            INVESTOR,
            ADMIN_SUPER,
            ADMIN_PROJECT,
          ),
        ),
      ),
    ),
  },
  {
    path: "/lands", // DONE API
    element: instantiate(
      withScrollTop(
        withNavbar(withAuth(Page.UserLand.ListLandPage, LANDOWNER)),
      ),
    ),
  },
  {
    path: "/lands/:id", // DONE API
    element: instantiate(
      withScrollTop(
        withNavbar(withAuth(Page.UserLand.DetailLandPage, LANDOWNER)),
      ),
    ),
  },
  {
    path: "/lands/register", // DONE API
    element: instantiate(
      withScrollTop(
        withNavbar(withAuth(Page.UserLand.RegisterPage, LANDOWNER)),
      ),
    ),
  },
  {
    path: "/admin/lands", // DONE API
    element: instantiate(
      withScrollToTop(
        withNavbar(
          withAuth(
            Page.AdminLand.ListRegisteredLandPage,
            ADMIN_LANDOWNER,
            ADMIN_PROJECT,
            ADMIN_SUPER,
          ),
        ),
      ),
    ),
  },
  {
    path: "/admin/lands/:id", // DONE API
    element: instantiate(
      withScrollToTop(
        withNavbar(
          withAuth(
            Page.AdminLand.DetailLandPage,
            ADMIN_LANDOWNER,
            ADMIN_SUPER,
            ADMIN_PROJECT,
          ),
        ),
      ),
    ),
  },
  {
    path: "/admin/projects", // DONE API
    element: instantiate(
      withScrollToTop(
        withNavbar(
          withAuth(
            Page.AdminProject.ListProjectPage,
            ADMIN_PROJECT,
            ADMIN_SUPER,
          ),
        ),
      ),
    ),
  },
  {
    path: "/admin/projects/:id", // DONE API
    element: instantiate(
      withScrollToTop(
        withNavbar(
          withAuth(
            Page.AdminProject.DetailProjectPage,
            ADMIN_PROJECT,
            ADMIN_SUPER,
          ),
        ),
      ),
    ),
  },
  {
    path: "/admin/projects/:projectId/profit-distributions/:profitDistributionId", // DONE API
    element: instantiate(
      withScrollToTop(
        withNavbar(
          withAuth(
            Page.AdminProject.DetailProfitDistributionPage,
            ADMIN_PROJECT,
            ADMIN_SUPER,
          ),
        ),
      ),
    ),
  },
  {
    path: "/projects/:projectId/profit-distributions/:profitDistributionId",
    element: instantiate(
      withScrollToTop(
        withNavbar(
          withAuth(
            Page.UserProject.DetailProfitDistributionPage,
            INVESTOR,
            LANDOWNER,
          ),
        ),
      ),
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  //   <RouterProvider router={router} />
  // </React.StrictMode>,

  <RouterProvider router={router} />,
);
