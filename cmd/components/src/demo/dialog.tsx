// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, DialogRef, Form, FormAccessor, alert, confirm, prompt, useActions } from '@cmfx/components';

import { Demo, paletteSelector } from './base';

export default function() {
    const act = useActions();
    const [paletteS, palette] = paletteSelector('primary');

    let dlg1: DialogRef;
    let dlg2: DialogRef;

    const fa = new FormAccessor({}, act, async (_) => { return {ok:false, status:500, body: {title: 'req error', type: 'err', status: 500}}; });

    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Button onClick={async () => { await alert('msg'); console.log('alert'); }}>alert</Button>
        <Button onClick={async () => { console.log('confirm:', await confirm('msg')); }}>confirm</Button>
        <Button onClick={async () => { console.log('prompt:', await prompt('msg', 'def')); }}>prompt</Button>

        <Button onClick={async () => { await window.alert('msg'); console.log('alert'); }}>system.alert</Button>
        <Button onClick={async () => { console.log('confirm:', await window.confirm('msg')); }}>system.confirm</Button>
        <Button onClick={async () => { console.log('prompt:', await window.prompt('msg', 'def')); }}>system.prompt</Button>

        <div>
            <Dialog palette={palette()} ref={(el) => dlg1 = el} header="header" actions={
                <>
                    <button value='submit' type="submit" class="mr-8">submit</button>
                    <button value='reset' type="reset" class="mr-8">reset</button>
                    <button value='button' type="button" onClick={() => dlg1.close('close')}>close</button>
                </>
            }>
                content
            </Dialog>
            <Button onClick={() => dlg1.show()} palette={palette()}>show</Button>
        </div>

        <div>
            <Button onClick={() => dlg2.showModal()} palette={palette()}>showModal</Button>
            <Dialog palette={palette()} ref={el => dlg2 = el} header="header">
                <div>
                    <Form formAccessor={fa} inDialog>
                        <div class="flex flex-col">
                            <div class="py-3">form</div>

                            <hr />
                            <div class="flex">
                                <button value='submit' type="submit" class="mr-8">submit</button>
                                <button value='reset' type="reset" class="mr-8">reset</button>
                                <button value='button' type="button">button</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Dialog>
        </div>
    </Demo>;
}
