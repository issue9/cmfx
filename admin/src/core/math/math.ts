// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 除，同时获得商和余数
 */
export function divide(dividend: number, divisor: number): [quotient: number, remainder: number] {
    const remainder = dividend % divisor;
    const quotient = (dividend - remainder) / divisor;
    return [quotient, remainder];
}
