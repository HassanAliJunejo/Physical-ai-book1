import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Physical AI & Humanoid Robotics
          </h1>
          <p className="hero-subtitle">
            Dive into the world of AI-powered humanoid robots, explore their design, perception, and interaction technologies.
          </p>
          <button className="hero-button">
            Start Learning
          </button>
        </div>
        <div className="hero-illustration">
          <div className="robot-placeholder">
            <div className="robot-head"></div>
            <div className="robot-body"></div>
            <div className="robot-arm-gesture"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;