module.exports = {
    purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            flex: {
                "2": "2 2 0%",
                "3": "3 3 0%",
            },
            margin: {
                "60": "60%",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
