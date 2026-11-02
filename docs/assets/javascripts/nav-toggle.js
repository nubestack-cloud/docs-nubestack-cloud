/* The header button that hides and shows the left-hand navigation on desktop. The choice is kept
   in localStorage ("ns.nav") and set on <html data-ns-nav="hidden"> before the first paint by
   overrides/main.html; extra.css does the hiding. The click is delegated, so it survives instant
   navigation replacing the header's parts. */
(function () {
  var root = document.documentElement;

  function sync() {
    var hidden = root.dataset.nsNav === "hidden";
    document.querySelectorAll(".ns-nav-toggle").forEach(function (button) {
      button.setAttribute("aria-expanded", String(!hidden));
    });
    var nav = document.querySelector(".md-sidebar--primary");
    if (nav) nav.id = "ns-nav";
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".ns-nav-toggle")) return;
    var hidden = root.dataset.nsNav !== "hidden";
    if (hidden) root.dataset.nsNav = "hidden";
    else delete root.dataset.nsNav;
    try { localStorage.setItem("ns.nav", hidden ? "hidden" : "shown"); } catch (e) {}
    sync();
  });

  if (typeof document$ !== "undefined") document$.subscribe(sync);
  else sync();
})();

/* The home page's search box is a label for Material's search toggle; let Enter and Space open it
   too, as they would a button. */
document.addEventListener("keydown", function (event) {
  var box = event.target.closest && event.target.closest(".ns-search");
  if (box && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    box.click();
  }
});

/* Opening search from that box leaves focus on the box; put it in the search field. */
document.addEventListener("click", function (event) {
  if (!event.target.closest(".ns-search")) return;
  setTimeout(function () {
    var input = document.querySelector(".md-search__input");
    if (input) input.focus();
  }, 50);
});
