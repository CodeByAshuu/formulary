import { 
  searchMedicineService, 
  getSubstitutesService, 
  getMedicineByIdService,
  addMedicineService, 
  updateMedicineService, 
  deleteMedicineService 
} from '../services/medicine.service.js';

export const searchMedicine = async (req, res) => {
  try {
    const name = req.query.name;
    const data = await searchMedicineService(name);
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

export const getSubstitutes = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getSubstitutesService(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin endpoints
export const createMedicine = async (req, res) => {
  try {
    const data = await addMedicineService(req.body);
    res.status(201).json({ message: 'Medicine added successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await updateMedicineService(id, req.body);
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
    res.json({ message: 'Medicine deleted successfully', data });
  } catch (err) {
    if (err.message === 'Medicine not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};
