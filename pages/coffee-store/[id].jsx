import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';

import styles from '../../styles/coffee-store.module.css';
import fetchCoffeeStores from '../../lib/coffee-stores';

import { useStoreContext } from '../../store/store-context';

import { isEmpty, findCoffeStoreById, customFetch } from '../../utils';

// SSG Props
export async function getStaticProps(staticProps) {
  const { id } = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();

  const coffeeStore = (await findCoffeStoreById(coffeeStores, id)) || {};

  return {
    props: {
      coffeeStore,
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
// Component
const CoffeeStore = initialProps => {
  const {
    isFallback,
    query: { id },
  } = useRouter();

  if (isFallback) return <div>Loading...</div>;

  // Default: SSG Props to Local State
  const [localStateCoffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore
  );

  // Context State to Props
  const {
    state: { coffeeStores },
  } = useStoreContext();

  // Component Method: Sends new coffee store to API
  const handleCreateCoffeStore = async coffeeStore => {
    try {
      const { id, name, imgUrl, neighborhood, address } = coffeeStore;

      await customFetch('/api/createCoffeeStore', 'POST', {
        id,
        name,
        imgUrl,
        votes: 0,
        neighborhood: neighborhood || '',
        address: address || '',
      });
    } catch (error) {
      console.log('Error creating coffee store', error);
    }
  };

  // Look for coffee store in SSG props, or storeContext, then save to DB.
  useEffect(() => {
    async function fetchData() {
      // If SSG props are empty, retrieve it from Context API
      if (isEmpty(initialProps.coffeeStore)) {
        // if storeContex is not empty, go find this coffee store by id
        if (coffeeStores.length) {
          const ctxCoffeeStore = await findCoffeStoreById(coffeeStores, id);
          // if found coffee sotre by id, update local state and save to DB
          if (ctxCoffeeStore) {
            setCoffeeStore(ctxCoffeeStore);
            handleCreateCoffeStore(ctxCoffeeStore);
          }
        }
      } else {
        // if SSG is not empty, save SSG conffee sotre to DB
        handleCreateCoffeStore(initialProps.coffeeStore);
      }
    }

    fetchData();
  }, [id, initialProps, initialProps.coffeeStore, coffeeStores]);

  // Local State
  const { name, address, neighborhood, imgUrl } = localStateCoffeeStore;

  const [votesCount, setVotesCount] = useState(0);

  // SWR config
  const fetcher = url => fetch(url).then(res => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  //SWR
  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotesCount(data[0].votes);
    }
  }, [data]);

  // Upvote Event Handler
  const handleUpvoteButton = async () => {
    try {
      const response = await customFetch('/api/upvoteCoffeeStoreById', 'PUT', {
        id,
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length) {
        let count = votesCount + 1;
        setVotesCount(count);
      }
    } catch (error) {
      console.log('Error while upvoting coffee store', error);
    }
  };

  if (error) {
    return <div>Something went wrong while retrieving cofee store page.</div>;
  }
  if (!data) return <div>Loading data...</div>;

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
            <p className={styles.text}>{votesCount}</p>
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
