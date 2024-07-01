// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { XButton, XIconButton, buttonTypes, colors } from 'admin/dev/components';
import { For } from 'solid-js';

export default function() {
    return <div>
        <h1 class="mb-4 text-lg">纯 CSS button</h1>

        <For each={buttonTypes}>
            {(t)=>(
                <div class="my-4">
                    <p class="mb-2">{t}</p>
                    <div class="flex items-center gap-2">
                        <button class="button">default color</button>
                        <For each={colors}>
                            {(c)=>(
                                <button class={`button--${t} scheme--${c}`}>{c}</button>
                            )}
                        </For>
                        <button class={`button--${t} scheme--tertiary rounded-full`}>rounded tertiary</button>
                        <button class={`button--${t} scheme--tertiary icon-container`}>
                            <span class="material-symbols-outlined">face</span>
                            icon primary
                            <span class="material-symbols-outlined">face</span>
                        </button>
                        <button class={`button--${t} scheme--primary icon-container rounded-full`}>
                            <span class="material-symbols-outlined">face</span>
                        </button>
                    </div>
                </div>
            )}
        </For>

        <br /><br />
        <h1 class="mb-4">组件 button</h1>
        <For each={buttonTypes}>
            {(t)=>(
                <div class="my-4">
                    <p class="mb-2">{t}</p>
                    <div class="flex items-center gap-2">
                        <For each={colors}>
                            {(c)=>(
                                <XButton t={t} color={c}>{c}</XButton>
                            )}
                        </For>
                        <XButton t={t} color="primary" leftIcon="face" rightIcon="face">icon button</XButton>
                        <XButton t={t} color="primary" rounded>rounded button</XButton>
                    </div>
                </div>
            )}
        </For>


        <h1 class="mb-4 text-lg">纯 CSS icon-button</h1>

        <For each={buttonTypes}>
            {(t)=>(
                <div class="my-4">
                    <p class="mb-2">{t}</p>
                    <div class="flex items-center gap-2">
                        <For each={colors}>
                            {(c)=>(
                                <button class={`icon-button--${t} scheme--${c}`}>face</button>
                            )}
                        </For>
                        <button class={`button--${t} scheme--tertiary rounded-full`}>rounded tertiary</button>
                    </div>
                </div>
            )}
        </For>

        <br /><br />
        <h1 class="mb-4">组件 icon-button</h1>
        <For each={buttonTypes}>
            {(t)=>(
                <div class="my-4">
                    <p class="mb-2">{t}</p>
                    <div class="flex items-center gap-2">
                        <For each={colors}>
                            {(c)=>(
                                <XIconButton t={t} color={c}>sync</XIconButton>
                            )}
                        </For>
                        <button class={`button--${t} scheme--tertiary rounded-full`}>rounded tertiary</button>
                    </div>
                </div>
            )}
        </For>
    </div >;
}
