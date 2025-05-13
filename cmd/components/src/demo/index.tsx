// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';

export const routes: Array<RouteDefinition> = [
    { path: '/backtop', component: lazy(() => import('./backtop')) },
    { path: '/badge', component: lazy(() => import('./badge')) },
    { path: '/base', component: lazy(() => import('./base')) },
    { path: '/button', component: lazy(() => import('./button')) },
    { path: '/card', component: lazy(() => import('./card')) },
    { path: '/chart', component: lazy(() => import('./chart')) },
    { path: '/context', component: lazy(() => import('./context')) },
    { path: '/dialog', component: lazy(() => import('./dialog')) },
    { path: '/divider', component: lazy(() => import('./divider')) },
    { path: '/errors', component: lazy(() => import('./error')) },
    { path: '/icon', component: lazy(() => import('./icon')) },
    { path: '/notify', component: lazy(() => import('./notify')) },
    { path: '/pagination', component: lazy(() => import('./pagination')) },
    { path: '/page', component: lazy(() => import('./page')) },
    { path: '/qrcode', component: lazy(() => import('./qrcode')) },
    { path: '/spin', component: lazy(() => import('./spin')) },
    { path: '/table', component: lazy(() => import('./table')) },
    { path: '/tab', component: lazy(() => import('./tab')) },
    { path: '/theme', component: lazy(() => import('./theme')) },
    { path: '/timer', component: lazy(() => import('./timer')) },

    { path: '/tree-list', component: lazy(() => import('./tree/list')) },
    { path: '/tree-menu', component: lazy(() => import('./tree/menu')) },
    
    { path: '/typography', component: lazy(() => import('./typography')) },

    { path: '/wizard-stepper', component: lazy(() => import('./wizard/stepper')) },
    { path: '/wizard-tour', component: lazy(() => import('./wizard/tour')) },

    { path: '/form', component: lazy(() => import('./form')) },
    { path: '/form-checkbox', component: lazy(() => import('./form/checkbox')) },
    { path: '/form-choice', component: lazy(() => import('./form/choice')) },
    { path: '/form-date', component: lazy(() => import('./form/date')) },
    { path: '/form-editor', component: lazy(() => import('./form/editor')) },
    { path: '/form-radio', component: lazy(() => import('./form/radio')) },
    { path: '/form-range', component: lazy(() => import('./form/range')) },
    { path: '/form-textfield', component: lazy(() => import('./form/textfield')) },
    { path: '/form-textarea', component: lazy(() => import('./form/textarea')) },
    { path: '/form-upload', component: lazy(() => import('./form/upload')) },
] as const;
