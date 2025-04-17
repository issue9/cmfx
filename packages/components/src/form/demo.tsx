// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Demo, paletteSelector } from '@components/base/demo';
import { useComponents } from '@components/context';
import { Button } from '../button';
import { FormAccessor } from './access';
import { DatePicker } from './date';
import { Form } from './form';
import { TextArea } from './textarea';
import { Number, TextField } from './textfield';

export default function() {
    const ctx = useComponents();
    const [paletteS, palette] = paletteSelector('secondary');

    const f = new FormAccessor({
        f1: 'f1',
        5: 5,
        date: '2021-01-02T15:31',
        textarea: 'textarea',
    }, ctx, async (_) => { return { ok: false, status: 500 }; });

    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <p>flex</p>
        <Form class="flex items-center" formAccessor={f} palette={palette()} {...f.events()}>
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
