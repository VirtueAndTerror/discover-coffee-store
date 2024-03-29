import { createApi } from 'unsplash-js';

// Initializes Unsplash's API
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

// Builds a string formated as Foursquare's API requires it
function getCoffeeStoresUrls(latLong, query, limit) {
  const API_ENDPOINT_URL = 'https://api.foursquare.com/v2/venues/search';
  const client_id = process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_SECRET;
  const version = '20211129';

  return `${API_ENDPOINT_URL}?ll=${latLong}&query=${query}&client_id=${client_id}&client_secret=${client_secret}&v=${version}&limit=${limit}`;
}

// Gets photos out of Unsplash API
async function getPhotos() {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 40,
    orientation: 'portrait',
  });

  const unsplashResults = photos.response.results;

  return unsplashResults.map(result => result.urls['small']);
}

async function fetchCoffeeStores(
  latLong = '43.73849936382042, -79.36227218039721',
  limit = 6
) {
  const photos = await getPhotos();

  const response = await fetch(
    getCoffeeStoresUrls(latLong, 'coffee stores', limit)
  );

  const data = await response.json();

  return data.response.venues.map((venue, idx) => ({
    id: venue.id,
    address: venue.location.address,
    name: venue.name,
    neighborhood:
      venue.location.neighborhood || venue.location.crossStreet || '',
    imgUrl: photos[idx],
  }));
}

export default fetchCoffeeStores;
