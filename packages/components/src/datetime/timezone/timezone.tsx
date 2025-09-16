// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { DisplayStyle } from '@cmfx/core';
import { createEffect, createMemo, createSignal, For, JSX, Show, untrack } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { ChangeFunc } from '@/form/field';
import { Tab, TabItem } from '@/tab';
import styles from './style.module.css';

export interface Props extends BaseProps {
    value?: string;

    /**
     * 值发生改变时触发的事件
     */
    onChange?: ChangeFunc<string>;
}

interface TZ {
    id: string;
    displayName: string; // 本地化名称
}

interface Region {
    id: string;
    displayName: string; // 本地化名称
    timezones: Array<TZ>;
}

// 返回本地化的区域列表
export function buildLocaleRegion(l: Intl.Locale, style: DisplayStyle): Array<Region> {
    const fmt = (tz: string): string => {
        const formatter = new Intl.DateTimeFormat(l, {
            timeZone: tz,
            timeZoneName: style === 'full' ? 'long' : (style === 'short' ? 'shortGeneric' : 'short')
        });
        const parts = formatter.formatToParts(new Date());
        return parts.find(p => p.type === 'timeZoneName')?.value || tz;
    };

    const regions = Intl.supportedValuesOf('timeZone').reduce((acc, tz) => {
        const [region,] = tz.split('/');
        if (!acc.has(region)) { acc.set(region, []); }
        acc.get(region)?.push({ id: tz, displayName: fmt(tz) });
        return acc;
    }, new Map<string, Array<TZ>>());

    return Array.from(regions.entries()).map(([id, timezones]) => ({
        id,
        displayName: id,
        timezones,
    }));
}

/**
 * 时区选择组件
 *
 * @remarks 这是基于浏览器的时区选择组件，不同的浏览器展示的数据会稍有不同。
 */
export default function Timezone(props: Props): JSX.Element {
    const l = useLocale();
    const regions = createMemo(() => { return buildLocaleRegion(l.locale, l.displayStyle); });

    const tabs = regions().map(v => { return { id: v.id, label: v.displayName }; }) as Array<TabItem>;
    const [tab, setTab] = createSignal<string | undefined>(tabs[0].id);
    const [selected, setSelected] = createSignal<string | undefined>(props.value);

    // 监视 props.value 变化
    createEffect(() => {
        setSelected(props.value);
        if (props.value) {
            const s = props.value.split('/');
            setTab(s[0]);
        }
    });

    const change = (value: string) => {
        const old = untrack(selected);
        if (old === value) { return; }

        setSelected(value);
        if (props.value) {
            const s = props.value.split('/');
            setTab(s[0]);
        }

        if (props.onChange) { props.onChange(value, old); }
    };

    return <div class={joinClass(props.palette ? `palette--${props.palette}` : undefined, props.class)}>
        <Tab value={tab()} items={tabs} onChange={v => setTab(v)} panelClass={styles.panel}>
            <For each={regions()}>
                {region => (
                    <Show when={region.id === tab() ? region.timezones : undefined}>
                        {timezones => (
                            <For each={timezones()}>
                                {item => (
                                    <Button checked={selected() === item.id} kind='flat' class={styles.item}
                                        onClick={() => change(item.id)}
                                    >
                                        <span class={styles.line}>{item.displayName}</span>
                                        <span class={styles.line} title={item.id}>{item.id}</span>
                                    </Button>
                                )}
                            </For>
                        )}
                    </Show>
                )}
            </For>
        </Tab>
    </div>;
}
