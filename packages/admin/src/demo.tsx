// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { lazy } from 'solid-js';

import { Route } from '@admin/components';

export const routes: Array<Route> = [
    { path: '/app', component: lazy(() => import('@admin/app/demo')) },
    { path: '/backtop', component: lazy(() => import('@admin/components/backtop/demo')) },
    { path: '/badge', component: lazy(() => import('@admin/components/badge/demo')) },
    { path: '/base', component: lazy(() => import('@admin/components/base/demo')) },
    { path: '/button', component: lazy(() => import('@admin/components/button/demo')) },
    { path: '/card', component: lazy(() => import('@admin/components/card/demo')) },
    { path: '/chart', component: lazy(() => import('@admin/components/chart/demo')) },
    { path: '/dialog', component: lazy(() => import('@admin/components/dialog/demo')) },
    { path: '/divider', component: lazy(() => import('@admin/components/divider/demo')) },
    { path: '/errors', component: lazy(() => import('@admin/components/error/demo')) },
    { path: '/icon', component: lazy(() => import('@admin/components/icon/demo')) },
    { path: '/pagination', component: lazy(() => import('@admin/components/pagination/demo')) },
    { path: '/page', component: lazy(() => import('@admin/components/page/demo')) },
    { path: '/qrcode', component: lazy(() => import('@admin/components/qrcode/demo')) },
    { path: '/spin', component: lazy(() => import('@admin/components/spin/demo')) },
    { path: '/table', component: lazy(() => import('@admin/components/table/demo')) },
    { path: '/tab', component: lazy(() => import('@admin/components/tab/demo')) },
    { path: '/timer', component: lazy(() => import('@admin/components/timer/demo')) },

    { path: '/tree-list', component: lazy(() => import('@admin/components/tree/list/demo')) },
    { path: '/tree-menu', component: lazy(() => import('@admin/components/tree/menu/demo')) },
    
    { path: '/typography', component: lazy(() => import('@admin/components/typography/demo')) },

    { path: '/form', component: lazy(() => import('@admin/components/form/demo')) },
    { path: '/form-checkbox', component: lazy(() => import('@admin/components/form/checkbox/demo')) },
    { path: '/form-choice', component: lazy(() => import('@admin/components/form/choice/demo')) },
    { path: '/form-date', component: lazy(() => import('@admin/components/form/date/demo')) },
    { path: '/form-editor', component: lazy(() => import('@admin/components/form/editor/demo')) },
    { path: '/form-radio', component: lazy(() => import('@admin/components/form/radio/demo')) },
    { path: '/form-range', component: lazy(() => import('@admin/components/form/range/demo')) },
    { path: '/form-textfield', component: lazy(() => import('@admin/components/form/textfield/demo')) },
    { path: '/form-textarea', component: lazy(() => import('@admin/components/form/textarea/demo')) },
    { path: '/form-upload', component: lazy(() => import('@admin/components/form/upload/demo')) },
] as const;
