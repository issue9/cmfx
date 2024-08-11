// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useInternal } from '@/app/context';
import { Demo, paletteSelector } from '@/components/base/demo';
import { Button } from '@/components/button';
import { Form, FormAccessor } from '@/components/form';
import Dialog from './dialog';

export default function() {
    const ctx = useInternal();
    const [paletteS, palette] = paletteSelector('primary');

    let dlg1: HTMLDialogElement;
    let dlg2: HTMLDialogElement;

    const fa = new FormAccessor({}, ctx, 'POST', '/path');

    return <Demo settings={
        <>
            {paletteS}
        </>
    } stages={
        <>
            <div>
                <Button onClick={()=>dlg1.show()} palette={palette()}>show</Button>
                <Dialog palette={palette()} ref={(el)=>dlg1=el}>
                    <div class="p-5 bg-palette-bg border-2 border-palette-fg">
                        <h1>dialog</h1>
                        <div class="py-3">content</div>

                        <div class="flex">
                            <button value='submit' type="submit" class="mr-8">submit</button>
                            <button value='reset' type="reset" class="mr-8">reset</button>
                            <button value='button' type="button" onClick={()=>dlg1.close('close')}>close</button>
                        </div>
                    </div>
                </Dialog>
            </div>

            <div>
                <Button onClick={()=>dlg2.showModal()} palette={palette()}>showModal</Button>
                <Dialog palette={palette()} ref={(el)=>dlg2=el}>
                    <Form formAccessor={fa} inDialog>
                        <div class="p-5 bg-palette-bg border-2 border-palette-fg">
                            <h1>dialog</h1>
                            <div class="py-3">form</div>

                            <div class="flex">
                                <button value='submit' type="submit" class="mr-8">submit</button>
                                <button value='reset' type="reset" class="mr-8">reset</button>
                                <button value='button' type="button">button</button>
                            </div>
                        </div>
                    </Form>
                </Dialog>
            </div>
        </>
    } />;
}
