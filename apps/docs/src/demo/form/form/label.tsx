// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, createForm, DatePicker, MountProps, Number, TextArea, TextField } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, labelAlignSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector('secondary');
    const [roundedS, rounded] = boolSelector('rounded');
    const [helpS, help] = boolSelector('help');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('layout');
    const [labelAlignS, labelAlign] = labelAlignSelector('start');

    const [api, Form] = createForm({
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
            {paletteS}
            {roundedS}
            {helpS}
            {layoutS}
            {disabledS}
            {readonlyS}
            {labelAlignS}
        </Portal>

        <Form palette={palette()} rounded={rounded()} layout={layout()} hasHelp={help()}
            disabled={disabled()} readonly={readonly()} labelWidth='100px' labelAlign={labelAlign()}
        >
            <TextField label="textField" accessor={api.accessor<string>('f1')} help="这是一个帮助文本" />
            <Number label="number" accessor={api.accessor('f2')} help="这是一个帮助文本" />
            <DatePicker label="date" accessor={api.accessor('date')} help="这是一个帮助文本" />
            <TextArea label="textarea" class="grow" accessor={api.accessor<string>('textarea')} help="这是一个帮助文本" />
            <div class="w-full flex justify-between">
                <Button type="reset">reset</Button>
                <Button type="submit">submit</Button>
            </div>
        </Form>
    </>;
}
