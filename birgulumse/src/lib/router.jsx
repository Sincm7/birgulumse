import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const RouterContext = createContext({
  pathname: '/',
  params: {},
  navigate: () => {},
  replace: () => {},
  setParams: () => {}
});

const normalizePath = (path) => {
  if (!path) return '/';
  if (path.startsWith('http')) return path;
  const trimmed = path.startsWith('/') ? path : `/${path}`;
  return trimmed === '//' ? '/' : trimmed.replace(/\/+/g, '/');
};

const splitPath = (path) => {
  const normalized = normalizePath(path);
  const trimmed = normalized.replace(/^\/+|\/+$/g, '');
  return trimmed ? trimmed.split('/') : [];
};

const matchPath = (routePath = '*', currentPath = '/') => {
  if (routePath === '*') {
    return { params: {} };
  }

  const routeSegments = splitPath(routePath);
  const pathSegments = splitPath(currentPath);

  if (routeSegments.length !== pathSegments.length) {
    return null;
  }

  const params = {};

  for (let index = 0; index < routeSegments.length; index += 1) {
    const routeSegment = routeSegments[index];
    const pathSegment = pathSegments[index];

    if (routeSegment.startsWith(':')) {
      params[routeSegment.slice(1)] = decodeURIComponent(pathSegment);
      continue;
    }

    if (routeSegment !== pathSegment) {
      return null;
    }
  }

  return { params };
};

export function BrowserRouter({ children }) {
  const getInitialPath = () => {
    if (typeof window === 'undefined') {
      return '/';
    }

    return window.location.pathname || '/';
  };

  const [pathname, setPathname] = useState(getInitialPath);
  const [params, setParams] = useState({});

  const navigate = useCallback((to, options = {}) => {
    const target = normalizePath(to);

    if (typeof window === 'undefined') {
      setPathname(target);
      return;
    }

    const method = options.replace ? 'replaceState' : 'pushState';
    window.history[method](null, '', target);
    setPathname(target);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const contextValue = useMemo(
    () => ({
      pathname,
      params,
      navigate,
      replace: (to) => navigate(to, { replace: true }),
      setParams
    }),
    [navigate, params, pathname]
  );

  return <RouterContext.Provider value={contextValue}>{children}</RouterContext.Provider>;
}

export function Routes({ children }) {
  const { pathname, setParams } = useContext(RouterContext);

  const match = useMemo(() => {
    const routeElements = Children.toArray(children);

    for (const child of routeElements) {
      if (!isValidElement(child)) {
        continue;
      }

      const { path = '*', element = null } = child.props || {};
      const result = matchPath(path, pathname);

      if (result) {
        return { element, params: result.params };
      }
    }

    return null;
  }, [children, pathname]);

  useEffect(() => {
    setParams(match?.params ?? {});
  }, [match, setParams]);

  if (!match) {
    return null;
  }

  return isValidElement(match.element) ? cloneElement(match.element) : match.element;
}

export function Route() {
  return null;
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return useCallback((to, options) => navigate(to, options), [navigate]);
}

export function Navigate({ to, replace = false }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}

export function useParams() {
  const { params } = useContext(RouterContext);
  return params;
}

export function Link({ to, onClick, children, ...rest }) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (event) => {
      if (onClick) {
        onClick(event);
      }

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      event.preventDefault();
      navigate(to);
    },
    [navigate, onClick, to]
  );

  return (
    <a href={normalizePath(to)} {...rest} onClick={handleClick}>
      {children}
    </a>
  );
}

export function NavLink({ to, className, children, ...rest }) {
  const { pathname } = useContext(RouterContext);
  const normalized = normalizePath(to);
  const isActive = pathname === normalized || (normalized !== '/' && pathname.startsWith(`${normalized}/`));

  const computedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link to={to} {...rest} className={computedClassName} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  );
}

export function Outlet({ children }) {
  return children ?? null;
}

export function useLocation() {
  const { pathname } = useContext(RouterContext);
  return { pathname };
}
