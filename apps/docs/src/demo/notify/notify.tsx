// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Button, Number, Choice, fieldAccessor, notify, NotifyType, notifyTypes, useLocale, TextField, TextArea
} from '@cmfx/components';

export default function() {
    const l = useLocale();

    const typ = fieldAccessor<NotifyType>('type', 'success');
    const timeout = fieldAccessor<number>('timeout', 5000);
    const title = fieldAccessor<string>('title', 'title');
    const body = fieldAccessor<string>('body', 'body');

    const click = async(): Promise<void> => {
        await notify(title.getValue(), body.getValue(), typ.getValue(), l.locale.toString(), timeout.getValue());
    };

    return <div class="flex flex-col gap-2 w-40">
        <Choice label='type' accessor={typ}
            options={notifyTypes.map(v => { return { type: 'item', value: v, label: v }; })} />
        <Number step={500} label='timeout' accessor={timeout} />
        <TextField label='title' accessor={title} />
        <TextArea label='body' accessor={body} />
        <Button palette='primary' onclick={click}>notify</Button>
    </div>;
}
