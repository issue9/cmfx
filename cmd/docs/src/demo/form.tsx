// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DatePicker, Form, FormAccessor, Number, TextArea, TextField, useComponents } from '@cmfx/components';

import { boolSelector, Demo, layoutSelector, paletteSelector } from './base';

export default function() {
    const [, act] = useComponents();
    const [paletteS, palette] = paletteSelector('secondary');
    const [roundedS, rounded] = boolSelector('rounded');
    const [helpS, help] = boolSelector('help');
    const [layoutS, layout] = layoutSelector('layout');

    const f = new FormAccessor({
        f1: 'f1',
        f2: 5,
        date: new Date('2021-01-02T15:31'),
        textarea: 'textarea',
    }, async () => { return { ok: false, status: 500, body: {type: '500', title: '请求未处理', status: 500} }; }, act.outputProblem);

    return <Demo settings={
        <>
            {paletteS}
            {roundedS}
            {helpS}
            {layoutS}
        </>
    }>
        <Form formAccessor={f} palette={palette()} {...f.events()} rounded={rounded()} layout={layout()} hasHelp={help()}>
            <TextField label="textField" accessor={f.accessor<string>('f1')} help="这是一个帮助文本" />
            <Number label="number" accessor={f.accessor('f2')} help="这是一个帮助文本" />
            <DatePicker label="date" accessor={f.accessor('date')} help="这是一个帮助文本" />
            <TextArea label="textarea" class="grow" accessor={f.accessor<string>('textarea')} help="这是一个帮助文本" />
            <div class="w-full flex justify-between">
                <Button type="reset">reset</Button>
                <Button type="submit">submit</Button>
            </div>
        </Form>
    </Demo>;
}
