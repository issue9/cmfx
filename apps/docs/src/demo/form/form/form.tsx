// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, createForm, DatePicker, MountProps, notify, Number, TextArea, TextField } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector('secondary');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');
    const [Help, help] = boolSelector('help');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout');

    const [api, Form, actions] = createForm({
        initValue: {
            f1: 'f1',
            f2: 5,
            date: new Date('2021-01-02T15:31'),
            textarea: 'textarea',
        },
        submit: async () => ({ ok: false, status: 500, body: { type: '500', title: '请求未处理', status: 500 } }),
        onProblem: p => notify('error', p.title),
    });

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Rounded />
            <Help />
            <Layout />
            <Disabled />
            <Readonly />
            <Button onclick={() => { api.setError(api.getError() ? undefined : 'error'); }}>
                Set Error
            </Button>
        </Portal>

        <Form palette={palette()} rounded={rounded()} layout={layout()} hasHelp={help()}
            disabled={disabled()} readonly={readonly()} class="flex gap-4 flex-col"
        >
            <actions.Message />
            <TextField label="textField" accessor={api.accessor<string>('f1')} help="这是一个帮助文本" />
            <Number label="number" accessor={api.accessor('f2')} help="这是一个帮助文本" />
            <DatePicker label="date" accessor={api.accessor('date')} help="这是一个帮助文本" />
            <TextArea label="textarea" class="grow" accessor={api.accessor<string>('textarea')} help="这是一个帮助文本" />
        </Form>
        <div class="w-full flex justify-between">
            <actions.Reset>reset</actions.Reset>
            <actions.Submit>submit</actions.Submit>
        </div>
    </>;
}
