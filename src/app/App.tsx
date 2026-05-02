import { NavLink, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import type { Trip } from "../db/database";
import { listTrips } from "../db/repositories";
import { HomePage } from "./pages/HomePage";
import { SettingsPage } from "./pages/SettingsPage";
import { TodayPage } from "./pages/TodayPage";
import { TripDetailPage } from "./pages/TripDetailPage";
import { TripPlacesPage } from "./pages/TripPlacesPage";
import { TripsPage } from "./pages/TripsPage";

const navItems = [
  { to: "/", labelKey: "nav.home" },
  { to: "/today", labelKey: "nav.today" },
  { to: "/trips", labelKey: "nav.trips" },
  { to: "/settings", labelKey: "nav.settings" }
];

export function App() {
  const { t } = useTranslation();
  const [placesTrip, setPlacesTrip] = useState<Trip>();

  useEffect(() => {
    let isMounted = true;

    listTrips()
      .then((trips) => {
        if (isMounted) {
          setPlacesTrip([...trips].sort((left, right) =>
            right.startDate.localeCompare(left.startDate)
          )[0]);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPlacesTrip(undefined);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const mobileNavItems = [
    { to: "/today", labelKey: "nav.today" },
    { to: "/trips", labelKey: "nav.trips" },
    {
      to: placesTrip ? `/trips/${placesTrip.id}/places` : "/trips",
      labelKey: "nav.places"
    },
    { to: "/settings", labelKey: "nav.settings" }
  ];

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
          <Route path="/trips/:tripId/places" element={<TripPlacesPage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <nav className="bottom-nav" aria-label={t("nav.mobileLabel")}>
        {mobileNavItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? "bottom-nav-link bottom-nav-link-active" : "bottom-nav-link"
            }
            key={`${item.to}-${item.labelKey}`}
            to={item.to}
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
