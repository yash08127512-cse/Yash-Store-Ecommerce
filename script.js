const products = [
  {id:1,name:"Studio Headphones",category:"Tech",price:2499,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",tag:"BESTSELLER"},
  {id:2,name:"Everyday Tote",category:"Lifestyle",price:899,image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",tag:"JUST IN"},
  {id:3,name:"Classic Watch",category:"Accessories",price:3299,image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80",tag:"POPULAR"},
  {id:4,name:"Minimal Speaker",category:"Tech",price:1799,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80",tag:""},
  {id:5,name:"Travel Bottle",category:"Lifestyle",price:599,image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80",tag:"EASY PICK"},
  {id:6,name:"Everyday Cap",category:"Accessories",price:499,image:"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=80",tag:""},
  {id:7,name:"Wireless Mouse",category:"Tech",price:1199,image:"https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80",tag:""},
  {id:8,name:"Canvas Journal",category:"Lifestyle",price:449,image:"https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80",tag:"NEW"}
];

let activeCategory="All";
let cart=JSON.parse(localStorage.getItem("yashStoreCart")||"[]");
const $=id=>document.getElementById(id);
const grid=$("product-grid"), search=$("search-input"), drawer=$("cart-drawer"), overlay=$("cart-overlay");
const money=value=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);

function renderProducts(){
  const query=search.value.trim().toLowerCase();
  const visible=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&p.name.toLowerCase().includes(query));
  grid.innerHTML=visible.map(p=>`
    <article class="product-card">
      <div class="product-visual">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.background='#e9ecdf';this.parentElement.insertAdjacentHTML('beforeend','<span style=&quot;font-size:48px&quot;>✳</span>')">
      </div>
      <div class="product-info"><span class="product-category">${p.category}</span>
        <div class="product-name-row"><span class="product-name">${p.name}</span><span class="product-price">${money(p.price)}</span></div>
        <button class="add-button" data-add="${p.id}">Add to bag&nbsp; +</button>
      </div>
    </article>`).join("");
  $("empty-state").classList.toggle("hidden",visible.length>0);
}
function saveCart(){localStorage.setItem("yashStoreCart",JSON.stringify(cart));renderCart()}
function addToCart(id){const item=cart.find(x=>x.id===id);item?item.quantity++:cart.push({id,quantity:1});saveCart();toast("Added to your bag")}
function updateQuantity(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.quantity+=delta;cart=cart.filter(x=>x.quantity>0);saveCart()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function renderCart(){
  $("cart-count").textContent=cart.reduce((n,x)=>n+x.quantity,0);
  const total=cart.reduce((sum,x)=>{const p=products.find(y=>y.id===x.id);return sum+(p?p.price*x.quantity:0)},0);
  $("cart-total").textContent=money(total);$("cart-empty").classList.toggle("hidden",cart.length>0);
  $("cart-items").innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);if(!p)return"";return`
    <div class="cart-row"><img class="cart-thumb" src="${p.image}" alt="">
      <div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="quantity-control">
      <button data-qty="${p.id}" data-delta="-1" aria-label="Decrease">−</button><span>${x.quantity}</span>
      <button data-qty="${p.id}" data-delta="1" aria-label="Increase">+</button></div></div>
      <button class="remove-button" data-remove="${p.id}">Remove</button></div>`}).join("");
}
function openCart(){drawer.classList.add("open");overlay.classList.remove("hidden");drawer.setAttribute("aria-hidden","false")}
function closeCart(){drawer.classList.remove("open");overlay.classList.add("hidden");drawer.setAttribute("aria-hidden","true")}
let toastTimer;function toast(message){$("toast").textContent=message;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2100)}

$("category-filters").addEventListener("click",e=>{const button=e.target.closest("[data-category]");if(!button)return;activeCategory=button.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));renderProducts()});
search.addEventListener("input",renderProducts);
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add))});
$("cart-items").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q)updateQuantity(Number(q.dataset.qty),Number(q.dataset.delta));if(r)removeItem(Number(r.dataset.remove))});
$("open-cart").addEventListener("click",openCart);$("close-cart").addEventListener("click",closeCart);overlay.addEventListener("click",closeCart);
$("checkout-button").addEventListener("click",()=>toast(cart.length?"Demo checkout: payment is not connected":"Your bag is empty"));
$("search-focus").addEventListener("click",()=>{document.querySelector("#shop").scrollIntoView({behavior:"smooth"});search.focus()});
$("newsletter-form").addEventListener("submit",e=>{e.preventDefault();toast("Thanks! This demo form does not save emails.");e.target.reset()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
$("year").textContent=new Date().getFullYear();renderProducts();renderCart();
