import { useCallback } from 'react';

export const useGeometryOperations = (
  pointsHook,
  linesHook,
  polygonsHook,
  apiHook,
  notify,
  resetEdit
) => {
  // Handle point creation from map click
  const handleMapPointCreate = useCallback(async (name, coords) => {
    try {
      const [lon, lat] = coords;
      const created = await apiHook.pointApi.create({
        name,
        pointX: lon.toString(),
        pointY: lat.toString()
      });

      pointsHook.addItem({
        id: created.id,
        name: created.name,
        coords: [parseFloat(created.pointX), parseFloat(created.pointY)]
      });

      return { success: true, message: '✅ Nokta eklendi.' };
    } catch (error) {
      return { success: false, message: '❌ Hata oluştu.' };
    }
  }, [apiHook.pointApi, pointsHook]);

  // Handle city point creation
  const handleCityPointCreate = useCallback(async (city, label) => {
    try {
      const geoData = await apiHook.externalApi.geocodeCity(city);
      const { lon, lat } = geoData;

      const created = await apiHook.pointApi.create({
        name: label,
        pointX: lon.toString(),
        pointY: lat.toString()
      });

      pointsHook.addItem({
        id: created.id,
        name: created.name,
        coords: [parseFloat(created.pointX), parseFloat(created.pointY)]
      });

      return { success: true, message: '✅ Şehir eklendi.' };
    } catch (error) {
      return { success: false, message: `❌ ${error.message}` };
    }
  }, [apiHook.pointApi, apiHook.externalApi, pointsHook]);

  // Handle point update
  const handlePointUpdate = useCallback(async (id, newName, coords) => {
    try {
      const [lon, lat] = coords;
      const existingPoint = pointsHook.data.find(p => p.id === id);
      
      await apiHook.pointApi.update({
        id,
        name: newName || existingPoint?.name,
        pointX: lon.toString(),
        pointY: lat.toString()
      });

      pointsHook.updateItem(id, (item) => ({
        ...item,
        name: newName || item.name,
        coords: [lon, lat]
      }));

      return { success: true, message: '✅ Güncellendi.' };
    } catch (error) {
      return { success: false, message: '❌ Hata oluştu.' };
    }
  }, [apiHook.pointApi, pointsHook]);

  // Handle edit complete for all geometry types
  const handleEditComplete = useCallback(async ({ type, id, coordinates }) => {
    try {
      let updateData, updateFunction;

      if (type === 'point') {
        const existingPt = pointsHook.data.find(p => p.id === id);
        updateData = {
          id,
          name: existingPt.name,
          pointX: coordinates[0].toString(),
          pointY: coordinates[1].toString()
        };
        await apiHook.pointApi.update(updateData);
        updateFunction = () => pointsHook.updateItem(id, (item) => ({
          ...item,
          coords: [parseFloat(updateData.pointX), parseFloat(updateData.pointY)]
        }));
      } else if (type === 'line') {
        const existingLn = linesHook.data.find(l => l.id === id);
        updateData = {
          id,
          name: existingLn.name,
          coordinates: coordinates.map(c => ({ x: c[0].toString(), y: c[1].toString() }))
        };
        await apiHook.lineApi.update(updateData);
        updateFunction = () => linesHook.updateItem(id, (item) => ({
          ...item,
          geomWkt: `LINESTRING(${coordinates.map(c => c.join(' ')).join(',')})`
        }));
      } else if (type === 'polygon') {
        const existingPg = polygonsHook.data.find(p => p.id === id);
        updateData = {
          id,
          name: existingPg.name,
          coordinates: coordinates.map(c => ({ x: c[0].toString(), y: c[1].toString() }))
        };
        await apiHook.polygonApi.update(updateData);
        updateFunction = () => polygonsHook.updateItem(id, (item) => ({
          ...item,
          geomWkt: `POLYGON((${[...coordinates, coordinates[0]].map(c => c.join(' ')).join(',')}))`
        }));
      }

      updateFunction();
      notify('✅ Güncelleme kaydedildi.');
    } catch (error) {
      notify('❌ Güncelleme hatası.');
    } finally {
      resetEdit();
    }
  }, [pointsHook, linesHook, polygonsHook, apiHook, notify, resetEdit]);

  // Handle line drawing
  const handleLineDrawn = useCallback(async (lineObj) => {
    try {
      const created = await apiHook.lineApi.create(lineObj);
      linesHook.addItem(created);
      notify('✅ Çizgi başarıyla eklendi.');
    } catch (error) {
      notify('❌ Çizgi eklenirken hata oluştu.');
    }
  }, [apiHook.lineApi, linesHook, notify]);

  // Handle polygon drawing
  const handlePolygonDrawn = useCallback(async (polygonObj) => {
    try {
      const created = await apiHook.polygonApi.create(polygonObj);
      polygonsHook.addItem(created);
      notify('✅ Poligon başarıyla eklendi.');
    } catch (error) {
      notify('❌ Poligon eklenirken hata oluştu.');
    }
  }, [apiHook.polygonApi, polygonsHook, notify]);

  // Handle deletions
  const handleDeletePoint = useCallback(async (id) => {
    if (!window.confirm('Bu noktayı silmek istediğine emin misin?')) return;
    try {
      await apiHook.pointApi.delete(id);
      pointsHook.removeItem(id);
    } catch (error) {
      notify('❌ Silme işlemi başarısız.');
    }
  }, [apiHook.pointApi, pointsHook, notify]);

  const handleDeleteLine = useCallback(async (id) => {
    if (!window.confirm('Bu çizgiyi silmek istediğine emin misin?')) return;
    try {
      await apiHook.lineApi.delete(id);
      linesHook.removeItem(id);
    } catch (error) {
      notify('❌ Silme işlemi başarısız.');
    }
  }, [apiHook.lineApi, linesHook, notify]);

  const handleDeletePolygon = useCallback(async (id) => {
    if (!window.confirm('Bu çokgeni silmek istediğine emin misin?')) return;
    try {
      await apiHook.polygonApi.delete(id);
      polygonsHook.removeItem(id);
    } catch (error) {
      notify('❌ Silme işlemi başarısız.');
    }
  }, [apiHook.polygonApi, polygonsHook, notify]);

  return {
    handleMapPointCreate,
    handleCityPointCreate,
    handlePointUpdate,
    handleEditComplete,
    handleLineDrawn,
    handlePolygonDrawn,
    handleDeletePoint,
    handleDeleteLine,
    handleDeletePolygon
  };
};

export default useGeometryOperations;