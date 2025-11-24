// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Signal } from 'solid-js';

import { Picker } from './picker';
import styles from './style.module.css';
import { joinClass } from '@/base';

const vars: Array<string> = [
    '--color-red-50', '--color-red-100', '--color-red-200', '--color-red-300', '--color-red-400', '--color-red-500',
    '--color-red-600', '--color-red-700', '--color-red-800', '--color-red-900', '--color-red-950',

    '--color-orange-50', '--color-orange-100', '--color-orange-200', '--color-orange-300', '--color-orange-400', '--color-orange-500',
    '--color-orange-600', '--color-orange-700', '--color-orange-800', '--color-orange-900', '--color-orange-950',

    '--color-amber-50', '--color-amber-100', '--color-amber-200', '--color-amber-300', '--color-amber-400', '--color-amber-500',
    '--color-amber-600', '--color-amber-700', '--color-amber-800', '--color-amber-900', '--color-amber-950',

    '--color-yellow-50', '--color-yellow-100', '--color-yellow-200', '--color-yellow-300', '--color-yellow-400', '--color-yellow-500',
    '--color-yellow-600', '--color-yellow-700', '--color-yellow-800', '--color-yellow-900', '--color-yellow-950',

    '--color-lime-50', '--color-lime-100', '--color-lime-200', '--color-lime-300', '--color-lime-400', '--color-lime-500',
    '--color-lime-600', '--color-lime-700', '--color-lime-800', '--color-lime-900', '--color-lime-950',

    '--color-green-50', '--color-green-100', '--color-green-200', '--color-green-300', '--color-green-400', '--color-green-500',
    '--color-green-600', '--color-green-700', '--color-green-800', '--color-green-900', '--color-green-950',

    '--color-emerald-50', '--color-emerald-100', '--color-emerald-200', '--color-emerald-300', '--color-emerald-400', '--color-emerald-500',
    '--color-emerald-600', '--color-emerald-700', '--color-emerald-800', '--color-emerald-900', '--color-emerald-950',

    '--color-teal-50', '--color-teal-100', '--color-teal-200', '--color-teal-300', '--color-teal-400', '--color-teal-500',
    '--color-teal-600', '--color-teal-700', '--color-teal-800', '--color-teal-900', '--color-teal-950',

    '--color-cyan-50', '--color-cyan-100', '--color-cyan-200', '--color-cyan-300', '--color-cyan-400', '--color-cyan-500',
    '--color-cyan-600', '--color-cyan-700', '--color-cyan-800', '--color-cyan-900', '--color-cyan-950',

    '--color-sky-50', '--color-sky-100', '--color-sky-200', '--color-sky-300', '--color-sky-400', '--color-sky-500',
    '--color-sky-600', '--color-sky-700', '--color-sky-800', '--color-sky-900', '--color-sky-950',

    '--color-blue-50', '--color-blue-100', '--color-blue-200', '--color-blue-300', '--color-blue-400', '--color-blue-500',
    '--color-blue-600', '--color-blue-700', '--color-blue-800', '--color-blue-900', '--color-blue-950',

    '--color-indigo-50', '--color-indigo-100', '--color-indigo-200', '--color-indigo-300', '--color-indigo-400', '--color-indigo-500',
    '--color-indigo-600', '--color-indigo-700', '--color-indigo-800', '--color-indigo-900', '--color-indigo-950',

    '--color-violet-50', '--color-violet-100', '--color-violet-200', '--color-violet-300', '--color-violet-400', '--color-violet-500',
    '--color-violet-600', '--color-violet-700', '--color-violet-800', '--color-violet-900', '--color-violet-950',

    '--color-purple-50', '--color-purple-100', '--color-purple-200', '--color-purple-300', '--color-purple-400', '--color-purple-500',
    '--color-purple-600', '--color-purple-700', '--color-purple-800', '--color-purple-900', '--color-purple-950',

    '--color-fuchsia-50', '--color-fuchsia-100', '--color-fuchsia-200', '--color-fuchsia-300', '--color-fuchsia-400', '--color-fuchsia-500',
    '--color-fuchsia-600', '--color-fuchsia-700', '--color-fuchsia-800', '--color-fuchsia-900', '--color-fuchsia-950',

    '--color-pink-50', '--color-pink-100', '--color-pink-200', '--color-pink-300', '--color-pink-400', '--color-pink-500',
    '--color-pink-600', '--color-pink-700', '--color-pink-800', '--color-pink-900', '--color-pink-950',

    '--color-rose-50', '--color-rose-100', '--color-rose-200', '--color-rose-300', '--color-rose-400', '--color-rose-500',
    '--color-rose-600', '--color-rose-700', '--color-rose-800', '--color-rose-900', '--color-rose-950',

    '--color-slate-50', '--color-slate-100', '--color-slate-200', '--color-slate-300', '--color-slate-400', '--color-slate-500',
    '--color-slate-600', '--color-slate-700', '--color-slate-800', '--color-slate-900', '--color-slate-950',

    '--color-gray-50', '--color-gray-100', '--color-gray-200', '--color-gray-300', '--color-gray-400', '--color-gray-500',
    '--color-gray-600', '--color-gray-700', '--color-gray-800', '--color-gray-900', '--color-gray-950',

    '--color-zinc-50', '--color-zinc-100', '--color-zinc-200', '--color-zinc-300', '--color-zinc-400', '--color-zinc-500',
    '--color-zinc-600', '--color-zinc-700', '--color-zinc-800', '--color-zinc-900', '--color-zinc-950',

    '--color-neutral-50', '--color-neutral-100', '--color-neutral-200', '--color-neutral-300', '--color-neutral-400', '--color-neutral-500',
    '--color-neutral-600', '--color-neutral-700', '--color-neutral-800', '--color-neutral-900', '--color-neutral-950',

    '--color-stone-50', '--color-stone-100', '--color-stone-200', '--color-stone-300', '--color-stone-400', '--color-stone-500',
    '--color-stone-600', '--color-stone-700', '--color-stone-800', '--color-stone-900', '--color-stone-950',
] as const;

export class TailwindVarsPicker implements Picker {
    get id(): string { return 'tailwind'; }
    get localeID(): string { return '_c.color.vars'; }
    include(value: string): boolean { return vars.includes(value); }

    panel(s: Signal<string>): JSX.Element {
        return <div class={styles.vars}>
            <For each={vars}>
                {v =>
                    <span class={joinClass(undefined, styles.color, v === s[0]() ? styles.selected : '')}
                        style={{ 'background': `var(${v})` }} onclick={() => {
                            s[1](v);
                        }} />
                }
            </For>
        </div>;
    }
}
