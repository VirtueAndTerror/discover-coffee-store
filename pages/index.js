import { useEffect, useState } from 'react';
import { ActionTypes, useStoreContext } from '../store/store-context';
import Head from 'next/head';
import Image from 'next/image';

import Banner from '../components/banner';
import Card from '../components/card';

import fetchCoffeeSotres from '../lib/coffee-stores';

import useTrackLocation from '../hooks/use-track-location';

import styles from '../styles/Home.module.css';

//Server side
export async function getStaticProps(context) {
  //This getStaticProps function runs only at build time in the server side.
  const coffeeStores = await fetchCoffeeSotres();

  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}

//Client side
const Home = props => {
  // Gets location and stores it in storeCotext
  const { handleTrackLocation } = useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useStoreContext();

  const { coffeeStores, latLong, isFindingLocation, locationErrorMsg } = state;

  useEffect(() => {
    async function fetchData() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30` // Make limit's value dynamic
          );

          const coffeeStores = await response.json();

          dispatch({
            type: ActionTypes.SET_COFFEE_STORES,
            payload: coffeeStores,
          });
          setCoffeeStoresError('');
        } catch (error) {
          console.log({ error });
          setCoffeeStoresError(error.message);
        }
      }
    }
    fetchData();
  }, [latLong, dispatch]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel='icon' href='/favicon.ico' />

        <meta
          name='description'
          content='Allows you to discover coffee stores.'
        />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />

        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError} </p>}

        <div className={styles.heroImage}>
          <Image
            src='/static/hero-image.png'
            width={700}
            height={400}
            alt='hero-image'
          />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.headding2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(({ name, imgUrl, id }) => (
                <Card
                  key={id}
                  className={styles.card}
                  name={name}
                  imgUrl={imgUrl}
                  href={`/coffee-store/${id}`}
                />
              ))}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.headding2}>Toronto Coffee Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map(({ name, imgUrl, id }) => (
                <Card
                  key={id}
                  className={styles.card}
                  name={name}
                  imgUrl={imgUrl}
                  href={`/coffee-store/${id}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
