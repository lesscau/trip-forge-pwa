import { NavLink, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState, type ReactNode } from "react";

import type { Trip } from "../db/database";
import { listTrips } from "../db/repositories";
import { HomePage } from "./pages/HomePage";
import { SettingsPage } from "./pages/SettingsPage";
import { TodayPage } from "./pages/TodayPage";
import { TripDetailPage } from "./pages/TripDetailPage";
import { TripPlacesPage } from "./pages/TripPlacesPage";
import { TripsPage } from "./pages/TripsPage";

const navItems = [
  { to: "/", labelKey: "nav.home", icon: "compass" },
  { to: "/today", labelKey: "nav.today", icon: "sun" },
  { to: "/trips", labelKey: "nav.trips", icon: "suitcase" },
  { to: "/settings", labelKey: "nav.settings", icon: "settings" }
] as const;

type NavIconName = (typeof navItems)[number]["icon"] | "map";

const navIconPaths: Record<NavIconName, ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.4 8.6-2.1 4.7-4.7 2.1 2.1-4.7Z" />
    </>
  ),
  map: (
    <>
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </>
  ),
  settings: (
    <>
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  suitcase: (
    <>
      <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <rect height="14" rx="2" width="18" x="3" y="6" />
      <path d="M8 6v14" />
      <path d="M16 6v14" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.9 19.1 1.4-1.4" />
      <path d="m17.7 6.3 1.4-1.4" />
    </>
  )
};

function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg
      aria-hidden="true"
      className="nav-icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {navIconPaths[name]}
    </svg>
  );
}

function NavLabel({
  children,
  icon
}: {
  children: ReactNode;
  icon: NavIconName;
}) {
  return (
    <>
      <NavIcon name={icon} />
      <span>{children}</span>
    </>
  );
}

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
    { to: "/today", labelKey: "nav.today", icon: "sun" },
    { to: "/trips", labelKey: "nav.trips", icon: "suitcase" },
    {
      to: placesTrip ? `/trips/${placesTrip.id}/places` : "/trips",
      labelKey: "nav.places",
      icon: "map"
    },
    { to: "/settings", labelKey: "nav.settings", icon: "settings" }
  ] as const;

  return (
    <div className="app-shell">
      <header className="top-bar">
        <NavLink className="brand" to="/" aria-label={t("nav.homeAria")}>
          <span className="brand-mark" aria-hidden="true">
            TF
          </span>
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
              <NavLabel icon={item.icon}>{t(item.labelKey)}</NavLabel>
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
            <NavLabel icon={item.icon}>{t(item.labelKey)}</NavLabel>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
