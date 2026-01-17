let products = [];
let cart = JSON.parse(localStorage.getItem('cart')||'[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser')||'null');

const userControls = document.getElementById('user-controls');
if(currentUser){
  userControls.innerHTML = `
    <span>${currentUser.pseudo}</span>
    <button class="profile-btn" onclick="logout()">✖</button>
    <button onclick="toggleCart()">Panier (<span id="cart-count">0</span>)</button>`;
}

function logout(){auth-page ===
  localStorage.removeItem('currentUser');
  location.reload();
}

fetch('products.json')
.then(r=>r.json())
.then(data=>{
  products=data;
  displayProducts(products);
  updateCart();
});

function displayProducts(list){
  const cat = document.getElementById('catalogue');
  if(!cat) return;
  cat.innerHTML='';
  list.forEach(p=>{
    const div = document.createElement('div');
    div.className='product';
    div.innerHTML=`
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>€${p.price}</p>
      <button onclick="viewProduct(${p.id})">Voir</button>
      <button onclick="addToCart(${p.id})">Ajouter</button>
    `;
    cat.appendChild(div);
  });
}

function viewProduct(id){
  window.location.href=`product.html?id=${id}`;
}

function addToCart(id){
  if(!currentUser){
    alert("Connectez-vous d'abord !");
    window.location.href="login.html";
    return;
  }
  const prod = products.find(p=>p.id===id);
  cart.push({id:prod.id,name:prod.name,price:prod.price});
  localStorage.setItem('cart',JSON.stringify(cart));
  updateCart();
  alert("Produit ajouté au panier !");
}

function toggleCart(){
  document.getElementById('cart').classList.toggle('open');
  updateCart();
}

function updateCart(){
  const itemsDiv=document.getElementById('cart-items');
  const count=document.getElementById('cart-count');
  const total=document.getElementById('cart-total');
  if(!itemsDiv) return;
  itemsDiv.innerHTML='';
  let sum=0;
  cart.forEach(i=>{
    sum+=i.price;
    const d=document.createElement('div');
    d.className='cart-item';
    d.textContent=`${i.name} - €${i.price}`;
    const btn=document.createElement('button');
    btn.textContent='Supprimer';
    btn.onclick=()=>{
      cart=cart.filter(c=>c.id!==i.id);
      localStorage.setItem('cart',JSON.stringify(cart));
      updateCart();
    };
    d.appendChild(btn);
    itemsDiv.appendChild(d);
  });
  count.textContent=cart.length;
  total.textContent=sum;
}

// Recherche + tri
function filterProducts(){
  const term=document.getElementById('search').value.toLowerCase();
  const filtered=products.filter(p=>p.name.toLowerCase().includes(term));
  displayProducts(filtered);
}
function sortProducts(){
  const order=document.getElementById('sort').value;
  let sorted=[...products];
  if(order==='asc') sorted.sort((a,b)=>a.price-b.price);
  else if(order==='desc') sorted.sort((a,b)=>b.price-a.price);
  displayProducts(sorted);
}

async function checkout(){
  if(cart.length===0){ alert("Panier vide"); return; }
  const res = await fetch('/create-checkout-session',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({items:cart})
  });
  const data=await res.json();
  if(data.url) window.location.href=data.url;
  else alert("Erreur paiement");
}
