import type { ReactNode } from "react";

export type SectionIconName =
  | "bookings"
  | "checklist"
  | "documents"
  | "expenses"
  | "itinerary"
  | "places";

const sectionIconPaths: Record<SectionIconName, ReactNode> = {
  bookings: (
    <>
      <path d="M2 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </>
  ),
  checklist: (
    <>
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  documents: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </>
  ),
  expenses: (
    <>
      <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v2" />
      <path d="M3 7v12a2 2 0 0 0 2 2h16V9a2 2 0 0 0-2-2Z" />
      <path d="M16 14h.01" />
    </>
  ),
  itinerary: (
    <>
      <path d="M3 7h4l3 10h4l3-10h4" />
      <circle cx="5" cy="7" r="2" />
      <circle cx="19" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
    </>
  ),
  places: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  )
};

export function SectionIcon({ name }: { name: SectionIconName }) {
  return (
    <span className={`section-icon section-icon-${name}`} aria-hidden="true">
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        {sectionIconPaths[name]}
      </svg>
    </span>
  );
}
