<template>
    <v-toolbar class="pl-4">{{ i.t('_internal.settings') }}</v-toolbar>
    <div class="pa-4">
        adafsdfasdf<br />
        adafsdfasdf<br />
    </div>

    <div class="pa-4">
        <v-label class="w-100"><v-icon icon='mdi-theme-light-dark' />&nbsp;{{ i.t('_internal.theme.mode')
        }}&nbsp;<v-divider /></v-label>
        <v-radio-group>
            <v-radio value="system">
                <template v-slot:label>
                    <v-icon icon='mdi-desktop-classic' />&nbsp;{{ i.t('_internal.theme.system') }}
                </template>
            </v-radio>

            <v-radio value="dark">
                <template v-slot:label>
                    <v-icon icon='mdi-weather-night' />&nbsp;{{ i.t('_internal.theme.dark') }}
                </template>
            </v-radio>

            <v-radio value="light">
                <template v-slot:label>
                    <v-icon icon='mdi-white-balance-sunny' />&nbsp;{{ i.t('_internal.theme.light') }}
                </template>
            </v-radio>
        </v-radio-group>

        <v-label class="w-100"><v-icon icon='mdi-brightness-percent' />&nbsp;{{ i.t('_internal.contrast.contrast')
        }}&nbsp;<v-divider /></v-label>
        <v-radio-group>
            <v-radio value="standard">
                <template v-slot:label>
                    <v-icon icon='mdi-brightness-5' />&nbsp;{{ i.t('_internal.contrast.standard') }}
                </template>
            </v-radio>

            <v-radio value="medium">
                <template v-slot:label>
                    <v-icon icon='mdi-brightness-6' />&nbsp;{{ i.t('_internal.contrast.medium') }}
                </template>
            </v-radio>

            <v-radio value="high">
                <template v-slot:label>
                    <v-icon icon='mdi-brightness-7' />&nbsp;{{ i.t('_internal.contrast.high') }}
                </template>
            </v-radio>
        </v-radio-group>

        <v-label class="w-100"><v-icon icon='mdi-palette' />&nbsp;{{ i.t('_internal.theme.primaryColor')
        }}&nbsp;<v-divider /></v-label>
        <v-radio-group inline>
            <v-radio false-icon="mdi-checkbox-blank" true-icon="mdi-checkbox-marked" base-color="red" color="red"
                value="red" />
            <v-radio false-icon="mdi-checkbox-blank" true-icon="mdi-checkbox-marked" base-color="green" color="green"
                value="green" />
        </v-radio-group>

        <v-label class="w-100"><v-icon icon='mdi-translate' />&nbsp;{{ i.t('_internal.locale.locale')
        }}&nbsp;<v-divider /></v-label>
        <v-select class="mt-4" :label="i.t('_internal.locale.uiLanguage')" :items="languages"
            @change="(v: string) => i.locale = v" />
    </div>
</template>

<script setup lang="ts">
import { VLabel, VToolbar, VRadioGroup, VRadio, VDivider, VIcon, VSelect } from 'vuetify/components';
import { useInternal } from '@/plugins';
interface Language { title: string, value: string }

const i = useInternal();
const languages: Array<Language> = [];
i.supportedLanguages.forEach((val, key) => {
    languages.push({ title: key, value: val });
});
</script>
