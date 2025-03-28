// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { lazy } from 'solid-js';

import { Route } from '@/context';

export const routes: Array<Route> = [
    { path: '/app', component: lazy(() => import('@/app/demo')) },
    { path: '/backtop', component: lazy(() => import('@/components/backtop/demo')) },
    { path: '/badge', component: lazy(() => import('@/components/badge/demo')) },
    { path: '/base', component: lazy(() => import('@/components/base/demo')) },
    { path: '/button', component: lazy(() => import('@/components/button/demo')) },
    { path: '/card', component: lazy(() => import('@/components/card/demo')) },
    { path: '/chart', component: lazy(() => import('@/components/chart/demo')) },
    { path: '/dialog', component: lazy(() => import('@/components/dialog/demo')) },
    { path: '/divider', component: lazy(() => import('@/components/divider/demo')) },
    { path: '/errors', component: lazy(() => import('@/components/error/demo')) },
    { path: '/icon', component: lazy(() => import('@/components/icon/demo')) },
    { path: '/pagination', component: lazy(() => import('@/components/pagination/demo')) },
    { path: '/page', component: lazy(() => import('@/components/page/demo')) },
    { path: '/qrcode', component: lazy(() => import('@/components/qrcode/demo')) },
    { path: '/spin', component: lazy(() => import('@/components/spin/demo')) },
    { path: '/table', component: lazy(() => import('@/components/table/demo')) },
    { path: '/tab', component: lazy(() => import('@/components/tab/demo')) },
    { path: '/timer', component: lazy(() => import('@/components/timer/demo')) },

    { path: '/tree-list', component: lazy(() => import('@/components/tree/list/demo')) },
    { path: '/tree-menu', component: lazy(() => import('@/components/tree/menu/demo')) },
    
    { path: '/typography', component: lazy(() => import('@/components/typography/demo')) },

    { path: '/form', component: lazy(() => import('@/components/form/demo')) },
    { path: '/form-checkbox', component: lazy(() => import('@/components/form/checkbox/demo')) },
    { path: '/form-choice', component: lazy(() => import('@/components/form/choice/demo')) },
    { path: '/form-date', component: lazy(() => import('@/components/form/date/demo')) },
    { path: '/form-editor', component: lazy(() => import('@/components/form/editor/demo')) },
    { path: '/form-radio', component: lazy(() => import('@/components/form/radio/demo')) },
    { path: '/form-textfield', component: lazy(() => import('@/components/form/textfield/demo')) },
    { path: '/form-textarea', component: lazy(() => import('@/components/form/textarea/demo')) },
    { path: '/form-upload', component: lazy(() => import('@/components/form/upload/demo')) },
] as const;
