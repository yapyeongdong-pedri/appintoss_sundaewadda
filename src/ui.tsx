import { ReactNode } from "react";

type ButtonColor = "primary" | "light" | "dark";
type ButtonVariant = "fill" | "weak";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  display?: "full" | "inline" | "block";
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: "large" | "xlarge" | "medium";
}

export function Button({
  children,
  onClick,
  disabled,
  display = "inline",
  color = "primary",
  variant = "fill",
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`ui-button ui-button-${color} ui-button-${variant} ui-button-${display}`}
    >
      {children}
    </button>
  );
}

interface BadgeProps {
  children: ReactNode;
  color?: "blue" | "green" | "yellow" | "elephant";
  variant?: "fill" | "weak";
  size?: "small" | "medium";
}

export function Badge({
  children,
  color = "blue",
  variant = "weak",
}: BadgeProps) {
  return <span className={`ui-badge ui-badge-${color} ui-badge-${variant}`}>{children}</span>;
}

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  header?: ReactNode;
  headerDescription?: ReactNode;
  cta?: ReactNode;
  children: ReactNode;
  hasTextField?: boolean;
  expandBottomSheet?: boolean;
}

export function BottomSheet({
  open,
  onClose,
  header,
  headerDescription,
  cta,
  children,
}: BottomSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true">
      <button type="button" className="sheet-dismiss" onClick={onClose} aria-label="Close sheet" />
      <section className="sheet-panel">
        {(header || headerDescription) && (
          <header className="sheet-panel-header">
            {header}
            {headerDescription}
          </header>
        )}
        <div className="sheet-panel-body">{children}</div>
        {cta ? <div className="sheet-panel-cta">{cta}</div> : null}
      </section>
    </div>
  );
}

BottomSheet.Header = function BottomSheetHeader({ children }: { children: ReactNode }) {
  return <h3 className="sheet-heading">{children}</h3>;
};

BottomSheet.HeaderDescription = function BottomSheetHeaderDescription({
  children,
}: {
  children: ReactNode;
}) {
  return <p className="sheet-subheading">{children}</p>;
};

BottomSheet.CTA = function BottomSheetCTA({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
};

BottomSheet.DoubleCTA = function BottomSheetDoubleCTA({
  leftButton,
  rightButton,
}: {
  leftButton: ReactNode;
  rightButton: ReactNode;
}) {
  return <div className="sheet-double-cta">{leftButton}{rightButton}</div>;
};
