import { Link, LinkProps, useMatch, useResolvedPath } from "react-router-dom";

const TabLink: React.FC<LinkProps> = ({ children, to, ...props }) => {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: true })

    return <Link
        style={{ textDecoration: match ? "underline" : "none" }}
        to={to}
        {...props}>
        {children}
    </Link>
}

export default TabLink;