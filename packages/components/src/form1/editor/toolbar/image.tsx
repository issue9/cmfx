// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';
import IconClose from '~icons/material-symbols/cancel-rounded';
import IconOK from '~icons/material-symbols/check-circle-unread-outline';
import IconImage from '~icons/material-symbols/image-inset-outline-rounded';

import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { Form1 } from '@components/form1/form';
import { TextField } from '@components/form1/textfield';
import styles from './style.module.css';
import type { Props } from './types';

type Image = {
	src: string;
	alt?: string;
};

/**
 * https://tiptap.dev/docs/editor/extensions/nodes/image
 */
export function Image(props: Props): JSX.Element {
	const l = useLocale();

	const img = new Form1.ObjectAccessor<Image>({
		src: '',
		alt: '',
	});

	let dlg: Dialog.RootRef;
	return (
		<>
			<Button.Root
				title={l.t('_c.editor.addImage')}
				kind="flat"
				square
				onclick={() => {
					img.setValue({ src: '', alt: '' });
					dlg.root().showModal();
				}}
			>
				<IconImage />
			</Button.Root>

			<Dialog.Root
				ref={el => (dlg = el)}
				mainClass={styles['image-main']}
				footer={
					<footer>
						<Button.Root
							square
							kind="flat"
							palette="error"
							title={l.t('_c.close')}
							onclick={() => dlg.root().close('close')}
						>
							<IconClose />
						</Button.Root>

						<Button.Root
							square
							kind="flat"
							palette="error"
							title={l.t('_c.ok')}
							onclick={() => {
								props.editor.chain().focus().setImage(img.getValue()).run();
								dlg.root().close('ok');
							}}
						>
							<IconOK />
						</Button.Root>
					</footer>
				}
			>
				<TextField.Root label="src" accessor={img.accessor('src')} />
				<TextField.Root label="alt" accessor={img.accessor('alt')} />
			</Dialog.Root>
		</>
	);
}
