const currency = "DKK";

// ✅ 1 Pair also expands now
const bundles = [
  { id: "b1", pairs: 1, price: 195.0, offText: "50% OFF", tag: "", expandedRows: 2 },
  { id: "b2", pairs: 2, price: 345.0, offText: "40% OFF", tag: "Most Popular", expandedRows: 2, compareAtText: `${currency} 195.00` },
  { id: "b3", pairs: 3, price: 528.0, offText: "60% OFF", tag: "", expandedRows: 2 },
];

const sizes = ["S", "M", "L", "XL"];
const colors = ["colour", "Black", "White", "Green", "Blue"];

const listEl = document.getElementById("bundleList");
const totalEl = document.getElementById("totalText");
const addBtn = document.getElementById("addBtn");

// default selection (set "b2" if you want 2 Pair selected by default)
let activeId = "b1";

function money(n) {
  return `${currency} ${Number(n).toFixed(2)}`;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSelect(id, options, selected) {
  const opts = options
    .map(
      (o) =>
        `<option value="${escapeHtml(o)}" ${o === selected ? "selected" : ""}>${escapeHtml(o)}</option>`
    )
    .join("");
  return `<select id="${id}" name="${id}">${opts}</select>`;
}

function setActive(id) {
  activeId = id;
  render();
}

function render() {
  listEl.innerHTML = "";

  bundles.forEach((b) => {
    const card = document.createElement("div");
    card.className = "bundle" + (b.id === activeId ? " active" : "");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.dataset.id = b.id;

    const radio = document.createElement("div");
    radio.className = "radio";

    const left = document.createElement("div");
    left.className = "left";

    const topRow = document.createElement("div");
    topRow.className = "topRow";
    topRow.innerHTML = `
      <div class="pair">${b.pairs} Pair</div>
      <div class="price">${money(b.price)}</div>
    `;

    left.appendChild(topRow);

    if (b.compareAtText) {
      const subRow = document.createElement("div");
      subRow.className = "subRow";
      subRow.innerHTML = `<div class="strike">${b.compareAtText}</div>`;
      left.appendChild(subRow);
    }

    const right = document.createElement("div");
    right.className = "right";
    right.innerHTML = `
      ${b.tag ? `<div class="tag">${b.tag}</div>` : `<div></div>`}
      <div class="off">${b.offText}</div>
    `;

    const details = document.createElement("div");
    details.className = "details";

    if (b.expandedRows > 0) {
      details.innerHTML = `
        <div class="hdrRow">
          <div></div>
          <div class="hdr">Size</div>
          <div class="hdr">Colour</div>
        </div>
        <div class="grid">
          ${Array.from({ length: b.expandedRows })
            .map((_, i) => {
              const idx = i + 1;
              return `
                <div class="idx">#${idx}</div>
                <div>${renderSelect(`size-${b.id}-${idx}`, sizes, "S")}</div>
                <div>${renderSelect(`color-${b.id}-${idx}`, colors, "colour")}</div>
              `;
            })
            .join("")}
        </div>
      `;
    }

    card.appendChild(radio);
    card.appendChild(left);
    card.appendChild(right);
    card.appendChild(details);

    card.addEventListener("click", () => setActive(b.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive(b.id);
      }
    });

    listEl.appendChild(card);
  });

  const active = bundles.find((b) => b.id === activeId);
  totalEl.textContent = money(active.price);
}

addBtn.addEventListener("click", () => {
  const active = bundles.find((b) => b.id === activeId);

  // Collect dropdown selections (only from active card)
  const card = [...document.querySelectorAll(".bundle")].find((c) => c.dataset.id === activeId);
  const selects = card ? [...card.querySelectorAll("select")] : [];
  const selections = selects.map((s) => ({ name: s.name, value: s.value }));

  console.log("ADD TO CART", { bundle: active, selections });
  alert(`Added: ${active.pairs} Pair (${money(active.price)})`);
});

render();
