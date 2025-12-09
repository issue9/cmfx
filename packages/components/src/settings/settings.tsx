// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Show } from 'solid-js';
import { formatDuration, DisplayStyle, Locale } from '@cmfx/core';
import IconFormat from '~icons/material-symbols/format-letter-spacing-2';
import IconPalette from '~icons/material-symbols/palette';
import IconSettings from '~icons/material-symbols/settings-night-sight';
import IconTranslate from '~icons/material-symbols/translate';
import IconTimezone from '~icons/mdi/timezone';

import { BaseProps, joinClass, Mode } from '@/base';
import { useComponents, useLocale } from '@/context';
import { Description } from '@/typography';
import { fieldAccessor, RadioGroup, Choice } from '@/form';
import { Divider } from '@/divider';
import { SchemeSelector } from '@/theme';
import { Timezone } from '@/datetime';
import { createBytesFormatter } from '@/kit';
import styles from './style.module.css';

export interface Props extends BaseProps {}

/**
 * 提供了整个项目页可设置的选项
 */
export function Settings(props: Props) {
    const [act, opt] = useComponents();
    const l = useLocale();

    const modeFA = fieldAccessor<Mode>('mode', opt.mode ?? 'system');
    modeFA.onChange(m => { act.switchMode(m); });

    const localeFA = fieldAccessor<string>('locale', Locale.matchLanguage(opt.locale));
    localeFA.onChange((v) => { act.switchLocale(v); });

    const unitFA = fieldAccessor<DisplayStyle>('unit', opt.displayStyle);
    unitFA.onChange((v) => { act.switchDisplayStyle(v); });

    return <div class={joinClass(props.palette, styles.settings, props.class)} style={props.style}>
        <Description icon={/*@once*/<IconSettings />} title={l.t('_c.settings.mode')!}>
            {l.t('_c.settings.modeDesc')!}
        </Description>

        <RadioGroup itemLayout='horizontal' accessor={modeFA} block={/*@once*/false}
            class={joinClass(undefined, styles.item, styles.radios)}
            options={/*@once*/[
                { value: 'system', label: l.t('_c.settings.system') },
                { value: 'dark', label: l.t('_c.settings.dark') },
                { value: 'light', label: l.t('_c.settings.light') }
            ]}
        />

        <Show when={opt.schemes && opt.scheme}>
            <Divider padding='8px' />

            <Description icon={/*@once*/<IconPalette />} title={l.t('_c.settings.color')!}>
                {l.t('_c.settings.colorDesc')!}
            </Description>

            <SchemeSelector class={styles.item} schemes={opt.schemes!}
                value={opt.scheme!} onChange={val => act.switchScheme(val)} />
        </Show>

        <Divider padding='8px' />

        <Description icon={/*@once*/<IconTranslate />} title={l.t('_c.settings.locale')!}>
            {l.t('_c.settings.localeDesc')!}
        </Description>

        <Choice class={styles.item}
            accessor={localeFA} options={l.locales.map(v => ({ type: 'item', value: v[0], label: v[1] }))} />

        <Divider padding='8px' />

        <Description icon={/*@once*/<IconFormat />} title={l.t('_c.settings.displayStyle')!}>
            {l.t('_c.settings.displayStyleDesc')!}
        </Description>

        <RadioGroup itemLayout='horizontal' accessor={unitFA} block={/*@once*/false}
            class={joinClass(undefined, styles.item, styles.radios)}
            options={/*@once*/[
                { value: 'narrow', label: l.t('_c.settings.narrow') },
                { value: 'short', label: l.t('_c.settings.short') },
                { value: 'full', label: l.t('_c.settings.long') },
            ]}
        />

        <div class={joinClass(undefined, styles.item, styles['ds-demo'])}>
            <p>{l.datetimeFormat().format(new Date())}</p>
            <p>{formatDuration(l.durationFormat(), 1111111223245)}</p>
            <p>{createBytesFormatter(l)(1111223245)}</p>
        </div>

        <Divider padding='8px' />

        <Description icon={/*@once*/<IconTimezone />} title={l.t('_c.settings.timezone')!}>
            {l.t('_c.settings.timezoneDesc')!}
        </Description>

        <Timezone class={styles.item} value={opt.timezone} onChange={v => { act.switchTimezone(v); }} />
    </div>;
}
