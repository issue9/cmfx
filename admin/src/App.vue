<template>
    <VApp>
        <VNavigationDrawer v-model="isLogin">
            <VListItem>
                abc
            </VListItem>
            <VDivider />

            <VListItem>
                item
            </VListItem>
        </VNavigationDrawer>
        <VMain>
            abc
        </VMain>
    </VAPp>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VNavigationDrawer, VMain, VApp, VListItem, VDivider } from 'vuetify/components';

const isLogin = ref(false);

</script>
