// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { ContextNotFoundError } from '@cmfx/components';
import { createContext, JSX, ParentProps, splitProps, useContext } from 'solid-js';

import { build } from '@admin/app/options';

type OptionsContext = ReturnType<typeof build>;

const optionsContext = createContext<OptionsContext>();

export function OptionsProvider(props: ParentProps<OptionsContext>): JSX.Element {
    const [, opt] = splitProps(props, ['children']);
    return <optionsContext.Provider value={opt}>
        {props.children}
    </optionsContext.Provider>;
}

/**
 * 返回当前项目的配置项
 */
export function useOptions(): OptionsContext {
    const ctx = useContext(optionsContext);
    if (!ctx) { throw new ContextNotFoundError('optionsContext'); }
    return ctx;
}
