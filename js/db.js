/**
 * Luxe Aroma - Unified Database / Persistence Layer
 * Integrates Supabase BaaS (PostgreSQL) client calls, with automatic pre-seeded 
 * LocalStorage fallback to support fully-functional local testing instantly.
 */

// Supabase Configuration Placeholders (Replace with your actual Supabase URL & Anon Key)
const SUPABASE_URL = "";
const SUPABASE_KEY = "";

let luxeSupabase = null;
if (SUPABASE_URL && SUPABASE_KEY && typeof supabase !== 'undefined') {
    luxeSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Database Seeding / Local Mock Persistence Initializer
function initLocalDatabase() {
    if (!localStorage.getItem('luxe_db_initialized')) {
        // Seed default products from products.js
        if (window.LUXE_PRODUCTS) {
            localStorage.setItem('luxe_products', JSON.stringify(window.LUXE_PRODUCTS));
        }

        // Seed default reviews collected from initial products
        const initialReviews = [];
        if (window.LUXE_PRODUCTS) {
            window.LUXE_PRODUCTS.forEach(p => {
                if (p.reviews) {
                    p.reviews.forEach(r => {
                        initialReviews.push({
                            id: Date.now() + Math.random().toString(36).substr(2, 9),
                            productId: p.id,
                            author: r.author,
                            rating: r.rating,
                            text: r.text,
                            date: r.date || "July 12, 2026"
                        });
                    });
                }
            });
        }
        localStorage.setItem('luxe_reviews', JSON.stringify(initialReviews));

        // Seed default users (includes a ready-to-use Admin account)
        const initialUsers = [
            { email: "admin@luxearoma.com", name: "Administrator", role: "admin", password: "admin" },
            { email: "user@luxearoma.com", name: "Esha Razia", role: "user", password: "user123" }
        ];
        localStorage.setItem('luxe_users', JSON.stringify(initialUsers));

        // Seed a sample order for tracking
        const initialOrders = [
            {
                id: "LA-98754",
                email: "user@luxearoma.com",
                items: [
                    { id: 1, name: "Oud Royale", price: 180, qty: 1, size: "50ml" }
                ],
                subtotal: 180,
                discount: 0,
                total: 180,
                status: "processing",
                shippingDetails: {
                    name: "Esha Razia",
                    address: "Johar Town, Lahore",
                    city: "Lahore",
                    phone: "+92 300 1234567"
                },
                created_at: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            }
        ];
        localStorage.setItem('luxe_orders', JSON.stringify(initialOrders));

        localStorage.setItem('luxe_db_initialized', 'true');
    }
}

// Invoke local DB seeding helper
initLocalDatabase();

// --- Database Service Interface ---
window.LuxeDB = {
    // --- Products API ---
    getProducts: async function() {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('products').select('*');
            if (!error) return data;
        }
        // Fallback
        return JSON.parse(localStorage.getItem('luxe_products')) || [];
    },

    addProduct: async function(product) {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('products').insert([product]).select();
            if (!error) return data[0];
        }
        // Fallback
        const products = JSON.parse(localStorage.getItem('luxe_products')) || [];
        product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(product);
        localStorage.setItem('luxe_products', JSON.stringify(products));
        // Refresh catalog window array
        window.LUXE_PRODUCTS = products;
        return product;
    },

    updateProduct: async function(id, updatedFields) {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('products').update(updatedFields).eq('id', id).select();
            if (!error) return data[0];
        }
        // Fallback
        const products = JSON.parse(localStorage.getItem('luxe_products')) || [];
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedFields };
            localStorage.setItem('luxe_products', JSON.stringify(products));
            window.LUXE_PRODUCTS = products;
            return products[index];
        }
        return null;
    },

    deleteProduct: async function(id) {
        if (luxeSupabase) {
            const { error } = await luxeSupabase.from('products').delete().eq('id', id);
            if (!error) return true;
        }
        // Fallback
        let products = JSON.parse(localStorage.getItem('luxe_products')) || [];
        products = products.filter(p => p.id !== parseInt(id));
        localStorage.setItem('luxe_products', JSON.stringify(products));
        window.LUXE_PRODUCTS = products;
        return true;
    },

    // --- Reviews API ---
    getReviews: async function() {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('reviews').select('*');
            if (!error) return data;
        }
        // Fallback
        return JSON.parse(localStorage.getItem('luxe_reviews')) || [];
    },

    addReview: async function(review) {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('reviews').insert([review]).select();
            if (!error) return data[0];
        }
        // Fallback
        const reviews = JSON.parse(localStorage.getItem('luxe_reviews')) || [];
        review.id = Date.now() + Math.random().toString(36).substr(2, 9);
        reviews.push(review);
        localStorage.setItem('luxe_reviews', JSON.stringify(reviews));
        return review;
    },

    deleteReview: async function(id) {
        if (luxeSupabase) {
            const { error } = await luxeSupabase.from('reviews').delete().eq('id', id);
            if (!error) return true;
        }
        // Fallback
        let reviews = JSON.parse(localStorage.getItem('luxe_reviews')) || [];
        reviews = reviews.filter(r => r.id !== id);
        localStorage.setItem('luxe_reviews', JSON.stringify(reviews));
        return true;
    },

    // --- Orders API ---
    getOrders: async function() {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('orders').select('*');
            if (!error) return data;
        }
        // Fallback
        return JSON.parse(localStorage.getItem('luxe_orders')) || [];
    },

    addOrder: async function(order) {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('orders').insert([order]).select();
            if (!error) return data[0];
        }
        // Fallback
        const orders = JSON.parse(localStorage.getItem('luxe_orders')) || [];
        orders.push(order);
        localStorage.setItem('luxe_orders', JSON.stringify(orders));
        return order;
    },

    updateOrderStatus: async function(orderId, status) {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('orders').update({ status: status }).eq('id', orderId).select();
            if (!error) return data[0];
        }
        // Fallback
        const orders = JSON.parse(localStorage.getItem('luxe_orders')) || [];
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders[index].status = status;
            localStorage.setItem('luxe_orders', JSON.stringify(orders));
            return orders[index];
        }
        return null;
    },

    // --- Users / Membership API ---
    getUsers: async function() {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('users').select('*');
            if (!error) return data;
        }
        // Fallback
        return JSON.parse(localStorage.getItem('luxe_users')) || [];
    },

    registerUser: async function(user) {
        if (luxeSupabase) {
            const { data, error } = await luxeSupabase.from('users').insert([user]).select();
            if (!error) return data[0];
        }
        // Fallback
        const users = JSON.parse(localStorage.getItem('luxe_users')) || [];
        if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
            throw new Error("Email already registered");
        }
        users.push(user);
        localStorage.setItem('luxe_users', JSON.stringify(users));
        return user;
    },

    loginUser: async function(email, password) {
        if (luxeSupabase) {
            // Real authentication query can go here
        }
        const users = JSON.parse(localStorage.getItem('luxe_users')) || [];
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        return user;
    }
};
