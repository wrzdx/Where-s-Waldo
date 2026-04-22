import { createBrowserRouter, RouterProvider } from "react-router"
import { App } from "./App"
import ErrorPage from "./components/Error/Error"
import { Home } from "./components/Home/Home"
import { Play } from "./components/Play/Play"

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        element: <Play />,
        path: "/play",
      },
    ],
  },
]

export default function Router() {
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}
