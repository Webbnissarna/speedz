import React from "react";
import Body from "./Body";
import Content from "./Content";
import Navigation from "./Navigation";
import UserNavigation from "./UserNavigation";

import { useNavigate } from "@remix-run/react";

type LayoutProps = {
  children: React.ReactNode;
  userNavigation?: boolean;
  subheading?: {
    href?: string;
    title: string;
  };
};

export function Layout({
  children,
  userNavigation = true,
  subheading,
}: LayoutProps) {
  const navigate = useNavigate();
  return (
    <div className="p-4 md:p-6" id="layout-container">
      <div className="grid grid-cols-6 items-center justify-center">
        <h1
          onClick={() => {
            navigate("/");
          }}
          className="typo-h1 col-span-6 cursor-pointer text-center md:col-span-4 md:col-start-2"
        >
          Speedz
        </h1>
        {subheading ? (
          <h2
            className={`col-span-6 ${
              subheading.href && "cursor-pointer"
            } pt-4 text-center`}
            onClick={() => {
              if (subheading.href) {
                navigate(`/${subheading.href}`);
              }
            }}
          >
            {subheading.title}
          </h2>
        ) : null}
        {userNavigation && <UserNavigation />}
      </div>
      {children}
    </div>
  );
}

Layout.Content = Content;
Layout.Navigation = Navigation;
Layout.Body = Body;
