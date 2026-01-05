// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { DisplayStyle, formatDuration, I18n } from '@cmfx/core';
import { createSignal, JSX, ParentProps, Show } from 'solid-js';
import IconFormat from '~icons/material-symbols/format-letter-spacing-2';
import IconSystemNotify from '~icons/material-symbols/notification-settings';
import IconNotify from '~icons/material-symbols/notifications-active-rounded';
import IconPalette from '~icons/material-symbols/palette';
import IconMode from '~icons/material-symbols/settings-night-sight';
import IconTranslate from '~icons/material-symbols/translate';
import IconTimezone from '~icons/mdi/timezone';
import IconFontSize from '~icons/mingcute/font-size-fill';

import { BaseProps, joinClass, Mode, RefProps } from '@/base';
import { Button } from '@/button';
import { useLocale, useOptions } from '@/context';
import { Timezone } from '@/datetime';
import { Divider } from '@/divider';
import { Checkbox, Choice, fieldAccessor, Number, RadioGroup, Range } from '@/form';
import { createBytesFormatter } from '@/kit';
import { SchemeSelector } from '@/theme';
import { Description } from '@/typography';
import styles from './style.module.css';

/**
 * 设置项的属性
 */
export interface ItemProps extends ParentProps {
    /**
     * 图标
     *
     * @reactive
     */
    icon: JSX.Element;

    /**
     * 标题
     *
     * @reactive
     */
    title: string;

    /**
     * 设置内容的详细描述
     *
     * @reactive
     */
    desc: string;
}

export interface Ref {
    /**
     * 组件根元素
     */
    root(): HTMLDivElement;

    /**
     * 声明一个设置项的组件
     */
    Item(props: ItemProps): JSX.Element;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {}

/**
 * 提供了整个项目页可设置的选项
 *
 * @remarks
 * 这是对 {@link useOptions} 中部分选项的设置。
 */
export function Settings(props: Props) {
    const [set, opt] = useOptions();
    const l = useLocale();
    let count = 0;

    const Item = (props: ItemProps) => {
        count++;
        return <>
            <Show when={count > 1}>
                <Divider padding='16px 8px' />
            </Show>
            <Description icon={props.icon} title={props.title}>{props.desc}</Description>
            <br />
            {props.children}
        </>;
    };

    const fontSizeFA = fieldAccessor<number>('fontSize', parseInt(opt.fontSize.slice(0, -2)));
    fontSizeFA.onChange(v => set.setFontSize(v + 'px'));

    const modeFA = fieldAccessor<Mode>('mode', opt.mode);
    modeFA.onChange(m => set.setMode(m));

    const localeFA = fieldAccessor<string>('locale', I18n.matchLanguage(opt.locale));
    localeFA.onChange(v => set.setLocale(v));

    const unitFA = fieldAccessor<DisplayStyle>('unit', opt.displayStyle);
    unitFA.onChange(v => set.setDisplayStyle(v));

    const staysFA = fieldAccessor<number>('stays', opt.stays);
    staysFA.onChange(v => set.setStays(v));

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

    return <div class={joinClass(props.palette, styles.settings, props.class)} style={props.style} ref={el=>{
        if (props.ref) {
            props.ref({
                root: () => el,
                Item: Item,
            });
        }
    }}>
        {props.children}

        {/***************************** font *******************************/}

        <Item icon={<IconFontSize />} title={l.t('_c.settings.fontSize')} desc={l.t('_c.settings.fontSizeDesc')}>
            <Range class={styles.range} value={v=>v+'px'}
                min={12} max={32} step={1} accessor={fontSizeFA}
            />
        </Item>

        {/***************************** mode *******************************/}

        <Item icon={<IconMode />} title={l.t('_c.settings.mode')} desc={l.t('_c.settings.modeDesc')}>
            <RadioGroup itemLayout='horizontal' accessor={modeFA} block={/*@once*/false} class={styles.radios}
                options={/*@once*/[
                    { value: 'system', label: l.t('_c.settings.system') },
                    { value: 'dark', label: l.t('_c.settings.dark') },
                    { value: 'light', label: l.t('_c.settings.light') }
                ]}
            />
        </Item>

        {/***************************** scheme *******************************/}

        <Show when={opt.schemes && opt.scheme}>
            <Item icon={<IconPalette />} title={l.t('_c.settings.color')} desc={l.t('_c.settings.colorDesc')}>
                <SchemeSelector schemes={opt.schemes}
                    value={opt.scheme} onChange={val => set.setScheme(val)} />
            </Item>
        </Show>

        {/***************************** stays *******************************/}

        <Item icon={<IconNotify />} title={l.t('_c.settings.stays')} desc={l.t('_c.settings.staysDesc')}>
            <Number accessor={staysFA} min={1000} max={10000} step={500} class={styles.stays} />
        </Item>

        {/***************************** notify *******************************/}

        <Show when={'Notification' in window}>
            <Item icon={/*@once*/<IconSystemNotify />} title={l.t('_c.settings.systemNotify')}
                desc={l.t('_c.settings.systemNotifyDesc',{request: l.t('_c.settings.requestNotifyPermission')})}
            >
                <div class={styles.notify}>
                    <Checkbox label={l.t('_c.settings.enabled')} class={styles.checkbox} disabled={sysNotifyDisabled()}
                        checked={opt.systemNotify} onChange={async v => {
                            set.setSystemNotify(!!v);
                        }}
                    />
                    <Button kind='flat' onclick={requestSysNotify}>{ l.t('_c.settings.requestNotifyPermission') }</Button>
                </div>
            </Item>
        </Show>

        {/***************************** locale *******************************/}

        <Item icon={/*@once*/<IconTranslate />} title={l.t('_c.settings.locale')} desc={l.t('_c.settings.localeDesc')}>
            <Choice accessor={localeFA} options={l.locales.map(v => ({ type: 'item', value: v[0], label: v[1] }))} />
        </Item>

        {/***************************** displayStyle *******************************/}

        <Item icon={/*@once*/<IconFormat />}
            title={l.t('_c.settings.displayStyle')} desc={l.t('_c.settings.displayStyleDesc')}
        >
            <RadioGroup itemLayout='horizontal' accessor={unitFA} block={/*@once*/false} class={styles.radios}
                options={/*@once*/[
                    { value: 'narrow', label: l.t('_c.settings.narrow') },
                    { value: 'short', label: l.t('_c.settings.short') },
                    { value: 'full', label: l.t('_c.settings.long') },
                ]}
            />
            <div class={styles['ds-demo']}>
                <p>{l.datetimeFormat().format(new Date())}</p>
                <p>{formatDuration(l.durationFormat(), 1111111223245)}</p>
                <p>{createBytesFormatter(l)(1111223245)}</p>
            </div>
        </Item>

        {/***************************** timezone *******************************/}

        <Item icon={/*@once*/<IconTimezone />}
            title={l.t('_c.settings.timezone')} desc={l.t('_c.settings.timezoneDesc')}
        >
            <div><Timezone value={opt.timezone} onChange={v => { set.setTimezone(v); }} /></div>
        </Item>
    </div>;
}
