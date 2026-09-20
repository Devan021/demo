const customers = [
  { id: 1, name: "Jordan Williams", initials: "JW", email: "jordan.w@demo.test", spent: 1240, orders: 12, last: "Aug 10, 2026", note: "Prefers the essentials range. A good candidate for a replenishment reminder before the seasonal launch.", tone: "pink", tags: ["Repeat buyer", "Email opt-in"] },
  { id: 2, name: "Maya Kim", initials: "MK", email: "maya.k@demo.test", spent: 860, orders: 8, last: "Sep 14, 2026", note: "Added a bundle to cart recently but did not complete checkout. Keep the message helpful, not pushy.", tone: "orange", tags: ["Cart recovery"] },
  { id: 3, name: "Alex Singh", initials: "AS", email: "alex.s@demo.test", spent: 1860, orders: 18, last: "Sep 19, 2026", note: "High-value returning customer. Usually buys premium bundles and responds to early-access offers.", tone: "blue", tags: ["VIP", "Repeat buyer"] },
  { id: 4, name: "Olivia Chen", initials: "OC", email: "olivia.c@demo.test", spent: 430, orders: 4, last: "Sep 18, 2026", note: "New customer acquired through a referral. First purchase went smoothly.", tone: "purple", tags: ["New"] },
  { id: 5, name: "Marcus Reed", initials: "MR", email: "marcus.r@demo.test", spent: 670, orders: 6, last: "Sep 16, 2026", note: "Interested in the travel collection. Asked about gift packaging in a prior note.", tone: "cyan", tags: ["Returning"] }
];

const products = [
  { id: 1, name: "Core Starter Kit", type: "Best seller", price: 48, art: "◒" },
  { id: 2, name: "Daily Essentials", type: "Single item", price: 32, art: "◉" },
  { id: 3, name: "Premium Bundle", type: "Gift set", price: 86, art: "✦" },
  { id: 4, name: "Travel Refill", type: "Add-on", price: 18, art: "◌" }
];

let transactions = [
  { id: "#CS-1048", customer: "Alex Singh", initials: "AS", date: "Today, 10:42 AM", items: "Premium Bundle", amount: 86, tone: "blue" },
  { id: "#CS-1047", customer: "Olivia Chen", initials: "OC", date: "Today, 9:18 AM", items: "Core Starter Kit", amount: 48, tone: "purple" },
  { id: "#CS-1046", customer: "Maya Kim", initials: "MK", date: "Yesterday, 4:32 PM", items: "Daily Essentials × 2", amount: 64, tone: "orange" },
  { id: "#CS-1045", customer: "Jordan Williams", initials: "JW", date: "Yesterday, 1:07 PM", items: "Travel Refill × 3", amount: 54, tone: "pink" }
];

let selectedCustomer = customers[0];
let cart = [];

const fmt = amount => `$${amount.toFixed(2)}`;
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function navigate(view) {
  $$(".view").forEach(el => el.classList.remove("active"));
  $$(".nav-item").forEach(el => el.classList.remove("active"));
  $(`#${view}-view`).classList.add("active");
  $(`.nav-item[data-view="${view}"]`).classList.add("active");
  const titles = {
    dashboard: ["OPERATIONS", "Good morning, Devan."],
    customers: ["CRM DATABASE", "Customers"],
    checkout: ["POINT OF SALE", "New checkout"],
    insights: ["AI ASSISTANT", "Follow-up workspace"],
    transactions: ["SALES LEDGER", "Transaction history"]
  };
  $("#page-kicker").textContent = titles[view][0];
  $("#page-title").textContent = titles[view][1];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTransactions() {
  const row = tx => `<div class="transaction-row">
    <div class="transaction-name"><span class="avatar ${tx.tone}">${tx.initials}</span><span><strong>${tx.customer}</strong><small>${tx.id} · ${tx.date}</small></span></div>
    <span class="category">${tx.items}</span><span class="status">PAID</span><span class="amount">${fmt(tx.amount)}</span>
  </div>`;
  $("#activity-transactions").innerHTML = transactions.slice(0, 4).map(row).join("");
  $("#all-transactions").innerHTML = transactions.map(row).join("");
}

function renderCustomers(query = "") {
  const list = customers.filter(c => `${c.name} ${c.email} ${c.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  $("#customer-count").textContent = `${list.length} customer${list.length === 1 ? "" : "s"}`;
  $("#customer-list").innerHTML = list.map(c => `<button class="customer-row ${c.id === selectedCustomer.id ? "active" : ""}" data-customer="${c.id}">
    <span class="avatar ${c.tone}">${c.initials}</span><span><strong>${c.name}</strong><small>${c.email}</small></span>
    <span class="spent"><strong>${fmt(c.spent)}</strong><small>${c.orders} orders</small></span>
  </button>`).join("");
  $$(".customer-row").forEach(el => el.addEventListener("click", () => {
    selectedCustomer = customers.find(c => c.id === Number(el.dataset.customer));
    renderCustomers($("#customer-search").value);
    renderCustomerDetail();
    renderAI();
  }));
}

function renderCustomerDetail() {
  const c = selectedCustomer;
  $("#customer-detail").innerHTML = `<div class="detail-head"><span class="avatar ${c.tone}">${c.initials}</span><span><h3>${c.name}</h3><p>${c.email}</p></span></div>
    <div class="detail-stat-grid"><div class="detail-stat"><small>LIFETIME VALUE</small><strong>${fmt(c.spent)}</strong></div><div class="detail-stat"><small>ORDERS</small><strong>${c.orders}</strong></div><div class="detail-stat"><small>LAST ORDER</small><strong>${c.last}</strong></div><div class="detail-stat"><small>STATUS</small><strong>Active</strong></div></div>
    <div>${c.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")}</div>
    <div class="note-box"><p class="eyebrow">TEAM NOTE</p><p>${c.note}</p></div>
    <div class="detail-actions"><button class="primary-btn" id="detail-draft">✦ Draft a follow-up</button></div>`;
  $("#detail-draft").addEventListener("click", () => { navigate("insights"); renderAI(); });
}

function emailCopy(c) {
  const isMaya = c.name === "Maya Kim";
  const isAlex = c.name === "Alex Singh";
  return {
    subject: isMaya ? "Still thinking about your essentials?" : isAlex ? "A little early access, just for you" : `A thoughtful follow-up from Clarity`,
    body: isMaya
      ? `Hi Maya,\n\nI noticed you were looking at a few essentials recently. If you had a question or something got in the way, I’m happy to help.\n\nYour cart is still easy to pick up whenever you’re ready. No pressure—just wanted to make sure you have what you need.\n\nWarmly,\nThe Clarity team`
      : isAlex
      ? `Hi Alex,\n\nThank you for being one of our most loyal customers. Since you’ve enjoyed our premium bundles before, I wanted to offer you an early look at what’s coming next.\n\nIf you’d like, I can reserve one for you before the wider release.\n\nWarmly,\nThe Clarity team`
      : `Hi ${c.name.split(" ")[0]},\n\nI wanted to check in and thank you for choosing Clarity. Based on your recent purchases, we thought you might enjoy a simple refresh when the time feels right.\n\nIf there’s anything we can help with, just reply here—we’re happy to make it easy.\n\nWarmly,\nThe Clarity team`
  };
}

function renderAI() {
  const c = selectedCustomer;
  $("#ai-customer-picker").innerHTML = customers.slice(0, 4).map(customer => `<button data-ai-customer="${customer.id}" class="${customer.id === c.id ? "active" : ""}">
    <span class="avatar ${customer.tone}">${customer.initials}</span><span><strong>${customer.name}</strong><small>${fmt(customer.spent)} lifetime value</small></span></button>`).join("");
  $$("#ai-customer-picker button").forEach(button => button.addEventListener("click", () => {
    selectedCustomer = customers.find(customer => customer.id === Number(button.dataset.aiCustomer));
    renderAI(); renderCustomers($("#customer-search").value); renderCustomerDetail();
  }));
  const draft = emailCopy(c);
  $("#ai-context").innerHTML = `<h4>Customer signal</h4><p><span>Last purchase:</span> ${c.last}</p><p><span>History:</span> ${c.orders} orders · ${fmt(c.spent)} lifetime value</p><p><span>Internal note:</span> ${c.note}</p>`;
  $("#email-to").value = `${c.name} <${c.email}>`;
  $("#email-subject").value = draft.subject;
  $("#email-message").value = draft.body;
}

function renderProducts() {
  $("#product-grid").innerHTML = products.map(p => `<button class="product" data-product="${p.id}"><div class="product-art">${p.art}</div><strong>${p.name}</strong><small>${p.type}</small><b>${fmt(p.price)}</b></button>`).join("");
  $$(".product").forEach(button => button.addEventListener("click", () => {
    const product = products.find(p => p.id === Number(button.dataset.product));
    const item = cart.find(i => i.id === product.id);
    item ? item.qty++ : cart.push({ ...product, qty: 1 });
    renderCart();
    showToast(`${product.name} added to the cart`);
  }));
}

function renderCart() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * .08;
  const total = subtotal + tax;
  $("#cart-items").innerHTML = cart.length ? cart.map(item => `<div class="cart-item"><div class="product-art">${item.art}</div><span><strong>${item.name}</strong><small>${fmt(item.price)} each</small></span><div class="qty-controls"><button data-change="${item.id}" data-delta="-1">−</button><b>${item.qty}</b><button data-change="${item.id}" data-delta="1">+</button></div></div>`).join("") : `<div class="empty-cart">Your cart is empty.<br/><small>Add a product to get started.</small></div>`;
  $("#subtotal").textContent = fmt(subtotal); $("#tax").textContent = fmt(tax); $("#total").textContent = fmt(total); $("#checkout-total").textContent = fmt(total);
  $("#complete-sale").disabled = !cart.length;
  $$(".qty-controls button").forEach(button => button.addEventListener("click", () => {
    const item = cart.find(i => i.id === Number(button.dataset.change));
    item.qty += Number(button.dataset.delta);
    if (item.qty <= 0) cart = cart.filter(i => i.id !== item.id);
    renderCart();
  }));
}

function populateCustomerSelect() {
  const select = $("#sale-customer");
  select.innerHTML = `<option value="">Walk-in customer</option>${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}`;
  select.addEventListener("change", () => $("#cart-customer").textContent = select.value ? customers.find(c => c.id === Number(select.value)).name : "Walk-in customer");
}

function completeSale() {
  const customer = $("#sale-customer").value ? customers.find(c => c.id === Number($("#sale-customer").value)) : { name: "Walk-in customer", initials: "WI", tone: "cyan" };
  const amount = cart.reduce((sum, item) => sum + item.price * item.qty, 0) * 1.08;
  const items = cart.map(item => `${item.name}${item.qty > 1 ? ` × ${item.qty}` : ""}`).join(", ");
  transactions.unshift({ id: `#CS-${1049 + transactions.length}`, customer: customer.name, initials: customer.initials, tone: customer.tone, date: "Just now", items, amount });
  if (customer.id) {
    customer.orders++;
    customer.spent += amount;
    customer.last = "Today";
  }
  cart = [];
  renderCart(); renderTransactions(); renderCustomers($("#customer-search").value); renderCustomerDetail(); renderAI();
  showToast(`Demo payment approved · receipt ${transactions[0].id} created`);
}

function openModal() { $("#customer-modal").classList.add("open"); $("#customer-modal").setAttribute("aria-hidden", "false"); $("#form-name").focus(); }
function closeModal() { $("#customer-modal").classList.remove("open"); $("#customer-modal").setAttribute("aria-hidden", "true"); }

$$(".nav-item").forEach(button => button.addEventListener("click", () => navigate(button.dataset.view)));
$$("[data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));
$$("[data-draft]").forEach(button => button.addEventListener("click", () => { selectedCustomer = customers.find(c => c.name === button.dataset.draft); navigate("insights"); renderAI(); }));
$("#new-customer").addEventListener("click", openModal); $("#new-customer-alt").addEventListener("click", openModal);
$("#customer-modal").addEventListener("click", event => { if (event.target === $("#customer-modal") || event.target.closest("[data-close]")) closeModal(); });
$("#customer-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#form-name").value.trim(), email = $("#form-email").value.trim(), note = $("#form-note").value.trim();
  const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const newCustomer = { id: Date.now(), name, initials, email, spent: 0, orders: 0, last: "No orders yet", note: note || "No internal note yet.", tone: "cyan", tags: ["New"] };
  customers.unshift(newCustomer); selectedCustomer = newCustomer; event.target.reset(); closeModal();
  renderCustomers(); renderCustomerDetail(); renderAI(); populateCustomerSelect(); showToast(`${name} added to the CRM`);
});
$("#customer-search").addEventListener("input", event => renderCustomers(event.target.value));
$("#clear-cart").addEventListener("click", () => { cart = []; renderCart(); });
$("#complete-sale").addEventListener("click", completeSale);
$("#regenerate").addEventListener("click", () => { const message = $("#email-message"); message.value = message.value.replace("I wanted to", "I thought I’d").replace("just reply here", "send us a note"); showToast("A fresh demo variation is ready"); });
$("#copy-email").addEventListener("click", async () => {
  const content = `To: ${$("#email-to").value}\nSubject: ${$("#email-subject").value}\n\n${$("#email-message").value}`;
  try { await navigator.clipboard.writeText(content); showToast("Draft copied to clipboard"); } catch { showToast("Draft ready to copy"); }
});

renderTransactions(); renderCustomers(); renderCustomerDetail(); renderProducts(); renderCart(); populateCustomerSelect(); renderAI();
