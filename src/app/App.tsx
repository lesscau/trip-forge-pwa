import { NavLink, Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { SettingsPage } from "./pages/SettingsPage";
import { TodayPage } from "./pages/TodayPage";
import { TripDetailPage } from "./pages/TripDetailPage";
import { TripsPage } from "./pages/TripsPage";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/today", label: "Today" },
  { to: "/trips", label: "Trips" },
  { to: "/settings", label: "Settings" }
];

export function App() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <NavLink className="brand" to="/" aria-label="TripForge home">
          TripForge
        </NavLink>
        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
              key={item.to}
              to={item.to}
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="page-frame">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/:tripId" element={<TripDetailPage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
