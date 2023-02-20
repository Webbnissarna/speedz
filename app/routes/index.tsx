import { Layout } from "~/components/layout";
import Link from "~/components/Link";

export default function Index() {
  return (
    <Layout header="Speedz">
      <div>
        <Link to={"/heroes-of-newerth"}>Heroes of Newerth</Link>
      </div>
    </Layout>
  );
}
