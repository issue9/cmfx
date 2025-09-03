// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, ButtonGroup, ButtonKind, buttonKinds, ConfirmButton, FitScreenButton, LinkButton, PrintButton, SplitButton, SplitButtonItem } from '@cmfx/components';
import { Accessor, For, JSX, Setter } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconSync from '~icons/material-symbols/sync';
import IconTask from '~icons/material-symbols/task-alt';


import { Hotkey } from '@cmfx/core';
import { arraySelector, boolSelector, Demo, palettesWithUndefined, Stage } from './base';

export function kindSelector(v: ButtonKind = 'fill'): [JSX.Element, Accessor<ButtonKind>, Setter<ButtonKind>] {
    return arraySelector('风格', buttonKinds, v);
}

export default function() {
    const [kindS, kind] = kindSelector('fill');
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    const Links = () => <div class="flex flex-wrap items-center gap-2 my-4">
        <For each={palettesWithUndefined}>
            {(c) => (
                <LinkButton href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette={c}>{c ? c : 'undefined'}</LinkButton>
            )}
        </For>
        <LinkButton href="./" disabled={disabled()} rounded={rounded()} kind={kind()} palette="primary">
            <IconFace class="!me-1" />with icon
        </LinkButton>

        <Button rounded kind='fill' palette='tertiary'>对比按钮</Button>
    </div>;

    const Buttons = () => <div class="flex flex-wrap items-center gap-2 my-4">
        <For each={palettesWithUndefined}>
            {(c) => (
                <Button disabled={disabled()} rounded={rounded()} kind={kind()} palette={c}>{c ? c : 'undefined'}</Button>
            )}
        </For>
        <Button disabled={disabled()} rounded={rounded()} kind={kind()} palette="primary">
            <IconFace class="me-1" />with icon
        </Button>

        <ConfirmButton onClick={() => alert('confirm')} disabled={disabled()} rounded={rounded()} kind={kind()} palette='tertiary'>confirm button</ConfirmButton>
    </div>;

    const IconButtons = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c) => (
                <Button square title={c ? c : 'undefined'} disabled={disabled()} rounded={rounded()} kind={kind()} palette={c}><IconSync /></Button>
            )}
        </For>
        <Button rounded kind='fill' palette='tertiary'>a</Button>
        <ConfirmButton prompt={<p>这是一段比较长的文字内容</p>} onClick={() => alert('confirm')} disabled={disabled()} rounded={rounded()} kind={kind()} palette='tertiary' ok={<><IconTask />OK</>} cancel='cancel'>recommend</ConfirmButton>
    </div>;

    const SplitButtons = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c, index) => {
                const menus: Array<SplitButtonItem> = [
                    { type: 'item', label: 'button1', onClick: () => console.log('btn1') },
                    { type: 'item', label: 'button2', onClick: () => console.log('btn2') },
                    { type: 'divider' },
                    { type: 'item', label: 'confirm', onClick: () => confirm('confirm') },
                ];
                if (index() === 1) {
                    menus.push({ type: 'item', label: 'confirm(ctrl+alt+d)', onClick: () => confirm('confirm(ctrl+alt+d)'), hotkey: new Hotkey('d', 'control', 'alt') });
                }
                return <SplitButton palette={c} kind={kind()} rounded={rounded()} disabled={disabled()} menus={menus}>split-button</SplitButton>;
            }}
        </For>
    </div>;

    const ButtonGroupsH = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c)=>(
                <>
                    <ButtonGroup rounded={rounded()} palette={c} kind={kind()} disabled={disabled()}>
                        <Button checked>abc</Button>
                        <Button>def</Button>
                        <Button>hij</Button>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const ButtonGroupsV = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c) => (
                <>
                    <ButtonGroup layout='vertical' rounded={rounded()} palette={c} kind={kind()} disabled={disabled()}>
                        <Button>abc</Button>
                        <Button>def</Button>
                        <Button>hij</Button>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const IconButtonGroups = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c)=>(
                <>
                    <ButtonGroup rounded={rounded()} palette={c} kind={kind()} disabled={disabled()}>
                        <Button square><IconFace /></Button>
                        <Button square><IconClose /></Button>
                        <Button square><IconSync /></Button>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const LinkButtonGroups = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c) => (
                <>
                    <ButtonGroup rounded={rounded()} palette={c} kind={kind()} disabled={disabled()}>
                        <LinkButton href='.'>abc</LinkButton>
                        <LinkButton href='.'>def</LinkButton>
                        <LinkButton href='.'>hij</LinkButton>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const LinkIconButtonGroups = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c) => (
                <>
                    <ButtonGroup rounded={rounded()} palette={c} kind={kind()} disabled={disabled()}>
                        <LinkButton square href=""><IconFace /></LinkButton>
                        <LinkButton square href=""><IconClose /></LinkButton>
                        <LinkButton square href=""><IconSync /></LinkButton>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const Block = () => <div class="flex flex-col gap-y-2">
        <Button disabled={disabled()} rounded={rounded()} kind={kind()} palette='primary'>block</Button>

        <Button disabled={disabled()} rounded={rounded()} kind={kind()} palette="primary">
            <IconFace />with icon
        </Button>

        <ButtonGroup rounded={rounded()} palette='primary' kind={kind()} disabled={disabled()}>
            <Button>abc</Button>
            <Button>def</Button>
            <Button>hij</Button>
            <Button>klm</Button>
        </ButtonGroup>
    </div>;

    const FitScreen = () => <div class="flex flex-wrap gap-5">
        <For each={palettesWithUndefined}>
            {(c) => {
                let screenElement: HTMLElement;
                return <div class="w-10" ref={el => screenElement = el}>
                    <FitScreenButton disabled={disabled()} rounded={rounded()} kind={kind()} container={() => screenElement} palette={c} />
                    <p>line1</p>
                    <p>line2</p>
                </div>;
            }}
        </For>
    </div>;

    const Prints = () => <div class="flex flex-wrap gap-5">
        <For each={palettesWithUndefined}>
            {(c) => {
                let screenElement: HTMLElement;
                return <div class="w-10" ref={el => screenElement = el}>
                    <PrintButton disabled={disabled()} rounded={rounded()} kind={kind()} container={() => screenElement} palette={c} />
                    <p>line1</p>
                    <p>line2</p>
                </div>;
            }}
        </For>
    </div>;

    return <Demo settings={
        <>
            {kindS}
            {disabledS}
            {roundedS}
        </>
    }>

        <Stage title="fit screen">
            <FitScreen />
        </Stage>

        <Stage title="printer">
            <Prints />
        </Stage>

        <Stage title="button">
            <Buttons />
        </Stage>

        <Stage title='link'>
            <Links />
        </Stage>

        <Stage title='icon-button'>
            <IconButtons />
        </Stage>

        <Stage title='split-button'>
            <SplitButtons />
        </Stage>

        <Stage title="button-group">
            <ButtonGroupsH />
        </Stage>

        <Stage title="button-group">
            <ButtonGroupsV />
        </Stage>

        <Stage title='icon-button-group'>
            <IconButtonGroups />
        </Stage>

        <Stage title="link-button-group">
            <LinkButtonGroups />
        </Stage>

        <Stage title='link-icon-button-group'>
            <LinkIconButtonGroups />
        </Stage>

        <Stage title="block" class="w-full">
            <Block />
        </Stage>
    </Demo>;
}
