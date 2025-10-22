// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, DialogRef, Form, FormAccessor, useComponents } from '@cmfx/components';

import { paletteSelector } from '../base';

export default function() {
    const [, act] = useComponents();
    const [paletteS, palette] = paletteSelector('primary');

    let dlg2: DialogRef;
    let dlg3: DialogRef;

    const fa = new FormAccessor({}, async () => { return {ok:false, status:500, body: {title: 'req error', type: 'err', status: 500}}; }, act.outputProblem);

    return <div>
        {paletteS}
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
        </div>
    </div>;
}
