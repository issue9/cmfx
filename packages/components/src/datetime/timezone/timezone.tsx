// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { DisplayStyle } from '@cmfx/core';
import { createEffect, createMemo, createSignal, For, JSX, onMount, Show, untrack } from 'solid-js';

import { BaseProps } from '@components/base';
import { Button, ButtonRef } from '@components/button';
import { useLocale } from '@components/context';
import { ChangeFunc } from '@components/form/field';
import { Tab, TabItem } from '@components/tab';
import styles from './style.module.css';

export interface Props extends BaseProps {
    value?: string;

    /**
     * 值发生改变时触发的事件
     */
    onChange?: ChangeFunc<string>;
}

interface Region {
    id: string;
    displayName: string;
    timezones: Array<string>;
}

export function buildLocaleRegion(l: Intl.Locale, style: DisplayStyle): Map<string, string> {
    const fmt = (tz: string): string => {
        const formatter = new Intl.DateTimeFormat(l, {
            timeZone: tz,
            timeZoneName: style === 'full' ? 'long' : (style === 'short' ? 'shortGeneric' : 'short')
        });
        const parts = formatter.formatToParts(new Date());
        return parts.find(p => p.type === 'timeZoneName')?.value || tz;
    };

    const ret = new Map<string, string>();
    Intl.supportedValuesOf('timeZone').forEach(tz => ret.set(tz, fmt(tz)));
    return ret;
}

export function buildRegion(): Array<Region> {
    const regions = Intl.supportedValuesOf('timeZone').reduce((acc, tz) => {
        const [region,] = tz.split('/');
        if (!acc.has(region)) { acc.set(region, []); }
        acc.get(region)!.push(tz);
        return acc;
    }, new Map<string, Array<string>>());

    return Array.from(regions.entries().map(([id, timezones]) => ({
        id,
        displayName: id.split('/')[0],
        timezones,
    })));
}

/**
 * 时区选择组件
 *
 * @remarks 这是基于浏览器的时区选择组件，不同的浏览器展示的数据会稍有不同。
 */
export default function Timezone(props: Props): JSX.Element {
    const l = useLocale();

    const regions = buildRegion();
    const localeRegions = createMemo(() => { return buildLocaleRegion(l.locale, l.displayStyle); });
    const tabs = regions.map(v => { return { id: v.id, label: v.displayName } as TabItem; });

    const [tab, setTab] = createSignal<string | undefined>(tabs[0].id);
    const [selected, setSelected] = createSignal<string | undefined>(props.value);
    if (props.value) {
        setTab(props.value.split('/')[0]);
    }

    createEffect(() => { // 监视 props.value 变化
        const val = props.value;
        if (val === untrack(selected)) { return; }

        setSelected(val);
        if (val) { setTab(val.split('/')[0]); }
    });

    const click = (value: string) => {
        const old = untrack(selected);
        if (old === value) { return; }

        setSelected(value);
        if (value) { setTab(value.split('/')[0]); }

        if (props.onChange) { props.onChange(value, old); }
    };

    let buttonRef: ButtonRef;
    onMount(() => {
        requestAnimationFrame(() => {
            if (!buttonRef) { return; }

            const p = buttonRef.root().parentElement!;
            const top = buttonRef.root().getBoundingClientRect().top - p.getBoundingClientRect().top;
            p.scrollBy({ top: top, behavior: 'smooth' });
        });
    });

    return <Tab class={props.class} style={props.style} palette={props.palette}
        value={tab()} items={tabs} onChange={v => setTab(v)} panelClass={styles.panel}>
        <For each={regions}>
            {region =>
                <Show when={region.id === tab() ? region.timezones : undefined}>
                    {timezones =>
                        <For each={timezones()}>
                            {item =>
                                <Button checked={selected() === item} kind='flat' class={styles.item}
                                    onclick={() => click(item)} ref={el => {
                                        if (selected() === item && !buttonRef) {
                                            buttonRef = el;
                                        }
                                    }}
                                >
                                    <span class={styles.line}>{localeRegions().get(item)}</span>
                                    <span class={styles.line} title={item}>{item}</span>
                                </Button>
                            }
                        </For>
                    }
                </Show>
            }
        </For>
    </Tab>;
}
