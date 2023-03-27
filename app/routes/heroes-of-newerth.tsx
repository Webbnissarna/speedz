import { Outlet } from "@remix-run/react";
import { Layout } from "~/components/layout";

export default function HoNIndex() {
  return (
    <Layout header="Speedz" game="Heroes of Newerth">
      <Layout.Body>
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout.Body>
    </Layout>
  );
}
