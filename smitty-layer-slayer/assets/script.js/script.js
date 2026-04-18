
// SIMPLE SOUND HANDLER
let hoverSound, clickSound;

function initSounds() {
    hoverSound = new Audio("assets/sounds/hover.mp3");
    clickSound = new Audio("assets/sounds/click.mp3");

    document.querySelectorAll("button, a").forEach(el => {
        el.addEventListener("mouseenter", () => {
            if (hoverSound) hoverSound.play().catch(() => {});
        });
        el.addEventListener("click", () => {
            if (clickSound) clickSound.play().catch(() => {});
        });
    });
}

// DARK MODE
function toggleMode() {
    document.body.classList.toggle("light");
    localStorage.setItem("layerSlayerTheme", document.body.classList.contains("light") ? "light" : "dark");
}

function loadTheme() {
    const saved = localStorage.getItem("layerSlayerTheme");
    if (saved === "light") document.body.classList.add("light");
}

// SPARKS
function createSparks() {
    const banner = document.querySelector(".animated-banner");
    if (!banner) return;
    for (let i = 0; i < 20; i++) {
        const spark = document.createElement("div");
        spark.classList.add("spark");
        spark.style.left = Math.random() * 100 + "%";
        spark.style.animationDelay = Math.random() + "s";
        banner.appendChild(spark);
    }
}

// CART
let cart = [];

function loadCart() {
    const saved = localStorage.getItem("layerSlayerCart");
    if (saved) cart = JSON.parse(saved);
    renderCart();
}

function saveCart() {
    localStorage.setItem("layerSlayerCart", JSON.stringify(cart));
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty++;
    else cart.push({ name, price, qty: 1 });
    saveCart();
    renderCart();
}

function renderCart() {
    const cartDiv = document.getElementById("cart");
    if (!cartDiv) return;
    if (cart.length === 0) {
        cartDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }
    let total = 0;
    cartDiv.innerHTML = "";
    cart.forEach(item => {
        total += item.price * item.qty;
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <span>${item.name} x ${item.qty}</span>
            <span>$${(item.price * item.qty).toFixed(2)}</span>
        `;
        cartDiv.appendChild(row);
    });
    const totalRow = document.createElement("div");
    totalRow.style.marginTop = "10px";
    totalRow.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    cartDiv.appendChild(totalRow);
}

// PRICING CALCULATOR
function calculatePrice() {
    const materialRate = parseFloat(document.getElementById("material").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const hours = parseFloat(document.getElementById("hours").value);
    const result = document.getElementById("result");

    if (isNaN(materialRate) || isNaN(weight) || isNaN(hours)) {
        result.innerText = "Please enter valid numbers.";
        return;
    }

    const materialCost = weight * materialRate;
    const timeCost = hours * 2.5;
    const total = (materialCost + timeCost).toFixed(2);
    result.innerText = "Estimated Price: $" + total;
}

// LOGIN MOCK
function login(event) {
    event.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (user && pass) {
        localStorage.setItem("layerSlayerUser", user);
        alert("Logged in as " + user + " (mock)");
        window.location.href = "index.html";
    }
}

function checkAdmin() {
    const user = localStorage.getItem("layerSlayerUser");
    const info = document.getElementById("admin-info");
    if (!info) return;
    if (user) info.innerText = "Logged in as: " + user + " (mock admin)";
    else info.innerText = "Not logged in. (mock)";
}

// STL VIEWER
function initViewer() {
    const container = document.getElementById("viewer");
    if (!container || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    const loader = new THREE.STLLoader();
    loader.load("assets/models/sample.stl", geometry => {
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0x111111, shininess: 200 });
        const mesh = new THREE.Mesh(geometry, material);
        geometry.center();
        mesh.rotation.x = -Math.PI / 2;
        scene.add(mesh);

        camera.position.z = 100;

        function animate() {
            requestAnimationFrame(animate);
            mesh.rotation.z += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    });
}

// INIT
window.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    createSparks();
    initSounds();
    loadCart();
    initViewer();
    checkAdmin();
});
