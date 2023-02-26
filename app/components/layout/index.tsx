import React from "react";
import Body from "./Body";
import Content from "./Content";
import Navigation from "./Navigation";
import UserNavigation from "./UserNavigation";

type LayoutProps = {
  children: React.ReactNode;
  header: string;
  userNavigation?: boolean;
};

export function Layout({
  children,
  header,
  userNavigation = true,
}: LayoutProps) {
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-3 items-center justify-center">
        <h1 className="text-gradient col-span-3 flex h-[4rem] animate-gradient justify-center text-5xl md:col-span-1 md:col-start-2">
          {header}
        </h1>
        {userNavigation && <UserNavigation />}
      </div>
      {children}
    </div>
  );
}

Layout.Content = Content;
Layout.Navigation = Navigation;
Layout.Body = Body;
