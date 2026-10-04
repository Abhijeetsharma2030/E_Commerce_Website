import "../app/globals.css";

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
  parameters: {
    layout: "centered",

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo"
    }
  },
};

export default preview;