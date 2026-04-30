import { 
  searchMedicineService, 
  getSubstitutesService, 
  getMedicineByIdService,
  addMedicineService, 
  updateMedicineService, 
  deleteMedicineService,
  bulkUploadService,
  getAdminMetricsService,
  getAllMedicinesService,
  removeSubstituteService
} from '../services/medicine.service.js';
import { getCache, setCache, invalidateCache } from '../utils/cache.js';

export const searchMedicine = async (req, res) => {
  try {
    const name = req.query.name;
    const cacheKey = `search:${name}`;

    // Check cache
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const data = await searchMedicineService(name);

    // Set cache (60s TTL)
    if (data && data.length > 0) {
      await setCache(cacheKey, data, 60);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMedicineDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getMedicineByIdService(id);
    if (!data) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const bulkUpload = async (req, res) => {
  try {
    const { csvData } = req.body;
    if (!csvData) {
      return res.status(400).json({ error: 'CSV data is required' });
    }
    const summary = await bulkUploadService(csvData);

    // Invalidate cache
    await invalidateCache('search:*');
    await invalidateCache('substitutes:*');

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubstitutes = async (req, res) => {
  try {
    const id = req.params.id;
    const cacheKey = `substitutes:${id}`;

    // Check cache
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const data = await getSubstitutesService(id);

    // Set cache (120s TTL)
    if (data && data.length > 0) {
      await setCache(cacheKey, data, 120);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin endpoints
export const createMedicine = async (req, res) => {
  try {
    const data = await addMedicineService(req.body);

    // Invalidate cache
    await invalidateCache('search:*');

    res.status(201).json({ message: 'Medicine added successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await updateMedicineService(id, req.body);

    // Invalidate cache
    await invalidateCache('search:*');
    await invalidateCache(`substitutes:*`);

    res.json({ message: 'Medicine updated successfully', data });
  } catch (err) {
    if (err.message === 'Medicine not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await deleteMedicineService(id);

    // Invalidate cache
    await invalidateCache('search:*');
    await invalidateCache(`substitutes:*`);

    res.json({ message: 'Medicine deleted successfully', data });
  } catch (err) {
    if (err.message === 'Medicine not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getMetrics = async (req, res) => {
  try {
    const data = await getAdminMetricsService();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listAllMedicines = async (req, res) => {
  try {
    const data = await getAllMedicinesService();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeSubstituteLink = async (req, res) => {
  try {
    const { id, subId } = req.params;
    await removeSubstituteService(parseInt(id), parseInt(subId));

    // Invalidate cache
    await invalidateCache('search:*');
    await invalidateCache(`substitutes:*`);

    res.json({ message: 'Substitute link removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
