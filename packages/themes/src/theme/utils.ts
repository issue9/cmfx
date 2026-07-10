// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

const reducedMotionWatcher = window.matchMedia('(prefers-reduced-motion: reduce)');

const [isReducedMotion, setIsReducedMotion] = createSignal<boolean>(reducedMotionWatcher.matches);

reducedMotionWatcher.addEventListener('change', e => {
	setIsReducedMotion(e.matches);
});

export { isReducedMotion };
