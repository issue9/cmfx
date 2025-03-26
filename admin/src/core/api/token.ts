// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

const tokenName = 'cmfx-admin-token';

export interface SSEToken {
    token: string;
    expire: number;
}

/**
 * 令牌的状态
 */
export const enum TokenState {
    Normal, // 可访问的状态
    AccessExpired, // 访问令牌已过期，刷新令牌未过期
    RefreshExpired // 刷新令牌也过期了
}

/**
 * 登录和刷新令牌接口返回的数据
 */
export interface Token {
    access_token: string;
    refresh_token: string;

    // 以下为令牌过期时间，有两种不同的表示：
    //  - 默认情况下表示对应令牌的过期秒数；
    //  - 由 buildToken 处理之后，则表示过期时间点的时间戳毫秒数。可参考 buildToken 的说明；

    access_exp: number;
    refresh_exp: number;
}

/**
 * 从缓存中获取令牌
 *
 * @returns 返回的令牌是由 {@link buildToken} 处理之后的。
 */
export function getToken(storage: Storage): Token | undefined {
    const s = storage.getItem(tokenName);
    if (!s) {
        return;
    }
    return JSON.parse(s) as Token;
}

export function delToken(storage: Storage) { storage.removeItem(tokenName); }

/**
 * 保存令牌至缓存，会调用 {@link buildToken} 对令牌进行二次处理。
 */
export function writeToken(storage: Storage, t: Token): Token {
    t = buildToken(t);
    storage.setItem(tokenName, JSON.stringify(t));
    return t;
}

/**
 * 获得令牌的状态
 * @param t 令牌，必须得是由 {@link buildToken} 处理之后的对象。
 * @returns 令牌的状态
 */
export function state(t: Token): TokenState {
    const now = Date.now().valueOf();

    if (now >= t.refresh_exp) {
        return TokenState.RefreshExpired;
    }
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
