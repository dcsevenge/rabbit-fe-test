const API_URL = 'https://5efabb3a80d8170016f758ee.mockapi.io/';

async function fetchAPI(method = 'GET', path = '', body = '') {
    const headers = { 'Content-Type': 'application/json' };

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers
    });

    return await res.json();
}

export async function getProduct() {
  return await fetchAPI('GET', 'products');
}

export async function getLocation() {
    return await fetchAPI('GET', 'locations');
}

export async function addToCart({ date, product, locations }) {
    console.log({ date });
    const body = JSON.stringify({
        date: "2020-07-30",
        product,
        locations
    });
    console.log({ body });
    return await fetchAPI('POST', 'cart', body);
}