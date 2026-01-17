const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));
const mainImg = document.getElementById('mainImg');
const slider = document.getElementById('slider');
const pname = document.getElementById('product-name');
const pdesc = document.getElementById('product-description');
const pprice = document.getElementById('product-price');
const pcolor = document.getElementById('product-color');
const psize = document.getElementById('product-size');
const btn = document.getElementById('add-cart-btn');

let cart = JSON.parse(localStorage.getItem('cart')||'[]');
let currentUser = localStorage.getItem('currentUser');

fetch('products.json').then(r=>r.json()).then(data=>{
  const prod = data.find(p=>p.id===id);
  if(!prod){alert("Produit introuvable"); return;}
  mainImg.src = prod.image;
  pname.textContent = prod.name;
  pdesc.textContent = prod.description;
  pprice.textContent = prod.price;

  prod.colors.forEach(c=>{const o=document.createElement('option'); o.textContent=c; pcolor.appendChild(o);});
  prod.sizes.forEach(s=>{const o=document.createElement('option'); o.textContent=s; psize.appendChild(o);});

  slider.innerHTML='';
  prod.images.forEach(img=>{
    const i = document.createElement('img');
    i.src=img;
    i.onclick=()=>{mainImg.src=img;};
    slider.appendChild(i);
  });

  btn.onclick=()=>{
    if(!currentUser){alert("Connectez-vous d'abord"); window.location.href="login.html"; return;}
    cart.push({id:prod.id,name:prod.name,price:prod.price});
    localStorage.setItem('cart',JSON.stringify(cart));
    alert("Produit ajouté au panier !");
  };
});
