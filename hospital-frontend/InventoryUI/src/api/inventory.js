import axios from 'axios';

const API_BASE_URL =  'http://localhost:5000';

export const getMedicines = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getThe/medicines`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
};

export const getEquipment = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getThe/equipment`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};


export const consumeStock = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/inventory/consume-stocks`, data);
    return response.data;
  } catch (error) {
    console.error('Error consuming stock:', error);
    throw error;
  }
};

export const restock = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/inventory/restock`, data);
    return response.data;
  } catch (error) {
    console.error('Error restocking:', error);
    throw error;
  }
};

export const getInventoryLogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inventory/logs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};