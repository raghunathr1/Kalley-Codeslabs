import { useState } from "react";
import {
  FiZap,
  FiBarChart2,
  FiCpu,
  FiGlobe,
  FiCode,
  FiSettings,
} from "react-icons/fi";

const icons = {
  zap: FiZap,
  analytics: FiBarChart2,
  ai: FiCpu,
  web: FiGlobe,
  software: FiCode,
  consulting: FiSettings,
};

function ServiceCard({ icon, title, description }) {
  const [flipped, setFlipped] = useState(false);

  const Icon = icons[icon];

  return (
    <div
      className={`service-card-wrapper ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="service-card">

        {/* Front */}
        <div className="service-card-front">
          <div className="service-icon">
            <Icon />
          </div>

          <h3>{title}</h3>

          <span className="card-hint">
            Click to explore →
          </span>
        </div>

        {/* Back */}
        <div className="service-card-back">
          <div className="service-icon">
            <Icon />
          </div>

          <h3>{title}</h3>

          <p>{description}</p>

          <span className="card-hint">
            Click to flip back
          </span>
        </div>

      </div>
    </div>
  );
}

export default ServiceCard;