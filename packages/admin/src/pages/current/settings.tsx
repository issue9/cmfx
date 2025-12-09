// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, Page, Settings as XSettings } from '@cmfx/components';
import { JSX } from 'solid-js';

import styles from './style.module.css';

/**
 * 设置页面
 */
export function Settings(): JSX.Element {
    return <Page title='_p.current.settings' class={joinClass(undefined, styles.settings)}>
        <XSettings />
    </Page>;
}
