import { ChangeEvent, useEffect, useRef, useState } from "react";
import { readFilesAsDataUrls } from "../lib/imageFiles";
import type { UpdateRequest, VendorSummary } from "../types";
import { BottomSheet, Button } from "../ui";

interface UpdateSheetProps {
  open: boolean;
  vendorId?: string;
  vendor?: VendorSummary;
  onClose: () => void;
  onSubmit: (draft: Omit<UpdateRequest, "id" | "submittedAt">) => Promise<void>;
}

const FIELD_OPTIONS: Array<{ key: UpdateRequest["field"]; label: string }> = [
  { key: "menuBoard", label: "\uBA54\uB274\uD310 \uAD50\uCCB4" },
  { key: "visitPattern", label: "\uC624\uB294 \uC694\uC77C" },
  { key: "businessHours", label: "\uC6B4\uC601 \uC2DC\uAC04" },
  { key: "location", label: "\uC704\uCE58" },
  { key: "phone", label: "\uC804\uD654\uBC88\uD638" },
  { key: "closedNotice", label: "\uD3D0\uC5C5\uC2E0\uACE0" },
];

function getFieldPlaceholder(field: UpdateRequest["field"]) {
  switch (field) {
    case "menuBoard":
      return "\uC608: \uAC00\uACA9\uC774 \uBC14\uB00C\uACE0 \uCD5C\uC2E0 \uBA54\uB274\uD310\uC73C\uB85C \uBC14\uAFD4\uC694";
    case "visitPattern":
      return "\uC608: \uD654/\uBAA9/\uD1A0 \uC800\uB141";
    case "businessHours":
      return "\uC608: \uC624\uD6C4 6\uC2DC ~ \uBC24 11\uC2DC";
    case "location":
      return "\uC608: \uC815\uB989\uC2DC\uC7A5 \uC785\uAD6C \uC55E";
    case "phone":
      return "\uC608: 010-1234-5678";
    case "closedNotice":
      return "\uC608: \uC694\uC998 \uC774 \uC790\uB9AC\uC5D0\uC11C \uBCF4\uAE30 \uD798\uB4E4\uC5B4\uC694";
    default:
      return "\uC218\uC815\uD560 \uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694";
  }
}

function getCurrentFieldValue(vendor: VendorSummary | undefined, field: UpdateRequest["field"]) {
  if (vendor == null) {
    return "";
  }

  switch (field) {
    case "visitPattern":
      return vendor.visitPattern;
    case "businessHours":
      return vendor.businessHours;
    case "location":
      return vendor.position.address;
    case "phone":
      return vendor.phone;
    case "closedNotice":
      return "\uD604\uC7AC \uC601\uC5C5 \uC885\uB8CC \uC815\uBCF4 \uC5C6\uC74C";
    default:
      return "";
  }
}

export function UpdateSheet({ open, vendorId, vendor, onClose, onSubmit }: UpdateSheetProps) {
  const [field, setField] = useState<UpdateRequest["field"]>("menuBoard");
  const [value, setValue] = useState("");
  const [menuBoardPhotos, setMenuBoardPhotos] = useState(["", "", ""]);
  const menuBoardInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setField("menuBoard");
    setValue("");
    setMenuBoardPhotos(["", "", ""]);
  }, [open]);

  useEffect(() => {
    if (!open || field === "menuBoard") {
      return;
    }

    setValue(getCurrentFieldValue(vendor, field));
  }, [field, open, vendor]);

  const handleMenuBoardSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null || event.target.files.length === 0) {
      return;
    }

    const images = await readFilesAsDataUrls(event.target.files);
    if (images.length > 0) {
      setMenuBoardPhotos(images.slice(0, 3).concat(["", "", ""]).slice(0, 3));
    }
    event.target.value = "";
  };

  const handleClose = () => {
    setValue("");
    setField("menuBoard");
    setMenuBoardPhotos(["", "", ""]);
    onClose();
  };

  const handleSubmit = async () => {
    if (vendorId == null) {
      return;
    }

    if (field === "menuBoard") {
      const nextPhotos = menuBoardPhotos.map((item) => item.trim()).filter(Boolean);
      if (value.trim() === "" || nextPhotos.length === 0) {
        return;
      }

      await onSubmit({
        vendorId,
        field,
        value: value.trim(),
        menuBoardPhotos: nextPhotos,
      });
      handleClose();
      return;
    }

    if (value.trim() === "") {
      return;
    }

    await onSubmit({ vendorId, field, value });
    handleClose();
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
              disabled={
                vendorId == null ||
                (field === "menuBoard"
                  ? value.trim() === "" || menuBoardPhotos.every((item) => item.trim() === "")
                  : value.trim() === "")
              }
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
              onClick={() => {
                setField(key);
                setValue("");
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {field === "menuBoard" ? (
          <>
            <label className="field">
              <span>{"\uAD50\uCCB4 \uC0AC\uC720"}</span>
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={getFieldPlaceholder(field)}
              />
            </label>

            <div className="field">
              <span>{"\uCD5C\uC2E0 \uBA54\uB274\uD310 \uC0AC\uC9C4"}</span>
              <input
                ref={menuBoardInputRef}
                className="hidden-file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleMenuBoardSelect}
              />
              <div className="photo-upload-stack">
                <Button
                  color="light"
                  variant="fill"
                  size="large"
                  display="full"
                  onClick={() => menuBoardInputRef.current?.click()}
                >
                  {"\uCD5C\uC2E0 \uBA54\uB274\uD310 \uCD5C\uB300 3\uC7A5 \uC120\uD0DD"}
                </Button>
                {menuBoardPhotos.some((item) => item !== "") ? (
                  <div className="photo-preview-grid">
                    {menuBoardPhotos
                      .filter(Boolean)
                      .map((photo, index) => (
                        <div className="photo-preview-card" key={`update-menu-board-preview-${index}`}>
                          <img src={photo} alt={`\uBA54\uB274\uD310 \uBBF8\uB9AC\uBCF4\uAE30 ${index + 1}`} />
                        </div>
                      ))}
                  </div>
                ) : null}
              </div>
              <small className="field-help">
                {"\uBA54\uB274\uC640 \uAC00\uACA9\uC774 \uC798 \uBCF4\uC774\uB294 \uCD5C\uC2E0 \uBA54\uB274\uD310 \uC0AC\uC9C4\uC744 \uC62C\uB824\uC8FC\uC138\uC694."}
              </small>
            </div>
          </>
        ) : (
          <>
            <label className="field">
              <span>{"\uC218\uC815\uD560 \uB0B4\uC6A9"}</span>
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={getFieldPlaceholder(field)}
              />
              {field === "location" ? (
                <small className="field-help">
                  {"\uC785\uB825\uD55C \uC704\uCE58\uB97C \uAE30\uC900\uC73C\uB85C \uCE74\uCE74\uC624\uB9F5 \uC88C\uD45C\uB97C \uD568\uAED8 \uC800\uC7A5\uD574\uC694."}
                </small>
              ) : null}
            </label>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
