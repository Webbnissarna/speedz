import { Outlet } from "@remix-run/react";
import { Layout } from "~/components/layout";

export default function HoNIndex() {
  return (
    <Layout
      subheading={{ title: "Heroes of Newerth", href: "heroes-of-newerth" }}
    >
      <Layout.Body>
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout.Body>
    </Layout>
  );
}
