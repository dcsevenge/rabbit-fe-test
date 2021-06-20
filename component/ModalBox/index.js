import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import styles from '../../styles/ModalBox.module.scss'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function ModalBox({ locations, modalIsOpen, closeModal, items, setItems }) {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyClAg0Y6cz98UNLzPdpBQ8qeLfwT9U2iZ4"
  })

  const [mapRef, setMapRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [center, setCenter] = useState({
    lat: 13.7370587,
    lng: 100.5603061
  });
  const [zoom, setZoom] = useState(5);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const onLoad = useCallback(map => {
    const GGM = window.google.maps;
    const bounds = new GGM.LatLngBounds();
    locations.map(location => {
      const { lat, long } = location;
      const latLng = new GGM.LatLng(lat, long);
      bounds.extend(latLng);
    });
    map.fitBounds(bounds);
    setMapRef(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMapRef(null)
  }, [])

  const markerLoadHandler = (marker, place) => {
    return setMarkerMap(prevState => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {

    const newPlace = {
      ...place,
      isDisable: !!items.find(x => x.id === place.id)
    }

    // Remember which place was clicked
    setSelectedPlace(newPlace);

    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }

    setInfoOpen(true);

    // If you want to zoom in a little on marker click
    if (zoom < 16) {
      setZoom(16);
    }

    // if you want to center the selected Marker
    //setCenter(place.pos)
  };

  const addItemToList = selectedPlace => {
    const { id, name, fee } = selectedPlace;
    const item = {
      id,
      name,
      cost: fee,
      unit: 1
    }
    items.push(item);
    setItems(items);
    clearModal();
  };

  const clearModal = () => {
    closeModal();
    setSelectedPlace(null);
  }

  return <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
  >
    <div>
      <button type="button" onClick={() => clearModal()}>
        x
      </button>
      <div className={styles.googlebox}>
        {isLoaded ? (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={16}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
              {locations.map(location => {
                const { id, lat, long } = location;
                return <Marker
                    key={id}
                    position={{lat, lng: long}}
                    onLoad={marker => markerLoadHandler(marker, location)}
                    onClick={event => markerClickHandler(event, location)}
                />
              })}
              {infoOpen && selectedPlace && (
                  <InfoWindow
                      className={styles.contextBox}
                      anchor={markerMap[selectedPlace.id]}
                      onCloseClick={() => setInfoOpen(false)}
                  >
                    <div className={styles.contextBox}>
                      <div className={styles.title}>{selectedPlace.name}</div>
                      <div className={styles.flexbox}>
                        <div>Max unit: </div>
                        <div>{selectedPlace.max_dist}</div>
                      </div>
                      <div className={styles.flexbox}>
                        <div>Fee: </div>
                        <div>{selectedPlace.fee}</div>
                      </div>
                      <div>
                        <button disabled={selectedPlace.isDisable && `disabled`} className={styles.button} type="button" onClick={() => addItemToList(selectedPlace)}>Add</button>
                      </div>
                    </div>
                  </InfoWindow>
              )}
            </GoogleMap>
          ) : <></>
        }
      </div>
    </div>
  </Modal>
}
