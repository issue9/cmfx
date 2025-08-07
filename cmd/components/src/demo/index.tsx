// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';

export const routes: Array<RouteDefinition> = [
    { path: '/appbar', component: lazy(() => import('./appbar')) },
    { path: '/backtop', component: lazy(() => import('./backtop')) },
    { path: '/badge', component: lazy(() => import('./badge')) },
    { path: '/base', component: lazy(() => import('./base')) },
    { path: '/button', component: lazy(() => import('./button')) },
    { path: '/card', component: lazy(() => import('./card')) },
    { path: '/code', component: lazy(() => import('./code')) },
    { path: '/chart', component: lazy(() => import('./chart')) },
    { path: '/context', component: lazy(() => import('./context')) },

    { path: '/datetime-calendar', component: lazy(() => import('./datetime/calendar')) },
    { path: '/datetime-datepanel', component: lazy(() => import('./datetime/datepanel')) },
    { path: '/datetime-monthpanel', component: lazy(() => import('./datetime/month')) },
    { path: '/datetime-timepanel', component: lazy(() => import('./datetime/timepanel')) },
    { path: '/datetime-timer', component: lazy(() => import('./datetime/timer')) },
    { path: '/datetime-timezone', component: lazy(() => import('./datetime/timezone')) },
    { path: '/datetime-week', component: lazy(() => import('./datetime/week')) },

    { path: '/dialog', component: lazy(() => import('./dialog')) },
    { path: '/divider', component: lazy(() => import('./divider')) },
    { path: '/drawer', component: lazy(() => import('./drawer')) },
    { path: '/empty', component: lazy(() => import('./empty')) },
    { path: '/icon', component: lazy(() => import('./icon')) },
    { path: '/illustrations', component: lazy(() => import('./illustrations')) },
    { path: '/notify', component: lazy(() => import('./notify')) },
    { path: '/pagination', component: lazy(() => import('./pagination')) },
    { path: '/page', component: lazy(() => import('./page')) },
    { path: '/qrcode', component: lazy(() => import('./qrcode')) },

    { path: '/result-bug', component: lazy(() => import('./result/bug')) },
    { path: '/result-500', component: lazy(() => import('./result/500')) },
    { path: '/result-build', component: lazy(() => import('./result/build')) },

    { path: '/spin', component: lazy(() => import('./spin')) },
    { path: '/statistics', component: lazy(() => import('./statistics')) },
    { path: '/table', component: lazy(() => import('./table')) },
    { path: '/tab', component: lazy(() => import('./tab')) },


    { path: '/theme-builder', component: lazy(() => import('./theme/builder')) },
    { path: '/theme-selector', component: lazy(() => import('./theme/selector')) },

    { path: '/tooltip', component: lazy(() => import('./tooltip')) },

    { path: '/tree-list', component: lazy(() => import('./tree/list')) },
    { path: '/tree-menu', component: lazy(() => import('./tree/menu')) },

    { path: '/typography', component: lazy(() => import('./typography')) },

    { path: '/wizard-stepper', component: lazy(() => import('./wizard/stepper')) },
    { path: '/wizard-tour', component: lazy(() => import('./wizard/tour')) },

    { path: '/form', component: lazy(() => import('./form')) },
    { path: '/form-checkbox', component: lazy(() => import('./form/checkbox')) },
    { path: '/form-choice', component: lazy(() => import('./form/choice')) },
    { path: '/form-color', component: lazy(() => import('./form/color')) },
    { path: '/form-date', component: lazy(() => import('./form/date')) },
    { path: '/form-editor', component: lazy(() => import('./form/editor')) },
    { path: '/form-radio', component: lazy(() => import('./form/radio')) },
    { path: '/form-range', component: lazy(() => import('./form/range')) },
    { path: '/form-textfield', component: lazy(() => import('./form/textfield')) },
    { path: '/form-textarea', component: lazy(() => import('./form/textarea')) },
    { path: '/form-time', component: lazy(() => import('./form/time')) },
    { path: '/form-upload', component: lazy(() => import('./form/upload')) },
] as const;
