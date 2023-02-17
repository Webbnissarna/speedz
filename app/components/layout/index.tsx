import React from "react";
import Body from "./Body";
import Content from "./Content";
import Navigation from "./Navigation";
import UserNavigation from "./UserNavigation";

type LayoutProps = {
  children: React.ReactNode;
  header: string;
};

export function Layout({ children, header }: LayoutProps) {
  return (
    <div>
      <div className="grid grid-cols-3">
        <h1 className="text-gradient col-span-1 col-start-2 flex justify-center text-5xl">
          {header}
        </h1>
        <UserNavigation />
      </div>
      {children}
    </div>
  );
}

Layout.Content = Content;
Layout.Navigation = Navigation;
Layout.Body = Body;
