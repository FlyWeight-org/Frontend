import type { LocaleMessage } from "@intlify/core-base";
import type { VueMessageType } from "vue-i18n";
import en from "@/i18n/en/messages";

const messages: Record<string, LocaleMessage<VueMessageType>> = { en }; //TODO better type?
export default messages;
