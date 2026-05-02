import { NavLink, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { HomePage } from "./pages/HomePage";
import { SettingsPage } from "./pages/SettingsPage";
import { TodayPage } from "./pages/TodayPage";
import { TripDetailPage } from "./pages/TripDetailPage";
import { TripsPage } from "./pages/TripsPage";

const navItems = [
  { to: "/", labelKey: "nav.home" },
  { to: "/today", labelKey: "nav.today" },
  { to: "/trips", labelKey: "nav.trips" },
  { to: "/settings", labelKey: "nav.settings" }
];

export function App() {
  const { t } = useTranslation();

  return (
    <div className="app-shell">
      <header className="top-bar">
        <NavLink className="brand" to="/" aria-label={t("nav.homeAria")}>
          {t("common.appName")}
        </NavLink>
        <nav className="main-nav" aria-label={t("nav.primaryLabel")}>
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
              key={item.to}
              to={item.to}
              end={item.to === "/"}
            >
              {t(item.labelKey)}
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
