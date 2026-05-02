export function SettingsPage() {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">Local data</p>
        <h1>Settings</h1>
      </div>
      <div className="settings-list">
        <button type="button">Export backup JSON</button>
        <button type="button">Import backup JSON</button>
      </div>
    </section>
  );
}
