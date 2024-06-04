// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 接口错误返回的对象
 */
export interface Problem {
    type: string
    title: string
    status: number
    detail?: string
    params?: Array<Param>
    instance?: string
    extension?: unknown
}

export interface Param {
    name: string
    reason: string
}

/**
 * 分页接口返回的对象
 */
export interface Page<T> {
    count: number
    current: Array<T>
    more?: boolean
}

export interface Return {
    problem?: Problem
    body?: unknown
    status: number
    ok: boolean
}
