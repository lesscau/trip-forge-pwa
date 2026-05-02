import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Local-first China travel planner</p>
        <h1>TripForge</h1>
        <p>
          Plan days, places, bookings, documents, and travel notes in a static
          PWA designed to keep working offline on your phone.
        </p>
        <div className="button-row">
          <Link className="primary-action" to="/today">
            Open Today
          </Link>
          <Link className="secondary-action" to="/trips">
            View Trips
          </Link>
        </div>
      </div>
      <div className="status-panel" aria-label="Offline planning status">
        <span>Offline ready</span>
        <strong>IndexedDB first</strong>
        <p>Backup data as JSON and keep the app usable without a backend.</p>
      </div>
    </section>
  );
}
