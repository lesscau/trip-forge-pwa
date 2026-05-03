import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { TravelDocument, TravelDocumentType } from "../../db/database";
import { IconButton } from "../../shared/IconButton";
import type { DocumentFormValues } from "./types";

const documentTypes: TravelDocumentType[] = [
  "passport",
  "visa",
  "insurance",
  "ticket",
  "booking",
  "other"
];

type DocumentsSectionProps = {
  documents: TravelDocument[];
  documentForm: DocumentFormValues;
  onDocumentFormChange: (patch: Partial<DocumentFormValues>) => void;
  onAddDocument: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onDeleteDocument: (documentId: string) => Promise<void>;
};

export function DocumentsSection({
  documents,
  documentForm,
  onDocumentFormChange,
  onAddDocument,
  onDeleteDocument
}: DocumentsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="data-section">
      <h2>{t("tripDetail.sections.documents")}</h2>
      <form
        className="compact-form"
        onSubmit={(event) => void onAddDocument(event)}
      >
        <label>
          <span>{t("tripDetail.documentForm.type")}</span>
          <select
            onChange={(event) =>
              onDocumentFormChange({
                type: event.target.value as TravelDocumentType
              })
            }
            value={documentForm.type}
          >
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {t(`travelDocumentTypes.${type}`)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t("tripDetail.documentForm.title")}</span>
          <input
            onChange={(event) =>
              onDocumentFormChange({ title: event.target.value })
            }
            required
            type="text"
            value={documentForm.title}
          />
        </label>
        <label>
          <span>{t("tripDetail.documentForm.notes")}</span>
          <input
            onChange={(event) =>
              onDocumentFormChange({ notes: event.target.value })
            }
            type="text"
            value={documentForm.notes}
          />
        </label>
        <button className="secondary-action" type="submit">
          {t("tripDetail.documentForm.submit")}
        </button>
      </form>

      {documents.length === 0 ? (
        <p className="muted-text">{t("tripDetail.emptyDocuments")}</p>
      ) : (
        <div className="card-grid">
          {documents.map((document) => (
            <article className="focus-card" key={document.id}>
              <span>{t(`travelDocumentTypes.${document.type}`)}</span>
              <strong>{document.title}</strong>
              {document.notes ? <p>{document.notes}</p> : null}
              <IconButton
                icon="trash"
                label={t("common.delete")}
                onClick={() => void onDeleteDocument(document.id)}
                type="button"
                variant="danger"
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
