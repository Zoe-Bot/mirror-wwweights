import { NextPage } from "next";
import Head from "next/head";
import { Button } from "../components/Button/Button";
import { routes } from "../services/routes/routes";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>WWWeights | Development</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main className="container">
        <Button className="mb-2" to={routes.weights.list()} icon="list">Weights List</Button>
        <Button to={routes.tags.list()} icon="bookmark">Tags List</Button>
      </main>
    </div>
  )
}

export default Home
