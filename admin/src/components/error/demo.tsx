// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { default as XError } from './error';

export default function() {
    return <XError header='404' title='page not found' detail='detail' home='/' />;
}
