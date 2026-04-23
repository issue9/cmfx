// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';
import IconAlignCenter from '~icons/material-symbols/format-align-center-rounded';
import IconAlignJustify from '~icons/material-symbols/format-align-justify-rounded';
import IconAlignLeft from '~icons/material-symbols/format-align-left-rounded';
import IconAlignRight from '~icons/material-symbols/format-align-right-rounded';

import { ToggleButton } from './toggle';
import type { Props } from './types';

export function AlignLeft(props: Props): JSX.Element {
	return buildAlign('left', <IconAlignLeft />)(props);
}

export function AlignCenter(props: Props): JSX.Element {
	return buildAlign('center', <IconAlignCenter />)(props);
}

export function AlignRight(props: Props): JSX.Element {
	return buildAlign('right', <IconAlignRight />)(props);
}

export function AlignJustify(props: Props): JSX.Element {
	return buildAlign('justify', <IconAlignJustify />)(props);
}

/**
 * 生成 TextAlign 组件
 *
 * https://tiptap.dev/docs/editor/extensions/functionality/textalign
 */
function buildAlign(align: 'left' | 'center' | 'right' | 'justify', icon: JSX.Element) {
	return (props: Props): JSX.Element => {
		return (
			<ToggleButton
				isActive={() => {
					console.log(props.editor.isActive({ textAlign: align }));
					return props.editor.isActive({ textAlign: align });
				}}
				editor={props.editor}
				toggle={() => props.editor.chain().focus().toggleTextAlign(align).run()}
			>
				{icon}
			</ToggleButton>
		);
	};
}
