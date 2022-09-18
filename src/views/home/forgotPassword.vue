<template>
  <h2>{{ t("home.forgotPassword.title") }}</h2>
  <p>{{ t("home.forgotPassword.description") }}</p>
  <form method="post" :action="URL" @submit.prevent="submitHandler">
    <field
      type="email"
      v-model="form.email"
      object="form"
      field="email"
      :label="t('pilot.email')"
      required
      autocomplete="email"
      data-cy="forgot-password-email"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('home.forgotPassword.button')"
        :class="{ processing: isProcessing }"
        data-cy="forgot-password-submit"
      />

      <p>
        <router-link to="/login"
          >{{ t("home.forgotPassword.cancelButton") }}
        </router-link>
      </p>
    </fieldset>

    <p class="success" v-if="success" data-cy="forgot-password-success">
      {{ t("home.forgotPassword.success", { email: form.email }) }}
    </p>
    <p class="error" v-if="error">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { reactive, ref } from "vue";
import config from "@/config";
import Field from "@/components/field.vue";
import { errorToString } from "@/utils/errors";
import { useAccountStore } from "@/stores/modules/account";

const { t } = useI18n();
const accountStore = useAccountStore();

interface ForgotPasswordForm {
  email: string;
}

const form = reactive<ForgotPasswordForm>({
  email: "",
});
const URL = `${config.APIURL}/password_resets.json`;
const success = ref<boolean>(false);
const error = ref<string | null>(null);
const isProcessing = ref<boolean>(false);

async function submitHandler() {
  isProcessing.value = true;
  success.value = false;

  try {
    await accountStore.forgotPassword(form.email);
    success.value = true;
  } catch (err) {
    error.value = errorToString(err);
  }
  isProcessing.value = false;
}
</script>
