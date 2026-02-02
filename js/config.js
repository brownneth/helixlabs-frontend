const CONFIG = {
    API_BASE_URL: "http://127.0.0.1:5000"
};
window.tailwind = {
    config: {
        theme: {
            extend: {
                colors: {
                    "primary": "#195de6",
                    "background-light": "#f6f6f8",
                },
                fontFamily: {
                    "display": ["Inter", "sans-serif"],
                    "mono": ["Roboto Mono", "Fira Code", "monospace"],
                },
                borderRadius: {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
                },
            },
        },
    }
};