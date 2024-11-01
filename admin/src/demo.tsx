// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { lazy } from 'solid-js';

import { Options } from './app';

export const routes: Options['routes']['private']['routes'] = [
    { path: '/app', component: lazy(() => import('@/app/demo')) },
    { path: '/base', component: lazy(() => import('@/components/base/demo')) },
    { path: '/errors', component: lazy(() => import('@/components/error/demo')) },
    { path: '/button', component: lazy(() => import('@/components/button/demo')) },
    { path: '/dialog', component: lazy(() => import('@/components/dialog/demo')) },
    { path: '/badge', component: lazy(() => import('@/components/badge/demo')) },
    { path: '/divider', component: lazy(() => import('@/components/divider/demo')) },
    { path: '/pagination', component: lazy(() => import('@/components/pagination/demo')) },
    { path: '/icon', component: lazy(() => import('@/components/icon/demo')) },
    { path: '/table', component: lazy(() => import('@/components/table/demo')) },
    { path: '/spin', component: lazy(() => import('@/components/spin/demo')) },
    { path: '/chart', component: lazy(() => import('@/components/chart/demo')) },
    { path: '/page', component: lazy(() => import('@/components/page/demo')) },

    { path: '/tree-list', component: lazy(() => import('@/components/tree/list/demo')) },
    { path: '/tree-menu', component: lazy(() => import('@/components/tree/menu/demo')) },

    { path: '/form', component: lazy(() => import('@/components/form/demo')) },
    { path: '/form-textfield', component: lazy(() => import('@/components/form/textfield/demo')) },
    { path: '/form-textarea', component: lazy(() => import('@/components/form/textarea/demo')) },
    { path: '/form-editor', component: lazy(() => import('@/components/form/editor/demo')) },
    { path: '/form-radio', component: lazy(() => import('@/components/form/radio/demo')) },
    { path: '/form-checkbox', component: lazy(() => import('@/components/form/checkbox/demo')) },
    { path: '/form-choice', component: lazy(() => import('@/components/form/choice/demo')) },
    { path: '/form-date', component: lazy(() => import('@/components/form/date/demo')) },
    { path: '/form-upload', component: lazy(() => import('@/components/form/upload/demo')) },
] as const;
