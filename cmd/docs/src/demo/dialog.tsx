// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { alert, Button, confirm, Dialog, DialogRef, Form, FormAccessor, prompt, useComponents } from '@cmfx/components';

import { Demo, paletteSelector } from './base';

export default function() {
    const [, act] = useComponents();
    const [paletteS, palette] = paletteSelector('primary');

    let dlg1: DialogRef;
    let dlg2: DialogRef;
    let dlg3: DialogRef;
    let dlg4: DialogRef;

    const fa = new FormAccessor({}, async () => { return {ok:false, status:500, body: {title: 'req error', type: 'err', status: 500}}; }, act.outputProblem);

    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Button onclick={async () => { await alert('msg'); console.log('alert'); }}>alert</Button>
        <Button onclick={async () => { console.log('confirm:', await confirm('这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！')); }}>confirm</Button>
        <Button onclick={async () => { console.log('prompt:', await prompt('msg', 'def')); }}>prompt</Button>

        <Button onclick={() => { window.alert('msg'); console.log('alert'); }}>system.alert</Button>
        <Button onclick={() => { console.log('confirm:', window.confirm('msg')); }}>system.confirm</Button>
        <Button onclick={() => { console.log('prompt:', window.prompt('msg', 'def')); }}>system.prompt</Button>

        <div>
            <Dialog class="min-w-5" movable palette={palette()} ref={el => dlg1 = el} header="header" actions={
                <>
                    <button value='submit' type="submit" class="me-8">submit</button>
                    <button value='reset' type="reset" class="me-8">reset</button>
                    <button value='button' type="button" onClick={() => dlg1.element().close('close')}>close</button>
                </>
            }>
                content
            </Dialog>
            <Button onclick={() => dlg1.element().show()} palette={palette()}>show</Button>
        </div>

        <div>
            <Button onclick={() => dlg2.element().showModal()} palette={palette()}>showModal</Button>
            <Dialog movable palette={palette()} ref={el => dlg2 = el} header="header">
                <div>
                    <Form formAccessor={fa} inDialog>
                        <div class="flex flex-col">
                            <div class="py-3">form</div>
                            <div class="flex">
                                <Button onclick={() => dlg3.element().showModal()}>show modal</Button>
                                <Button ref={el => el.element().value = 'submit'} type="submit" class="me-8">submit</Button>
                                <Button ref={el => el.element().value = 'reset'} type="reset" class="me-8">reset</Button>
                                <Button ref={el => el.element().value = 'button'} type="button" onclick={() => {
                                    dlg2.move({ x: 8, y: 8 });
                                }}>move(8,8)</Button>
                                <Button ref={el => el.element().value = 'button'} type="button" onclick={() => {
                                    dlg2.move();
                                }}>move to center</Button>
                                <Button ref={el => el.element().value = 'button'} type="button">button</Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Dialog>

            <Dialog movable ref={(el) => dlg3 = el} header="header">
                <div>dialog 3</div>
            </Dialog>

            <div>
                <Button onclick={() => dlg4.element().showModal()} palette={palette()}>scrollable</Button>
                <Dialog movable scrollable ref={(el) => dlg4 = el} header="header" actions="footer" class="h-80 w-80">
                    <div>
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                        长内容<br />
                    </div>
                </Dialog>
            </div>
        </div>
    </Demo>;
}
