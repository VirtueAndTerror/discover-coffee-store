import { useState } from "react";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setisFindingLocation] = useState(false);

  const success = position => {
    const { latitude, longitude } = position.coords;

    setLatLong(`${latitude}, ${longitude}`);
    setLocationErrorMsg("");
    setisFindingLocation(false);
  };

  const error = () => {
    setisFindingLocation(false);
    setLocationErrorMsg("Unable to retreave your location");
  };

  const handleTrackLocation = () => {
    setisFindingLocation(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
    } else {
      //   status.textContext = "Locating";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    latLong,
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useTrackLocation;
