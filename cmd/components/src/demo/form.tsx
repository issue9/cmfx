// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DatePicker, Form, FormAccessor, Number, TextArea, TextField, use } from '@cmfx/components';

import { Demo, paletteSelector } from './base';

export default function() {
    const [, act] = use();
    const [paletteS, palette] = paletteSelector('secondary');

    const f = new FormAccessor({
        f1: 'f1',
        f2: 5,
        date: new Date('2021-01-02T15:31'),
        textarea: 'textarea',
    }, async () => { return { ok: false, status: 500, body: {type: '500', title: '请求未处理', status: 500} }; }, act.outputProblem);

    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Form formAccessor={f} palette={palette()} {...f.events()}>
            <TextField accessor={f.accessor<string>('f1')} />
            <Number accessor={f.accessor('f2')} />
            <DatePicker accessor={f.accessor('date')} />
            <TextArea class="flex-grow" accessor={f.accessor<string>('textarea')} />
            <div class="w-full flex justify-between">
                <Button type="reset">reset</Button>
                <Button type="submit">submit</Button>
            </div>
        </Form>
    </Demo>;
}
