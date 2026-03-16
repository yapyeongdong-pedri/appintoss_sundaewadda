import { getStatusLabel } from "../lib/status";
import type { VendorSummary } from "../types";

interface NeighborhoodMapProps {
  vendors: VendorSummary[];
  selectedVendorId?: string;
  onSelect: (vendorId: string) => void;
}

export function NeighborhoodMap({
  vendors,
  selectedVendorId,
  onSelect,
}: NeighborhoodMapProps) {
  return (
    <section className="map-card">
      <div className="map-surface" aria-label="local truck map">
        <div className="street street-horizontal" />
        <div className="street street-vertical" />
        {vendors.map((vendor) => (
          <button
            key={vendor.id}
            type="button"
            className={`pin pin-${vendor.status} ${selectedVendorId === vendor.id ? "pin-selected" : ""}`}
            style={{ left: `${vendor.position.x}%`, top: `${vendor.position.y}%` }}
            onClick={() => onSelect(vendor.id)}
            aria-label={`${vendor.name}, ${getStatusLabel(vendor.status)}`}
          >
            <span className="pin-dot" />
            <span className="pin-label">{vendor.name}</span>
          </button>
        ))}
      </div>
      <div className="map-legend">
        <span>
          <i className="legend-dot legend-open" /> {"\uC601\uC5C5\uC911"}
        </span>
        <span>
          <i className="legend-dot legend-closed" /> {"\uC601\uC5C5\uC885\uB8CC"}
        </span>
        <span>
          <i className="legend-dot legend-unknown" /> {"\uD655\uC778 \uC81C\uBCF4 \uD544\uC694"}
        </span>
      </div>
    </section>
  );
}
