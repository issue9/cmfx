// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button, Choice, fieldAccessor, MountProps, notify, NotifyType, notifyTypes,
    Number, TextArea, TextField, useLocale, useOptions
} from '@cmfx/components';
import { createEffect, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const l = useLocale();
    const [System, system] = boolSelector('system');
    const [set] = useOptions();

    const typ = fieldAccessor<NotifyType>('type', 'success');
    const timeout = fieldAccessor<number>('timeout', 5000);
    const title = fieldAccessor<string>('title', 'title');
    const body = fieldAccessor<string>('body', 'body');

    const click = async(): Promise<void> => {
        await notify(title.getValue(), body.getValue(), typ.getValue(), l.locale.toString(), timeout.getValue());
    };

    createEffect(() => {
        set.setSystemNotify(system());
    });

    return <div class="flex flex-col gap-2 w-40">
        <Portal mount={props.mount}>
            <System />
        </Portal>

        <Choice label='type' accessor={typ}
            options={notifyTypes.map(v => { return { type: 'item', value: v, label: v }; })} />
        <Number step={500} label='timeout' accessor={timeout} />
        <TextField label='title' accessor={title} />
        <TextArea label='body' accessor={body} />
        <Button palette='primary' onclick={click}>notify</Button>
    </div>;
}
