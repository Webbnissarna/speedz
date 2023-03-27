import { Layout } from "~/components/layout";
import Link from "~/components/Link";

export default function Index() {
  return (
    <Layout subheading={{ title: "Games" }}>
      <Layout.Body>
        <Layout.Content>
          <Link to={"/heroes-of-newerth"}>Heroes of Newerth</Link>
        </Layout.Content>
      </Layout.Body>
    </Layout>
  );
}
