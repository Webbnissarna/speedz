import Link from "../Link";

export type NavigationLink = {
  href: string;
  title: string;
  relative: "route" | "path";
};

type NavigationProps = {
  links: Array<NavigationLink>;
};

export default function Navigation({ links }: NavigationProps) {
  return (
    <nav className="col-span-3 md:col-span-1">
      <ul className="grid grid-cols-1 gap-2">
        {links.map((link) => {
          return (
            <li key={`${link.href}`} className="col-span-1">
              <Link to={link.href} relative={link.relative}>
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
