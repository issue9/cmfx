// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useApp } from '@/app/context';
import { Demo, paletteSelector } from '@/components/base/demo';
import { Button } from '@/components/button';
import { Form, FormAccessor } from '@/components/form';
import Dialog, { Ref } from './dialog';
import { default as System } from './system';

export default function() {
    const ctx = useApp();
    const [paletteS, palette] = paletteSelector('primary');

    let dlg1: Ref;
    let dlg2: Ref;

    const fa = new FormAccessor({}, ctx, async (_) => { return {ok:false, status:500}; });

    return <Demo settings={
        <>
            {paletteS}
        </>
    } stages={
        <>
            <System />
            <Button onClick={()=>window.alert('msg')}>alert</Button>
            <Button onClick={()=>window.confirm('msg')}>confirm</Button>
            <Button onClick={()=>window.prompt('msg', 'def')}>prompt</Button>

            <div>
                <Dialog palette={palette()} ref={(el)=>dlg1=el} header="header" actions={
                    <>
                        <button value='submit' type="submit" class="mr-8">submit</button>
                        <button value='reset' type="reset" class="mr-8">reset</button>
                        <button value='button' type="button" onClick={()=>dlg1.close('close')}>close</button>
                    </>
                }>
                    content
                </Dialog>
                <Button onClick={()=>dlg1.show()} palette={palette()}>show</Button>
            </div>

            <div>
                <Button onClick={()=>dlg2.showModal()} palette={palette()}>showModal</Button>
                <Dialog palette={palette()} ref={(el)=>dlg2=el} header="header">
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
        </>
    } />;
}
