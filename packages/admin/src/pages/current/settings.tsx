// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Checkbox, fieldAccessor, joinClass, Page, RadioGroup, SettingsRef, useLocale, Settings as XSettings } from '@cmfx/components';
import { JSX } from 'solid-js';
import IconLayout from '~icons/material-symbols/responsive-layout-rounded';
import IconHorizontal from '~icons/ph/square-split-horizontal-fill';
import IconVertical from '~icons/ph/square-split-vertical-fill';

import { useLayout } from '@/app';
import styles from './style.module.css';

/**
 * 设置页面
 */
export function Settings(): JSX.Element {
    const l = useLocale();
    const lay = useLayout();

    let ref!: SettingsRef;
    let layout = fieldAccessor('layout', lay.layout());
    const gap = lay.float();

    return <Page title='_p.current.settings' class={joinClass(undefined, styles.settings)}>
        <XSettings ref={el => ref = el}>
            <ref.Item icon={<IconLayout />} title={l.t('_p.current.layout')} desc={l.t('_p.current.layoutDesc')}>
                <div class={styles.content}>
                    <RadioGroup class={styles.layout} block accessor={layout} options={[
                        {value: 'horizontal', label: <IconHorizontal class="text-8xl" /> },
                        {value: 'vertical', label: <IconVertical class="text-8xl" /> },
                    ]} />

                    <Checkbox label={l.t('_p.current.float')} checked={gap[0]()} onChange={v=>gap[1](!!v)} />
                </div>
            </ref.Item>
        </XSettings>
    </Page>;
}
