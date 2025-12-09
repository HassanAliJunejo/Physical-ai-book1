import React from 'react';
import './FooterSection.css';

const FooterSection = () => {
  // Sample chapter links - these can be updated as needed
  const chapters = [
    { name: 'Introduction to Physical AI', path: '/docs/intro' },
    { name: 'Foundations of Physical AI', path: '/docs/chapter-1' },
    { name: 'Agents & Environments', path: '/docs/chapter-2' },
    { name: 'Learning & Control', path: '/docs/chapter-3' },
    { name: 'Physical AI in the Real World', path: '/docs/chapter-4' },
  ];

  // Community links
  const communityLinks = [
    { name: 'Physical AI Forum', url: 'https://example.com/physical-ai-forum', icon: '💬' },
    { name: 'Discord', url: 'https://discordapp.com/invite/physical-ai', icon: '💬' },
    { name: 'X/Twitter', url: 'https://x.com/physical_ai', icon: '🐦' },
  ];

  // More links - including the portfolio link
  const moreLinks = [
    { name: 'GitHub', url: 'https://github.com/physical-ai/physical-ai-book', icon: '🔗' },
    { name: 'Documentation', url: '/docs', icon: '📖' },
    { name: 'Tutorials', url: '/tutorials', icon: '🎓' },
    { name: 'Portfolio', url: 'https://new-personal-portfolio-ntzg-lx6w2myvu-hassanalijunejos-projects.vercel.app/', icon: '💼' }, // Added portfolio link
  ];

  // Personal links
  const personalLinks = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/hassan-ali-junejo', icon: '👔' },
    { name: 'Twitter', url: 'https://x.com/hassan_ali_junejo', icon: '🐦' },
  ];

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Chapters Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Chapters</h3>
            <ul className="footer-links">
              {chapters.map((chapter, index) => (
                <li key={index} className="footer-link-item">
                  <a 
                    href={chapter.path} 
                    className="footer-link"
                  >
                    {chapter.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Community</h3>
            <ul className="footer-links">
              {communityLinks.map((link, index) => (
                <li key={index} className="footer-link-item">
                  <a 
                    href={link.url} 
                    className="footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="link-icon">{link.icon}</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Column */}
          <div className="footer-column">
            <h3 className="footer-heading">More</h3>
            <ul className="footer-links">
              {moreLinks.map((link, index) => (
                <li key={index} className="footer-link-item">
                  <a 
                    href={link.url} 
                    className="footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="link-icon">{link.icon}</span>
                    {link.name}
                  </a>
                </li>
              ))}
              {personalLinks.map((link, index) => (
                <li key={`personal-${index}`} className="footer-link-item">
                  <a 
                    href={link.url} 
                    className="footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="link-icon">{link.icon}</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <p className="copyright-text">
            Copyright © 2025 Physical AI Book. Built with Docusaurus. Created by Hassan Ali Junejo
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;