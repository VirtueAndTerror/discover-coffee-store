import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';

import styles from '../../styles/coffee-store.module.css';
import fetchCoffeeStores from '../../lib/coffee-stores';

import { useStoreContext } from '../../store/store-context';

import { isEmpty } from '../../utils';

export async function getStaticProps(staticProps) {
  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();

  const foundCoffeeStore = coffeeStores.find(
    coffeeStore => coffeeStore.id.toString() === params.id
  );

  return {
    props: {
      coffeeStore: foundCoffeeStore ? foundCoffeeStore : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map(coffeeStore => ({
    params: {
      id: coffeeStore.id.toString(),
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = initialProps => {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  const { id } = router.query;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const {
    state: { coffeeStores },
  } = useStoreContext();

  const handleCreateCoffeStore = async coffeeStore => {
    try {
      const { id, name, imgUrl, neighborhood, address } = coffeeStore;

      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          votes: 0,
          imgUrl,
          neighborhood: neighborhood || '',
          address: address || '',
        }),
      });

      const dbCoffeeStore = response.json();
      console.log(dbCoffeeStore);
    } catch (error) {
      console.log('Error creating coffee store', error);
    }
  };

  useEffect(async () => {
    // if SSG props are empty, do this:
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const ctxCoffeeStore = await coffeeStores.find(
          coffeeStore => coffeeStore.id.toString() === id
        );

        if (ctxCoffeeStore) {
          setCoffeeStore(ctxCoffeeStore);
          handleCreateCoffeStore(ctxCoffeeStore);
        }
      }
    } else {
      // SSG
      handleCreateCoffeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  // Static Site Generated
  const { name, address, neighborhood, imgUrl } = coffeeStore;

  const [votesCount, setVotesCount] = useState(0);

  const handleUpvoteButton = () => {
    let count = votesCount + 1;
    setVotesCount(count);
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name='description' content='' />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
              <a>Back to Home</a>
            </Link>
          </div>

          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/places.svg'
              width={24}
              height={24}
              alt={address}
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/nearMe.svg'
                width={24}
                height={24}
                alt={neighborhood}
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/star.svg'
              width={24}
              height={24}
              alt='rank'
            />
            <p className={styles.text}>1</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
