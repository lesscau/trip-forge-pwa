export function TodayPage() {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Travel day</p>
        <h1>Today</h1>
      </div>
      <div className="today-layout">
        <article className="focus-card">
          <span>Next stop</span>
          <strong>Hotel check-in</strong>
          <p>Keep key addresses, bookings, and checklist items within reach.</p>
        </article>
        <article className="focus-card">
          <span>Backup</span>
          <strong>Export JSON</strong>
          <p>Offline backup and restore flows belong in the app settings.</p>
        </article>
      </div>
    </section>
  );
}
