/** @type {import('tailwindcss').Config} */
const roles = [
  "canvas", "surface-1", "surface-2", "surface-elevated",
  "border-subtle", "border-strong", "text-primary", "text-secondary", "text-muted",
  "primary", "primary-hover", "on-primary", "secondary", "secondary-subtle",
  "focus", "danger", "danger-hover", "danger-subtle", "on-danger",
];

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: Object.fromEntries(roles.map((role) => [role, `var(--color-${role})`])),
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
      },
      fontSize: {
        display: ["56px", { lineHeight: "64px", fontWeight: "800", letterSpacing: "-0.03em" }],
        "display-mobile": ["36px", { lineHeight: "44px", fontWeight: "800", letterSpacing: "-0.03em" }],
        "heading-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "heading-lg-mobile": ["26px", { lineHeight: "34px", fontWeight: "700" }],
        "heading-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "heading-sm": ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "body-lg": ["16px", "26px"], body: ["14px", "22px"],
        "body-sm": ["13px", "18px"],
        label: ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "600" }],
      },
      spacing: Object.fromEntries([4, 8, 12, 16, 24, 32, 40, 56, 72].map((value, index) => [`space-${index + 1}`, `${value}px`])),
      borderRadius: { control: "8px", "surface-sm": "4px", surface: "12px", "surface-lg": "16px" },
    },
  },
  plugins: [],
};
