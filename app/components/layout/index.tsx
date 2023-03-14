import React from "react";
import Body from "./Body";
import Content from "./Content";
import Navigation from "./Navigation";
import UserNavigation from "./UserNavigation";

type LayoutProps = {
  children: React.ReactNode;
  header: string;
  userNavigation?: boolean;
  game?: string;
};

export function Layout({
  children,
  header,
  userNavigation = true,
  game,
}: LayoutProps) {
  return (
    <div className="p-4 md:p-6" id="layout-container">
      <div className="grid grid-cols-3 items-center justify-center">
        <h1 className="typo-h1 col-span-3 text-center md:col-span-1 md:col-start-2">
          {header}
        </h1>
        {game ? <h2 className="col-span-3 pt-4 text-center">{game}</h2> : null}
        {userNavigation && <UserNavigation />}
      </div>
      {children}
    </div>
  );
}

Layout.Content = Content;
Layout.Navigation = Navigation;
Layout.Body = Body;
