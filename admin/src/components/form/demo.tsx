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
        textarea: 'textarea',
    });

    const [obj, setObj] = createSignal('');

    return <div>
        <div class="w-60">
            <p>text-field</p><br />
            <TextField accessor={f.accessor('f1')} scheme='secondary' />
            <TextField label='label' scheme='tertiary' placeholder='placeholder' accessor={f.accessor('f1')} />
            <TextField label='disabled' disabled accessor={f.accessor('f1')} />
            <TextField label='readonly' readonly accessor={f.accessor('f1')} />
            <TextField label='icon' icon='face' accessor={f.accessor('f1')} />
            <TextField label='password' type="password" icon='face' accessor={f.accessor('f1')} />
            <TextField label='number' type="number" icon='face' accessor={f.accessor('f1')} />
            <TextField label='date' type="date" icon='face' accessor={f.accessor('f1')} />
            <TextArea label='date' accessor={f.accessor('textarea')} />
            <button class="button--filled scheme-primary" onClick={()=>setObj(JSON.stringify(f.object()))}> object </button>
            <button class="button--filled scheme-primary" type="reset" onClick={()=>f.reset()}>reset</button>
            <pre>
                {obj()}
            </pre>
        </div>
    </div>;
}
