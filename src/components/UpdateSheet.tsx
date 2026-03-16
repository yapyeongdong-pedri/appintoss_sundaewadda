import { useEffect, useMemo, useState } from "react";
import type { MenuCategory, MenuItem, UpdateRequest, VendorSummary } from "../types";
import { BottomSheet, Button } from "../ui";

interface UpdateSheetProps {
  open: boolean;
  vendorId?: string;
  vendor?: VendorSummary;
  onClose: () => void;
  onSubmit: (draft: Omit<UpdateRequest, "id" | "submittedAt">) => Promise<void>;
}

const FIELD_OPTIONS: Array<{ key: UpdateRequest["field"]; label: string }> = [
  { key: "menu", label: "\uBA54\uB274/\uAC00\uACA9" },
  { key: "visitPattern", label: "\uC624\uB294 \uC694\uC77C" },
  { key: "businessHours", label: "\uC6B4\uC601 \uC2DC\uAC04" },
  { key: "location", label: "\uC704\uCE58" },
  { key: "phone", label: "\uC804\uD654\uBC88\uD638" },
  { key: "closedNotice", label: "\uD3D0\uC5C5\uC2E0\uACE0" },
];

const MENU_CATEGORY_OPTIONS: MenuCategory[] = [
  "\uC21C\uB300",
  "\uACF1\uCC3D",
  "\uD1B5\uB2ED",
  "\uC0BC\uACB9\uC0B4",
  "\uBAA9\uC0B4",
  "\uD0C0\uCF54\uC57C\uB07C",
  "\uAE30\uD0C0",
];

function getFieldPlaceholder(field: UpdateRequest["field"]) {
  switch (field) {
    case "menu":
      return "\uBA3C\uC800 \uBA54\uB274\uB97C \uACE0\uB974\uACE0 \uC218\uC815\uD560 \uBA54\uB274\uBA85\uACFC \uAC00\uACA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694";
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

function buildFallbackMenuItems(vendor: VendorSummary | undefined): MenuItem[] {
  if (vendor == null) {
    return [];
  }

  if (vendor.menuItems?.length > 0) {
    return vendor.menuItems;
  }

  const prices = vendor.priceSummary
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  return vendor.menuSummary.map((name, index) => ({
    name,
    price: prices[index] ?? prices[prices.length - 1] ?? "-",
    category: "\uAE30\uD0C0",
  }));
}

export function UpdateSheet({ open, vendorId, vendor, onClose, onSubmit }: UpdateSheetProps) {
  const [field, setField] = useState<UpdateRequest["field"]>("menu");
  const [value, setValue] = useState("");
  const [menuCategory, setMenuCategory] = useState<MenuCategory>("\uAE30\uD0C0");
  const [selectedMenuName, setSelectedMenuName] = useState("");
  const [menuNameDraft, setMenuNameDraft] = useState("");
  const [menuPriceDraft, setMenuPriceDraft] = useState("");

  const menuItems = useMemo(() => buildFallbackMenuItems(vendor), [vendor]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setField("menu");
    setValue("");

    if (menuItems.length > 0) {
      const firstMenu = menuItems[0];
      setSelectedMenuName(firstMenu.name);
      setMenuNameDraft(firstMenu.name);
      setMenuPriceDraft(firstMenu.price);
      setMenuCategory(firstMenu.category);
      return;
    }

    setSelectedMenuName("");
    setMenuNameDraft("");
    setMenuPriceDraft("");
    setMenuCategory("\uAE30\uD0C0");
  }, [menuItems, open]);

  useEffect(() => {
    if (!open || field === "menu") {
      return;
    }

    setValue(getCurrentFieldValue(vendor, field));
  }, [field, open, vendor]);

  const handleClose = () => {
    setValue("");
    setField("menu");
    setSelectedMenuName("");
    setMenuNameDraft("");
    setMenuPriceDraft("");
    setMenuCategory("\uAE30\uD0C0");
    onClose();
  };

  const handleSubmit = async () => {
    if (vendorId == null) {
      return;
    }

    if (field === "menu") {
      const currentMenu = menuItems.find((item) => item.name === selectedMenuName);

      if (currentMenu == null || menuNameDraft.trim() === "" || menuPriceDraft.trim() === "") {
        return;
      }

      await onSubmit({
        vendorId,
        field,
        value: `\uB300\uC0C1 \uBA54\uB274: ${currentMenu.name} / \uD604\uC7AC: ${currentMenu.price} / \uC81C\uC548 \uBA54\uB274: ${menuNameDraft.trim()} / \uC81C\uC548 \uAC00\uACA9: ${menuPriceDraft.trim()}`,
        menuCategory,
        targetMenuName: currentMenu.name,
        currentMenuName: currentMenu.name,
        currentMenuPrice: currentMenu.price,
        proposedMenuName: menuNameDraft.trim(),
        proposedMenuPrice: menuPriceDraft.trim(),
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
                (field === "menu"
                  ? selectedMenuName === "" || menuNameDraft.trim() === "" || menuPriceDraft.trim() === ""
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

        {field === "menu" ? (
          <>
            <div className="field">
              <span>{"\uC218\uC815\uD560 \uBA54\uB274 \uC120\uD0DD"}</span>
              <div className="field-picker-grid">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={`field-chip ${selectedMenuName === item.name ? "field-chip-active" : ""}`}
                    onClick={() => {
                      setSelectedMenuName(item.name);
                      setMenuNameDraft(item.name);
                      setMenuPriceDraft(item.price);
                      setMenuCategory(item.category);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span>{"\uBA54\uB274 \uBD84\uB958"}</span>
              <div className="field-picker-grid">
                {MENU_CATEGORY_OPTIONS.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`field-chip ${menuCategory === category ? "field-chip-active" : ""}`}
                    onClick={() => setMenuCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <label className="field">
              <span>{"\uC218\uC815\uD560 \uBA54\uB274\uBA85"}</span>
              <input
                value={menuNameDraft}
                onChange={(event) => setMenuNameDraft(event.target.value)}
                placeholder="\uC608: \uCC30\uC21C\uB300"
              />
            </label>

            <label className="field">
              <span>{"\uC218\uC815\uD560 \uAC00\uACA9"}</span>
              <input
                value={menuPriceDraft}
                onChange={(event) => setMenuPriceDraft(event.target.value)}
                placeholder="\uC608: 5,000\uC6D0"
              />
            </label>
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
