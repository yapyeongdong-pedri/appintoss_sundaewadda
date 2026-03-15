import { BottomSheet, Button } from "@toss/tds-mobile";
import { useState } from "react";
import type { UpdateRequest } from "../types";

interface UpdateSheetProps {
  open: boolean;
  vendorId?: string;
  onClose: () => void;
  onSubmit: (draft: Omit<UpdateRequest, "id" | "submittedAt">) => void;
}

export function UpdateSheet({ open, vendorId, onClose, onSubmit }: UpdateSheetProps) {
  const [field, setField] = useState<UpdateRequest["field"]>("menu");
  const [value, setValue] = useState("");

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
      onClose={onClose}
      hasTextField
      header={<BottomSheet.Header>{"\uC815\uBCF4 \uC218\uC815 \uC694\uCCAD"}</BottomSheet.Header>}
      headerDescription={
        <BottomSheet.HeaderDescription>
          {"\uCD5C\uC885 DB\uB294 \uC6B4\uC601 \uAC80\uC218 \uD6C4 \uBC18\uC601\uB3FC\uC694."}
        </BottomSheet.HeaderDescription>
      }
      cta={
        <BottomSheet.CTA>
          <Button
            color="primary"
            variant="fill"
            size="xlarge"
            display="full"
            onClick={handleSubmit}
            disabled={vendorId == null || value.trim() === ""}
          >
            {"\uC218\uC815 \uC694\uCCAD \uBCF4\uB0B4\uAE30"}
          </Button>
        </BottomSheet.CTA>
      }
    >
      <div className="sheet-content">
        <div className="field-picker">
          {[
            ["menu", "\uBA54\uB274\uBA85"],
            ["price", "\uAC00\uACA9"],
            ["visitPattern", "\uC624\uB294 \uC694\uC77C"],
            ["businessHours", "\uC6B4\uC601 \uC2DC\uAC04"],
            ["location", "\uC704\uCE58"],
            ["phone", "\uC804\uD654\uBC88\uD638"],
            ["closedNotice", "\uC6B4\uC601 \uC885\uB8CC"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`field-chip ${field === key ? "field-chip-active" : ""}`}
              onClick={() => setField(key as UpdateRequest["field"])}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="field">
          <span>{"\uC218\uC815 \uB0B4\uC6A9"}</span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="e.g. Also comes on Saturdays around 8pm"
          />
        </label>
      </div>
    </BottomSheet>
  );
}
