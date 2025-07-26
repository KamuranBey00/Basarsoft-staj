import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export const useMapInitialization = () => {
  const containerRef = useRef();
  const mapRef = useRef();
  const pointSrcRef = useRef();
  const lineSrcRef = useRef();
  const polySrcRef = useRef();
  const endpointSrcRef = useRef();

  useEffect(() => {
    const map = new Map({
      target: containerRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({ center: fromLonLat([35, 39]), zoom: 6 })
    });
    mapRef.current = map;

    pointSrcRef.current = new VectorSource();
    lineSrcRef.current = new VectorSource();
    polySrcRef.current = new VectorSource();
    endpointSrcRef.current = new VectorSource();

    const pointStyle = new Style({
      image: new Icon({ src: '/pin.png', anchor: [0.5, 1], scale: 0.1 })
    });
    const hoverPointStyle = new Style({
      image: new Icon({ src: '/pin.png', anchor: [0.5, 1], scale: 0.13 })
    });
    const endpointStyle = new Style({
      image: new Icon({ src: '/pin2.png', anchor: [0.5, 1], scale: 0.1 })
    });
    const endpointHoverStyle = new Style({
      image: new Icon({ src: '/pin2.png', anchor: [0.5, 1], scale: 0.13 })
    });
    const lineStyle = new Style({
      stroke: new Stroke({ color: '#0077FF', width: 3 })
    });
    const polygonStyle = new Style({
      stroke: new Stroke({ color: '#FF8800', width: 2 }),
      fill: new Fill({ color: 'rgba(255,136,0,0.2)' })
    });

    const ptLayer = new VectorLayer({
      source: pointSrcRef.current,
      style: f => f.get('hover') ? hoverPointStyle : pointStyle
    });
    const lnLayer = new VectorLayer({ source: lineSrcRef.current, style: lineStyle });
    const pgLayer = new VectorLayer({ source: polySrcRef.current, style: polygonStyle });
    const epLayer = new VectorLayer({
      source: endpointSrcRef.current,
      style: f => f.get('hover') ? endpointHoverStyle : endpointStyle 
    });

    map.addLayer(ptLayer);
    map.addLayer(lnLayer);
    map.addLayer(pgLayer);
    map.addLayer(epLayer);

    // Popup setup
    const popupEl = document.createElement('div');
    popupEl.className = 'map-popup';
    containerRef.current.appendChild(popupEl);
    const overlay = new Overlay({
      element: popupEl,
      positioning: 'bottom-center',
      offset: [0, -15]
    });
    map.addOverlay(overlay);

    map.on('singleclick', evt => {
      const feat = map.forEachFeatureAtPixel(evt.pixel, f => f);
      if (feat) {
        const geom = feat.getGeometry();
        const coord = geom.getType() === 'Point'
          ? geom.getCoordinates()
          : geom.getClosestPoint(evt.coordinate);
        const [lon, lat] = toLonLat(coord).map(n => parseFloat(n.toFixed(6)));
        overlay.setPosition(coord);
        popupEl.innerHTML = `<strong>${feat.get('name') || ''}</strong><br>${lon}, ${lat}`;
      } else {
        overlay.setPosition();
      }
    });

    return () => {
      map.setTarget(null);
      if (popupEl.parentNode) popupEl.parentNode.removeChild(popupEl);
    };
  }, []);

  return {
    containerRef,
    mapRef,
    pointSrcRef,
    lineSrcRef,
    polySrcRef,
    endpointSrcRef
  };
};