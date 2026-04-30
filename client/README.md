# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


.search-wrapper { position: relative; z-index: 1; width: 100%; max-width: 600px; }

  .search-box {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.07);
    border: 1.5px solid rgba(206,241,123,0.4);
    border-radius: 16px; padding: 6px 6px 6px 20px; gap: 12px;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(8px);
  }
  .search-box:focus-within {
    border-color: var(--accent);
    background: rgba(255,255,255,0.11);
    box-shadow: 0 0 0 4px rgba(206,241,123,0.15), 0 8px 32px rgba(0,0,0,0.25);
  }

  .ghost-input {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 1rem;
    color: #ffffff; caret-color: var(--accent);
  }
  .ghost-input::placeholder { color: rgba(205,237,179,0.5); }

  .search-hint {
    margin-top: 14px; font-size: 0.78rem;
    color: rgba(205,237,179,0.6); letter-spacing: 0.02em;
  }
  .search-hint strong { color: var(--accent); font-weight: 600; }


        <div className="search-wrapper">
            <div className="search-box">
              <span className="material-symbols-outlined" style={{ color: 'rgba(206,241,123,0.7)', fontSize: 22 }}>search</span>
              <input
                type="text"
                className="ghost-input"
                placeholder="Search medicine (e.g., Paracetamol)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
              />
            </div>
            <div className="search-hint">
              Press <strong>Enter</strong> to start Molecular Search
            </div>
          </div>