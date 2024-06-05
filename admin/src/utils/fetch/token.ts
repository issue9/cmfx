// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import localforage from 'localforage';

const tokenName = 'cmfx-admin-token';

/**
 * 令牌的状态
 */
export enum TokenState {
    Normal, // 可访问的状态
    AccessExpired, // 访问令牌已过期，刷新令牌未过期
    RefreshExpired // 刷新令牌也过期了
}

export interface Token {
    access_token: string;
    refresh_token: string;

    // 以下为令牌过期时间，有两种不同的表示，可参考 buildToken 的说明。

    access_exp: number; 
    refresh_exp: number;
};

export async function getToken(): Promise<Token | null> {
    return await localforage.getItem<Token>(tokenName);
}

export async function delToken() { await localforage.removeItem(tokenName); }

/**
 * 保存令牌至缓存，会调用 buildToken 对令牌进行二次处理。
 */
export async function writeToken(t: Token) {
    await localforage.setItem(tokenName, buildToken(t));
}

/**
 * 获得令牌的状态
 * @param t 令牌
 * @returns 令牌的状态
 */
export function state(t: Token): TokenState {
    const now = Date.now().valueOf();

    if (now >= t.refresh_exp) {
        return TokenState.RefreshExpired;
    } 
    console.log(now,t.access_exp)
    if(now >= t.access_exp) {
        return TokenState.AccessExpired;
    }
    return TokenState.Normal;
}

/**
 * 对从服务端返回的令牌进行处理
 * 
 * 此方法会改变 access_exp 和 refresh_exp 的表示，表示令牌的过期时间点的毫秒数。
 * 
 * @param t 服务端返回的令牌
 * @returns 处理后的令牌
 */
function buildToken(t: Token): Token {
    const now = Date.now().valueOf();
    t.access_exp = now + t.access_exp * 1000;
    t.refresh_exp = now + t.refresh_exp * 1000;
    return t;
}
