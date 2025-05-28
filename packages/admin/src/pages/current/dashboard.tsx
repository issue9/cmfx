// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Page } from '@cmfx/components';
import { JSX, ParentProps } from 'solid-js';

export function Dashboard(props: ParentProps): JSX.Element {
    return <Page title='_p.current.dashboard' class="p--dashboard">
        {props.children}
    </Page>;
}

