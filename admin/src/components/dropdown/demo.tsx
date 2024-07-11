// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, For, Setter, createSignal } from 'solid-js';

import { Color } from '@/components/base';
import { ColorSelector } from '@/components/base/demo';
import { ButtonStyle } from '@/components/button';
import { ButtonSettings } from '@/components/button/demo';
import { Position, Ref, default as XDropdown, positions } from './dropdown';

export function PositionSelector(props: {get: Accessor<Position>, set: Setter<Position>}) {
    return <fieldset class="border-2 flex flex-wrap">
        <legend>位置</legend>
        <For each={positions}>
            {(item) => (
                <label class="mr-4">
                    <input class="mr-1" type="radio" name="type" value={item} onClick={() => props.set(item)} checked={props.get() === item} />{item}
                </label >
            )}
        </For>
    </fieldset>;
}

export default function() {
    const [c, setC] = createSignal<Color>();
    const [pos, setPos] = createSignal<Position>('bottomleft');
    const [icon, setIcon] = createSignal(false);
    const [rounded, setRounded] = createSignal(false);
    const [style, setStyle] = createSignal<ButtonStyle>('filled');
    const [txt, setTxt] = createSignal('');
    let ref: Ref;

    return <div class="p-5 flex flex-col items-center gap-5">
        <div class="flex justify-around gap-2">
            <ColorSelector setter={setC} getter={c} />
            <ButtonSettings get={style} set={setStyle} />
            <PositionSelector get={pos} set={setPos} />
            <label><input type="checkbox" checked={icon()} onInput={(e)=>setIcon(e.target.checked)} />icon</label>
            <label><input type="checkbox" checked={rounded()} onInput={(e)=>setRounded(e.target.checked)} />rounded</label>
            <input value={txt()} onInput={(e)=>setTxt(e.target.value)} />
            <button onClick={()=>ref?.visible(false)} class="button filled">手动关闭</button >
        </div>

        <XDropdown ref={el=>ref=el} icon={icon()? 'face':undefined} text={txt()} rounded={rounded()} color={c()} style={style()} pos={pos()}>
            <div class="p-4 z-5">dropdown</div>
        </XDropdown>

    </div>;
}
