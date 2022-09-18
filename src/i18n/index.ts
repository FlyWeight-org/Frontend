import { createI18n } from "vue-i18n";
import messages from "@/i18n/messages";
import numberFormats from "@/i18n/numberFormats";
import dateTimeFormats from "@/i18n/dateTimeFormats";

const i18n = createI18n({
  messages,
  numberFormats,
  datetimeFormats: dateTimeFormats,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  allowComposition: true,
});

export default i18n;
export const { global } = i18n;
