import { getStatusLabel, getStatusTone } from "../lib/status";
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
  if (!open || vendor == null) {
    return null;
  }

  const menuItems =
    vendor.menuItems?.length > 0
      ? vendor.menuItems
      : vendor.menuSummary.map((name, index) => {
          const prices = vendor.priceSummary
            .split("/")
            .map((part) => part.trim())
            .filter(Boolean);

          return {
            name,
            price: prices[index] ?? prices[prices.length - 1] ?? "-",
          };
        });
  const headlineMenu = vendor.menuSummary.slice(0, 3).join(" / ");

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true">
      <button type="button" className="detail-dismiss" onClick={onClose} aria-label="Close detail" />
      <section className="detail-panel">
        <header className="detail-top-bar">
          <div className="detail-title-group">
            <p className="section-eyebrow">{vendor.position.address}</p>
            <h3 className="detail-title">{vendor.name}</h3>
            <p className="detail-meta-line">
              <span>{headlineMenu}</span>
              <span>{vendor.visitPattern}</span>
              <span>{vendor.businessHours}</span>
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
              <span>{"\uC601\uC5C5\uC911 "} {vendor.reportCounts.open}</span>
              <span>{"\uC885\uB8CC "} {vendor.reportCounts.closed}</span>
              <span>{"\uBBF8\uD655\uC778 "} {vendor.reportCounts.notYet}</span>
              <span>{formatReportTime(vendor.latestReportAt)}</span>
            </div>
          </div>

          <div className="detail-quick-actions">
            <a className="detail-link-button" href={`tel:${vendor.phone}`}>
              {"\uC804\uD654\uD558\uAE30"}
            </a>
            <a className="detail-link-button" href={`sms:${vendor.phone}`}>
              {"\uBB38\uC790\uD558\uAE30"}
            </a>
          </div>
        </div>

        <div className="detail-body">
          <section className="detail-section">
            <div className="detail-section-head">
              <p className="section-label">{"\uBA54\uB274 \uBC0F \uAC00\uACA9"}</p>
              <span className="muted-text">{menuItems.length}</span>
            </div>
            <div className="menu-list">
              {menuItems.map((item) => (
                <div className="menu-row" key={`${vendor.id}-${item.name}`}>
                  <strong>{item.name}</strong>
                  <span>{item.price}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <p className="section-label">{"\uAE30\uBCF8 \uC815\uBCF4"}</p>
            <div className="info-list">
              <div className="info-row">
                <span>{"\uC8FC\uC694 \uC704\uCE58"}</span>
                <strong>{vendor.position.address}</strong>
              </div>
              <div className="info-row">
                <span>{"\uD2B8\uB7ED \uC885\uB958"}</span>
                <strong>{vendor.category}</strong>
              </div>
            </div>
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
            {"\uC601\uC5C5\uC911 \uC81C\uBCF4"}
          </Button>
          <Button
            color="dark"
            variant="weak"
            size="large"
            display="full"
            onClick={() => onReport(vendor.id, "notYet")}
          >
            {"\uC544\uC9C1 \uC548 \uC634"}
          </Button>
          <Button
            color="light"
            variant="weak"
            size="large"
            display="full"
            onClick={() => onReport(vendor.id, "closed")}
          >
            {"\uC601\uC5C5\uC885\uB8CC"}
          </Button>
        </footer>
      </section>
    </div>
  );
}
