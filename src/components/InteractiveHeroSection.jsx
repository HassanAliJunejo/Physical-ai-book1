import React, { useState } from 'react';
import './InteractiveHeroSection.css';

const InteractiveHeroSection = () => {
  const [showChapters, setShowChapters] = useState(false);

  const chapters = [
    "Introduction to Humanoid Robotics",
    "Robot Perception & Sensors",
    "Motion Control & Kinematics",
    "Human-Robot Interaction",
    "AI & Machine Learning in Robotics",
    "Real-world Applications"
  ];

  const handleStartLearning = () => {
    setShowChapters(!showChapters);
  };

  return (
    <section className="interactive-hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Physical AI & Humanoid Robotics
          </h1>
          <p className="hero-subtitle">
            Dive into the world of AI-powered humanoid robots, explore their design, perception, and interaction technologies.
          </p>
          <button 
            className="hero-button"
            onClick={handleStartLearning}
          >
            Start Learning
          </button>
        </div>
        <div className="hero-illustration">
          <div className="robot-container">
            <div className="robot-base">
              <div className="robot-head">
                <div className="robot-eye left-eye"></div>
                <div className="robot-eye right-eye"></div>
                <div className="robot-mouth"></div>
              </div>
              <div className="robot-neck"></div>
              <div className="robot-body">
                <div className="robot-chest">
                  <div className="robot-display"></div>
                </div>
                <div className="robot-arm left-arm"></div>
                <div className="robot-arm right-arm animated-wave"></div>
              </div>
              <div className="robot-legs">
                <div className="robot-leg left-leg"></div>
                <div className="robot-leg right-leg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showChapters && (
        <div className="chapters-container">
          <div className="chapters-content">
            <h2 className="chapters-title">Learning Path</h2>
            <div className="chapters-grid">
              {chapters.map((chapter, index) => (
                <div key={index} className="chapter-card">
                  <div className="chapter-number">{index + 1}</div>
                  <h3 className="chapter-title">{chapter}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InteractiveHeroSection;