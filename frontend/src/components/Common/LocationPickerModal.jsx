import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

const LocationPickerModal = ({ isOpen, onClose, onConfirm, isLoaded }) => {
  console.log("onConfirm",onConfirm);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const autocompleteRef = useRef(null);
  const placesServiceRef = useRef(null);
  const [address, setAddress] = useState("");
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (isOpen && isLoaded) {
      initMap();
      setAddress("Fetching address...");
      setTimeout(() => document.getElementById("autocomplete")?.focus(), 300);
    }
  }, [isOpen, isLoaded]);

  const initMap = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoderRef.current = geocoder;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        const newMap = new window.google.maps.Map(mapRef.current, {
          center: currentPosition,
          zoom: 16,
        });
        setMap(newMap);

        const marker = new window.google.maps.Marker({
          position: currentPosition,
          map: newMap,
          draggable: true,
        });
        markerRef.current = marker;

        getAddress(currentPosition, (addr) => {
          marker.setTitle(addr);
        });

        marker.addListener("dragend", () => {
          const newPos = marker.getPosition();
          getAddress(newPos, (addr) => {
            marker.setTitle(addr);
          });
        });

        // Autocomplete
        const input = document.getElementById("autocomplete");
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ["geocode"],
        });
        autocomplete.bindTo("bounds", newMap);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) {
            alert(`No details found for: '${place.name}'`);
            return;
          }
          const location = place.geometry.location;
          newMap.setCenter(location);
          newMap.setZoom(16);
          marker.setPosition(location);
          const formattedAddress =
            place.formatted_address || "Address not available";
          setAddress(formattedAddress);
          marker.setTitle(formattedAddress);
        });

        autocompleteRef.current = autocomplete;

        // Places Service
        placesServiceRef.current = new window.google.maps.places.PlacesService(
          newMap
        );
      },
      () => {
        alert("Geolocation not available.");
        setAddress("Unable to fetch location.");
      }
    );
  };

  const getAddress = (position, callback) => {
    let lat, lng;
    if (typeof position.lat === "function") {
      lat = position.lat();
      lng = position.lng();
    } else {
      lat = position.lat;
      lng = position.lng;
    }

    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          if (callback) callback(formattedAddress);
        } else {
          setAddress("Unable to fetch address.");
          if (callback) callback("Unable to fetch address.");
        }
      }
    );
  };

  const searchPlaces = () => {
    const query = document.getElementById("autocomplete").value;
    if (!query) return alert("Please enter a location to search.");

    placesServiceRef.current.textSearch(
      {
        query,
        location: map.getCenter(),
        radius: 5000,
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results);
        } else {
          alert("No places found for this query.");
          setPlaces([]);
        }
      }
    );
  };

  const handlePlaceClick = (place) => {
    if (place.geometry && place.geometry.location) {
      const location = place.geometry.location;
      map.setCenter(location);
      map.setZoom(16);
      markerRef.current.setPosition(location);

      const formattedAddress =
        place.formatted_address || "Address not available";
      setAddress(formattedAddress);
      markerRef.current.setTitle(formattedAddress);
    }
  };

  const handleConfirm = () => {
    const position = markerRef.current.getPosition();
    onConfirm({
      latitude: position.lat(),
      longitude: position.lng(),
      address,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Select Location"
    >
      <h2 className="text-lg font-bold mb-2">Pick your location</h2>

      {isLoaded ? (
        <>
          <div className="flex mb-3">
            <input
              id="autocomplete"
              type="text"
              placeholder="Search location..."
              className="border p-2 flex-1 rounded mr-2"
            />
            <button
              onClick={searchPlaces}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
            <button
              onClick={() => {
                document.getElementById("autocomplete").value = "";
                setPlaces([]);
                setAddress("");
              }}
              className="bg-red-500 text-white px-3 py-2 rounded-r"
              title="Clear search"
            >
              ×
            </button>
          </div>

          <div
            ref={mapRef}
            style={{ height: "300px", width: "100%", marginBottom: "10px" }}
          ></div>

          <p className="text-sm text-gray-600">Selected Address:</p>
          <p className="font-medium mb-2">{address}</p>

          {/* Search result list */}
          {places.length > 0 && (
            <div className="border p-2 max-h-52 overflow-y-auto rounded mb-4">
              <h3 className="text-sm font-semibold mb-2">Search Results:</h3>
              {places.map((place, i) => (
                <div
                  key={i}
                  className="mb-2 border-b pb-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => handlePlaceClick(place)}
                >
                  <p className="font-medium">{place.name}</p>
                  <p className="text-sm text-gray-500">
                    {place.formatted_address}
                  </p>
                  {place.rating && (
                    <p className="text-xs text-yellow-600">⭐ {place.rating}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
          >
            Confirm Location
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <p>Loading map...</p>
      )}
    </Modal>
  );
};

export default LocationPickerModal;
