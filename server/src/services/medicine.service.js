import { redisClient } from '../config/redis.js';
import { 
  findMedicineByName, 
  findSubstitutes, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine 
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

export const addMedicineService = async (medicineData) => {
  const result = await createMedicine(medicineData);
  return result.rows[0];
};

export const updateMedicineService = async (id, medicineData) => {
  const existing = await getMedicineById(id);
  if (existing.rows.length === 0) {
    throw new Error('Medicine not found');
  }

  const result = await updateMedicine(id, medicineData);
  
  if (redisClient.isReady) {
    await redisClient.flushDb(); // Simple approach to cache invalidation
  }

  return result.rows[0];
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
