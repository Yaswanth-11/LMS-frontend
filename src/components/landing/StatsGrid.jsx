// src/components/landing/StatsGrid.jsx
import React from "react";

const StatsGrid = ({ stats }) => (
  <div className="row g-4 text-center">
    {stats.map((stat, idx) => (
      <div key={idx} className="col-6 col-md-3">
        <div className="stat-card p-4 rounded-4 bg-secondary bg-opacity-10 text-light d-flex flex-column align-items-center">
          <stat.icon
            size={32}
            className="mb-3 text-gradient floating-animation"
          />
          <h3 className="fw-bold mb-1">{stat.number}</h3>
          <div className="text-light-50">{stat.label}</div>
        </div>
      </div>
    ))}
  </div>
);

export default StatsGrid;
