// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { notify } from '@cmfx/components';
import { Problem } from '@cmfx/core';

/**
 * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
 *
 * @param p - 如果该值空，则会抛出异常；
 */
export async function handleProblem<P>(p?: Problem<P>): Promise<void> {
    if (!p) { throw new Error('发生了一个未知的错误，请联系管理员！'); }

    await notify(p.title, p.detail, 'error');
}
