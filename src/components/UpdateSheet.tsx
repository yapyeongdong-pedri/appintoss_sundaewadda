import { useState } from "react";
import type { UpdateRequest } from "../types";
import { BottomSheet, Button } from "../ui";

interface UpdateSheetProps {
  open: boolean;
  vendorId?: string;
  onClose: () => void;
  onSubmit: (draft: Omit<UpdateRequest, "id" | "submittedAt">) => void;
}

const FIELD_OPTIONS: Array<{ key: UpdateRequest["field"]; label: string }> = [
  { key: "menu", label: "\uBA54\uB274" },
  { key: "price", label: "\uAC00\uACA9" },
  { key: "visitPattern", label: "\uC624\uB294 \uC694\uC77C" },
  { key: "businessHours", label: "\uC6B4\uC601 \uC2DC\uAC04" },
  { key: "location", label: "\uC704\uCE58" },
  { key: "phone", label: "\uC804\uD654\uBC88\uD638" },
  { key: "closedNotice", label: "\uC601\uC5C5 \uC885\uB8CC" },
];

function getFieldPlaceholder(field: UpdateRequest["field"]) {
  switch (field) {
    case "menu":
      return "\uC608: \uCC30\uC21C\uB300, \uC624\uB385, \uB0B4\uC7A5\uD0D5 \uD310\uB9E4";
    case "price":
      return "\uC608: \uCC30\uC21C\uB300 4,000\uC6D0, \uB0B4\uC7A5\uBAA8\uB4EC 7,000\uC6D0";
    case "visitPattern":
      return "\uC608: \uD654/\uBAA9/\uD1A0 \uC800\uB141";
    case "businessHours":
      return "\uC608: \uC624\uD6C4 6\uC2DC ~ \uBC24 11\uC2DC";
    case "location":
      return "\uC608: \uC815\uB989\uC2DC\uC7A5 \uC785\uAD6C \uC55E";
    case "phone":
      return "\uC608: 010-1234-5678";
    case "closedNotice":
      return "\uC608: \uC694\uC998\uC740 \uC774 \uC790\uB9AC\uC5D0 \uC624\uC9C0 \uC54A\uC544\uC694";
    default:
      return "\uC218\uC815\uD560 \uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694";
  }
}

export function UpdateSheet({ open, vendorId, onClose, onSubmit }: UpdateSheetProps) {
  const [field, setField] = useState<UpdateRequest["field"]>("menu");
  const [value, setValue] = useState("");

  const handleClose = () => {
    setValue("");
    setField("menu");
    onClose();
  };

  const handleSubmit = () => {
    if (vendorId == null || value.trim() === "") {
      return;
    }

    onSubmit({ vendorId, field, value });
    setValue("");
    setField("menu");
  };

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      hasTextField
      header={<BottomSheet.Header>{"\uC815\uBCF4 \uC218\uC815 \uC694\uCCAD"}</BottomSheet.Header>}
      headerDescription={
        <BottomSheet.HeaderDescription>
          {"\uCD5C\uC885 DB\uB294 \uC6B4\uC601 \uAC80\uC218 \uD6C4 \uBC18\uC601\uB3FC\uC694."}
        </BottomSheet.HeaderDescription>
      }
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="light" variant="weak" size="large" display="full" onClick={handleClose}>
              {"\uCDE8\uC18C"}
            </Button>
          }
          rightButton={
            <Button
              color="primary"
              variant="fill"
              size="large"
              display="full"
              onClick={handleSubmit}
              disabled={vendorId == null || value.trim() === ""}
            >
              {"\uC218\uC815 \uC694\uCCAD"}
            </Button>
          }
        />
      }
    >
      <div className="sheet-content">
        <div className="field-picker-grid">
          {FIELD_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`field-chip ${field === key ? "field-chip-active" : ""}`}
              onClick={() => setField(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="field">
          <span>{"\uC218\uC815\uD560 \uB0B4\uC6A9"}</span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={getFieldPlaceholder(field)}
          />
        </label>
      </div>
    </BottomSheet>
  );
}
