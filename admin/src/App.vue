<template>
    <v-app>
        <v-navigation-drawer v-model="isLogin">
            <v-list-item>
                abc
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
                <v-btn icon="mdi-fullscreen"></v-btn>
            </template>
        </v-app-bar>
        
        <v-main>
            abc
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VNavigationDrawer, VMain, VApp, VListItem, VDivider, VBtn } from 'vuetify/components';

import { useAdmin } from '@/plugins';

const admin = useAdmin();

const isLogin = ref(false);

</script>
