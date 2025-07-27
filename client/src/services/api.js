import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// ... (fungsi-fungsi lain tetap sama) ...
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const fetchLaptops = () => API.get('/laptops');
export const fetchAllLaptopsForAdmin = () => API.get('/laptops/admin');
export const createLaptop = (formData) => API.post('/laptops', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
export const updateLaptop = (id, formData) => API.put(`/laptops/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
export const deleteLaptop = (id) => API.delete(`/laptops/${id}`);
export const updateLaptopStatus = (id, status) => API.patch(`/laptops/${id}/status`, { status });
export const getCartItems = () => API.get('/cart');
export const addToCart = (laptopId) => API.post('/cart', { laptopId });
export const removeFromCart = (laptopId) => API.delete(`/cart/${laptopId}`);


// --- FUNGSI RENTAL DIPERBARUI ---
// Sekarang mengirim FormData, jadi header Content-Type diatur otomatis oleh browser.
export const createRental = (rentalFormData) => API.post('/rentals', rentalFormData);
export const getMyRentals = () => API.get('/rentals/my-rentals');
export const getAllRentalsForAdmin = () => API.get('/rentals/admin/all');
export const updateRentalStatusForAdmin = (id, status) => API.patch(`/rentals/admin/${id}/status`, { status });
export const getLaptopById = (id) => API.get(`/laptops/${id}`);