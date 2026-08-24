// Flat ESLint config pour les cards Home Assistant (vanilla JS / Lit).
// Autonome : aucune dépendance npm requise — l'extension ESLint de VSCode
// embarque son propre moteur. On définit les règles à la main pour éviter
// d'avoir à installer @eslint/js sur le partage SMB.

export default [
  {
    // On ne lint QUE nos cards à la racine de www/
    files: ["*.js"],
    ignores: [
      "community/**", // cards HACS, pas notre code
      "*.backup.js", // sauvegardes
      "eslint.config.js",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // --- Navigateur ---
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        getComputedStyle: "readonly",
        // --- Web Components / Custom Elements ---
        HTMLElement: "readonly",
        customElements: "readonly",
        CustomEvent: "readonly",
        ShadowRoot: "readonly",
        ResizeObserver: "readonly",
        MutationObserver: "readonly",
        IntersectionObserver: "readonly",
        // --- Canvas / SVG (cards néon) ---
        Path2D: "readonly",
        SVGElement: "readonly",
        DOMParser: "readonly",
        // --- Home Assistant / Lovelace ---
        LitElement: "readonly",
        html: "readonly",
        css: "readonly",
        // --- WebSocket (cards live : Sunology, Linux terminal) ---
        WebSocket: "readonly",
      },
    },
    rules: {
      // Erreurs réelles qui cassent une card en prod
      "no-undef": "error", // variable/global non déclaré (le filet n°1)
      "no-unused-vars": ["warn", { args: "none" }],
      "no-const-assign": "error",
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-unreachable": "error",
      "no-cond-assign": "error",
      "use-isnan": "error",
      "valid-typeof": "error",

      // Bonnes pratiques (warn, pas bloquant)
      eqeqeq: ["warn", "smart"], // === plutôt que ==
      "no-var": "warn", // let/const plutôt que var
      "prefer-const": "warn",
      "no-empty": ["warn", { allowEmptyCatch: true }],
    },
  },
];
