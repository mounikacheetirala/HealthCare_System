import { NavLink } from 'react-router-dom';

export default function Sidebar({ sections }) {
  return (
    <aside className="sidebar">
      {sections.map((section) => (
        <div key={section.label || 'main'}>
          {section.label && <div className="sidebar-section-label">{section.label}</div>}
          {section.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  );
}
