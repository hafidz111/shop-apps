const API_BASE = "https://dummyjson.com";

if(document.getElementById(loginForm)) {
    const loginForm = document.getElementById("loginForm");
    const errorDiv = document.getElementById("error");

    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if(!username || !password) {
            errorDiv.textContent = "Please fill in all fields.";
            return;
        }

        try{
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
            });
            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed.");
            } else {
                const user = await response.json();
                localStorage.setItem("token", data.token);
                window.location.href = "products.html";
            }
        } catch(error) {
            errorDiv.textContent = error.message;
            console.error("Login Error:", error)
        }
    });
}

if(document.location.pathname.includes("products.html")) {
    const productList = document.getElementById(productList);
    
    fetch(`${API_BASE}/products`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(!Array.isArray(data)){
            if(data && Array.isArray(data.products)){
                data = data.products;
            } else {
                console.log(data)
            }
        }
        const productContainer = document.getElementById('product-container')
        data.forEach(product => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('col-md-4', 'mb-3');
            console.log(product);

            cardDiv.innerHTML = `
            <div>
                <img src="${product.image}" alt=""/>
            </div>
            `;
            productContainer.appendChild(cardDiv);
        });
    });
}

if(document.location.pathname.includes("profile.html")) {
    const profileInfo = document.getElementById("profileInfo");
    const user = JSON.parse(localStorage.getItem("user"));

    if(user){
        profileInfo.innerHTML = `
        <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        `;
    } else {
        profileInfo.textContent = "User not logged in"
    }
}

if(document.location.pathname.includes("logout.html")) {
    localStorage.clear();
}
