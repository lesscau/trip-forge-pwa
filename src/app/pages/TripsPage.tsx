import { Link } from "react-router-dom";

const sampleTrips = [
  {
    id: "china-2026",
    name: "China 2026",
    dates: "Beijing, Xi'an, Shanghai"
  }
];

export function TripsPage() {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Itinerary</p>
        <h1>Trips</h1>
      </div>
      <div className="card-grid">
        {sampleTrips.map((trip) => (
          <Link className="trip-card" key={trip.id} to={`/trips/${trip.id}`}>
            <span>{trip.dates}</span>
            <strong>{trip.name}</strong>
            <p>Open day-by-day planning, places, bookings, and notes.</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
