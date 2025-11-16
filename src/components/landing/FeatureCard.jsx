// src/components/landing/FeatureCard.jsx
import React from "react";

const FeatureCard = ({ Icon, title, description, styleClass = "" }) => (
  <div
    className={`card h-100 text-center p-4 rounded-4 border-0 ${styleClass}`}
  >
    <div className="card-body">
      <Icon size={32} className="mb-3 floating-animation text-gradient" />
      <h5 className="card-title mb-3">{title}</h5>
      <p className="card-text">{description}</p>
    </div>
  </div>
);

export default FeatureCard;
