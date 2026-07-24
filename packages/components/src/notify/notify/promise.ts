// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

type Resolve<T> = (value: T) => void;

// biome-ignore lint/suspicious/noExplicitAny: Promise.reject
type Reject = (reason: any) => void;

export function createDeferred<T>(): [Promise<T>, Resolve<T>, Reject] {
	let resolve!: Reject;
	let reject!: Reject;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return [promise, resolve, reject];
}
