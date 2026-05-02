import { useParams } from "react-router-dom";

export function TripDetailPage() {
  const { tripId } = useParams();

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Trip detail</p>
        <h1>{tripId ?? "Trip"}</h1>
      </div>
      <div className="timeline-list">
        <article>
          <span>Day 1</span>
          <strong>Arrival and hotel check-in</strong>
          <p>Use this route for itinerary, places, documents, and expenses.</p>
        </article>
        <article>
          <span>Places</span>
          <strong>Chinese addresses and map links</strong>
          <p>Place records will support copy buttons and Amap/Baidu/Apple Maps.</p>
        </article>
      </div>
    </section>
  );
}
