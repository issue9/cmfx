// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType } from '@cmfx/core';
import { JSX } from 'solid-js';
import IconAnimation from '~icons/material-symbols/animation';
import IconColors from '~icons/material-symbols/colors';
import IconSpacing from '~icons/material-symbols/format-letter-spacing';
import IconRadius from '~icons/mingcute/border-radius-fill';
import IconFontSize from '~icons/mingcute/font-size-fill';

import { Locale, Mode, Palette, Scheme } from '@/base';
import { useLocale } from '@/context';
import { Divider } from '@/divider';
import { Accessor, FieldOption, ObjectAccessor, OKLCHPicker, RadioGroup, Range } from '@/form';
import styles from './style.module.css';

// 参数面板
export function params(s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    const l = useLocale();

    return <div class={styles.params}>
        {fontSizeParams(l, s)}
        {colorsParams(l, s)}
        {radiusParams(l, s)}
        {spacingParams(l, s)}
        {transitionParams(l, s)}
    </div>;
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

function radius(title: string, a: Accessor<number>): JSX.Element {
    const radiusLabel = (radius: number): JSX.Element => {
        return <div class={styles.btns}><div style={{ 'border-top-left-radius': `${radius}rem` }} /></div>;
    };

    return <div class={styles.radius}>
        <span class={styles.title}>{title}</span>
        <RadioGroup accessor={a} block options={[
            [0, radiusLabel(0)],
            [0.25, radiusLabel(0.125)],
            [0.375, radiusLabel(0.25)],
            [0.5, radiusLabel(0.5)],
            [0.625, radiusLabel(0.75)],
            [0.75, radiusLabel(1)],
            [0.875, radiusLabel(1.2)],
            [1, radiusLabel(1.5)],
        ]} />
    </div>;
}

// 设置字体大小参数面板
function fontSizeParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconFontSize />{l.t('_c.theme.fontSize')}</Divider>
        {fontSize(s.accessor('fontSize'))}
    </div>;
}

function fontSize(a: Accessor<string>): JSX.Element {
    const max = 32;

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

    return <RadioGroup accessor={a} block layout='vertical' options={[
        option(12), option(16), option(20), option(24),
        option(28), option(max),
    ]} />;
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
            <div class={styles.title}>{name ? name : 'base'}</div>
            <OKLCHPicker accessor={s.accessor(`${mode}.${palette}-bg${name ? '-' + name : ''}` as any)} />
            <OKLCHPicker accessor={s.accessor(`${mode}.${palette}-fg${name ? '-' + name : ''}` as any)} />
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

function spacingParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconSpacing />{l.t('_c.theme.spacing')}</Divider>
        <div class="flex gap-2 items-center w-full">
            <Range class="flex-1" accessor={s.accessor('spacing')} min={0.1} max={0.5} step={0.05} />
            {s.accessor<number>('spacing').getValue()}rem
        </div>
    </div>;
}

function transitionParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconAnimation />{l.t('_c.theme.transitionDuration')}</Divider>
        <div class="flex gap-2 items-center w-full">
            <Range class="flex-1" accessor={s.accessor('transitionDuration')} min={100} max={1000} step={50} />
            {s.accessor<number>('transitionDuration').getValue()}ms
        </div>
    </div>;
}
