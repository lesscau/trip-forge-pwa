export type StorageStatus = {
  isSupported: boolean;
  estimate?: StorageEstimate;
  isPersistent?: boolean;
  error?: string;
};

export type PersistentStorageRequestResult = {
  isSupported: boolean;
  isPersistent?: boolean;
  error?: string;
};

export function formatBytes(value?: number): string {
  if (value === undefined) {
    return "Unknown";
  }

  if (value < 1024) {
    return `${value} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let size = value / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

export function calculateUsagePercent(
  usage?: number,
  quota?: number
): number | undefined {
  if (usage === undefined || quota === undefined || quota <= 0) {
    return undefined;
  }

  return Math.min(100, Math.round((usage / quota) * 100));
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  return error instanceof Error ? error.message : fallbackMessage;
}

export async function readStorageStatus(
  fallbackErrorMessage = "Unable to read storage status",
  browserNavigator: Navigator = navigator
): Promise<StorageStatus> {
  const storage = browserNavigator.storage;

  if (!storage) {
    return { isSupported: false };
  }

  try {
    const estimate = await storage.estimate();
    const isPersistent = await storage.persisted();

    return {
      isSupported: true,
      estimate,
      isPersistent
    };
  } catch (error) {
    return {
      isSupported: true,
      error: getErrorMessage(error, fallbackErrorMessage)
    };
  }
}

export async function requestPersistentStorage(
  fallbackErrorMessage = "Storage API request failed",
  browserNavigator: Navigator = navigator
): Promise<PersistentStorageRequestResult> {
  const storage = browserNavigator.storage;

  if (!storage) {
    return { isSupported: false };
  }

  try {
    return {
      isSupported: true,
      isPersistent: await storage.persist()
    };
  } catch (error) {
    return {
      isSupported: true,
      error: getErrorMessage(error, fallbackErrorMessage)
    };
  }
}
