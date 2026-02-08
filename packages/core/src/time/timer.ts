// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 创建一个可暂停的计时器
 *
 * @param startTime - 计时器的初始时间，单位为 ms；
 * @param step - 步长，也是计时器可暂停的最短时间，单位为 ms。
 * 该绝对值应该小于 startTime，否则为抛出异常，
 * 正数表示增长。负数表示减少，如果为负数，在计时器跑到 0 时会停止计时；
 * @param tick - 每一个 step 时间调用的方法，函数签名为 `{(value: number): void}`，value 表示剩余的时间；
 */
export function createTimer(startTime: number, step: number, tick?: (value: number) => void) {
	const absStep = Math.abs(step);
	if (startTime / absStep < 2) {
		throw new Error('timeout 的值最起码是 2*step');
	}

	let timer: number | undefined;

	const clear = () => {
		clearInterval(timer);
		timer = undefined;
	};

	const createInterval = (): ReturnType<typeof window.setInterval> | undefined => {
		if (startTime <= 0 && step < 0) {
			return undefined;
		}

		return window.setInterval(() => {
			startTime += step;

			if (tick) {
				tick(startTime);
			}

			if (startTime <= 0) {
				clear();
			}
		}, absStep);
	};

	const start = () => {
		timer = createInterval();
	};

	return {
		/**
		 * 切换 {@link clear} 和 {@link start}
		 */
		toggle(): void {
			timer ? clear() : start();
		},

		/**
		 * 停止并销毁计时器
		 */
		stop(): void {
			clear();
		},

		/**
		 * 暂停计时器，之后可用 {@link start} 继续
		 */
		pause(): void {
			clear();
		},

		/**
		 * 开始计时
		 */
		start(): void {
			start();
		},

		/**
		 * 获取剩余时间
		 */
		value(): number {
			return startTime;
		},
	};
}
