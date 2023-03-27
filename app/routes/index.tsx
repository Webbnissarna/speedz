import { Layout } from "~/components/layout";
import Link from "~/components/Link";

export default function Index() {
  return (
    <Layout>
      <div>
        <h2 className="typo-h2 pt-6 pb-4 text-center">Games</h2>
        <Link to={"/heroes-of-newerth"}>Heroes of Newerth</Link>
      </div>
    </Layout>
  );
}
