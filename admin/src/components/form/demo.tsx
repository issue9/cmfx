// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { useInternal } from '@/app/context';
import { Demo, paletteSelector } from '@/components/base/demo';
import { Button } from '../button';
import { FormAccessor } from './access';
import { DatePicker } from './date';
import Form from './form';
import { TextArea } from './textarea';
import { Number, TextField } from './textfield';

export default function() {
    const ctx = useInternal();
    const [paletteS, palette] = paletteSelector('secondary');

    const f = new FormAccessor({
        f1: 'f1',
        5:5,
        date: '2021-01-02T15:31',
        textarea: 'textarea',
    }, ctx, 'POST', '/path');

    return <Demo settings={
        <>
            {paletteS}
        </>
    } stages={
        <>
            <Form formAccessor={f} palette={palette()} {...f.events()}>
                <TextField accessor={f.accessor('f1')} />
                <Number accessor={f.accessor(5)} />
                <DatePicker accessor={f.accessor('date')} />
                <TextArea accessor={f.accessor('textarea')} />
                <Button type="reset">reset</Button>
                <Button type="submit">submit</Button>
            </Form>
        </>
    } />;
}
