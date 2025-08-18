// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

export interface SSEToken {
    token: string;
    expire: number;
}

type TokenState =
    'normal' // 可访问的状态
    | 'accessExpired' // 访问令牌已过期，刷新令牌未过期
    | 'refreshExpired'; // 刷新令牌也过期了

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
export function getToken(id: string, s: Storage): Token | undefined {
    const t = s.getItem(id);
    if (!t) {
        return;
    }
    return JSON.parse(t) as Token;
}

export function delToken(id: string, s: Storage) { s.removeItem(id); }

/**
 * 保存令牌至缓存，会调用 {@link buildToken} 对令牌进行二次处理。
 */
export function writeToken(t: Token, id: string, s: Storage): Token {
    t = buildToken(t);
    s.setItem(id, JSON.stringify(t));
    return t;
}

/**
 * 获得令牌的状态
 * @param t - 令牌，必须得是由 {@link buildToken} 处理之后的对象。
 * @returns 令牌的状态
 */
export function state(t: Token): TokenState {
    const now = Date.now().valueOf();

    if (now >= t.refresh_exp) {
        return 'refreshExpired';
    }
    if(now >= t.access_exp) {
        return 'accessExpired';
    }
    return 'normal';
}

/**
 * 对从服务端返回的令牌进行处理
 *
 * 此方法会改变 access_exp 和 refresh_exp 的表示，表示令牌的过期时间点的毫秒数。
 *
 * @param t - 服务端返回的令牌
 * @returns 处理后的令牌
 */
function buildToken(t: Token): Token {
    const now = Date.now().valueOf();
    t.access_exp = now + t.access_exp * 1000;
    t.refresh_exp = now + t.refresh_exp * 1000;
    return t;
}
