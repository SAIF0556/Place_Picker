import { useRef, useState, useEffect } from 'react'

import Places from './components/Places.jsx'
import { AVAILABLE_PLACES } from './data.js'
import Modal from './components/Modal.jsx'
import DeleteConfirmation from './components/DeleteConfirmation.jsx'
import logoImg from './assets/logo.png'
import { sortPlacesByDistance } from './loc.js'
function App() {
  const modal = useRef()
  const selectedPlace = useRef()
  const [pickedPlaces, setPickedPlaces] = useState([])
  const [availablePlaces, setAvailablePlaces] = useState([])

  // find location of the user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude,
      )
      setAvailablePlaces(sortedPlaces)
    })
  }, [])

  function handleStartRemovePlace(id) {
    modal.current.open()
    selectedPlace.current = id
  }

  function handleStopRemovePlace() {
    modal.current.close()
  }

  function handleSelectPlace(id) {
    // sort places by distance
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id)
      return [place, ...prevPickedPlaces]
    })

    // store places in the browser's local storage
    const pickedPlaceIds =
      JSON.parse(localStorage.getItem('pickedPlaceIds')) || []
    if (pickedPlaceIds.indexOf(id) === -1) {
      localStorage.setItem(
        'pickedPlaceIds',
        JSON.stringify([id, ...pickedPlaceIds]),
      )
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current),
    )
    modal.current.close()
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance ..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  )
}

export default App
