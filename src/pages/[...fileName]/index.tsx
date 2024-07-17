import type { NextPage } from 'next';
import Head from 'next/head';

import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import CircuitEditor from 'components/Pages/CircuitEditor';
import path from 'path';

const Home: NextPage = () => {
	const router = useRouter();
	let { fileName } = router.query;

	if (typeof fileName === 'string') fileName = [fileName];

	if (!fileName) {
		return 'Error: Should not get here';
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>Circiut: {fileName.slice(-1)}</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			{/* <header className={styles.header}>React Flow - Next.js Example</header> */}
			<CircuitEditor fileName={path.join(...fileName)} />
		</div>
	);
};

export default Home;