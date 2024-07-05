import type { NextPage } from "next";
import Head from "next/head";

import Flow from "components/Flow/Flow";

import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { fileName } = router.query;

  return (
    <div className={styles.container}>
      <Head>
        <title>React Flow Editor</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <header className={styles.header}>React Flow - Next.js Example</header> */}
      <Flow fileName={fileName as string} />
    </div>
  );
};

export default Home;
