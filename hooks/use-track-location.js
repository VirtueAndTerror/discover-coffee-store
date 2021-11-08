import { useState } from 'react';
import { ActionTypes, useStoreContext } from '../store/store-context';

const useTrackLocation = () => {
  const { dispatch } = useStoreContext();
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [locationErrorMsg, setLocationErrorMsg] = useState('');

  const handleTrackLocation = () => {
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setIsFindingLocation(false);
      setLocationErrorMsg('Geolocation is not supported by your browser');

      dispatch({
        type: ActionTypes.SET_LAT_LONG,
        payload: { isFindingLocation, locationErrorMsg },
      });
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const success = position => {
    const { latitude, longitude } = position.coords;

    dispatch({
      type: ActionTypes.SET_LAT_LONG,
      payload: {
        latLong: `${latitude}, ${longitude}`,
        isFindingLocation: false,
        locationErrorMsg: '',
      },
    });
  };

  const error = () => {
    dispatch({
      type: ActionTypes.SET_LAT_LONG,
      payload: {
        isFindingLocation: false,
        locationErrorMsg: 'Unable to retreave your location',
      },
    });
  };

  return {
    handleTrackLocation,
  };
};

export default useTrackLocation;
