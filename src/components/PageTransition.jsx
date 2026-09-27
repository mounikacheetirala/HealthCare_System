import { useLocation } from 'react-router-dom';

/**
 * Re-mounts its children with a short fade/lift whenever the route changes.
 *
 * `routeKey` lets you decide what counts as "a different page". By default it's the full pathname.
 * (App.jsx uses it so moving between dashboard tabs doesn't re-animate the sidebar.)
 */
export default function PageTransition({ children, routeKey, className = '' }) {
  const { pathname } = useLocation();
  const key = routeKey ? routeKey(pathname) : pathname;
  return (
    <div key={key} className={`page-enter ${className}`.trim()}>
      {children}
    </div>
  );
}
