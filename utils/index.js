// Checks whether the an object is empty or not.
export const isEmpty = obj => {
  return Object.keys(obj).length === 0;
};

export const findCoffeStoreById = (coffeeStores, id) =>
  coffeeStores.find(coffeeStore => coffeeStore.id.toString() === id);

export const customFetch = (url, method, values) => {
  const response = fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...values,
    }),
  });

  return response;
};
