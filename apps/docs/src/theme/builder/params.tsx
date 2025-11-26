// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Accessor, Button, ButtonGroup, Code, Dialog, DialogRef, Divider, Dropdown, FieldOption, joinClass, Label,
    Locale, MenuItemItem, ObjectAccessor, Palette, RadioGroup, Range, Scheme, useComponents, useLocale,
    RangeRef, fieldAccessor,
} from '@cmfx/components';
import { ExpandType, rand } from '@cmfx/core';
import { batch, createMemo, JSX, createEffect } from 'solid-js';
import Color from 'colorjs.io';
import { unwrap } from 'solid-js/store';
import IconApply from '~icons/fluent/text-change-accept-20-filled';
import IconOptions from '~icons/ion/options';
import IconLoad from '~icons/material-symbols/arrow-upload-progress';
import IconRand from '~icons/mingcute/random-fill';
import IconColors from '~icons/material-symbols/colors';
import IconExport from '~icons/material-symbols/export-notes';
import IconRadius from '~icons/mingcute/border-radius-fill';
import IconFontSize from '~icons/mingcute/font-size-fill';

import { convertSchemeVar2Color } from './utils';
import styles from './style.module.css';

/**
 * 参数面板
 */
export function params(s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    const l = useLocale();
    const [, act, opt] = useComponents();
    let dlg: DialogRef;

    const schemes = Array.from(opt.schemes!).
        map(s => { return { type: 'item', value: s[0], label: s[0] }; }) as Array<MenuItemItem<string>>;

    const source = createMemo(() => JSON.stringify(s.store(), null, 4));

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
            </div>

            <ButtonGroup kind='border'>
                <Button square onclick={async () => act.switchScheme(await s.object())} title={l.t('_d.theme.apply')}>
                    <IconApply />
                </Button>
                <Button square onclick={() => dlg.element().showModal()} title={l.t('_d.theme.export')}>
                    <IconExport />
                </Button>
            </ButtonGroup>
        </div>

        <div class={styles.ps}>
            {fontSizeParams(l, s)}
            {colorsParams(l, s)}
            {radiusParams(l, s)}
            {otherParams(l, s)}
        </div>

        <Dialog movable class="h-1/2" ref={el => dlg = el}
            header={<Label icon={<IconExport />}>{l.t('_d.theme.export')}</Label>}
        >
            <Code lang='json' class="h-full" ln={0}>{source()}</Code>
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

        let h = rand(0, 360, 2);
        s.accessor<string>('error').setValue(fmtColor(1, .4, h));

        h = rand((h + 20) % 360, 360, 2);
        s.accessor<string>('primary').setValue(fmtColor(1, .4, h));

        h = rand((h + 20) % 360, 360, 2);
        s.accessor<string>('secondary').setValue(fmtColor(1, .4, h));

        h = rand((h + 20) % 360, 360, 2);
        s.accessor<string>('tertiary').setValue(fmtColor(1, .4, h));

        h = rand((h + 20) % 360, 360, 2);
        s.accessor<string>('surface').setValue(fmtColor(1, .4, h));

        s.accessor<number>('radius.xs').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.sm').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.md').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.lg').setValue(radiusValues[rand(0, radiusValues.length, 0)]);
        s.accessor<number>('radius.xl').setValue(radiusValues[rand(0, radiusValues.length, 0)]);

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
function colorsParams(l: Locale, s: ObjectAccessor<ExpandType<Scheme>>): JSX.Element {
    return <div class={styles.param}>
        <Divider><IconColors class="me-1" />{l.t('_d.theme.colors')}</Divider>
        <PalettePicker palette='primary' schemes={s} />
        <PalettePicker palette='secondary' schemes={s} />
        <PalettePicker palette='tertiary' schemes={s} />
        <PalettePicker palette='error' schemes={s} />
        <PalettePicker palette='surface' schemes={s} />
    </div>;
}

function PalettePicker(props: { palette: Palette, schemes: ObjectAccessor<ExpandType<Scheme>> }): JSX.Element {
    let rangeRef: RangeRef;
    const schemesFA = props.schemes.accessor<string>(props.palette);

    const c = new Color(props.schemes.store()[props.palette]);
    const hueFA = fieldAccessor<number>('hue', c.h);
    hueFA.onChange(v => {
        const c = new Color(schemesFA.getValue());
        schemesFA.setValue(fmtColor(c.l, c.c, v));
    });

    createEffect(() => {
        const c = new Color(props.schemes.store()[props.palette]);

        rangeRef.input().style.background = `linear-gradient(to right, ${fmtColor(c.l, c.c, 0)},
            ${fmtColor(c.l, c.c, 20)}, ${fmtColor(c.l, c.c, 40)}, ${fmtColor(c.l, c.c, 60)},
            ${fmtColor(c.l, c.c, 80)}, ${fmtColor(c.l, c.c, 100)}, ${fmtColor(c.l, c.c, 120)},
            ${fmtColor(c.l, c.c, 140)}, ${fmtColor(c.l, c.c, 160)}, ${fmtColor(c.l, c.c, 180)},
            ${fmtColor(c.l, c.c, 200)}, ${fmtColor(c.l, c.c, 220)}, ${fmtColor(c.l, c.c, 240)},
            ${fmtColor(c.l, c.c, 260)}, ${fmtColor(c.l, c.c, 280)}, ${fmtColor(c.l, c.c, 300)},
            ${fmtColor(c.l, c.c, 320)}, ${fmtColor(c.l, c.c, 340)}, ${fmtColor(c.l, c.c, 360)})`;

        hueFA.setValue(c.h);
    });

    return <Range min={0} max={360} step={0.01} fitHeight ref={el => rangeRef = el} layout='vertical' label={props.palette}
        accessor={hueFA} value={v => `${v.toFixed(2)}%`} />;
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

function fmtColor(l: number, c: number, h: number): string {
    return `oklch(${l} ${c} ${h})`;
}
