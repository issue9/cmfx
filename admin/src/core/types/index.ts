// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 判断两个范型是否相等
 *
 * https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
 */
export type Equal<X, Y> =
    (<T>() => (T extends X ? 1 : 2)) extends
    (<T>() => (T extends Y ? 1 : 2)) ? true : false;
