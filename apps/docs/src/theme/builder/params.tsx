// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Accessor, Button, ButtonGroup, Code, Dialog, DialogRef, Divider, Dropdown, FieldOption, joinClass, Label, Locale,
    MenuItemItem, Mode, ObjectAccessor, OKLCHPicker, Palette, RadioGroup, Range, Scheme, ThemeProvider, useComponents, useLocale
} from '@cmfx/components';
import { ExpandType, rand } from '@cmfx/core';
import { batch, JSX } from 'solid-js';
import Color from 'colorjs.io';
import { unwrap } from 'solid-js/store';
import IconApply from '~icons/fluent/text-change-accept-20-filled';
import IconOptions from '~icons/ion/options';
import IconLoad from '~icons/material-symbols/arrow-upload-progress';
import IconRand from '~icons/mingcute/random-fill';
import IconColors from '~icons/material-symbols/colors';
import IconDark from '~icons/material-symbols/dark-mode';
import IconExport from '~icons/material-symbols/export-notes';
import IconLight from '~icons/material-symbols/light-mode';
import IconRadius from '~icons/mingcute/border-radius-fill';
import IconFontSize from '~icons/mingcute/font-size-fill';

import { Ref } from './ref';
import styles from './style.module.css';

/**
 * 参数面板
 */
export function params(s: ObjectAccessor<ExpandType<Scheme>>, m: Accessor<Mode>, ref: Ref): JSX.Element {
    const l = useLocale();
    const [, , opt] = useComponents();
    let dlg: DialogRef;

    const schemes = Array.from(opt.schemes!).
        map(s => { return { type: 'item', value: s[0], label: s[0] }; }) as Array<MenuItemItem<string>>;

    return <div class={styles.params}>
        <div class={joinClass('primary', styles.toolbar)}>
            <div class={styles.actions}>
                <ButtonGroup kind='border'>
                    <Dropdown trigger='click' selectedClass='' items={schemes} onChange={e => {
                        s.setObject(unwrap(opt.schemes?.get(e)!));
                    }}>
                        <Button kind='border' square title={l.t('_d.theme.loadPredefinedSchemes')}>
                            <IconLoad />
                        </Button>
                    </Dropdown>
                    <Button square title={l.t('_d.theme.generateScheme')}
                        onclick={() => random(s)}><IconRand /></Button>
                </ButtonGroup>

                <ButtonGroup kind='border'>
                    <Button square title={l.t('_d.theme.light')}
                        checked={m.getValue() === 'light'} onclick={() => m.setValue('light')}>
                        <IconLight />
                    </Button>
                    <Button square title={l.t('_d.theme.dark')}
                        checked={m.getValue() === 'dark'} onclick={() => m.setValue('dark')}>
                        <IconDark />
                    </Button>
                </ButtonGroup>
            </div>

            <ButtonGroup kind='border'>
                <Button square onclick={() => ref.apply()} title={l.t('_d.theme.apply')}><IconApply /></Button>
                <Button square onclick={() => dlg.element().showModal()} title={l.t('_d.theme.export')}>
                    <IconExport />
                </Button>
            </ButtonGroup>
        </div>

        <div class={styles.ps}>
            {fontSizeParams(l, s)}
            {colorsParams(l, s, m)}
            {radiusParams(l, s)}
            {otherParams(l, s)}
        </div>

        <Dialog class="h-2/3" ref={el => dlg = el}
            header={<Label icon={<IconExport />}>{l.t('_d.theme.export')}</Label>}
        >
            <Code lang='json' class="h-full" ln={0}>{JSON.stringify(s.object(), null, 4)}</Code>
        </Dialog>
    </div>;
}

/**
 * 生成随机参数
 */
export function random(s: ObjectAccessor<ExpandType<Scheme>>) {
    batch(() => {
        // 改字体会直接作用在整个页面上。所以随机功能不修改字体大小。
        // s.accessor<string>('fontSize').setValue('16px');

        let h = rand(0, 360, 3);
        s.accessor<string>('error').setValue(new Color('oklch', [.9, .2, h]).toString());

        h = rand((h + 20) % 360, 360, 3);
        s.accessor<string>('surface').setValue(new Color('oklch', [.9, .2, h]).toString());

        h = rand((h + 20) % 360, 360, 3);
        s.accessor<string>('primary').setValue(new Color('oklch', [.9, .2, h]).toString());


        h = rand((h + 20) % 360, 360, 3);
        s.accessor<string>('secondary').setValue(new Color('oklch', [.9, .2, h]).toString());

        h = rand((h + 20) % 360, 360, 3);
        s.accessor<string>('tertiary').setValue(new Color('oklch', [.9, .2, h]).toString());


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
            options={radiusValues.map((v) => ({ value: v, label: radiusLabel(v) }))} />
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
const fontSizeValues = [14, 16, 18, 20, 24, 28] as const;

function fontSize(a: Accessor<string>): JSX.Element {
    const max = fontSizeValues[fontSizeValues.length - 1];

    const option = (size: number): FieldOption<string> => {
        return {
            value: `${size}px`,
            label: <span class={styles['font-number']} style={{
                'font-size': `${size}px`,
                'width': `${max + 8}px`,
                'height': `${max + 8}px`,
                'line-height': `${max + 8}px`,
            }}>{size}</span>
        };
    };

    return <RadioGroup accessor={a} block layout='vertical' options={fontSizeValues.map(v => option(v))} />;
}

// 颜色选择参数面板
function colorsParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>, mode: Accessor<Mode>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconColors class="me-1" />{l.t('_d.theme.colors')}</Divider>
        <ThemeProvider scheme={s.raw()} mode={mode.getValue()}>
            <div>
                {palette('primary', s)}
                {palette('secondary', s)}
                {palette('tertiary', s)}
                {palette('error', s)}
                {palette('surface', s)}
            </div>
        </ThemeProvider>
    </div>;
}

function palette(palette: Palette, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    const color = s.accessor<string>(`${palette}` as any);
    const colorVal = color.getValue();
    if (colorVal.startsWith('var(--')) { // 值是变量，需要计算其真实的值。
        color.setValue(window.getComputedStyle(document.documentElement).getPropertyValue(colorVal.slice(4, -1)));
    }

    const sty = (t: '' | '-low' | '-high') => ({
        'background-color': `var(--${palette}-bg${t})`,
        'color': `var(--${palette}-fg${t})`,
        'border': `1px solid var(--${palette}-border${t})`
    });

    return <div class={styles.palette}>
        {palette}
        <div class={styles.blocks}>
            <OKLCHPicker class="me-auto" accessor={color} />

            <div style={{...sty('-low')}} class={styles.block}>low</div>
            <div style={{...sty('')}} class={styles.block}>base</div>
            <div style={{...sty('-high')}} class={styles.block}>high</div>
        </div>
    </div>;
    return ;
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
