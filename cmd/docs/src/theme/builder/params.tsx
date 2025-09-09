// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Accessor, Button, ButtonGroup, Code, Dialog, DialogRef, Divider, FieldOption, Label,
    Locale, Mode, ObjectAccessor, OKLCHPicker, Palette, RadioGroup, Range, Scheme, useLocale
} from '@cmfx/components';
import { ExpandType, rand } from '@cmfx/core';
import { batch, JSX, Show } from 'solid-js';
import IconApply from '~icons/fluent/text-change-accept-20-filled';
import IconOptions from '~icons/ion/options';
import IconRandLess from '~icons/material-symbols/brightness-4-rounded';
import IconRandNormal from '~icons/material-symbols/brightness-6-rounded';
import IconRandMore from '~icons/material-symbols/brightness-7-rounded';
import IconColors from '~icons/material-symbols/colors';
import IconDark from '~icons/material-symbols/dark-mode';
import IconExport from '~icons/material-symbols/export-notes';
import IconLight from '~icons/material-symbols/light-mode';
import IconReset from '~icons/material-symbols/reset-settings';
import IconRadius from '~icons/mingcute/border-radius-fill';
import IconFontSize from '~icons/mingcute/font-size-fill';

import { randOklchColor } from './oklch';
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
                <ButtonGroup rounded>
                    <Button kind='border' rounded square title={l.t('_d.theme.randomContrastLess')}
                        onclick={() => random(s, 45)}><IconRandLess /></Button>
                    <Button kind='border' rounded square title={l.t('_d.theme.randomContrastNormal')}
                        onclick={() => random(s, 60)}><IconRandNormal /></Button>
                    <Button kind='border' rounded square title={l.t('_d.theme.randomContrastMore')}
                        onclick={() => random(s, 75)}><IconRandMore /></Button>
                </ButtonGroup>

                <ButtonGroup rounded>
                    <Button square title={l.t('_d.theme.light')}
                        checked={m.getValue() === 'light'} onClick={() => m.setValue('light')}>
                        <IconLight />
                    </Button>
                    <Button square title={l.t('_d.theme.dark')}
                        checked={m.getValue() === 'dark'} onClick={() => m.setValue('dark')}>
                        <IconDark />
                    </Button>
                </ButtonGroup>
            </div>
            <ButtonGroup rounded>
                <Button square onClick={ref.reset} title={l.t('_c.reset')}><IconReset /></Button>
                <Button square onClick={() => ref.apply()} title={l.t('_d.theme.apply')}><IconApply /></Button>
                <Button square onClick={() => dlg.showModal()} title={l.t('_d.theme.export')}><IconExport /></Button>
            </ButtonGroup>
        </div>

        {fontSizeParams(l, s)}
        {colorsParams(l, m, s)}
        {radiusParams(l, s)}
        {otherParams(l, s)}

        <Dialog class="h-2/3" ref={el => dlg = el} header={<Label icon={IconExport}>{l.t('_d.theme.export')}</Label>}>
            <Code lang='json' class="h-full" ln={0}>{JSON.stringify(s.object(), null, 4)}</Code>
        </Dialog>
    </div>;
}

/**
 * 生成随机参数
 */
export function random(s: ObjectAccessor<ExpandType<Scheme>>, contrast: 75 | 60 | 45 = 60) {
    batch(() => {
        // 字体不生成随机，改字体会直接作用在整个页面上。
        s.accessor<string>('fontSize').setValue('16px');

        s.accessor<number>('contrast').setValue(contrast);

        let h = rand(0, 360, 3);
        let c = randOklchColor(h, contrast);
        s.accessor<string>('dark.error-bg').setValue(c[1].toString());
        s.accessor<string>('dark.error-fg').setValue(c[0].toString());
        s.accessor<string>('light.error-bg').setValue(c[0].toString());
        s.accessor<string>('light.error-fg').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'low');
        s.accessor<string>('dark.error-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.error-fg-low').setValue(c[0].toString());
        s.accessor<string>('light.error-bg-low').setValue(c[0].toString());
        s.accessor<string>('light.error-fg-low').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'high');
        s.accessor<string>('dark.error-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.error-fg-high').setValue(c[0].toString());
        s.accessor<string>('light.error-bg-high').setValue(c[0].toString());
        s.accessor<string>('light.error-fg-high').setValue(c[1].toString());

        h = rand((h + 20) % 360, 360, 3);
        c = randOklchColor(h, contrast);
        s.accessor<string>('dark.surface-bg').setValue(c[1].toString());
        s.accessor<string>('dark.surface-fg').setValue(c[0].toString());
        s.accessor<string>('light.surface-bg').setValue(c[0].toString());
        s.accessor<string>('light.surface-fg').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'low');
        s.accessor<string>('dark.surface-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.surface-fg-low').setValue(c[0].toString());
        s.accessor<string>('light.surface-bg-low').setValue(c[0].toString());
        s.accessor<string>('light.surface-fg-low').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'high');
        s.accessor<string>('dark.surface-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.surface-fg-high').setValue(c[0].toString());
        s.accessor<string>('light.surface-bg-high').setValue(c[0].toString());
        s.accessor<string>('light.surface-fg-high').setValue(c[1].toString());

        h = rand((h + 20) % 360, 360, 3);
        c = randOklchColor(h, contrast);
        s.accessor<string>('dark.primary-bg').setValue(c[1].toString());
        s.accessor<string>('dark.primary-fg').setValue(c[0].toString());
        s.accessor<string>('light.primary-bg').setValue(c[0].toString());
        s.accessor<string>('light.primary-fg').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'low');
        s.accessor<string>('dark.primary-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.primary-fg-low').setValue(c[0].toString());
        s.accessor<string>('light.primary-bg-low').setValue(c[0].toString());
        s.accessor<string>('light.primary-fg-low').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'high');
        s.accessor<string>('dark.primary-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.primary-fg-high').setValue(c[0].toString());
        s.accessor<string>('light.primary-bg-high').setValue(c[0].toString());
        s.accessor<string>('light.primary-fg-high').setValue(c[1].toString());

        h = rand((h + 20) % 360, 360, 3);
        c = randOklchColor(h, contrast);
        s.accessor<string>('dark.secondary-bg').setValue(c[1].toString());
        s.accessor<string>('dark.secondary-fg').setValue(c[0].toString());
        s.accessor<string>('light.secondary-bg').setValue(c[0].toString());
        s.accessor<string>('light.secondary-fg').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'low');
        s.accessor<string>('dark.secondary-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.secondary-fg-low').setValue(c[0].toString());
        s.accessor<string>('light.secondary-bg-low').setValue(c[0].toString());
        s.accessor<string>('light.secondary-fg-low').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'high');
        s.accessor<string>('dark.secondary-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.secondary-fg-high').setValue(c[0].toString());
        s.accessor<string>('light.secondary-bg-high').setValue(c[0].toString());
        s.accessor<string>('light.secondary-fg-high').setValue(c[1].toString());

        h = rand((h + 20) % 360, 360, 3);
        c = randOklchColor(h, contrast);
        s.accessor<string>('dark.tertiary-bg').setValue(c[1].toString());
        s.accessor<string>('dark.tertiary-fg').setValue(c[0].toString());
        s.accessor<string>('light.tertiary-bg').setValue(c[0].toString());
        s.accessor<string>('light.tertiary-fg').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'low');
        s.accessor<string>('dark.tertiary-bg-low').setValue(c[1].toString());
        s.accessor<string>('dark.tertiary-fg-low').setValue(c[0].toString());
        s.accessor<string>('light.tertiary-bg-low').setValue(c[0].toString());
        s.accessor<string>('light.tertiary-fg-low').setValue(c[1].toString());
        c = randOklchColor(h, contrast, 'high');
        s.accessor<string>('dark.tertiary-bg-high').setValue(c[1].toString());
        s.accessor<string>('dark.tertiary-fg-high').setValue(c[0].toString());
        s.accessor<string>('light.tertiary-bg-high').setValue(c[0].toString());
        s.accessor<string>('light.tertiary-fg-high').setValue(c[1].toString());

        s.accessor<number>('radius.xs').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.sm').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.md').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.lg').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.2xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.3xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.4xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);

        s.accessor<number>('transitionDuration').setValue(rand(transitionValues.min, transitionValues.max, 0));
    });
}

// 设置圆角孤度参数面板
function radiusParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconRadius class="me-1" />{l.t('_d.theme.radius')}</Divider>
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
        <RadioGroup class="w-full" accessor={a} block
            label={<span class={styles.title}>{title}</span>}
            options={radiusValues.map((v) => [v, radiusLabel(v)])} />
    </div>;
}

// 设置字体大小参数面板
function fontSizeParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconFontSize class="me-1" />{l.t('_d.theme.fontSize')}</Divider>
        {fontSize(s.accessor('fontSize'))}
    </div>;
}

// 可用的字体大小
const fontSizeValues = [14, 16, 18, 20, 24, 28, 32] as const;

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
function colorsParams(l: Locale, m: Accessor<Mode>, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconColors class="me-1" />{l.t('_d.theme.colors')}</Divider>
        {palette(m.getValue(), 'primary', s)}
        {palette(m.getValue(), 'secondary', s)}
        {palette(m.getValue(), 'tertiary', s)}
        {palette(m.getValue(), 'error', s)}
        {palette(m.getValue(), 'surface', s)}
    </div>;
}

function palette(mode: Mode, palette: Palette, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    const block = (name: string) => {
        const bg = s.accessor<string>(`${mode}.${palette}-bg${name ? '-' + name : ''}` as any);
        const fg = s.accessor<string>(`${mode}.${palette}-fg${name ? '-' + name : ''}` as any);

        return <div class={styles.block}>
            <Show when={name}><div class={styles.title}>{name}</div></Show>
            <OKLCHPicker accessor={bg} />
            <OKLCHPicker accessor={fg} wcag={bg.getValue()} />
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
        <Divider><IconOptions class="me-1" />{l.t('_d.theme.otherParams')}</Divider>

        <Range layout='vertical' label={l.t('_d.theme.transitionDuration')}
            accessor={s.accessor('transitionDuration')} {...transitionValues} value={v => `${v}ms`} />
    </div>;
}

// transition 可用的参数
const transitionValues = { min: 100, max: 1000, step: 50 } as const;
