// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Accessor, Button, ButtonGroup, Code, Dialog, DialogRef, Divider, Dropdown, FieldOption, joinClass, Label,
    Locale, wcag, MenuItemItem, Mode, ObjectAccessor, OKLCHPicker, Palette, RadioGroup, Range, Scheme,
    ThemeProvider, useComponents, useLocale,
} from '@cmfx/components';
import { ExpandType, rand } from '@cmfx/core';
import { batch, createSignal, JSX, onMount } from 'solid-js';
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

import { Ref, convertSchemeVar2Color } from './utils';
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
                        s.setObject(convertSchemeVar2Color(unwrap(opt.schemes?.get(e)!)));
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
        <PalettePicker palette='primary' schemes={s} mode={mode} />
        <PalettePicker palette='secondary' schemes={s} mode={mode} />
        <PalettePicker palette='tertiary' schemes={s} mode={mode} />
        <PalettePicker palette='error' schemes={s} mode={mode} />
        <PalettePicker palette='surface' schemes={s} mode={mode} />
    </div>;
}

function PalettePicker(
    props: { palette: Palette, schemes: ObjectAccessor<ExpandType<Scheme>>, mode: Accessor<Mode> }
): JSX.Element {
    const sty = (t: '' | '-low' | '-high') => ({
        'background-color': `var(--${props.palette}-bg${t})`,
        'color': `var(--${props.palette}-fg${t})`,
        'border': `1px solid var(--${props.palette}-border${t})`
    });

    let ref1: HTMLDivElement;
    let ref2: HTMLDivElement;
    let ref3: HTMLDivElement;

    const [wcag1, setWCAG1] = createSignal('');
    const [wcag2, setWCAG2] = createSignal('');
    const [wcag3, setWCAG3] = createSignal('');

    const change =() => {
        const s1 = window.getComputedStyle(ref1);
        setWCAG1(wcag(s1.getPropertyValue('background-color'), s1.getPropertyValue('color')));

        const s2 = window.getComputedStyle(ref2);
        setWCAG2(wcag(s2.getPropertyValue('background-color'), s2.getPropertyValue('color')));

        const s3 = window.getComputedStyle(ref3);
        setWCAG3(wcag(s3.getPropertyValue('background-color'), s3.getPropertyValue('color')));
    };
    onMount(() => change());

    const color = props.schemes.accessor<string>(props.palette);
    color.onChange(() => change());

    return <div class={styles.palette}>
        {props.palette}
        <div class={styles.blocks}>
            <OKLCHPicker accessor={color} />

            <ThemeProvider scheme={props.schemes.raw()} mode={props.mode.getValue()}>
                <div class={styles.right}>
                    <div ref={el => ref1 = el} style={{ ...sty('-low') }} class={styles.block}>{wcag1()}</div>
                    <div ref={el => ref2 = el} style={{ ...sty('') }} class={styles.block}>{wcag2()}</div>
                    <div ref={el => ref3 = el} style={{ ...sty('-high') }} class={styles.block}>{wcag3()}</div>
                </div>
            </ThemeProvider>
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
