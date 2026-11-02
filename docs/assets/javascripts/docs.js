// Accessible enlargement for console screenshots; the image link works without JavaScript.
(() => {
  let lastTrigger;
  const dialog = document.createElement("dialog");
  dialog.className = "docs-image-dialog";
  dialog.setAttribute("aria-labelledby", "docs-image-title");
  dialog.innerHTML = `<header><p id="docs-image-title"></p><div><a class="docs-original" target="_blank" rel="noopener">Open original ↗</a><button type="button" class="docs-image-close" aria-label="Close screenshot">Close <span aria-hidden="true">×</span></button></div></header><div class="docs-image-body"><img alt=""></div>`;
  document.body.append(dialog);
  const image = dialog.querySelector("img");
  const close = () => dialog.close();
  dialog.querySelector("button").addEventListener("click", close);
  dialog.addEventListener("click", event => { if (event.target === dialog) close(); });
  dialog.addEventListener("close", () => lastTrigger?.focus());
  const openLinkedMethod = () => {
    if (!location.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    const block = target?.closest(".tabbed-block");
    const set = block?.closest(".tabbed-set");
    if (!set) return;
    const index = [...set.querySelectorAll(":scope > .tabbed-content > .tabbed-block")].indexOf(block);
    const input = set.querySelectorAll(":scope > input")[index];
    if (input) {
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      target.scrollIntoView({ block: "start" });
    }
  };
  window.addEventListener("hashchange", openLinkedMethod);
  requestAnimationFrame(openLinkedMethod);
  document.addEventListener("click", event => {
    const target = event.target.closest("a[data-docs-zoom]");
    if (!target || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    lastTrigger = target;
    const original = target.querySelector("img");
    image.src = target.href;
    image.alt = original.alt;
    dialog.querySelector("#docs-image-title").textContent = original.alt;
    dialog.querySelector(".docs-original").href = target.href;
    dialog.showModal();
  });
})();

// Synchronize the native action tabs and remember the customer's preferred interface.
(() => {
  const picker = document.querySelector('.docs-method-picker');
  if (!picker) return;
  const sets = [...document.querySelectorAll('.tabbed-set')];
  const key = 'nubestack.docs.interface';
  const methods = [...sets[0].querySelectorAll(".tabbed-labels > label")].map(label => label.textContent.trim());
  let applying = false;
  const labelFor = input => document.querySelector(`label[for="${input.id}"]`)?.textContent.trim();
  const apply = (method, remember = true) => {
    if (applying) return;
    applying = true;
    for (const set of sets) {
      const input = [...set.querySelectorAll(':scope > input')].find(input => labelFor(input) === method);
      if (input && !input.checked) {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    picker.querySelectorAll('[data-interface-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.interfaceChoice === method)));
    document.documentElement.classList.toggle('docs-interface-api', method === 'API');
    if (remember) { try { localStorage.setItem(key, method); } catch { /* Private storage may be unavailable. */ } }
    applying = false;
  };
  picker.hidden = false;
  picker.addEventListener('click', event => {
    const button = event.target.closest('[data-interface-choice]');
    if (button) apply(button.dataset.interfaceChoice);
  });
  document.addEventListener('change', event => {
    if (event.target.matches('.tabbed-set > input') && event.target.checked) {
      const method = labelFor(event.target);
      if (methods.includes(method)) apply(method);
    }
  });
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Native tabs remain usable. */ }
  apply(methods.includes(saved) ? saved : labelFor(sets[0]?.querySelector(':scope > input:checked')) || 'Console', false);
})();
