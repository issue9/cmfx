// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { alert, Button, confirm, Dialog, DialogRef, Form, FormAccessor, prompt, use } from '@cmfx/components';

import { Demo, paletteSelector } from './base';

export default function() {
    const [, act] = use();
    const [paletteS, palette] = paletteSelector('primary');

    let dlg1: DialogRef;
    let dlg2: DialogRef;
    let dlg3: DialogRef;

    const fa = new FormAccessor({}, act, async (_) => { return {ok:false, status:500, body: {title: 'req error', type: 'err', status: 500}}; });

    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Button onClick={async () => { await alert('msg'); console.log('alert'); }}>alert</Button>
        <Button onClick={async () => { console.log('confirm:', await confirm('这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！')); }}>confirm</Button>
        <Button onClick={async () => { console.log('prompt:', await prompt('msg', 'def')); }}>prompt</Button>

        <Button onClick={() => { window.alert('msg'); console.log('alert'); }}>system.alert</Button>
        <Button onClick={() => { console.log('confirm:', window.confirm('msg')); }}>system.confirm</Button>
        <Button onClick={() => { console.log('prompt:', window.prompt('msg', 'def')); }}>system.prompt</Button>

        <div>
            <Dialog class="min-w-5" movable palette={palette()} ref={(el) => dlg1 = el} header="header" actions={
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
            <Dialog movable palette={palette()} ref={el => dlg2 = el} header="header">
                <div>
                    <Form formAccessor={fa} inDialog>
                        <div class="flex flex-col">
                            <div class="py-3">form</div>
                            <div class="flex">
                                <Button onclick={() => dlg3.showModal()}>show modal</Button>
                                <Button value='submit' type="submit" class="mr-8">submit</Button>
                                <Button value='reset' type="reset" class="mr-8">reset</Button>
                                <Button value='button' type="button" onClick={()=>{
                                    dlg2.move({ x: 8, y: 8 });
                                }}>move(8,8)</Button>
                                <Button value='button' type="button" onClick={()=>{
                                    dlg2.move();
                                }}>move to center</Button>
                                <Button value='button' type="button">button</Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Dialog>

            <Dialog movable ref={(el) => dlg3 = el} header="header">
                <div>dialog 3</div>
            </Dialog>
        </div>
    </Demo>;
}
