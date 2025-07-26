import React, { useEffect } from 'react';
import './App.css';
import './styles/panels.css';
import './styles/GenericEntityPanel.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Components
import MapComponent from './components/maps/MapComponent';
import FloatingButton from './components/maps/FloatingButton';
import ChoicePopup from './components/maps/ChoicePopup';
import CityPointForm from './components/forms/CityPointForm';
import MapPointForm from './components/forms/MapPointForm';
import UpdatePointForm from './components/forms/UpdatePointForm';
// MapPage import'u kaldırıldı
import PointsPanel from './components/panels/PointsPanel';
import LinesPanel from './components/panels/LinesPanel';
import PolygonsPanel from './components/panels/PolygonsPanel';

// Hooks
import useNotification from './hooks/useNotification';
import usePagination from './hooks/usePagination';
import useApi, { API_ENDPOINTS } from './hooks/useApi';
import useMapActions from './hooks/useMapAction';
import useEditMode from './hooks/useEditMode';
import useForms from './hooks/useForms.js';
import useGeometryOperations from './hooks/useGeometryOperations';

function App() {
  // Initialize hooks
  const { notify } = useNotification();
  const api = useApi();

  // Pagination hooks for different entity types
  const pointsHook = usePagination(1, 5);
  const linesHook = usePagination(1, 5);
  const polygonsHook = usePagination(1, 5);

  // Map actions hook
  const mapActions = useMapActions(notify);

  // Edit mode hook
  const editMode = useEditMode();

  // Forms hook
  const forms = useForms();

  // Geometry operations hook
  const geometryOps = useGeometryOperations(
    pointsHook,
    linesHook,
    polygonsHook,
    api,
    notify,
    editMode.resetEdit
  );

  // Data mappers for pagination
  const pointMapper = (pt) => ({
    id: pt.id,
    name: pt.name,
    coords: [parseFloat(pt.pointX), parseFloat(pt.pointY)]
  });

  const lineMapper = (ln) => ({
    id: ln.id,
    name: ln.name,
    geomWkt: ln.geomWkt || ln.wkt
  });

  const polygonMapper = (pg) => ({
    id: pg.id,
    name: pg.name,
    geomWkt: pg.geomWkt || pg.wkt
  });

  // Initial data fetch
  useEffect(() => {
    pointsHook.fetchPaged(API_ENDPOINTS.POINT, pointMapper, notify);
    linesHook.fetchPaged(API_ENDPOINTS.LINE, lineMapper, notify);
    polygonsHook.fetchPaged(API_ENDPOINTS.POLYGON, polygonMapper, notify);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle choice selection from popup
  const handleChoiceSelect = (choice) => {
    forms.setShowChoice(false);
    switch (choice) {
      case 'PointMap':
        mapActions.startMapAction('createPoint');
        break;
      case 'PointCity':
        forms.setShowCityForm(true);
        break;
      case 'LineString':
        mapActions.startMapAction('drawLine');
        break;
      case 'Polygon':
        mapActions.startMapAction('drawPolygon');
        break;
      default:
        break;
    }
  };

  // Handle map click
  const handleMapClick = (coords) => {
    const wasHandled = mapActions.handleMapClick(coords);
    if (wasHandled) {
      if (mapActions.mapAction === 'createPoint') {
        forms.openMapForm();
        mapActions.setMapAction(null);
      }
      if (mapActions.mapAction === 'updatePoint' && forms.updateTarget) {
        forms.openUpdateForm(forms.updateTarget);
        mapActions.setMapAction(null);
      }
    }
  };

  // Handle map form submission
  const handleMapFormSubmit = async (name) => {
    forms.setMapSubmitting(true);
    const result = await geometryOps.handleMapPointCreate(name, mapActions.selectedCoords);
    forms.setMapMessage(result.message);
    forms.setMapSubmitting(false);
  };

  // Handle city form submission
  const handleCitySubmit = async (city, label) => {
    forms.setCitySubmitting(true);
    const result = await geometryOps.handleCityPointCreate(city, label);
    forms.setCityMessage(result.message);
    forms.setCitySubmitting(false);
  };

  // Handle update form submission
  const handleUpdateSubmit = async (newName) => {
    forms.setUpdateSubmitting(true);
    const result = await geometryOps.handlePointUpdate(
      forms.updateTarget.id,
      newName,
      mapActions.selectedCoords
    );
    forms.setUpdateMessage(result.message);
    forms.setUpdateSubmitting(false);
  };

  // Handle edit initiation
  const handleEditPoint = (id) => {
    editMode.initiateEditPoint(id, pointsHook.data, notify);
  };

  const handleEditLine = (id) => {
    editMode.initiateEditLine(id, linesHook.data, notify);
  };

  const handleEditPolygon = (id) => {
    editMode.initiateEditPolygon(id, polygonsHook.data, notify);
  };

  // Search select handlers
  const handlePointSearchSelect = (pt) => {
    pointsHook.addItemIfNotExists({
      id: pt.id,
      name: pt.name,
      coords: [parseFloat(pt.pointX), parseFloat(pt.pointY)]
    });
  };

  const handleLineSearchSelect = (ln) => {
    linesHook.addItemIfNotExists({
      id: ln.id,
      name: ln.name,
      geomWkt: ln.geomWkt || ln.wkt
    });
  };

  const handlePolySearchSelect = (pg) => {
    polygonsHook.addItemIfNotExists({
      id: pg.id,
      name: pg.name,
      geomWkt: pg.geomWkt || pg.wkt
    });
  };

  // Handle line and polygon drawing completion
  const handleLineDrawn = async (lineObj) => {
    await geometryOps.handleLineDrawn(lineObj);
    mapActions.setMapAction(null);
  };

  const handlePolygonDrawn = async (polygonObj) => {
    await geometryOps.handlePolygonDrawn(polygonObj);
    mapActions.setMapAction(null);
  };

  // Hotkey ile veri eklendiğinde çağırılacak fonksiyon
  const handleHotkeyDataAdded = (type, data) => {
    console.log('🔄 handleHotkeyDataAdded called:', { type, data });
    
    if (type === 'point') {
      const newPoint = {
        id: data.id,
        name: data.name,
        coords: [parseFloat(data.pointX), parseFloat(data.pointY)]
      };
      console.log('🟢 Adding point to pagination:', newPoint);
      pointsHook.addItemIfNotExists(newPoint);
    } 
    else if (type === 'line') {
      // API'den dönen data'da geomWkt olup olmadığını kontrol et
      if (!data.geomWkt) {
        console.warn('⚠️ Line data missing geomWkt field:', data);
        // Eğer geomWkt yoksa, coordinates'tan oluşturmaya çalış veya hata ver
        console.error('❌ Cannot add line without geomWkt field');
        return;
      }
      
      const newLine = {
        id: data.id,
        name: data.name,
        geomWkt: data.geomWkt
      };
      console.log('📏 Adding line to pagination:', newLine);
      linesHook.addItemIfNotExists(newLine);
    } 
    else if (type === 'polygon') {
      // API'den dönen data'da geomWkt olup olmadığını kontrol et
      if (!data.geomWkt) {
        console.warn('⚠️ Polygon data missing geomWkt field:', data);
        // Eğer geomWkt yoksa, coordinates'tan oluşturmaya çalış veya hata ver
        console.error('❌ Cannot add polygon without geomWkt field');
        return;
      }
      
      const newPolygon = {
        id: data.id,
        name: data.name,
        geomWkt: data.geomWkt
      };
      console.log('🔷 Adding polygon to pagination:', newPolygon);
      polygonsHook.addItemIfNotExists(newPolygon);
    }
  };

  return (
    <div className="App">
      <h1>Harita Uygulaması</h1>

      <MapComponent
        onMapClick={handleMapClick}
        onLineDrawn={handleLineDrawn}
        onPolygonDrawn={handlePolygonDrawn}
        points={pointsHook.data}
        lines={linesHook.data}
        polygons={polygonsHook.data}
        mapClickMode={mapActions.mapAction === 'createPoint' || mapActions.mapAction === 'updatePoint'}
        drawMode={
          mapActions.mapAction === 'drawLine' ? 'LineString' :
          mapActions.mapAction === 'drawPolygon' ? 'Polygon' : null
        }
        editType={editMode.editType}
        editTarget={editMode.editTarget}
        onEditComplete={geometryOps.handleEditComplete}
        onSearchSelect={handlePointSearchSelect}
        
        // Yeni hotkey özellikleri
        enableHotkeyDrawing={true}
        onDataAdded={handleHotkeyDataAdded}
      />

      {/* MapPage kaldırıldı */}

      <FloatingButton onClick={() => forms.setShowChoice(true)} />

      <ChoicePopup
        visible={forms.showChoice}
        onClose={() => forms.setShowChoice(false)}
        onSelect={handleChoiceSelect}
      />

      <CityPointForm
        visible={forms.showCityForm}
        onClose={() => forms.setShowCityForm(false)}
        onSubmit={handleCitySubmit}
        submitting={forms.citySubmitting}
        submitMessage={forms.cityMessage}
      />

      <MapPointForm
        visible={forms.showMapForm}
        coords={mapActions.selectedCoords}
        onSubmit={handleMapFormSubmit}
        onCancel={() => forms.setShowMapForm(false)}
        submitting={forms.mapSubmitting}
        submitMessage={forms.mapMessage}
      />

      <UpdatePointForm
        visible={forms.showUpdateForm}
        defaultName={forms.updateTarget?.name}
        coords={mapActions.selectedCoords}
        onSubmit={handleUpdateSubmit}
        onCancel={() => forms.setShowUpdateForm(false)}
        submitting={forms.updateSubmitting}
        submitMessage={forms.updateMessage}
      />

      <div className="panels-container">
        <PointsPanel
          points={pointsHook.data}
          onDelete={geometryOps.handleDeletePoint}
          onUpdate={handleEditPoint}
          showLoadMore={pointsHook.hasMore}
          onLoadMore={() => pointsHook.loadMore(API_ENDPOINTS.POINT, pointMapper, notify)}
          loading={pointsHook.loading}
          searchApiUrl={`${API_ENDPOINTS.POINT}/search?keyword=`}
          onSearchSelect={handlePointSearchSelect}
        />

        <LinesPanel
          lines={linesHook.data}
          onDelete={geometryOps.handleDeleteLine}
          onUpdate={handleEditLine}
          showLoadMore={linesHook.hasMore}
          onLoadMore={() => linesHook.loadMore(API_ENDPOINTS.LINE, lineMapper, notify)}
          loading={linesHook.loading}
          searchApiUrl={`${API_ENDPOINTS.LINE}/search?keyword=`}
          onSearchSelect={handleLineSearchSelect}
        />

        <PolygonsPanel
          polygons={polygonsHook.data}
          onDelete={geometryOps.handleDeletePolygon}
          onUpdate={handleEditPolygon}
          showLoadMore={polygonsHook.hasMore}
          onLoadMore={() => polygonsHook.loadMore(API_ENDPOINTS.POLYGON, polygonMapper, notify)}
          loading={polygonsHook.loading}
          searchApiUrl={`${API_ENDPOINTS.POLYGON}/search?keyword=`}
          onSearchSelect={handlePolySearchSelect}
        />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;