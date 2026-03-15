import { Badge, Button } from "@toss/tds-mobile";

interface IntroSectionProps {
  onStart: () => void;
}

export function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <section className="hero-card">
      <Badge variant="weak" color="blue" size="small">
        {"\uC2E4\uC2DC\uAC04 \uB3D9\uB124 \uD2B8\uB7ED \uD655\uC778"}
      </Badge>
      <h1 className="hero-title">{"\uC21C\uB300\uC640\uB530"}</h1>
      <p className="hero-description">
        {
          "\uC624\uB298 \uC6B0\uB9AC \uB3D9\uB124 \uC21C\uB300\uD2B8\uB7ED, \uACF1\uCC3D\uD2B8\uB7ED \uC654\uB294\uC9C0 \uD655\uC778\uD574\uC694."
        }
      </p>
      <div className="hero-tags">
        <span>{"\uC21C\uB300"}</span>
        <span>{"\uACF1\uCC3D"}</span>
        <span>{"\uC2E4\uC2DC\uAC04 \uC81C\uBCF4"}</span>
        <span>{"\uB4F1\uB85D \uC694\uCCAD"}</span>
      </div>
      <Button color="primary" variant="fill" size="xlarge" display="full" onClick={onStart}>
        {"\uC6B0\uB9AC \uB3D9\uB124 \uBCF4\uAE30"}
      </Button>
    </section>
  );
}
