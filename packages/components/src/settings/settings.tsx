// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { DisplayStyle, formatDuration, I18n } from '@cmfx/core';
import { createSignal, Show } from 'solid-js';
import IconFormat from '~icons/material-symbols/format-letter-spacing-2';
import IconSystemNotify from '~icons/material-symbols/notification-settings';
import IconNotify from '~icons/material-symbols/notifications-active-rounded';
import IconPalette from '~icons/material-symbols/palette';
import IconSettings from '~icons/material-symbols/settings-night-sight';
import IconTranslate from '~icons/material-symbols/translate';
import IconTimezone from '~icons/mdi/timezone';

import { BaseProps, joinClass, Mode } from '@/base';
import { Button } from '@/button';
import { useLocale, useOptions } from '@/context';
import { Timezone } from '@/datetime';
import { Divider } from '@/divider';
import { Checkbox, Choice, fieldAccessor, Number, RadioGroup } from '@/form';
import { createBytesFormatter } from '@/kit';
import { SchemeSelector } from '@/theme';
import { Description } from '@/typography';
import styles from './style.module.css';

export interface Props extends BaseProps {}

/**
 * 提供了整个项目页可设置的选项
 *
 * @remarks
 * 这是对 {@link useOptions} 中部分选项的设置。
 */
export function Settings(props: Props) {
    const [act, opt] = useOptions();
    const l = useLocale();

    const modeFA = fieldAccessor<Mode>('mode', opt.mode);
    modeFA.onChange(m => { act.setMode(m); });

    const localeFA = fieldAccessor<string>('locale', I18n.matchLanguage(opt.locale));
    localeFA.onChange(v => { act.setLocale(v); });

    const unitFA = fieldAccessor<DisplayStyle>('unit', opt.displayStyle);
    unitFA.onChange(v => { act.setDisplayStyle(v); });

    const staysFA = fieldAccessor<number>('stays', opt.stays);
    staysFA.onChange(v => { act.setStays(v); });

    const [sysNotifyDisabled, setSysNotifyDisabled] = createSignal(false);
    const requestSysNotify = async () => {
        if (!('Notification' in window)) { return; }

        switch (Notification.permission) {
        case 'denied':
            setSysNotifyDisabled(true);
            return;
        case 'granted':
            setSysNotifyDisabled(false);
            return;
        case 'default':
            const p = await Notification.requestPermission();
            if (p === 'granted') {
                setSysNotifyDisabled(false);
            } else {
                setSysNotifyDisabled(true);
            }
        }
    };

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

        {/***************************** scheme *******************************/}

        <Show when={opt.schemes && opt.scheme}>
            <Divider padding='16px 8px' />

            <Description icon={/*@once*/<IconPalette />} title={l.t('_c.settings.color')}>
                {l.t('_c.settings.colorDesc')}
            </Description>

            <SchemeSelector class={styles.item} schemes={opt.schemes}
                value={opt.scheme} onChange={val => act.setScheme(val)} />
        </Show>

        {/***************************** stays *******************************/}

        <Divider padding='16px 8px' />

        <Description icon={/*@once*/<IconNotify />} title={l.t('_c.settings.stays')}>
            {l.t('_c.settings.staysDesc')}
        </Description>
        <Number accessor={staysFA} min={1000} max={10000} step={500}
            class={joinClass(undefined, styles.item, styles.stays)}
        />

        {/***************************** notify *******************************/}

        <Show when={'Notification' in window}>
            <Divider padding='16px 8px' />

            <Description icon={/*@once*/<IconSystemNotify />} title={l.t('_c.settings.systemNotify')}>
                {l.t('_c.settings.systemNotifyDesc',{request: l.t('_c.settings.requestNotifyPermission')})}
            </Description>
            <div class={joinClass(undefined, styles.item, styles.notify)}>
                <Checkbox label={l.t('_c.settings.enabled')} class={styles.checkbox} disabled={sysNotifyDisabled()}
                    checked={opt.systemNotify} onChange={async v => {
                        act.setSystemNotify(!!v);
                    }}
                />
                <Button kind='flat' onclick={requestSysNotify}>{ l.t('_c.settings.requestNotifyPermission') }</Button>
            </div>
        </Show>

        {/***************************** locale *******************************/}

        <Divider padding='16px 8px' />

        <Description icon={/*@once*/<IconTranslate />} title={l.t('_c.settings.locale')}>
            {l.t('_c.settings.localeDesc')}
        </Description>
        <Choice class={styles.item}
            accessor={localeFA} options={l.locales.map(v => ({ type: 'item', value: v[0], label: v[1] }))} />

        {/***************************** displayStyle *******************************/}

        <Divider padding='16px 8px' />

        <Description icon={/*@once*/<IconFormat />} title={l.t('_c.settings.displayStyle')}>
            {l.t('_c.settings.displayStyleDesc')}
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

        {/***************************** timezone *******************************/}

        <Divider padding='16px 8px' />

        <Description icon={/*@once*/<IconTimezone />} title={l.t('_c.settings.timezone')}>
            {l.t('_c.settings.timezoneDesc')}
        </Description>
        <div class={styles.item}>
            <Timezone value={opt.timezone} onChange={v => { act.setTimezone(v); }} />
        </div>

    </div>;
}
