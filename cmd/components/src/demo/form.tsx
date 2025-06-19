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
        5: 5,
        date: '2021-01-02T15:31',
        textarea: 'textarea',
    }, act, async (_) => { return { ok: false, status: 500, body: {type: '500', title: '请求未处理', status: 500} }; });

    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Form formAccessor={f} palette={palette()} {...f.events()}>
            <TextField accessor={f.accessor('f1')} />
            <Number accessor={f.accessor(5)} />
            <DatePicker accessor={f.accessor('date')} />
            <TextArea class="flex-grow" accessor={f.accessor('textarea')} />
            <div class="w-full flex justify-between">
                <Button type="reset">reset</Button>
                <Button type="submit">submit</Button>
            </div>
        </Form>
    </Demo>;
}
