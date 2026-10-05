/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import i18n from "@/locales";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n } from "vue-i18n";

// Composables
import { createVuetify } from "vuetify";

const THEME_STORAGE_KEY = "theme";

// Components, directives, icons and styles are auto-imported by vite-plugin-vuetify
const vuetify = createVuetify({
  defaults: {
    VSwitch: {
      color: "primary",
    },
    VTextField: {
      variant: "underlined",
    },
    VSelect: {
      variant: "outlined",
    },
    VCombobox: {
      variant: "outlined",
    },
    VTabs: {
      color: "primary",
    },
  },
  theme: {
    defaultTheme: localStorage.getItem(THEME_STORAGE_KEY) || "light",
    themes: {
      light: {
        colors: {
          primary: "#b00000",
          background: "#f5f5f5",
        },
      },
      dark: {
        colors: {
          primary: "#b02222",
        },
      },
    },
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});

// Remember the user's theme choice
watch(vuetify.theme.global.name, (name) => {
  localStorage.setItem(THEME_STORAGE_KEY, name);
});

export default vuetify;
