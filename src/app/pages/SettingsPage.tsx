import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  setCurrentLanguage,
  supportedLanguages,
  type SupportedLanguage
} from "../../i18n";
import {
  calculateUsagePercent,
  formatBytes,
  readStorageStatus,
  requestPersistentStorage,
  type StorageStatus
} from "../../shared/storageStatus";

export function SettingsPage() {
  const { i18n, t } = useTranslation();
  const [storageStatus, setStorageStatus] = useState<StorageStatus>({
    isSupported: false
  });
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);
  const [requestMessage, setRequestMessage] = useState<string>();

  useEffect(() => {
    let isMounted = true;

    readStorageStatus(t("storage.readError"))
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
                : t("storage.readError")
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
  }, [t]);

  const usagePercent = calculateUsagePercent(
    storageStatus.estimate?.usage,
    storageStatus.estimate?.quota
  );

  const handleRequestPersistentStorage = async () => {
    setRequestMessage(undefined);

    const result = await requestPersistentStorage(t("storage.requestError"));

    if (!result.isSupported) {
      setRequestMessage(t("storage.unsupportedPersistent"));
      return;
    }

    if (result.error) {
      setRequestMessage(result.error);
      return;
    }

    setRequestMessage(
      result.isPersistent
        ? t("storage.enabledMessage")
        : t("storage.notGrantedMessage")
    );
    setStorageStatus(await readStorageStatus(t("storage.readError")));
  };

  const handleLanguageChange = async (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    await i18n.changeLanguage(language);
  };

  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">{t("settings.eyebrow")}</p>
        <h1>{t("settings.title")}</h1>
      </div>
      <article className="language-panel">
        <div>
          <p className="eyebrow">{t("settings.languageEyebrow")}</p>
          <h2>{t("settings.languageTitle")}</h2>
          <p>{t("settings.languageDescription")}</p>
        </div>
        <div className="language-switcher">
          {supportedLanguages.map((language) => (
            <button
              className={
                i18n.language === language
                  ? "language-option language-option-active"
                  : "language-option"
              }
              key={language}
              onClick={() => void handleLanguageChange(language)}
              type="button"
            >
              {language === "ru"
                ? t("settings.russian")
                : t("settings.english")}
            </button>
          ))}
        </div>
      </article>
      <div className="settings-list">
        <button type="button">{t("settings.exportBackup")}</button>
        <button type="button">{t("settings.importBackup")}</button>
      </div>
      <article className="storage-panel">
        <div>
          <p className="eyebrow">{t("storage.eyebrow")}</p>
          <h2>{t("storage.title")}</h2>
        </div>

        {isLoadingStorage ? (
          <p>{t("storage.checking")}</p>
        ) : (
          <dl className="storage-details">
            <div>
              <dt>{t("storage.api")}</dt>
              <dd>
                {storageStatus.isSupported
                  ? t("common.supported")
                  : t("common.unsupported")}
              </dd>
            </div>
            <div>
              <dt>{t("storage.persistent")}</dt>
              <dd>
                {storageStatus.isPersistent === undefined
                  ? t("common.unknown")
                  : storageStatus.isPersistent
                    ? t("common.enabled")
                    : t("common.notEnabled")}
              </dd>
            </div>
            <div>
              <dt>{t("storage.used")}</dt>
              <dd>
                {storageStatus.estimate?.usage === undefined
                  ? t("common.unknown")
                  : formatBytes(storageStatus.estimate.usage)}
              </dd>
            </div>
            <div>
              <dt>{t("storage.quota")}</dt>
              <dd>
                {storageStatus.estimate?.quota === undefined
                  ? t("common.unknown")
                  : formatBytes(storageStatus.estimate.quota)}
              </dd>
            </div>
            <div>
              <dt>{t("storage.usage")}</dt>
              <dd>
                {usagePercent === undefined
                  ? t("common.unknown")
                  : `${usagePercent}%`}
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
          {t("storage.requestButton")}
        </button>
        <p className="storage-note">{t("storage.note")}</p>
      </article>
    </section>
  );
}
