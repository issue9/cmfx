// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, MenuItemGroup } from '@cmfx/components';
import { ArrayElement, Locale } from '@cmfx/core';
import { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';
import IconRadio from '~icons/akar-icons/radio-fill';
import IconMenu from '~icons/bi/menu-down';
import IconTextarea from '~icons/bi/textarea-resize';
import IconTime from '~icons/bxs/time';
import IconTour from '~icons/entypo/popup';
import IconMisc from '~icons/eos-icons/miscellaneous';
import IconOptionsConfig from '~icons/eva/options-2-fill';
import IconBadge from '~icons/f7/app-badge-fill';
import IconWeekPanel from '~icons/fa7-solid/calendar-week';
import IconUpload from '~icons/flowbite/upload-solid';
import IconLocaleConfig from '~icons/fluent-mdl2/locale-language';
import IconTimer from '~icons/fluent/timer-10-24-filled';
import IconForm from '~icons/icon-park-outline/form';
import IconPage from '~icons/icon-park-outline/page';
import IconPresetComponent from '~icons/iconamoon/component-fill'; // 组件的默认图标
import IconCounter from '~icons/ix/counter';
import IconDate from '~icons/lets-icons/date-range-light';
import IconTable from '~icons/lets-icons/table';
import IconDescription from '~icons/material-symbols/description';
import IconDialog from '~icons/material-symbols/dialogs-outline-rounded';
import IconDropdown from '~icons/material-symbols/dropdown-outline';
import IconColorPanel from '~icons/material-symbols/format-color-fill-rounded';
import IconInput from '~icons/material-symbols/input-rounded';
import IconLabel from '~icons/material-symbols/label-rounded';
import IconNav from '~icons/material-symbols/list-alt-rounded';
import IconTransition from '~icons/material-symbols/masked-transitions';
import IconAvatar from '~icons/material-symbols/person';
import IconSearch from '~icons/material-symbols/search-rounded';
import IconSettings from '~icons/material-symbols/settings';
import IconStyle from '~icons/material-symbols/style-outline';
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
import IconQRCode from '~icons/mingcute/qrcode-2-fill';
import IconStatistic from '~icons/octicon/number-16';
import IconSpin from '~icons/pepicons-pop/arrow-spin-circle';
import IconDivider from '~icons/pixel/divider-solid';
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
type Kind = 'general' | 'layout' | 'navigation' | 'data-input' | 'data-display' | 'feedback' | 'config' | 'function';

// 组件的路由定义
//
// title 表示该组件名称在翻译项中的 ID；
// kind 表示该组件的分类，用于在菜单中进行分组；
// icon 表示该组件的图标，用于在菜单中显示；
export const routes: Array<RouteDefinition & { kind: Kind }> = [
    {
        kind: 'general', path: '/appbar', component: lazy(() => import('./appbar')),
        info: { title: '_d.demo.appbar', icon: <IconAppbar /> },
    },
    {
        kind: 'general', path: '/button', component: lazy(() => import('./button')),
        info: { title: '_d.demo.button', icon: <IconButton /> },
    },
    {
        kind: 'general', path: '/card', component: lazy(() => import('./card')),
        info: { title: '_d.demo.card', icon: <IconCard /> },
    },
    {
        kind: 'general', path: '/description', component: lazy(() => import('./description')),
        info: { title: '_d.demo.description', icon: <IconDescription /> },
    },
    {
        kind: 'general', path: '/icon', component: lazy(() => import('./icon')),
        info: { title: '_d.demo.icon', icon: <IconIcon /> },
    },
    {
        kind: 'general', path: '/illustrations', component: lazy(() => import('./illustrations')),
        info: { title: '_d.demo.illustrations', icon: <IconIllustration /> },
    },
    {
        kind: 'general', path: '/input', component: lazy(() => import('./input')),
        info: { title: '_d.demo.input', icon: <IconInput /> },
    },
    {
        kind: 'general', path: '/label', component: lazy(() => import('./label')),
        info: { title: '_d.demo.label', icon: <IconLabel /> },
    },
    {
        kind: 'general', path: '/theme-selector', component: lazy(() => import('./theme/selector')),
        info: { title: '_d.demo.themeSelector', icon: <IconTheme /> },
    },
    {
        kind: 'general', path: '/transition', component: lazy(() => import('./transition')),
        info: { title: '_d.demo.transition', icon: <IconTransition /> },
    },

    //----------------------- layout

    {
        kind: 'layout', path: '/divider', component: lazy(() => import('./divider')),
        info: { title: '_d.demo.divider', icon: <IconDivider /> },
    },
    {
        kind: 'layout', path: '/drawer', component: lazy(() => import('./drawer')),
        info: { title: '_d.demo.drawer', icon: <IconDrawer /> },
    },
    {
        kind: 'layout', path: '/page', component: lazy(() => import('./page')),
        info: { title: '_d.demo.page', icon: <IconPage /> },
    },

    //----------------------- navigation

    {
        kind: 'navigation', path: '/backtop', component: lazy(() => import('./backtop')),
        info: { title: '_d.demo.backtop', icon: <IconBacktop /> },
    },
    {
        kind: 'navigation', path: '/dropdown', component: lazy(() => import('./menu/dropdown')),
        info: { title: '_d.demo.dropdown', icon: <IconDropdown /> },
    },
    {
        kind: 'navigation', path: '/menu', component: lazy(() => import('./menu/menu')),
        info: { title: '_d.demo.menu', icon: <IconMenu /> },
    },
    {
        kind: 'navigation', path: '/nav', component: lazy(() => import('./nav')),
        info: { title: '_d.demo.nav', icon: <IconNav /> },
    },
    {
        kind: 'navigation', path: '/tab', component: lazy(() => import('./tab')),
        info: { title: '_d.demo.tab', icon: <IconTab /> },
    },
    {
        kind: 'navigation', path: '/pagination', component: lazy(() => import('./pagination')),
        info: { title: '_d.demo.pagination', icon: <IconPagination /> },
    },
    {
        kind: 'navigation', path: '/wizard-stepper', component: lazy(() => import('./wizard/stepper')),
        info: { title: '_d.demo.stepper', icon: <IconStepper /> },
    },
    {
        kind: 'navigation', path: '/wizard-tour', component: lazy(() => import('./wizard/tour')),
        info: { title: '_d.demo.tour', icon: <IconTour /> },
    },

    //----------------------- data-input

    {
        kind: 'data-input', path: '/form-checkbox', component: lazy(() => import('./form/checkbox')),
        info: { title: '_d.demo.checkbox', icon: <IconCheckbox /> },
    },
    {
        kind: 'data-input', path: '/form-choice', component: lazy(() => import('./form/choice')),
        info: { title: '_d.demo.choice', icon: <IconChoice /> },
    },
    {
        kind: 'data-input', path: '/form-color', component: lazy(() => import('./form/color')),
        info: { title: '_d.demo.color', icon: <IconColor /> },
    },
    {
        kind: 'data-input', path: '/form-date', component: lazy(() => import('./form/date')),
        info: { title: '_d.demo.date', icon: <IconDate /> },
    },
    {
        kind: 'data-input', path: '/form-editor', component: lazy(() => import('./form/editor')),
        info: { title: '_d.demo.editor', icon: <IconEditor /> },
    },
    {
        kind: 'data-input', path: '/form-form', component: lazy(() => import('./form/form')),
        info: { title: '_d.demo.form', icon: <IconForm /> },
    },
    {
        kind: 'data-input', path: '/form-radio', component: lazy(() => import('./form/radio')),
        info: { title: '_d.demo.radio', icon: <IconRadio /> },
    },
    {
        kind: 'data-input', path: '/form-range', component: lazy(() => import('./form/range')),
        info: { title: '_d.demo.range', icon: <IconRange /> },
    },
    {
        kind: 'data-input', path: '/form-textfield', component: lazy(() => import('./form/textfield')),
        info: { title: '_d.demo.textfield', icon: <IconTextfield /> },
    },
    {
        kind: 'data-input', path: '/form-textarea', component: lazy(() => import('./form/textarea')),
        info: { title: '_d.demo.textarea', icon: <IconTextarea /> },
    },
    {
        kind: 'data-input', path: '/form-time', component: lazy(() => import('./form/time')),
        info: { title: '_d.demo.time', icon: <IconTime /> },
    },
    {
        kind: 'data-input', path: '/form-upload', component: lazy(() => import('./form/upload')),
        info: { title: '_d.demo.upload', icon: <IconUpload /> },
    },

    //----------------------- data-display

    {
        kind: 'data-display', path: '/avatar', component: lazy(() => import('./avatar')),
        info: { title: '_d.demo.avatar', icon: <IconAvatar /> },
    },
    {
        kind: 'data-display', path: '/code', component: lazy(() => import('./code')),
        info: { title: '_d.demo.code', icon: <IconCode /> },
    },
    {
        kind: 'data-display', path: '/color', component: lazy(() => import('./color')),
        info: { title: '_d.demo.color', icon: <IconColorPanel /> },
    },
    {
        kind: 'data-display', path: '/counter', component: lazy(() => import('./counter')),
        info: { title: '_d.demo.counter', icon: <IconCounter /> },
    },
    {
        kind: 'data-display', path: '/chart', component: lazy(() => import('./chart')),
        info: { title: '_d.demo.chart', icon: <IconChart /> },
    },
    {
        kind: 'data-display', path: '/datetime-calendar', component: lazy(() => import('./datetime/calendar')),
        info: { title: '_d.demo.calendar', icon: <IconCalendar /> },
    },
    {
        kind: 'data-display', path: '/datetime-datepanel', component: lazy(() => import('./datetime/datepanel')),
        info: { title: '_d.demo.datepanel', icon: <IconDatePanel /> },
    },
    {
        kind: 'data-display', path: '/datetime-monthpanel', component: lazy(() => import('./datetime/month')),
        info: { title: '_d.demo.monthpanel', icon: <IconMonthPanel /> },
    },
    {
        kind: 'data-display', path: '/datetime-timepanel', component: lazy(() => import('./datetime/timepanel')),
        info: { title: '_d.demo.timepanel', icon: <IconTimePanel /> },
    },
    {
        kind: 'data-display', path: '/datetime-timer', component: lazy(() => import('./datetime/timer')),
        info: { title: '_d.demo.timer', icon: <IconTimer /> },
    },
    {
        kind: 'data-display', path: '/datetime-timezone', component: lazy(() => import('./datetime/timezone')),
        info: { title: '_d.demo.timezone', icon: <IconTimezone /> },
    },
    {
        kind: 'data-display', path: '/datetime-week', component: lazy(() => import('./datetime/week')),
        info: { title: '_d.demo.weekPanel', icon: <IconWeekPanel />, },
    },
    {
        kind: 'data-display', path: '/qrcode', component: lazy(() => import('./qrcode')),
        info: { title: '_d.demo.qrcode', icon: <IconQRCode /> },
    },
    {
        kind: 'data-display', path: '/statistic', component: lazy(() => import('./statistic')),
        info: { title: '_d.demo.statistic', icon: <IconStatistic /> },
    },
    {
        kind: 'data-display', path: '/table', component: lazy(() => import('./table')),
        info: { title: '_d.demo.table', icon: <IconTable /> },
    },

    //----------------------- feedback

    {
        kind: 'feedback', path: '/badge', component: lazy(() => import('./badge')),
        info: { title: '_d.demo.badge', icon: <IconBadge /> },
    },
    {
        kind: 'feedback', path: '/dialog', component: lazy(() => import('./dialog')),
        info: { title: '_d.demo.dialog', icon: <IconDialog /> },
    },
    {
        kind: 'feedback', path: '/notify', component: lazy(() => import('./notify')),
        info: { title: '_d.demo.notify', icon: <IconNotify /> },
    },
    {
        kind: 'feedback', path: '/search', component: lazy(() => import('./search')),
        info: { title: '_d.demo.search', icon: <IconSearch /> },
    },
    {
        kind: 'feedback', path: '/spin', component: lazy(() => import('./spin')),
        info: { title: '_d.demo.spin', icon: <IconSpin /> },
    },
    {
        kind: 'feedback', path: '/result', component: lazy(() => import('./result')),
        info: { title: '_d.demo.result', icon: <IconResult /> },
    },
    {
        kind: 'feedback', path: '/tooltip', component: lazy(() => import('./tooltip')),
        info: { title: '_d.demo.tooltip', icon: <IconTooltip /> },
    },

    //----------------------- config

    {
        kind: 'config', path: '/config/locale', component: lazy(() => import('./config/locale')),
        info: { title: '_d.demo.localeConfig', icon: <IconLocaleConfig /> },
    },
    {
        kind: 'config', path: '/config/options', component: lazy(() => import('./config/options')),
        info: { title: '_d.demo.optionsConfig', icon: <IconOptionsConfig /> },
    },
    {
        kind: 'config', path: '/config/theme', component: lazy(() => import('./config/theme')),
        info: { title: '_d.demo.themeConfig', icon: <IconThemeConfig /> },
    },
    {
        kind: 'config', path: '/config/settings', component: lazy(() => import('./config/settings')),
        info: { title: '_d.demo.settings', icon: <IconSettings /> },
    },

    //----------------------- misc

    {
        kind: 'function', path: '/functions/style', component: lazy(() => import('./functions/style')),
        info: { title: '_d.demo.style', icon: <IconStyle /> },
    },
    {
        kind: 'function', path: '/functions/misc', component: lazy(() => import('./functions/misc')),
        info: { title: '_d.demo.misc', icon: <IconMisc /> },
    },
] as const;

// 生成 Drawer 组件的侧边栏菜单
export function buildMenus(l: Locale, prefix: string): Array<MenuItem<string>> {
    const menus: Array<MenuItem<string>> = [
        { type: 'a', label: l.t('_d.demo.overview'), value: prefix + '/', suffix: routes.length }, // 指向 overview
        { type: 'group', label: l.t('_d.demo.general'), items: [] },
        { type: 'group', label: l.t('_d.demo.layout'), items: [] },
        { type: 'group', label: l.t('_d.demo.navigation'), items: [] },
        { type: 'group', label: l.t('_d.demo.dataInput'), items: [] },
        { type: 'group', label: l.t('_d.demo.dataDisplay'), items: [] },
        { type: 'group', label: l.t('_d.demo.feedback'), items: [] },
        { type: 'group', label: l.t('_d.demo.config'), items: [] },
        { type: 'group', label: l.t('_d.demo.function'), items: [] },
    ];

    const append = (group: MenuItem<string>, r: ArrayElement<typeof routes>) => {
        const p = Array.isArray(r.path) ? r.path[0] : r.path;
        (group as MenuItemGroup<string>).items.push({
            type: 'a',
            label: l.t(r.info?.title),
            value: prefix + p,
            prefix: r.info?.icon ?? <IconPresetComponent />,
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
        case 'function':
            append(menus[8], r);
            break;
        }
    });

    return menus;
}
