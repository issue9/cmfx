// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType, rand } from '@cmfx/core';
import { JSX, Show } from 'solid-js';
import IconApply from '~icons/fluent/text-change-accept-20-filled';
import IconAnimation from '~icons/material-symbols/animation';
import IconColors from '~icons/material-symbols/colors';
import IconExport from '~icons/material-symbols/export-notes';
import IconSpacing from '~icons/material-symbols/format-letter-spacing';
import IconReset from '~icons/material-symbols/reset-settings';
import IconRadius from '~icons/mingcute/border-radius-fill';
import IconFontSize from '~icons/mingcute/font-size-fill';
import IconRand from '~icons/mingcute/random-line';

import { Locale, Mode, Palette, Scheme } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { useLocale } from '@/context';
import { Dialog, DialogRef } from '@/dialog';
import { Divider } from '@/divider';
import { Accessor, FieldOption, ObjectAccessor, OKLCHPicker, RadioGroup, Range } from '@/form';
import { Label } from '@/typography';
import { Ref } from './ref';
import styles from './style.module.css';

/**
 * 参数面板
 */
export function params(s: ObjectAccessor<ExpandType<Scheme>>, ref: Ref): JSX.Element {
    const l = useLocale();
    let dlg: DialogRef;

    return <div class={styles.params}>
        <div class={styles.toolbar}>
            <Button kind='border' rounded square title={l.t('_c.theme.random')} onclick={() => random(s)}><IconRand /></Button>
            <ButtonGroup kind='border' rounded>
                <Button square onClick={ref.reset} title={l.t('_c.reset')}><IconReset /></Button>
                <Button square onClick={() => ref.apply()} title={l.t('_c.theme.apply')}><IconApply /></Button>
                <Button square onClick={() => dlg.showModal()} title={l.t('_c.theme.export')}><IconExport /></Button>
            </ButtonGroup>
        </div>

        {fontSizeParams(l, s)}
        {colorsParams(l, s)}
        {radiusParams(l, s)}
        {spacingParams(l, s)}
        {transitionParams(l, s)}

        <Dialog scrollable class="h-2/3" ref={el => dlg = el} header={<Label icon={IconExport}>{l.t('_c.theme.export')}</Label>}>
            <pre>{JSON.stringify(s.object(), null, 4)}</pre>
        </Dialog>
    </div>;
}

/**
 * 生成随机参数
 */
function random(s: ObjectAccessor<ExpandType<Scheme>>) {
    // 字体不生成随机，改字体会直接作用在整个页面上。
    // s.accessor<string>('fontSize').setValue(`${fontSizeValues[rand(0, fontSizeValues.length, 0)]}px`);

    const primary = rand(0, 360, 0);
    const secondary = rand(0, 360, 0);
    const tertiary = rand(0, 360, 0);
    const error = rand(0, 360, 0);
    const surface = rand(0, 360, 0);

    s.accessor<string>('dark.primary-bg').setValue(`oklch(.2 .45 ${primary})`);
    s.accessor<string>('dark.primary-fg').setValue(`oklch(.8 .2 ${primary})`);
    s.accessor<string>('dark.primary-bg-low').setValue(`oklch(.3 .45 ${primary})`);
    s.accessor<string>('dark.primary-fg-low').setValue(`oklch(.7 .2 ${primary})`);
    s.accessor<string>('dark.primary-bg-high').setValue(`oklch(.1 .45 ${primary})`);
    s.accessor<string>('dark.primary-fg-high').setValue(`oklch(.9 .2 ${primary})`);

    s.accessor<string>('dark.secondary-bg').setValue(`oklch(.2 .45 ${secondary})`);
    s.accessor<string>('dark.secondary-fg').setValue(`oklch(.8 .2 ${secondary})`);
    s.accessor<string>('dark.secondary-bg-low').setValue(`oklch(.3 .45 ${secondary})`);
    s.accessor<string>('dark.secondary-fg-low').setValue(`oklch(.7 .2 ${secondary})`);
    s.accessor<string>('dark.secondary-bg-high').setValue(`oklch(.1 .45 ${secondary})`);
    s.accessor<string>('dark.secondary-fg-high').setValue(`oklch(.9 .2 ${secondary})`);

    s.accessor<string>('dark.tertiary-bg').setValue(`oklch(.2 .45 ${tertiary})`);
    s.accessor<string>('dark.tertiary-fg').setValue(`oklch(.8 .2 ${tertiary})`);
    s.accessor<string>('dark.tertiary-bg-low').setValue(`oklch(.3 .45 ${tertiary})`);
    s.accessor<string>('dark.tertiary-fg-low').setValue(`oklch(.7 .2 ${tertiary})`);
    s.accessor<string>('dark.tertiary-bg-high').setValue(`oklch(.1 .45 ${tertiary})`);
    s.accessor<string>('dark.tertiary-fg-high').setValue(`oklch(.9 .2 ${tertiary})`);

    s.accessor<string>('dark.error-bg').setValue(`oklch(.2 .45 ${error})`);
    s.accessor<string>('dark.error-fg').setValue(`oklch(.8 .2 ${error})`);
    s.accessor<string>('dark.error-bg-low').setValue(`oklch(.3 .45 ${error})`);
    s.accessor<string>('dark.error-fg-low').setValue(`oklch(.7 .2 ${error})`);
    s.accessor<string>('dark.error-bg-high').setValue(`oklch(.1 .45 ${error})`);
    s.accessor<string>('dark.error-fg-high').setValue(`oklch(.9 .2 ${error})`);

    s.accessor<string>('dark.surface-bg').setValue(`oklch(.2 .45 ${surface})`);
    s.accessor<string>('dark.surface-fg').setValue(`oklch(.8 .2 ${surface})`);
    s.accessor<string>('dark.surface-bg-low').setValue(`oklch(.3 .45 ${surface})`);
    s.accessor<string>('dark.surface-fg-low').setValue(`oklch(.7 .2 ${surface})`);
    s.accessor<string>('dark.surface-bg-high').setValue(`oklch(.1 .45 ${surface})`);
    s.accessor<string>('dark.surface-fg-high').setValue(`oklch(.9 .2 ${surface})`);

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
}

// 设置圆角孤度参数面板
function radiusParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconRadius />{l.t('_c.theme.radius')}</Divider>
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
        <span class={styles.title}>{title}</span>
        <RadioGroup accessor={a} block options={radiusValues.map((v) => [v, radiusLabel(v)])} />
    </div>;
}

// 设置字体大小参数面板
function fontSizeParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconFontSize />{l.t('_c.theme.fontSize')}</Divider>
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
        <Divider><IconColors />{l.t('_c.theme.colors')}</Divider>
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

// spacing 可用的参数
const spacingValues = { min: 0.1, max: 0.5, step: 0.05 } as const;

function spacingParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconSpacing />{l.t('_c.theme.spacing')}</Divider>
        <div class="flex gap-2 items-center w-full">
            <Range class="flex-1" accessor={s.accessor('spacing')} {...spacingValues} />
            {s.accessor<number>('spacing').getValue()}rem
        </div>
    </div>;
}

// transition 可用的参数
const transitionValues = { min: 100, max: 1000, step: 50 } as const;

function transitionParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconAnimation />{l.t('_c.theme.transitionDuration')}</Divider>
        <div class="flex gap-2 items-center w-full">
            <Range class="flex-1" accessor={s.accessor('transitionDuration')} {...transitionValues} />
            {s.accessor<number>('transitionDuration').getValue()}ms
        </div>
    </div>;
}
