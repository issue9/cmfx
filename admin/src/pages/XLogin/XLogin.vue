<template>
    <div class="d-flex justify-space-around h-75">
        <v-row justify="center">
            <v-col :xxl="1" :xl="2" :lg="3" :md="4" :sm="6" :xs="8" :cols="12"
                class="d-flex justify-space-around flex-column">
                <v-card :title="i.t('_internal.login.title')" flat>
                    <v-divider />
                    <v-form ref="form" class="d-flex justify-space-between flex-column pa-3 mt-3" @submit.prevent="submit">
                        <v-text-field name="username" variant="outlined" prepend-inner-icon="mdi-account-circle"
                            v-model="account.username" :label="i.t('_internal.login.username')" />
                        <v-text-field name="password" variant="outlined" prepend-inner-icon="mdi-lock"
                            v-model="account.password" type="password" :label="i.t('_internal.login.password')" />
                        <v-btn :disabled="!account.username && !account.password" flat type="reset" rounded="xs"
                            class="mb-3 mt-3">{{ i.t('_internal.reset') }}</v-btn>
                        <v-btn :disabled="!account.username || !account.password" flat type="submit" rounded="xs"
                            color="primary">{{ i.t('_internal.ok') }}</v-btn>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VCard, VCol, VRow, VForm, VTextField, VBtn, VDivider } from 'vuetify/components';
import { useInternal } from '@/plugins';
import { SubmitEventPromise } from 'vuetify';

interface Account {
    username: string
    password: string
}

const account = ref<Account>({ username: '', password: '' })

const i = useInternal();
const errors = ref<{ username: string[] }>({ username: ["string"] });

const form = ref<VForm>();

const submit = async (event: SubmitEventPromise) => {
    const rslt = await event;
    //errors.value.username = ['abc'];
    form.value!.isValid = false;
    form.value!.errors.push({ id: 'username', errorMessages: ['string'] });
    console.log('submit', form.value?.errors);
};
</script>
