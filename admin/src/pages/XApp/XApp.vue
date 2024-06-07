<template>
    <v-app>
        <v-navigation-drawer v-model="isLogin">
            <v-list-item>
                abcdef
            </v-list-item>
            <v-divider />

            <v-list-item>
                item
            </v-list-item>
        </v-navigation-drawer>

        <v-app-bar>
            <template v-slot:prepend>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title>{{admin.pageTitle}}</v-app-bar-title>

            <template v-slot:append>
                <v-btn icon="mdi-heart"></v-btn>
                <v-btn :icon="fullscreen.isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" @click="fullscreen.toggle"></v-btn>
            </template>
        </v-app-bar>

        <v-main>
            abcdef
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VNavigationDrawer, VMain, VApp, VListItem, VDivider, VBtn } from 'vuetify/components';

import { useAdmin } from '@/plugins';
import { useFullscreen } from '@vueuse/core';

const admin = useAdmin();
const fullscreen = useFullscreen();

const isLogin = ref(false);

</script>
