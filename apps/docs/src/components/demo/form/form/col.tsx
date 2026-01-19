// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createForm, DatePicker, MountProps, Number, TextArea, TextField } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, labelAlignSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Palette, palette] = paletteSelector('secondary');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');
    const [Help, help] = boolSelector('help');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout');
    const [LabelAlign, labelAlign] = labelAlignSelector('start');

    const [api, Form, { Reset, Submit }] = createForm({
        initValue: {
            f1: 'f1',
            f2: 5,
            date: new Date('2021-01-02T15:31'),
            textarea: 'textarea',
        },
        submit: async () => ({ ok: false, status: 500, body: { type: '500', title: '请求未处理', status: 500 } }),
    });

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Rounded />
            <Help />
            <Layout />
            <Disabled />
            <Readonly />
            <LabelAlign />
        </Portal>

        <Form palette={palette()} rounded={rounded()} layout={layout()} hasHelp={help()} class="grid grid-cols-2 gap-2"
            disabled={disabled()} readonly={readonly()} labelWidth='70px' labelAlign={labelAlign()}
        >
            <TextField label="textField" accessor={api.accessor<string>('f1')} help="这是一个帮助文本" />
            <Number label="number" accessor={api.accessor('f2')} help="这是一个帮助文本" />
            <DatePicker label="date" accessor={api.accessor('date')} help="这是一个帮助文本" />
            <TextArea label="textarea" class="grow" accessor={api.accessor<string>('textarea')} help="这是一个帮助文本" />
            <div class="col-span-full flex justify-between">
                <Reset>reset</Reset>
                <Submit>submit</Submit>
            </div>
        </Form>
    </>;
}
