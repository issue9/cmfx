// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/// <reference types="vite/client" />

declare module '*.vue' {
    import type { defineComponent } from 'vue';
    const component: ReturnType<typeof defineComponent>;
    export default component;
}
