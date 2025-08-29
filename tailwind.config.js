/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        // Match your navbar / UI color scheme
        primary: "#1E3A8A",      // navbar blue
        secondary: "#2563EB",    // buttons or highlights
        accent: "#FBBF24",       // accent/yellow
        background: "#F3F4F6",   // page background
        card: "#FFFFFF",         // comment boxes, timeline background
        muted: "#6B7280",        // muted text
      },
      borderRadius: {
        lg: "0.75rem",           // rounded for cards/comments
      },
      maxHeight: {
        'screen-80': '80vh',     // for scrollable comment sections
      },
    },
  },
  plugins: [],
};