// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Locale, Menu, MenuItem, MenuItemGroup, useLocale } from '@cmfx/components';
import { ArrayElement } from '@cmfx/core';
import { RouteDefinition } from '@solidjs/router';
import { lazy, ParentProps } from 'solid-js';

// 组件的分类
type Kind = 'general' | 'layout' | 'navigation' | 'data-input' | 'data-display' | 'feedback' | 'config';

// 组件的路由定义
//
// id 表示该组件名称在翻译项中的 ID，具有唯一性，最终会位于翻译文件的 _d.demo 之下；
// kind 表示该组件的分类，用于在菜单中进行分组；
const routes: Array<RouteDefinition & { id: string, kind: Kind }> = [
    { path: ['/', '/appbar'], id: 'appbar', kind: 'general', component: lazy(() => import('./appbar')) },
    { path: '/backtop', id: 'backtop', kind: 'navigation', component: lazy(() => import('./backtop')) },
    { path: '/badge', id: 'badge', kind: 'feedback', component: lazy(() => import('./badge')) },
    { path: '/base', id: 'base', kind: 'general', component: lazy(() => import('./base')) },
    { path: '/button', id: 'button', kind: 'general', component: lazy(() => import('./button')) },
    { path: '/card', id: 'card', kind: 'general', component: lazy(() => import('./card')) },
    { path: '/code', id: 'code', kind: 'data-display', component: lazy(() => import('./code')) },
    { path: '/chart', id: 'chart', kind: 'data-display', component: lazy(() => import('./chart')) },
    { path: '/context', id: 'context', kind: 'config', component: lazy(() => import('./context')) },

    { path: '/datetime-calendar', id: 'calendar', kind: 'data-display', component: lazy(() => import('./datetime/calendar')) },
    { path: '/datetime-datepanel', id: 'datepanel', kind: 'data-display', component: lazy(() => import('./datetime/datepanel')) },
    { path: '/datetime-monthpanel', id: 'monthpanel', kind: 'data-display', component: lazy(() => import('./datetime/month')) },
    { path: '/datetime-timepanel', id: 'timepanel', kind: 'data-display', component: lazy(() => import('./datetime/timepanel')) },
    { path: '/datetime-timer', id: 'timer', kind: 'data-display', component: lazy(() => import('./datetime/timer')) },
    { path: '/datetime-timezone', id: 'timezone', kind: 'data-display', component: lazy(() => import('./datetime/timezone')) },
    { path: '/datetime-week', id: 'week', kind: 'data-display', component: lazy(() => import('./datetime/week')) },

    { path: '/dialog', id: 'dialog', kind: 'feedback', component: lazy(() => import('./dialog')) },
    { path: '/divider', id: 'divider', kind: 'layout', component: lazy(() => import('./divider')) },
    { path: '/drawer', id: 'drawer', kind: 'layout', component: lazy(() => import('./drawer')) },
    { path: '/empty', id: 'empty', kind: 'data-display', component: lazy(() => import('./empty')) },
    { path: '/menu', id: 'menu', kind: 'navigation', component: lazy(() => import('./menu')) },
    { path: '/icon', id: 'icon', kind: 'general', component: lazy(() => import('./icon')) },
    { path: '/illustrations', id: 'illustrations', kind: 'general', component: lazy(() => import('./illustrations')) },
    { path: '/notify', id: 'notify', kind: 'feedback', component: lazy(() => import('./notify')) },
    { path: '/pagination', id: 'pagination', kind: 'navigation', component: lazy(() => import('./pagination')) },
    { path: '/page', id: 'page', kind: 'layout', component: lazy(() => import('./page')) },
    { path: '/qrcode', id: 'qrcode', kind: 'data-display', component: lazy(() => import('./qrcode')) },

    { path: '/result-bug', id: 'result-bug', kind: 'feedback', component: lazy(() => import('./result/bug')) },
    { path: '/result-500', id: 'result-500', kind: 'feedback', component: lazy(() => import('./result/500')) },
    { path: '/result-build', id: 'result-build', kind: 'feedback', component: lazy(() => import('./result/build')) },

    { path: '/spin', id: 'spin', kind: 'feedback', component: lazy(() => import('./spin')) },
    { path: '/statistics', id: 'statistics', kind: 'data-display', component: lazy(() => import('./statistics')) },
    { path: '/table', id: 'table', kind: 'data-display', component: lazy(() => import('./table')) },
    { path: '/tab', id: 'tab', kind: 'navigation', component: lazy(() => import('./tab')) },

    { path: '/theme-selector', id: 'theme-selector', kind: 'general', component: lazy(() => import('./theme/selector')) },

    { path: '/tooltip', id: 'tooltip', kind: 'feedback', component: lazy(() => import('./tooltip')) },

    { path: '/typography', id: 'typography', kind: 'general', component: lazy(() => import('./typography')) },

    { path: '/wizard-stepper', id: 'stepper', kind: 'navigation', component: lazy(() => import('./wizard/stepper')) },
    { path: '/wizard-tour', id: 'tour', kind: 'navigation', component: lazy(() => import('./wizard/tour')) },

    { path: '/form', id: 'form', kind: 'data-input', component: lazy(() => import('./form')) },
    { path: '/form-checkbox', id: 'checkbox', kind: 'data-input', component: lazy(() => import('./form/checkbox')) },
    { path: '/form-choice', id: 'choice', kind: 'data-input', component: lazy(() => import('./form/choice')) },
    { path: '/form-color', id: 'color', kind: 'data-input', component: lazy(() => import('./form/color')) },
    { path: '/form-date', id: 'date', kind: 'data-input', component: lazy(() => import('./form/date')) },
    { path: '/form-editor', id: 'editor', kind: 'data-input', component: lazy(() => import('./form/editor')) },
    { path: '/form-radio', id: 'radio', kind: 'data-input', component: lazy(() => import('./form/radio')) },
    { path: '/form-range', id: 'range', kind: 'data-input', component: lazy(() => import('./form/range')) },
    { path: '/form-textfield', id: 'textfield', kind: 'data-input', component: lazy(() => import('./form/textfield')) },
    { path: '/form-textarea', id: 'textarea', kind: 'data-input', component: lazy(() => import('./form/textarea')) },
    { path: '/form-time', id: 'time', kind: 'data-input', component: lazy(() => import('./form/time')) },
    { path: '/form-upload', id: 'upload', kind: 'data-input', component: lazy(() => import('./form/upload')) },
] as const;

// 生成 Drawer 组件的侧边栏菜单
function buildMenus(l: Locale, prefix: string): Array<MenuItem> {
    const menus: Array<MenuItemGroup> = [
        { type: 'group', label: l.t('_d.demo.general'), items: []},
        { type: 'group', label: l.t('_d.demo.layout'), items: []},
        { type: 'group', label: l.t('_d.demo.navigation'), items: []},
        { type: 'group', label: l.t('_d.demo.dataInput'), items: []},
        { type: 'group', label: l.t('_d.demo.dataDisplay'), items: []},
        { type: 'group', label: l.t('_d.demo.feedback'), items: []},
        { type: 'group', label: l.t('_d.demo.config'), items: []},
    ];

    const append = (group: MenuItemGroup, r: ArrayElement<typeof routes>) => {
        const p = Array.isArray(r.path) ? r.path[0] : r.path;
        group.items.push({ type: 'item', label: l.t('_d.demo.' + r.id), value: prefix + p });
    };

    routes.forEach(r => {
        switch (r.kind) {
        case 'general':
            append(menus[0], r);
            break;
        case 'layout':
            append(menus[1], r);
            break;
        case 'navigation':
            append(menus[2], r);
            break;
        case 'data-input':
            append(menus[3], r);
            break;
        case 'data-display':
            append(menus[4], r);
            break;
        case 'feedback':
            append(menus[5], r);
            break;
        case 'config':
            append(menus[6], r);
            break;
        }
    });

    //{ type: 'item', label: l.t('_d.demo.divider'), value: prefix + '/divider' },
    return menus;
}

/**
 * 组件预览的路由定义
 */
export default function route(prefix: string): RouteDefinition {
    return {
        path: prefix,
        component: (props: ParentProps) => {
            const l = useLocale();
            return <Drawer visible palette='secondary' mainPalette='surface' main={props.children}>
                <Menu layout='inline' anchor items={buildMenus(l, prefix)} />
            </Drawer>;
        },
        children: routes
    };
}
