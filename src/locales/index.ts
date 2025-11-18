import { createI18n } from "vue-i18n";
import { en, ja } from "vuetify/locale";
import enCustom from "@/locales/en.json";
import jaCustom from "@/locales/ja.json";

const messages = {
    en: {
        ...enCustom,
        $vuetify: {
            ...en,
        },
    },
    ja: {
        ...jaCustom,
        $vuetify: {
            ...ja,
        },
    },
};

export default createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: "en",
    messages,
});

