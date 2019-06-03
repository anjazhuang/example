import * as React from 'react';
declare type EventType = React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>;
declare type getContainerfunc = () => HTMLElement;
export interface DrawerProps {
    closable?: boolean;
    destroyOnClose?: boolean;
    getContainer?: string | HTMLElement | getContainerfunc;
    maskClosable?: boolean;
    mask?: boolean;
    maskStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    title?: React.ReactNode;
    visible?: boolean;
    width?: number | string;
    wrapClassName?: string;
    zIndex?: number;
    prefixCls?: string;
    push?: boolean;
    placement?: 'left' | 'right';
    onClose?: (e: EventType) => void;
}
export interface IDrawerState {
    push?: boolean;
}
export default class Drawer extends React.Component<DrawerProps, IDrawerState> {
    static propTypes: {
        closable: any;
        destroyOnClose: any;
        getContainer: any;
        maskClosable: any;
        mask: any;
        maskStyle: any;
        style: any;
        title: any;
        visible: any;
        width: any;
        wrapClassName: any;
        zIndex: any;
        prefixCls: any;
        placement: any;
        onClose: any;
    };
    static defaultProps: {
        prefixCls: string;
        width: number;
        closable: boolean;
        placement: string;
        maskClosable: boolean;
        level: null;
    };
    readonly state: {
        push: boolean;
    };
    praentDrawer: Drawer;
    componentDidUpdate(preProps: DrawerProps): void;
    close: (e: EventType) => void;
    onMaskClick: (e: EventType) => void;
    push: () => void;
    pull: () => void;
    renderBody: () => JSX.Element | null;
    renderProvider: (value: Drawer) => JSX.Element;
    render(): JSX.Element;
}
export {};
