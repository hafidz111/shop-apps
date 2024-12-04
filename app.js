const API_BASE = "https://dummyjson.com";

if (document.getElementById("loginForm")) {
  const loginForm = document.getElementById("loginForm");
  const errorDiv = document.getElementById("error");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      errorDiv.textContent = "Please fill in all fields.";
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }

      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "products.html";
    } catch (error) {
      errorDiv.textContent = error.message;
      console.error("Login Error:", error); 
    }
  });
}

async function fetchAndDisplayProducts(limit = 30) {
  try {
      const response = await fetch(`${API_BASE}/products?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      const products = data.products;

      const productList = document.getElementById("productList");

      productList.innerHTML = ""; 
      products.forEach((product) => {
          const productCard = `
              <div class="col-md-4 mb-4">
                  <div class="card h-100">
                      <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                      <div class="card-body">
                          <h5 class="card-title">${product.title}</h5>
                          <p class="card-text">${product.description.substring(0, 100)}...</p>
                          <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                          <p class="card-text"><strong>Rating:</strong> ${product.rating}</p>
                          <a href="#" class="btn btn-primary">Buy Now</a>
                      </div>
                  </div>
              </div>
          `;
          productList.innerHTML += productCard;
      });
  } catch (error) {
      console.error("Error fetching products:", error.message);
  }
}

fetchAndDisplayProducts();
