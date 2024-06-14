<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" v-if="isLogin">
            <v-list-item :title="admin.siteTitle" :append-avatar="admin.logo">
            </v-list-item>
            <v-divider />

            <v-list-item v-for="(item, index) of menus" :key="index">
                {{ item.title }}
            </v-list-item>

            <template v-slot:append v-if="footer">
                <v-divider />
                <a :href="item.key" v-for="(item, index) of footer" :key="index">
                    {{ item.title }}
                </a>
            </template>
        </v-navigation-drawer>

        <v-app-bar>
            <template v-slot:prepend v-if="isLogin">
                <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title>{{ admin.pageTitle }}</v-app-bar-title>

            <template v-slot:append>
                <v-btn v-tooltip="t('_internal.fullscreen')"
                    :icon="fullscreen.isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
                    @click="fullscreen.toggle"></v-btn>
            </template>
        </v-app-bar>

        <v-main id="main">
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    VNavigationDrawer, VMain, VApp, VListItem, VDivider, VBtn,
} from 'vuetify/components';

import { useInternal } from '@/plugins';
import { useFullscreen } from '@vueuse/core';

const { admin, menus, footer, t } = useInternal();
const fullscreen = useFullscreen();
const drawer = ref(true);
admin.locale = 'zhHans';

const isLogin = ref(false);
admin.isLogin().then((v) => { isLogin.value = v; });

</script>
