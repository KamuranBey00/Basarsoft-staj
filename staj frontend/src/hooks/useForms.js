import { useState } from 'react';

const useForms = () => {
  // Map Point Form
  const [showMapForm, setShowMapForm] = useState(false);
  const [mapSubmitting, setMapSubmitting] = useState(false);
  const [mapMessage, setMapMessage] = useState('');

  // City Form
  const [showCityForm, setShowCityForm] = useState(false);
  const [citySubmitting, setCitySubmitting] = useState(false);
  const [cityMessage, setCityMessage] = useState('');

  // Update Form
  const [updateTarget, setUpdateTarget] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Choice Popup
  const [showChoice, setShowChoice] = useState(false);

  const resetMapForm = () => {
    setShowMapForm(false);
    setMapSubmitting(false);
    setMapMessage('');
  };

  const resetCityForm = () => {
    setShowCityForm(false);
    setCitySubmitting(false);
    setCityMessage('');
  };

  const resetUpdateForm = () => {
    setShowUpdateForm(false);
    setUpdateSubmitting(false);
    setUpdateMessage('');
    setUpdateTarget(null);
  };

  const openMapForm = () => {
    setShowMapForm(true);
    setMapMessage('');
    setMapSubmitting(false);
  };

  const openUpdateForm = (target) => {
    setUpdateTarget(target);
    setShowUpdateForm(true);
    setUpdateMessage('');
    setUpdateSubmitting(false);
  };

  return {
    // Map Form
    showMapForm,
    mapSubmitting,
    mapMessage,
    setShowMapForm,
    setMapSubmitting,
    setMapMessage,
    resetMapForm,
    openMapForm,

    // City Form
    showCityForm,
    citySubmitting,
    cityMessage,
    setShowCityForm,
    setCitySubmitting,
    setCityMessage,
    resetCityForm,

    // Update Form
    updateTarget,
    showUpdateForm,
    updateSubmitting,
    updateMessage,
    setUpdateTarget,
    setShowUpdateForm,
    setUpdateSubmitting,
    setUpdateMessage,
    resetUpdateForm,
    openUpdateForm,

    // Choice Popup
    showChoice,
    setShowChoice
  };
};

export default useForms;