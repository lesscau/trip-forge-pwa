import { useEffect, useState } from "react";

import {
  calculateUsagePercent,
  formatBytes,
  readStorageStatus,
  requestPersistentStorage,
  type StorageStatus
} from "../../shared/storageStatus";

export function SettingsPage() {
  const [storageStatus, setStorageStatus] = useState<StorageStatus>({
    isSupported: false
  });
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);
  const [requestMessage, setRequestMessage] = useState<string>();

  useEffect(() => {
    let isMounted = true;

    readStorageStatus()
      .then((status) => {
        if (isMounted) {
          setStorageStatus(status);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setStorageStatus({
            isSupported: true,
            error:
              error instanceof Error
                ? error.message
                : "Unable to read storage status"
          });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingStorage(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const usagePercent = calculateUsagePercent(
    storageStatus.estimate?.usage,
    storageStatus.estimate?.quota
  );

  const handleRequestPersistentStorage = async () => {
    setRequestMessage(undefined);

    const result = await requestPersistentStorage();

    if (!result.isSupported) {
      setRequestMessage("Persistent storage is not supported by this browser.");
      return;
    }

    if (result.error) {
      setRequestMessage(result.error);
      return;
    }

    setRequestMessage(
      result.isPersistent
        ? "Persistent storage is enabled."
        : "Persistent storage was not granted by the browser."
    );
    setStorageStatus(await readStorageStatus());
  };

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
      <article className="storage-panel">
        <div>
          <p className="eyebrow">Browser storage</p>
          <h2>Storage status</h2>
        </div>

        {isLoadingStorage ? (
          <p>Checking storage support...</p>
        ) : (
          <dl className="storage-details">
            <div>
              <dt>Storage API</dt>
              <dd>{storageStatus.isSupported ? "Supported" : "Unsupported"}</dd>
            </div>
            <div>
              <dt>Persistent storage</dt>
              <dd>
                {storageStatus.isPersistent === undefined
                  ? "Unknown"
                  : storageStatus.isPersistent
                    ? "Enabled"
                    : "Not enabled"}
              </dd>
            </div>
            <div>
              <dt>Used</dt>
              <dd>{formatBytes(storageStatus.estimate?.usage)}</dd>
            </div>
            <div>
              <dt>Quota</dt>
              <dd>{formatBytes(storageStatus.estimate?.quota)}</dd>
            </div>
            <div>
              <dt>Usage</dt>
              <dd>
                {usagePercent === undefined ? "Unknown" : `${usagePercent}%`}
              </dd>
            </div>
          </dl>
        )}

        {storageStatus.error ? (
          <p className="status-message">{storageStatus.error}</p>
        ) : null}
        {requestMessage ? (
          <p className="status-message">{requestMessage}</p>
        ) : null}

        <button
          className="storage-action"
          disabled={!storageStatus.isSupported || isLoadingStorage}
          onClick={() => void handleRequestPersistentStorage()}
          type="button"
        >
          Request persistent storage
        </button>
        <p className="storage-note">
          Persistent storage can reduce browser cleanup risk, but JSON backup
          export remains required for safe offline travel data.
        </p>
      </article>
    </section>
  );
}
