// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { FormAccessor } from './access';
import { TextArea } from './textarea';
import { TextField } from './textfield';

export default function() {
    const f = new FormAccessor({
        f1: 'f1',
        5:5,
        date: '2021-01-02T15:31',
        textarea: 'textarea',
    });

    const [obj, setObj] = createSignal('');

    return <div>
        <div class="w-60">
            <p>text-field</p><br />
            <TextField accessor={f.accessor('f1')} palette='secondary' />
            <TextField label='label' palette='tertiary' placeholder='placeholder' accessor={f.accessor('f1')} />
            <TextField label='disabled' disabled accessor={f.accessor('f1')} />
            <TextField label='readonly' readonly accessor={f.accessor('f1')} />
            <TextField label='icon' accessor={f.accessor('f1')} />
            {f.accessor(5).getValue()}
            <TextField accessor={f.accessor('date')} />
            {typeof f.accessor('date').getValue()}
            <TextArea label='date' accessor={f.accessor('textarea')} />
            <button class="button--filled palette--primary" onClick={()=>setObj(JSON.stringify(f.object()))}> object </button>
            <button class="button--filled palette--primary" type="reset" onClick={()=>f.reset()}>reset</button>
            <pre>{obj()}</pre>
        </div>
    </div>;
}
