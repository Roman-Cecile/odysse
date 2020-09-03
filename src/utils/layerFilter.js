const isTileLayer = (layer, tileLayer) => {
  if (layer instanceof tileLayer) {
    return true;
  }
};

export default isTileLayer;
