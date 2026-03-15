import { Badge, BottomSheet, Button } from "@toss/tds-mobile";
import { getStatusLabel, getStatusTone } from "../lib/status";
import type { VendorSummary } from "../types";

interface VendorSheetProps {
  vendor?: VendorSummary;
  open: boolean;
  onClose: () => void;
  onReport: (vendorId: string, type: "open" | "notYet" | "closed") => void;
  onOpenRegistration: () => void;
  onOpenUpdate: (vendorId: string) => void;
}

export function VendorSheet({
  vendor,
  open,
  onClose,
  onReport,
  onOpenRegistration,
  onOpenUpdate,
}: VendorSheetProps) {
  if (vendor == null) {
    return null;
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      header={<BottomSheet.Header>{vendor.name}</BottomSheet.Header>}
      headerDescription={
        <BottomSheet.HeaderDescription>
          {vendor.position.address} {" · "} {vendor.category}
        </BottomSheet.HeaderDescription>
      }
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="light" variant="weak" size="large" onClick={onOpenRegistration}>
              {"\uC2E0\uADDC \uB4F1\uB85D"}
            </Button>
          }
          rightButton={
            <Button color="primary" variant="fill" size="large" onClick={() => onOpenUpdate(vendor.id)}>
              {"\uC815\uBCF4 \uC218\uC815"}
            </Button>
          }
        />
      }
    >
      <div className="sheet-content">
        <div className="status-row">
          <Badge variant="fill" color={getStatusTone(vendor.status)} size="medium">
            {getStatusLabel(vendor.status)}
          </Badge>
          <span className="muted-text">
            {vendor.latestReportAt
              ? `${vendor.latestReportAt.slice(11, 16)} \uAE30\uC900`
              : "\uC624\uB298 \uC81C\uBCF4 \uC5C6\uC74C"}
          </span>
        </div>

        <div className="section-block">
          <p className="section-label">{"\uB300\uD45C \uBA54\uB274"}</p>
          <div className="chip-row">
            {vendor.menuSummary.map((item) => (
              <span className="info-chip" key={item}>
                {item}
              </span>
            ))}
          </div>
          <p className="meta-row">{vendor.priceSummary}</p>
        </div>

        <div className="info-list">
          <div className="info-row">
            <span>{"\uC804\uD654\uBC88\uD638"}</span>
            <strong>{vendor.phone}</strong>
          </div>
          <div className="info-row">
            <span>{"\uC624\uB294 \uC694\uC77C"}</span>
            <strong>{vendor.visitPattern}</strong>
          </div>
          <div className="info-row">
            <span>{"\uC6B4\uC601 \uC2DC\uAC04"}</span>
            <strong>{vendor.businessHours}</strong>
          </div>
        </div>

        <div className="section-block">
          <p className="section-label">{"\uC624\uB298 \uC81C\uBCF4 \uC694\uC57D"}</p>
          <div className="report-grid">
            <div>
              <strong>{vendor.reportCounts.open}</strong>
              <span>{"\uC601\uC5C5\uC911"}</span>
            </div>
            <div>
              <strong>{vendor.reportCounts.notYet}</strong>
              <span>{"\uC544\uC9C1 \uC548 \uC634"}</span>
            </div>
            <div>
              <strong>{vendor.reportCounts.closed}</strong>
              <span>{"\uC601\uC5C5\uC885\uB8CC"}</span>
            </div>
          </div>
        </div>

        <div className="section-block">
          <p className="section-label">{"\uC74C\uC2DD \uB9AC\uBDF0"}</p>
          <div className="review-list">
            {vendor.reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-head">
                  <span>{review.author}</span>
                  <span>{Array.from({ length: review.score }, () => "*").join("")}</span>
                </div>
                <p>{review.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="section-block">
          <p className="section-label">{"\uC2E4\uC2DC\uAC04 \uC81C\uBCF4"}</p>
          <div className="action-stack">
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
              {"\uC544\uC9C1 \uC548 \uC634 \uC81C\uBCF4"}
            </Button>
            <Button
              color="light"
              variant="weak"
              size="large"
              display="full"
              onClick={() => onReport(vendor.id, "closed")}
            >
              {"\uC601\uC5C5\uC885\uB8CC \uC81C\uBCF4"}
            </Button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
