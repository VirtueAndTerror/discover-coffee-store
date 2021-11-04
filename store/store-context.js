import { createContext, useReducer, useContext } from "react";

export const StoreContext = createContext();

export const useStoreContext = () => useContext(StoreContext);

export const ActionTypes = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LAT_LONG:
      return { ...state, latLong: action.payload };

    case ActionTypes.SET_COFFEE_STORES:
      return { ...state, coffeeStores: action.payload };

    default:
      throw new Error(`Unhandeled action type: ${action.type}`);
  }
};

const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    coffeeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
