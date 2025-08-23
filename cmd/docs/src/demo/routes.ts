// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { IconComponent, Locale, MenuItem, MenuItemGroup } from '@cmfx/components';
import { ArrayElement } from '@cmfx/core';
import { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';
import IconRadio from '~icons/akar-icons/radio-fill';
import IconMenu from '~icons/bi/menu-down';
import IconTextarea from '~icons/bi/textarea-resize';
import IconTime from '~icons/bxs/time';
import IconTour from '~icons/entypo/popup';
import IconOptionsConfig from '~icons/eva/options-2-fill';
import IconBadge from '~icons/f7/app-badge-fill';
import IconWeekPanel from '~icons/fa7-solid/calendar-week';
import IconUpload from '~icons/flowbite/upload-solid';
import IconLocaleConfig from '~icons/fluent-mdl2/locale-language';
import IconTimer from '~icons/fluent/timer-10-24-filled';
import IconForm from '~icons/icon-park-outline/form';
import IconPage from '~icons/icon-park-outline/page';
import IconPresetComponent from '~icons/iconamoon/component-fill'; // 组件的默认图标
import IconDate from '~icons/lets-icons/date-range-light';
import IconTable from '~icons/lets-icons/table';
import IconDialog from '~icons/material-symbols/dialogs-outline-rounded';
import IconTab from '~icons/material-symbols/tab-outline';
import IconAppbar from '~icons/material-symbols/toolbar';
import IconEditor from '~icons/material-symbols/wysiwyg';
import IconNotify from '~icons/mdi/bell-notification-outline';
import IconCard from '~icons/mdi/card';
import IconCheckbox from '~icons/mdi/checkbox-multiple-marked';
import IconTheme from '~icons/mdi/theme';
import IconThemeConfig from '~icons/mdi/theme-light-dark';
import IconTimezone from '~icons/mdi/timezone';
import IconTooltip from '~icons/mdi/tooltip-text';
import IconTimePanel from '~icons/mingcute/calendar-time-add-fill';
import IconCode from '~icons/mingcute/code-fill';
import IconEmpty from '~icons/mingcute/empty-box-fill';
import IconQRCode from '~icons/mingcute/qrcode-2-fill';
import IconStatistics from '~icons/octicon/number-16';
import IconSpin from '~icons/pepicons-pop/arrow-spin-circle';
import IconDivider from '~icons/pixel/divider-solid';
import IconTypography from '~icons/proicons/text-typography';
import IconDrawer from '~icons/ri/archive-drawer-fill';
import IconCalendar from '~icons/solar/calendar-bold';
import IconDatePanel from '~icons/solar/calendar-date-bold';
import IconPagination from '~icons/stash/pagination-duotone';
import IconResult from '~icons/stash/search-results';
import IconStepper from '~icons/streamline-flex/steps-2-remix';
import IconTextfield from '~icons/streamline-plump/input-box-solid';
import IconColor from '~icons/streamline/color-picker-remix';
import IconMonthPanel from '~icons/tabler/calendar-month';
import IconBacktop from '~icons/tabler/transition-top-filled';
import IconButton from '~icons/tdesign/button-filled';
import IconChart from '~icons/tdesign/chart-pie-filled';
import IconChoice from '~icons/tdesign/component-dropdown-filled';
import IconIcon from '~icons/tdesign/icon-filled';
import IconIllustration from '~icons/uil/illustration';
import IconRange from '~icons/uil/slider-h-range';


// 组件的分类
type Kind = 'general' | 'layout' | 'navigation' | 'data-input' | 'data-display' | 'feedback' | 'config';

// 组件的路由定义
//
// id 表示该组件名称在翻译项中的 ID，具有唯一性，最终会位于翻译文件的 _d.demo 之下；
// kind 表示该组件的分类，用于在菜单中进行分组；
// icon 表示该组件的图标，用于在菜单中显示；
export const routes: Array<RouteDefinition & { id: string, kind: Kind, icon?: IconComponent }> = [
    {kind: 'general', path: '/appbar', id: 'appbar', icon: IconAppbar, component: lazy(() => import('./appbar')) },
    {kind: 'general', path: '/base', id: 'base', component: lazy(() => import('./base')) },
    {kind: 'general', path: '/button', id: 'button', icon: IconButton, component: lazy(() => import('./button')) },
    {kind: 'general', path: '/card', id: 'card', icon: IconCard, component: lazy(() => import('./card')) },
    {kind: 'general', path: '/icon', id: 'icon', icon: IconIcon, component: lazy(() => import('./icon')) },
    {kind: 'general', path: '/illustrations', id: 'illustrations', icon: IconIllustration, component: lazy(() => import('./illustrations')) },
    {kind: 'general', path: '/theme-selector', id: 'themeSelector', icon: IconTheme, component: lazy(() => import('./theme/selector')) },
    {kind: 'general', path: '/typography', id: 'typography', icon: IconTypography, component: lazy(() => import('./typography')) },

    {kind: 'layout', path: '/divider', id: 'divider', icon: IconDivider, component: lazy(() => import('./divider')) },
    {kind: 'layout', path: '/drawer', id: 'drawer', icon: IconDrawer, component: lazy(() => import('./drawer')) },
    {kind: 'layout', path: '/page', id: 'page', icon: IconPage, component: lazy(() => import('./page')) },

    {kind: 'navigation', path: '/backtop', id: 'backtop', icon: IconBacktop, component: lazy(() => import('./backtop')) },
    {kind: 'navigation', path: '/menu', id: 'menu', icon: IconMenu, component: lazy(() => import('./menu')) },
    {kind: 'navigation', path: '/tab', id: 'tab', icon: IconTab, component: lazy(() => import('./tab')) },
    {kind: 'navigation', path: '/pagination', id: 'pagination', icon: IconPagination, component: lazy(() => import('./pagination')) },
    {kind: 'navigation', path: '/wizard-stepper', id: 'stepper', icon: IconStepper, component: lazy(() => import('./wizard/stepper')) },
    {kind: 'navigation', path: '/wizard-tour', id: 'tour', icon: IconTour, component: lazy(() => import('./wizard/tour')) },

    {kind: 'data-input', path: '/form-checkbox', id: 'checkbox', icon: IconCheckbox, component: lazy(() => import('./form/checkbox')) },
    {kind: 'data-input', path: '/form-choice', id: 'choice', icon: IconChoice, component: lazy(() => import('./form/choice')) },
    {kind: 'data-input', path: '/form-color', id: 'color', icon: IconColor, component: lazy(() => import('./form/color')) },
    {kind: 'data-input', path: '/form-date', id: 'date', icon: IconDate, component: lazy(() => import('./form/date')) },
    {kind: 'data-input', path: '/form-editor', id: 'editor', icon: IconEditor, component: lazy(() => import('./form/editor')) },
    {kind: 'data-input', path: '/form', id: 'form', icon: IconForm, component: lazy(() => import('./form')) },
    {kind: 'data-input', path: '/form-radio', id: 'radio', icon: IconRadio, component: lazy(() => import('./form/radio')) },
    {kind: 'data-input', path: '/form-range', id: 'range', icon: IconRange, component: lazy(() => import('./form/range')) },
    {kind: 'data-input', path: '/form-textfield', id: 'textfield', icon: IconTextfield, component: lazy(() => import('./form/textfield')) },
    {kind: 'data-input', path: '/form-textarea', id: 'textarea', icon: IconTextarea, component: lazy(() => import('./form/textarea')) },
    {kind: 'data-input', path: '/form-time', id: 'time', icon: IconTime, component: lazy(() => import('./form/time')) },
    {kind: 'data-input', path: '/form-upload', id: 'upload', icon: IconUpload, component: lazy(() => import('./form/upload')) },

    { kind: 'data-display', path: '/code', id: 'code', icon: IconCode, component: lazy(() => import('./code')) },
    { kind: 'data-display', path: '/chart', id: 'chart', icon: IconChart, component: lazy(() => import('./chart')) },
    { kind: 'data-display', path: '/datetime-calendar', id: 'calendar', icon: IconCalendar, component: lazy(() => import('./datetime/calendar')) },
    { kind: 'data-display', path: '/datetime-datepanel', id: 'datepanel', icon: IconDatePanel, component: lazy(() => import('./datetime/datepanel')) },
    { kind: 'data-display', path: '/datetime-monthpanel', id: 'monthpanel', icon: IconMonthPanel, component: lazy(() => import('./datetime/month')) },
    { kind: 'data-display', path: '/datetime-timepanel', id: 'timepanel', icon: IconTimePanel, component: lazy(() => import('./datetime/timepanel')) },
    { kind: 'data-display', path: '/datetime-timer', id: 'timer', icon: IconTimer, component: lazy(() => import('./datetime/timer')) },
    { kind: 'data-display', path: '/datetime-timezone', id: 'timezone', icon: IconTimezone, component: lazy(() => import('./datetime/timezone')) },
    { kind: 'data-display', path: '/datetime-week', id: 'weekPanel', icon: IconWeekPanel, component: lazy(() => import('./datetime/week')) },
    { kind: 'data-display', path: '/empty', id: 'empty', icon: IconEmpty, component: lazy(() => import('./empty')) },
    { kind: 'data-display', path: '/qrcode', id: 'qrcode', icon: IconQRCode, component: lazy(() => import('./qrcode')) },
    { kind: 'data-display', path: '/statistics', id: 'statistics', icon: IconStatistics, component: lazy(() => import('./statistics')) },
    { kind: 'data-display', path: '/table', id: 'table', icon: IconTable, component: lazy(() => import('./table')) },

    { kind: 'feedback', path: '/badge', id: 'badge', icon: IconBadge, component: lazy(() => import('./badge')) },
    { kind: 'feedback', path: '/dialog', id: 'dialog', icon: IconDialog, component: lazy(() => import('./dialog')) },
    { kind: 'feedback', path: '/notify', id: 'notify', icon: IconNotify, component: lazy(() => import('./notify')) },
    { kind: 'feedback', path: '/spin', id: 'spin', icon: IconSpin, component: lazy(() => import('./spin')) },
    { kind: 'feedback', path: '/result', id: 'result', icon: IconResult, component: lazy(() => import('./result')) },
    { kind: 'feedback', path: '/tooltip', id: 'tooltip', icon: IconTooltip, component: lazy(() => import('./tooltip')) },

    { kind: 'config', path: '/config/locale', id: 'localeConfig', icon: IconLocaleConfig, component: lazy(() => import('./config/locale')) },
    { kind: 'config', path: '/config/options', id: 'optionsConfig', icon: IconOptionsConfig, component: lazy(() => import('./config/options')) },
    { kind: 'config', path: '/config/theme', id: 'themeConfig', icon: IconThemeConfig, component: lazy(() => import('./config/theme')) },
] as const;

// 生成 Drawer 组件的侧边栏菜单
export function buildMenus(l: Locale, prefix: string): Array<MenuItem> {
    const menus: Array<MenuItem> = [
        { type: 'item', label: l.t('_d.demo.overview'), value: prefix }, // 指向 overview
        { type: 'group', label: l.t('_d.demo.general'), items: [] },
        { type: 'group', label: l.t('_d.demo.layout'), items: [] },
        { type: 'group', label: l.t('_d.demo.navigation'), items: [] },
        { type: 'group', label: l.t('_d.demo.dataInput'), items: [] },
        { type: 'group', label: l.t('_d.demo.dataDisplay'), items: [] },
        { type: 'group', label: l.t('_d.demo.feedback'), items: [] },
        { type: 'group', label: l.t('_d.demo.config'), items: [] },
    ];

    const append = (group: MenuItem, r: ArrayElement<typeof routes>) => {
        const p = Array.isArray(r.path) ? r.path[0] : r.path;
        (group as MenuItemGroup).items.push({
            type: 'item',
            label: l.t('_d.demo.' + r.id),
            value: prefix + p,
            icon: r.icon ?? IconPresetComponent,
        });
    };

    routes.forEach(r => {
        switch (r.kind) {
        case 'general':
            append(menus[1], r);
            break;
        case 'layout':
            append(menus[2], r);
            break;
        case 'navigation':
            append(menus[3], r);
            break;
        case 'data-input':
            append(menus[4], r);
            break;
        case 'data-display':
            append(menus[5], r);
            break;
        case 'feedback':
            append(menus[6], r);
            break;
        case 'config':
            append(menus[7], r);
            break;
        }
    });

    return menus;
}
