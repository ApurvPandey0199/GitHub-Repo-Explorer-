import React from 'react';
import { Search, Github, Sparkles } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="glass-card empty-container fade-in">
      <div className="empty-glow-circle">
        <Github size={48} className="empty-icon" />
      </div>
      <h2 className="empty-title">GitHub Repository Explorer</h2>
      <p className="empty-subtitle">
        Search for a GitHub user or organization to explore their profile details, repository breakdowns, and visual language statistics.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
        <span>Try searching for users like <strong>gaearon</strong> or <strong>yyx990803</strong></span>
      </div>
    </div>
  );
};

export default EmptyState;
