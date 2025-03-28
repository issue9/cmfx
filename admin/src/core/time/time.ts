// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 延时
 * @param ms 时间，以毫秒为单位
 */
export function sleep(ms: number) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

/**
 * 创建一个可暂停的计时器
 *
 * @param fn 计时器到点时需要执行的函数；
 * @param timeout 计时器的时间，单位为 ms；
 * @param step 计时器可暂停的最短时间，单位为 ms。该值应该小于 timeout，否则为抛出异常；
 * @param tick 每一个 step 时间调用的方法，函数签名为 {(timeout: number): void}，timeout 表示剩余的时间；
 */
export function createTimer(fn: { (): void; }, timeout: number, step: number, tick?: { (t: number): void; }) {
    if (timeout/step < 2) {
        throw 'timeout 的值最起码是 2*step';
    }

    const createInterval = () => {
        return setInterval(() => {
            timeout -= step;

            if (tick) {
                tick(timeout);
            }

            if (timeout <= 0) {
                clearInterval(timer);
                fn();
            }
        }, step);
    };

    let timer = createInterval();

    return {
        /**
         * 销毁计时器
         */
        stop() { clearInterval(timer); },

        /**
         * 暂停计时器，之后可用 start 继续
         */
        pause() { clearInterval(timer); },

        /**
         * 开始计时
         */
        start() { timer = createInterval();},
    };
}
