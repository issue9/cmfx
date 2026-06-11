// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { error, info, notify, notifyPositions, success, system, warning } from './notify';

export const Notify = {
	error,
	info,
	notify,
	success,
	system,
	warning,
	positions: notifyPositions,
};

export namespace Notify {
	export type Position = import('./notify').NotifyPosition;
}
