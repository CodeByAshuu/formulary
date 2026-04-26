import { parse } from 'csv-parse/sync';
import { redisClient } from '../config/redis.js';
import { 
  findMedicineByName, 
  findSubstitutes, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine,
  findMedicinesByComposition,
  addSubstitute
} from '../models/medicine.model.js';

export const searchMedicineService = async (name) => {
  if (!name) return [];

  const cacheKey = `search:medicine:${name.toLowerCase()}`;
  
  // Try to get from cache
  if (redisClient.isReady) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const result = await findMedicineByName(name);
  const data = result.rows;

  // Cache result for 1 hour
  if (redisClient.isReady) {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
  }

  return data;
};

export const getMedicineByIdService = async (id) => {
  const cacheKey = `medicine:${id}`;

  if (redisClient.isReady) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const result = await getMedicineById(id);
  const data = result.rows[0];

  if (redisClient.isReady && data) {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
  }

  return data;
};

export const getSubstitutesService = async (id) => {
  const cacheKey = `substitutes:${id}`;

  if (redisClient.isReady) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const result = await findSubstitutes(id);
  const data = result.rows.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  if (redisClient.isReady) {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
  }

  return data;
};

export const smartLinkMedicine = async (medicineId, composition) => {
  const matches = await findMedicinesByComposition(composition, medicineId);
  for (const match of matches.rows) {
    await addSubstitute(medicineId, match.id);
  }
};

export const bulkUploadService = async (csvData) => {
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const summary = {
    total: records.length,
    inserted: 0,
    failed: 0,
    errors: []
  };

  for (const record of records) {
    try {
      const { name, composition, manufacturer, price } = record;
      
      // Validation
      if (!name || !composition || !manufacturer || !price) {
        throw new Error('Missing fields');
      }

      const result = await createMedicine({
        name,
        composition,
        manufacturer,
        price: parseFloat(price)
      });

      const medicine = result.rows[0];
      
      // Smart Linking
      await smartLinkMedicine(medicine.id, medicine.composition);
      
      summary.inserted++;
    } catch (err) {
      summary.failed++;
      summary.errors.push({ record: record.name || 'Unknown', error: err.message });
    }
  }

  if (redisClient.isReady) {
    await redisClient.flushDb();
  }

  return summary;
};

export const addMedicineService = async (medicineData) => {
  const result = await createMedicine(medicineData);
  const medicine = result.rows[0];
  await smartLinkMedicine(medicine.id, medicine.composition);
  return medicine;
};

export const updateMedicineService = async (id, medicineData) => {
  const existing = await getMedicineById(id);
  if (existing.rows.length === 0) {
    throw new Error('Medicine not found');
  }

  const result = await updateMedicine(id, medicineData);
  const updated = result.rows[0];
  
  // Re-run smart linking in case composition changed
  await smartLinkMedicine(id, updated.composition);

  if (redisClient.isReady) {
    await redisClient.flushDb();
  }

  return updated;
};

export const deleteMedicineService = async (id) => {
  const result = await deleteMedicine(id);
  if (result.rows.length === 0) {
    throw new Error('Medicine not found');
  }

  if (redisClient.isReady) {
    await redisClient.flushDb();
  }

  return result.rows[0];
};
