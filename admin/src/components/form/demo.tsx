// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { FormAccessor } from './access';
import { XTextArea } from './textarea';
import { XTextField } from './textfield';

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
            <XTextField accessor={f.accessor('f1')} color='secondary' />
            <XTextField label='label' color='tertiary' placeholder='placeholder' accessor={f.accessor('f1')} />
            <XTextField label='disabled' disabled accessor={f.accessor('f1')} />
            <XTextField label='readonly' readonly accessor={f.accessor('f1')} />
            <XTextField label='icon' icon='face' accessor={f.accessor('f1')} />
            <XTextField label='password' type="password" icon='face' accessor={f.accessor('f1')} />
            <XTextField label='number' type="number" icon='face' accessor={f.accessor('f1')} />
            <XTextField label='date' type="date" icon='face' accessor={f.accessor('f1')} />
            <XTextArea label='date' accessor={f.accessor('textarea')} />
            <button class="button--filled scheme-primary" onClick={()=>setObj(JSON.stringify(f.object()))}> object </button>
            <button class="button--filled scheme-primary" type="reset" onClick={()=>f.reset()}>reset</button>
            <pre>
                {obj()}
            </pre>
        </div>
    </div>;
}
