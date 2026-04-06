import { badgeClass } from "../utils/productBadges";

export default function ProductBadges({ badges, className = "card-badges" }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className={className}>
      {badges.map((b) => (
        <span key={b.text} className={`card-badge${badgeClass(b.variant)}`}>
          {b.text}
        </span>
      ))}
    </div>
  );
}
