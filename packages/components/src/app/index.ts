// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type AppProps, App as C } from './app';

export { run } from './run';

export const App = C;

export namespace App {
	export type Props = AppProps;
}
