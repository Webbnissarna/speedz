import { Link } from "@remix-run/react";

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
    <nav className="col-span-3 px-4 md:col-span-1">
      <ul className="flex flex-col gap-2">
        {links.map((link) => {
          return (
            <li key={`${link.href}`}>
              <Link
                className="block w-full rounded-lg border-2 border-amber-600 p-1 font-bold text-amber-400 hover:border-amber-400 hover:bg-amber-100/20 hover:underline"
                to={link.href}
                relative={link.relative}
              >
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
