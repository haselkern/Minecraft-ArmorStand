import { createApp } from "troisjs"
import { createI18n } from "vue-i18n"
import App from "./App.vue"
import "./main.css"

// Setup internationalization
import messages from '@intlify/vite-plugin-vue-i18n/messages'
const i18n = createI18n({
    locale: "en",
    fallbackLocale: "en",
    messages
})

createApp(App).use(i18n).mount("#app")
