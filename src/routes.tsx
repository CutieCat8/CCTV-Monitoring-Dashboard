import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { CitizenLayout } from "./components/CitizenLayout";
import { LiveMonitoring } from "./pages/LiveMonitoring";
import { Dashboard } from "./pages/Dashboard";
import { EventsPage } from "./pages/EventsPage";
import { Login } from "./pages/Login";
import { CitizenDashboard } from "./pages/CitizenDashboard";
import { CitizenMap } from "./pages/CitizenMap";
import { CitizenAnnouncements } from "./pages/CitizenAnnouncements";
import { CitizenReport } from "./pages/CitizenReport";
import { CitizenEvents } from "./pages/CitizenEvents";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/live",
    element: <Navigate to="/dashboard/live" replace />,
  },
  {
    path: "/events",
    element: <Navigate to="/dashboard/events" replace />,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "live", Component: LiveMonitoring },
      { path: "events", Component: EventsPage },
    ],
  },
  {
    path: "/citizen",
    Component: CitizenLayout,
    children: [
      { index: true, Component: CitizenDashboard },
      { path: "map", Component: CitizenMap },
      { path: "announcements", Component: CitizenAnnouncements },
      { path: "report", Component: CitizenReport },
      { path: "events", Component: CitizenEvents },
    ],
  },
]);