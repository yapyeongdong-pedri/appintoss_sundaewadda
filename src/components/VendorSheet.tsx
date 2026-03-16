import { useEffect, useState } from "react";
import { isImageSource } from "../lib/imageFiles";
import { getStatusLabel, getStatusTone } from "../lib/status";
import { formatVisitRules } from "../lib/visitRules";
import type { VendorSummary } from "../types";
import { Badge, Button } from "../ui";

interface VendorSheetProps {
  vendor?: VendorSummary;
  open: boolean;
  onClose: () => void;
  onReport: (vendorId: string, type: "open" | "notYet" | "closed") => void;
  onOpenUpdate: (vendorId: string) => void;
}

function formatReportTime(isoString?: string) {
  if (isoString == null) {
    return "\uAE30\uC900 \uC2DC\uAC04 \uC5C6\uC74C";
  }

  const date = new Date(isoString);
  const weekdays = [
    "\uC77C",
    "\uC6D4",
    "\uD654",
    "\uC218",
    "\uBAA9",
    "\uAE08",
    "\uD1A0",
  ];

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${month}/${day}(${weekday}) ${hours}:${minutes} \uAE30\uC900`;
}

export function VendorSheet({
  vendor,
  open,
  onClose,
  onReport,
  onOpenUpdate,
}: VendorSheetProps) {
  const [selectedMenuBoardPhoto, setSelectedMenuBoardPhoto] = useState<string>();

  useEffect(() => {
    if (!open) {
      setSelectedMenuBoardPhoto(undefined);
    }
  }, [open, vendor?.id]);

  if (!open || vendor == null) {
    return null;
  }

  const headlineMenu = vendor.menuSummary.slice(0, 3).join(" / ");
  const menuBoardPhotos = vendor.menuBoardPhotos ?? [];
  const visitPatternLabel = formatVisitRules(vendor.visitRules, vendor.visitPattern);

  return (
    <>
      <div className="detail-overlay" role="dialog" aria-modal="true">
        <button type="button" className="detail-dismiss" onClick={onClose} aria-label="Close detail" />
        <section className="detail-panel">
        <header className="detail-top-bar">
          <div className="detail-title-group">
            <p className="section-eyebrow">{headlineMenu}</p>
            <h3 className="detail-title">{vendor.name}</h3>
            <p className="detail-meta-line">
              <span className="detail-meta-item" title={vendor.position.address}>
                <strong>{"\uC601\uC5C5\uC7A5\uC18C"}</strong>
                <span>{vendor.position.address}</span>
              </span>
              <span className="detail-meta-item" title={visitPatternLabel}>
                <strong>{"\uC601\uC5C5\uC8FC\uAE30"}</strong>
                <span>{visitPatternLabel}</span>
              </span>
              <span className="detail-meta-item" title={vendor.businessHours}>
                <strong>{"\uC601\uC5C5\uC2DC\uAC04"}</strong>
                <span>{vendor.businessHours}</span>
              </span>
            </p>
          </div>
          <div className="detail-top-actions">
            <button type="button" className="detail-text-button" onClick={() => onOpenUpdate(vendor.id)}>
              {"\uC815\uBCF4 \uC218\uC815"}
            </button>
            <button type="button" className="detail-close-button" onClick={onClose}>
              {"\u2715"}
            </button>
          </div>
        </header>

        <div className="detail-status-bar">
          <div className={`detail-status-main detail-status-main-${vendor.status}`}>
            <Badge variant="fill" color={getStatusTone(vendor.status)} size="medium">
              {getStatusLabel(vendor.status)}
            </Badge>
            <div className="detail-report-summary">
              <span>{formatReportTime(vendor.latestReportAt)}</span>
            </div>
          </div>

          <div className="detail-quick-actions">
            <a className="detail-link-button" href={`tel:${vendor.phone}`}>
              {"\uC804\uD654"}
            </a>
            <a className="detail-link-button" href={`sms:${vendor.phone}`}>
              {"\uBB38\uC790"}
            </a>
            <button type="button" className="detail-text-button">
              {"\uC800\uC7A5"}
            </button>
          </div>
        </div>

        <div className="detail-body">
          <section className="detail-section">
            <div className="detail-section-head">
              <p className="section-label">{"\uCD5C\uC2E0 \uBA54\uB274\uD310"}</p>
              <span className="muted-text">{menuBoardPhotos.length}</span>
            </div>
            {menuBoardPhotos.length === 0 ? (
              <div className="menu-board-empty">
                {"\uB4F1\uB85D\uB41C \uBA54\uB274\uD310 \uC0AC\uC9C4\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694."}
              </div>
            ) : (
              <div className="menu-board-gallery">
                {menuBoardPhotos.map((photo, index) => (
                  <button
                    key={`${vendor.id}-board-${index}`}
                    type="button"
                    className="menu-board-card"
                    onClick={() => setSelectedMenuBoardPhoto(photo)}
                  >
                    <div className="menu-board-card-image">
                      <span className="menu-board-card-badge">{`\uBA54\uB274\uD310 ${index + 1}`}</span>
                      {isImageSource(photo) ? (
                        <img src={photo} alt={`\uBA54\uB274\uD310 ${index + 1}`} className="menu-board-image" />
                      ) : (
                        <strong>{photo}</strong>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

        </div>

        <footer className="detail-bottom-bar">
          <Button
            color="primary"
            variant="fill"
            size="large"
            display="full"
            onClick={() => onReport(vendor.id, "open")}
          >
            {`\uC601\uC5C5\uC911 ${vendor.reportCounts.open}`}
          </Button>
          <Button
            color="light"
            variant="weak"
            size="large"
            display="full"
            onClick={() => onReport(vendor.id, "notYet")}
          >
            {`\uD655\uC778\uC548\uB428 ${vendor.reportCounts.notYet}`}
          </Button>
          <Button
            color="danger"
            variant="weak"
            size="large"
            display="full"
            onClick={() => onReport(vendor.id, "closed")}
          >
            {`\uC601\uC5C5\uC885\uB8CC ${vendor.reportCounts.closed}`}
          </Button>
        </footer>
        </section>
      </div>

      {selectedMenuBoardPhoto ? (
        <div className="lightbox-overlay" role="dialog" aria-modal="true">
          <button
            type="button"
            className="lightbox-dismiss"
            onClick={() => setSelectedMenuBoardPhoto(undefined)}
            aria-label="Close image preview"
          />
          <section className="lightbox-panel">
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setSelectedMenuBoardPhoto(undefined)}
            >
              {"\u2715"}
            </button>
            <div className="lightbox-image">
              <span className="menu-board-card-badge">{"\uBA54\uB274\uD310 \uD655\uB300"}</span>
              {isImageSource(selectedMenuBoardPhoto) ? (
                <img src={selectedMenuBoardPhoto} alt="\uBA54\uB274\uD310 \uD655\uB300" className="lightbox-photo" />
              ) : (
                <strong>{selectedMenuBoardPhoto}</strong>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
