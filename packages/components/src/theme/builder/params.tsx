// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType, rand } from '@cmfx/core';
import { batch, JSX, Show } from 'solid-js';
import IconApply from '~icons/fluent/text-change-accept-20-filled';
import IconOptions from '~icons/ion/options';
import IconColors from '~icons/material-symbols/colors';
import IconDark from '~icons/material-symbols/dark-mode';
import IconExport from '~icons/material-symbols/export-notes';
import IconLight from '~icons/material-symbols/light-mode';
import IconReset from '~icons/material-symbols/reset-settings';
import IconRadius from '~icons/mingcute/border-radius-fill';
import IconFontSize from '~icons/mingcute/font-size-fill';
import IconRand from '~icons/mingcute/random-line';

import { Locale, Mode, Palette, Scheme } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { Code } from '@/code';
import { useLocale } from '@/context';
import { Dialog, DialogRef } from '@/dialog';
import { Divider } from '@/divider';
import { Accessor, FieldOption, ObjectAccessor, OKLCHPicker, RadioGroup, Range } from '@/form';
import { Label } from '@/typography';
import { randColor } from './oklch';
import { Ref } from './ref';
import styles from './style.module.css';

/**
 * 参数面板
 */
export function params(s: ObjectAccessor<ExpandType<Scheme>>, m: Accessor<Mode>, ref: Ref): JSX.Element {
    const l = useLocale();
    let dlg: DialogRef;

    return <div class={styles.params}>
        <div class={styles.toolbar}>
            <div class={styles.actions}>
                <Button kind='border' rounded square title={l.t('_c.theme.random')} onclick={() => random(s)}><IconRand /></Button>
                <ButtonGroup rounded>
                    <Button square title={l.t('_c.theme.light')}
                        checked={m.getValue() === 'light'} onClick={() => m.setValue('light')}>
                        <IconLight />
                    </Button>
                    <Button square title={l.t('_c.theme.dark')}
                        checked={m.getValue() === 'dark'} onClick={() => m.setValue('dark')}>
                        <IconDark />
                    </Button>
                </ButtonGroup>
            </div>
            <ButtonGroup kind='border' rounded>
                <Button square onClick={ref.reset} title={l.t('_c.reset')}><IconReset /></Button>
                <Button square onClick={() => ref.apply()} title={l.t('_c.theme.apply')}><IconApply /></Button>
                <Button square onClick={() => dlg.showModal()} title={l.t('_c.theme.export')}><IconExport /></Button>
            </ButtonGroup>
        </div>

        {fontSizeParams(l, s)}
        {colorsParams(l, s)}
        {radiusParams(l, s)}
        {otherParams(l, s)}

        <Dialog class="h-2/3" ref={el => dlg = el} header={<Label icon={IconExport}>{l.t('_c.theme.export')}</Label>}>
            <Code class="h-full" copyable>{JSON.stringify(s.object(), null, 4)}</Code>
        </Dialog>
    </div>;
}

/**
 * 生成随机参数
 */
export function random(s: ObjectAccessor<ExpandType<Scheme>>) {
    batch(() => {
        // 字体不生成随机，改字体会直接作用在整个页面上。
        s.accessor<string>('fontSize').setValue('16px');

        let h = rand(0, 360, 3);
        let c = randColor(h);
        s.accessor<string>('dark.error-bg').setValue(c[1].toString());
        s.accessor<string>('dark.error-fg').setValue(c[0].toString());
        c = randColor(h, 'low');
        s.accessor<string>('dark.error-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.error-fg-low').setValue(c[0].toString());
        c = randColor(h, 'high');
        s.accessor<string>('dark.error-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.error-fg-high').setValue(c[0].toString());

        h += rand(20, 40, 3) % 360;
        c = randColor(h);
        s.accessor<string>('dark.surface-bg').setValue(c[1].toString());
        s.accessor<string>('dark.surface-fg').setValue(c[0].toString());
        c = randColor(h, 'low');
        s.accessor<string>('dark.surface-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.surface-fg-low').setValue(c[0].toString());
        c = randColor(h, 'high');
        s.accessor<string>('dark.surface-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.surface-fg-high').setValue(c[0].toString());

        h += rand(20, 40, 3) % 360;
        c = randColor(h);
        s.accessor<string>('dark.primary-bg').setValue(c[1].toString());
        s.accessor<string>('dark.primary-fg').setValue(c[0].toString());
        c = randColor(h, 'low');
        s.accessor<string>('dark.primary-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.primary-fg-low').setValue(c[0].toString());
        c = randColor(h, 'high');
        s.accessor<string>('dark.primary-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.primary-fg-high').setValue(c[0].toString());

        h += rand(20, 40, 3) % 360;
        c = randColor(h);
        s.accessor<string>('dark.secondary-bg').setValue(c[1].toString());
        s.accessor<string>('dark.secondary-fg').setValue(c[0].toString());
        c = randColor(h, 'low');
        s.accessor<string>('dark.secondary-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.secondary-fg-low').setValue(c[0].toString());
        c = randColor(h, 'high');
        s.accessor<string>('dark.secondary-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.secondary-fg-high').setValue(c[0].toString());

        h += rand(20, 40, 3) % 360;
        c = randColor(h);
        s.accessor<string>('dark.tertiary-bg').setValue(c[1].toString());
        s.accessor<string>('dark.tertiary-fg').setValue(c[0].toString());
        c = randColor(h, 'low');
        s.accessor<string>('dark.tertiary-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.tertiary-fg-low').setValue(c[0].toString());
        c = randColor(h, 'high');
        s.accessor<string>('dark.tertiary-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.tertiary-fg-high').setValue(c[0].toString());

        s.accessor<number>('radius.xs').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.sm').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.md').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.lg').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.2xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.3xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.4xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);

        s.accessor<number>('spacing').setValue(rand(spacingValues.min, spacingValues.max, 2));
        s.accessor<number>('transitionDuration').setValue(rand(transitionValues.min, transitionValues.max, 0));
    });
}

// 设置圆角孤度参数面板
function radiusParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconRadius class="mr-1" />{l.t('_c.theme.radius')}</Divider>
        {radius('xs', s.accessor<number>('radius.xs'))}
        {radius('sm', s.accessor<number>('radius.sm'))}
        {radius('md', s.accessor<number>('radius.md'))}
        {radius('lg', s.accessor<number>('radius.lg'))}
        {radius('xl', s.accessor<number>('radius.xl'))}
        {radius('2xl', s.accessor<number>('radius.2xl'))}
        {radius('3xl', s.accessor<number>('radius.3xl'))}
        {radius('4xl', s.accessor<number>('radius.4xl'))}
    </div>;
}

// 可用的圆角值
const radiusValues = [0, 0.25, 0.5, 1, 1.5, 2] as const;

function radius(title: string, a: Accessor<number>): JSX.Element {
    const radiusLabel = (radius: number): JSX.Element => {
        return <div class={styles.btns}><div style={{ 'border-top-left-radius': `${radius}rem` }} /></div>;
    };

    return <div class={styles.radius}>
        <RadioGroup class="w-full" label={<span class={styles.title}>{title}</span>} accessor={a} block options={radiusValues.map((v) => [v, radiusLabel(v)])} />
    </div>;
}

// 设置字体大小参数面板
function fontSizeParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconFontSize class="mr-1" />{l.t('_c.theme.fontSize')}</Divider>
        {fontSize(s.accessor('fontSize'))}
    </div>;
}

// 可用的字体大小
const fontSizeValues = [12, 16, 20, 24, 28, 32] as const;

function fontSize(a: Accessor<string>): JSX.Element {
    const max = fontSizeValues[fontSizeValues.length - 1];

    const option = (size: number): FieldOption<string> => {
        return [
            `${size}px`,
            <span class={styles['font-number']} style={{
                'font-size': `${size}px`,
                'width': `${max + 8}px`,
                'height': `${max + 8}px`,
                'line-height': `${max + 8}px`,
            }}>{size}</span>
        ];
    };

    return <RadioGroup accessor={a} block layout='vertical' options={fontSizeValues.map(v => option(v))} />;
}

// 颜色选择参数面板
function colorsParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconColors class="mr-1" />{l.t('_c.theme.colors')}</Divider>
        {palette('dark', 'primary', s)}
        {palette('dark', 'secondary', s)}
        {palette('dark', 'tertiary', s)}
        {palette('dark', 'error', s)}
        {palette('dark', 'surface', s)}
    </div>;
}

function palette(mode: Mode, palette: Palette, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    const block = (name: string) => {
        return <div class={styles.block}>
            <Show when={name}><div class={styles.title}>{name}</div></Show>
            <OKLCHPicker accessor={s.accessor<string>(`${mode}.${palette}-bg${name ? '-' + name : ''}` as any)} />
            <OKLCHPicker accessor={s.accessor<string>(`${mode}.${palette}-fg${name ? '-' + name : ''}` as any)} />
        </div>;
    };

    return <div class={styles.palette}>
        <div>{palette}</div>
        <div class={styles.blocks}>
            {block('')}
            {block('low')}
            {block('high')}
        </div>
    </div>;
}

function otherParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconOptions class="mr-1" />{l.t('_c.theme.otherParams')}</Divider>
        <Range layout='vertical' label={l.t('_c.theme.spacing')} accessor={s.accessor('spacing')} {...spacingValues} value={v => `${v}rem`} />
        <Range layout='vertical' label={l.t('_c.theme.transitionDuration')} accessor={s.accessor('transitionDuration')} {...transitionValues} value={v => `${v}ms`} />
    </div>;
}

// spacing 可用的参数
const spacingValues = { min: 0.1, max: 0.4, step: 0.05 } as const;

// transition 可用的参数
const transitionValues = { min: 100, max: 1000, step: 50 } as const;
