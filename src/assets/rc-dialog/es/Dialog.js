import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import KeyCode from 'rc-util/es/KeyCode';
import contains from 'rc-util/es/Dom/contains';
import Animate from 'rc-animate';
import LazyRenderBox from './LazyRenderBox';
import getScrollBarSize from 'rc-util/es/getScrollBarSize';
var uuid = 0;
var openCount = 0;
var minLeft = [], minLine = [], minIndex = 0, dom;
/* eslint react/no-is-mounted:0 */
function getScroll(w, top) {
    var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
    var method = 'scroll' + (top ? 'Top' : 'Left');
    if (typeof ret !== 'number') {
        var d = w.document;
        ret = d.documentElement[method];
        if (typeof ret !== 'number') {
            ret = d.body[method];
        }
    }
    return ret;
}
function setTransformOrigin(node, value) {
    var style = node.style;
    ['Webkit', 'Moz', 'Ms', 'ms'].forEach(function (prefix) {
        style[prefix + 'TransformOrigin'] = value;
    });
    style['transformOrigin'] = value;
}
function offset(el) {
    var rect = el.getBoundingClientRect();
    var pos = {
        left: rect.left,
        top: rect.top
    };
    var doc = el.ownerDocument;
    var w = doc.defaultView || doc.parentWindow;
    pos.left += getScroll(w);
    pos.top += getScroll(w, true);
    return pos;
}

var Dialog = function (_React$Component) {
    _inherits(Dialog, _React$Component);

    function Dialog() {
        _classCallCheck(this, Dialog);

        var _this = _possibleConstructorReturn(this, _React$Component.apply(this, arguments));

        _this.onAnimateLeave = function () {
            var afterClose = _this.props.afterClose;
            // need demo?
            // https://github.com/react-component/dialog/pull/28

            if (_this.wrap) {
                _this.wrap.style.display = 'none';
            }
            _this.inTransition = false;
            _this.removeScrollingEffect();
            if (afterClose) {
                afterClose();
            }
        };
        _this.onMaskClick = function (e) {
            // android trigger click on open (fastclick??)
            if (Date.now() - _this.openTime < 300) {
                return;
            }
            if (e.target === e.currentTarget) {
                _this.close(e);
            }
        };
        _this.onKeyDown = function (e) {
            var props = _this.props;
            if (props.keyboard && e.keyCode === KeyCode.ESC) {
                _this.close(e);
            }
            // keep focus inside dialog
            if (props.visible) {
                if (e.keyCode === KeyCode.TAB) {
                    var activeElement = document.activeElement;
                    var dialogRoot = _this.wrap;
                    if (e.shiftKey) {
                        if (activeElement === dialogRoot) {
                            _this.sentinel.focus();
                        }
                    } else if (activeElement === _this.sentinel) {
                        dialogRoot.focus();
                    }
                }
            }
        };
        var dict = {}, config = {};
        // draggable begin
        _this.onMouseDown = function (e) {
            if(e) e.preventDefault();
            dom = ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal')[0];
            if(!dom.getAttribute('left')) {
                dict.moveStart = true;
                dict.offset = [
                    e.clientX - parseFloat(dom.offsetLeft),
                    e.clientY - parseFloat(dom.offsetTop)
                ];
            }
        };

        _this.onMouseMove = function (e) {
            if(dict.moveStart) {
                var X = e.clientX - dict.offset[0], 
                    Y = e.clientY - dict.offset[1];
                if(e) e.preventDefault();
                dict.stX = 0;
                dict.stY = 0;
                //控制元素不被拖出窗口外
                if(!config.moveOut){
                    var setRig = window.innerWidth - ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal')[0].offsetWidth + dict.stX
                    ,setBot = window.innerHeight - ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal')[0].offsetHeight + dict.stY;  
                    X < dict.stX && (X = dict.stX);
                    X > setRig && (X = setRig); 
                    Y < dict.stY && (Y = dict.stY);
                    Y > setBot && (Y = setBot);
                }
                ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal')[0].style.left = X + 'px';
                ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal')[0].style.top = Y + 'px';
                ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-wrap')[0].style.cursor = 'move';
            }
        };

        _this.onMouseUp = function () {
            if(dict.moveStart){
                delete dict.moveStart;
                ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-wrap')[0].style.cursor = 'default';
            }
        };
        // draggable end
        _this.getDialogElement = function () {
            var props = _this.props;
            var closable = props.closable;
            var minable = props.minable;
            var maxable = props.maxable;
            var draggable = props.draggable;
            var prefixCls = props.prefixCls;
            var dest = {};
            if (props.width !== undefined) {
                dest.width = props.width;
            }
            if (props.height !== undefined) {
                dest.height = props.height;
            }
            var footer = void 0;
            if (props.footer) {
                footer = React.createElement("div", { className: prefixCls + '-footer', ref: _this.saveRef('footer') }, props.footer);
            }
            var header = void 0;
            if (props.title && draggable !== false) {
                header = React.createElement("div", { className: prefixCls + '-header', ref: _this.saveRef('header'), onMouseDown: _this.onMouseDown }, React.createElement("div", { className: prefixCls + '-title', id: _this.titleId }, props.title));
            } else if(props.title && draggable === false) {
                header = React.createElement("div", { className: prefixCls + '-header header-cant-move', ref: _this.saveRef('header')}, React.createElement("div", { className: prefixCls + '-title', id: _this.titleId }, props.title));
            }
            var closer = void 0;
            if (closable) {
                closer = React.createElement("button", { onClick: _this.close, "aria-label": "Close", className: prefixCls + '-close', title: "关闭" }, React.createElement("span", { className: prefixCls + '-close-x' }));
            }
            var restorer = void 0;
            if ((minable || maxable) && closable) {
                restorer = React.createElement("button", { onClick: _this.restore, "aria-label": "Restorer", className: prefixCls + '-restore', title: "还原" }, React.createElement("span", { className: prefixCls + '-restore-x' }));
            } else {
                restorer = React.createElement("button", { onClick: _this.restore, "aria-label": "Restorer", className: prefixCls + '-restore-without-both', title: "还原" }, React.createElement("span", { className: prefixCls + '-restore-x' }));
            }
            var maxer = void 0;
            if (maxable && closable) {
                maxer = React.createElement("button", { onClick: _this.max, "aria-label": "Max", className: prefixCls + '-max', title: "最大化" }, React.createElement("span", { className: prefixCls + '-max-x' }));
            } else if(maxable) {
                maxer = React.createElement("button", { onClick: _this.max, "aria-label": "Max", className: prefixCls + '-max-without-close', title: "最大化" }, React.createElement("span", { className: prefixCls + '-max-x' }));
            }
            var miner = void 0;
            if (minable && maxable && closable) {
                miner = React.createElement("button", { onClick: _this.min, "aria-label": "Min", className: prefixCls + '-min', title: "最小化" }, React.createElement("span", { className: prefixCls + '-min-x' }));
            } else if(minable && closable || minable && maxable) {
                miner = React.createElement("button", { onClick: _this.min, "aria-label": "Min", className: prefixCls + '-min-without-one', title: "最小化" }, React.createElement("span", { className: prefixCls + '-min-x' }));
            } else if(minable) {
                miner = React.createElement("button", { onClick: _this.min, "aria-label": "Min", className: prefixCls + '-min-without-both', title: "最小化" }, React.createElement("span", { className: prefixCls + '-min-x' }));
            }
            var style = _extends({}, props.style, dest);
            var transitionName = _this.getTransitionName();
            var dialogElement = React.createElement(LazyRenderBox, { key: "dialog-element", role: "document", ref: _this.saveRef('dialog'), style: style, className: prefixCls + ' ' + (props.className || ''), visible: props.visible }, React.createElement("div", { className: prefixCls + '-content' }, miner, maxer, restorer, closer, header, React.createElement("div", _extends({ className: prefixCls + '-body', style: props.bodyStyle, ref: _this.saveRef('body') }, props.bodyProps), props.children), footer), React.createElement("div", { tabIndex: 0, ref: _this.saveRef('sentinel'), style: { width: 0, height: 0, overflow: 'hidden' } }, "sentinel"));
            return React.createElement(Animate, { key: "dialog", showProp: "visible", onLeave: _this.onAnimateLeave, transitionName: transitionName, component: "", transitionAppear: true }, props.visible || !props.destroyOnClose ? dialogElement : null);
        };
        _this.getZIndexStyle = function () {
            var style = {};
            var props = _this.props;
            if (props.zIndex !== undefined) {
                style.zIndex = props.zIndex;
            }
            return style;
        };
        _this.getWrapStyle = function () {
            return _extends({}, _this.getZIndexStyle(), _this.props.wrapStyle);
        };
        _this.getMaskStyle = function () {
            return _extends({}, _this.getZIndexStyle(), _this.props.maskStyle);
        };
        _this.getMaskElement = function () {
            var props = _this.props;
            var maskElement = void 0;
            if (props.mask) {
                var maskTransition = _this.getMaskTransitionName();
                maskElement = React.createElement(LazyRenderBox, _extends({ style: _this.getMaskStyle(), key: "mask", className: props.prefixCls + '-mask', hiddenClassName: props.prefixCls + '-mask-hidden', visible: props.visible, onMouseMove: props.draggable === false ? null : this.onMouseMove, onMouseUp: props.draggable === false ? null : this.onMouseUp }, props.maskProps));
                if (maskTransition) {
                    maskElement = React.createElement(Animate, { key: "mask", showProp: "visible", transitionAppear: true, component: "", transitionName: maskTransition }, maskElement);
                }
            }
            return maskElement;
        };
        _this.getMaskTransitionName = function () {
            var props = _this.props;
            var transitionName = props.maskTransitionName;
            var animation = props.maskAnimation;
            if (!transitionName && animation) {
                transitionName = props.prefixCls + '-' + animation;
            }
            return transitionName;
        };
        _this.getTransitionName = function () {
            var props = _this.props;
            var transitionName = props.transitionName;
            var animation = props.animation;
            if (!transitionName && animation) {
                transitionName = props.prefixCls + '-' + animation;
            }
            return transitionName;
        };
        _this.setScrollbar = function () {
            if (_this.bodyIsOverflowing && _this.scrollbarWidth !== undefined) {
                document.body.style.paddingRight = _this.scrollbarWidth + 'px';
            }
        };
        _this.addScrollingEffect = function () {
            openCount++;
            if (openCount !== 1) {
                return;
            }
            _this.checkScrollbar();
            _this.setScrollbar();
            document.body.style.overflow = 'hidden';
            // this.adjustDialog();
        };
        _this.removeScrollingEffect = function () {
            openCount--;
            if (openCount !== 0) {
                return;
            }
            document.body.style.overflow = '';
            _this.resetScrollbar();
            // this.resetAdjustments();
        };
        _this.close = function (e) {
            dom = ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal')[0];
            setTimeout(function() {
                if(dom.getAttribute('left')) {
                    _this.restore(true);
                }
            }, 200);

            var onClose = _this.props.onClose;

            if (onClose) {
                onClose(e);
            }
        };
        // minmax begin
        _this.min = function () {
            var layero = ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal')[0],
                titHeight = ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-header')[0] ? ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-header')[0].offsetHeight : 47,
                left = 231 * (minIndex % parseInt(window.innerWidth / 231)) + 'px',
                position = layero.currentStyle ? layero.currentStyle.position : window.getComputedStyle(layero,null).position,
                lineNum = parseInt(minIndex / parseInt(window.innerWidth / 231)) + 1;
            
            if(minLeft[0]) {
                left = minLeft[0];
                lineNum = minLine[0];
                minLeft.shift();
                minLine.shift();
            }

            minIndex++;

            layero.setAttribute('left', left);
            layero.setAttribute('line', lineNum);

            var area = [
                layero.style.width,
                layero.style.transformOrigin,
                layero.style.left,
                layero.style.top
            ];
            layero.setAttribute('area', area);

            layero.setAttribute('position', position);
            
            layero.style.width = '230px';
            layero.style.height = titHeight + 'px';
            layero.style.left = left;
            layero.style.top = 'calc(100% - ' + (titHeight * lineNum + 2) + 'px)';
            layero.style.position = 'fixed';
            layero.style.overflow = 'hidden';
            layero.style.border = 'solid #bdbdbd 1px';
            layero.style.borderRadius = '5px';
            if(layero.getElementsByClassName('ant-modal-min')[0]) {
                layero.getElementsByClassName('ant-modal-min')[0].style.display = 'none';
            } else if(layero.getElementsByClassName('ant-modal-min-without-one')[0]) {
                layero.getElementsByClassName('ant-modal-min-without-one')[0].style.display = 'none';
            } else if(layero.getElementsByClassName('ant-modal-min-without-both')[0]) {
                layero.getElementsByClassName('ant-modal-min-without-both')[0].style.display = 'none';
            }
            if(layero.getElementsByClassName('ant-modal-max')[0]) {
                layero.getElementsByClassName('ant-modal-max')[0].style.display = 'none';
            } else if(layero.getElementsByClassName('ant-modal-max-without-close')[0]) {
                layero.getElementsByClassName('ant-modal-max-without-close')[0].style.display = 'none';
            }
            if(layero.getElementsByClassName('ant-modal-restore')[0]) {
                layero.getElementsByClassName('ant-modal-restore')[0].style.display = 'block';
            } else {
                layero.getElementsByClassName('ant-modal-restore-without-both')[0].style.display = 'block';
            }
            ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-mask')[0].className += ' ant-modal-mask-hidden';
            if(ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-header')[0]) {
                ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-header')[0].className += ' header-cant-move';
            }
            if(ReactDOM.findDOMNode(_this).getElementsByClassName('ant-confirm')[0]) {
                ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-body')[0].className += ' ant-modal-body-for-min';
            }
            document.getElementsByTagName('body')[0].removeAttribute('style');
        };
        _this.max = function() {
            var layero = ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal')[0], area;
            var area = [
                layero.style.width,
                layero.style.transformOrigin,
                layero.style.left,
                layero.style.top
            ], timer;
            
            layero.setAttribute('area', area);

            if(!document.documentElement.getAttribute('layer-full')){
                document.documentElement.style.overflow = 'hidden';
            }
            clearTimeout(timer);
            timer = setTimeout(function(){
                var isfix = layero.style.position === 'fixed';
                layero.style.top = isfix ? 0 : window.pageYOffset + 'px';
                layero.style.left = isfix ? 0 : window.pageXOffset + 'px';
                layero.style.width = window.innerWidth + 'px';
                layero.style.height = window.innerHeight + 'px';
                if(layero.getElementsByClassName('ant-modal-min')[0]) {
                    layero.getElementsByClassName('ant-modal-min')[0].style.display = 'none';
                } else if(layero.getElementsByClassName('ant-modal-min-without-one')[0]) {
                    layero.getElementsByClassName('ant-modal-min-without-one')[0].style.display = 'none';
                } else if(layero.getElementsByClassName('ant-modal-min-without-both')[0]) {
                    layero.getElementsByClassName('ant-modal-min-without-both')[0].style.display = 'none';
                }
                if(layero.getElementsByClassName('ant-modal-max')[0]) {
                    layero.getElementsByClassName('ant-modal-max')[0].style.display = 'none';
                } else if(layero.getElementsByClassName('ant-modal-max-without-close')[0]) {
                    layero.getElementsByClassName('ant-modal-max-without-close')[0].style.display = 'none';
                }
                if(layero.getElementsByClassName('ant-modal-restore')[0]) {
                    layero.getElementsByClassName('ant-modal-restore')[0].style.display = 'block';
                } else {
                    layero.getElementsByClassName('ant-modal-restore-without-both')[0].style.display = 'block';
                }
            }, 100);
        }
        _this.restore = function(isClose) {
            var layero = ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal')[0], area;
            area = layero.getAttribute('area').split(',');

            layero.removeAttribute('style');
            layero.style.width = area[0];
            layero.style.transformOrigin = area[1];
            layero.style.left = area[2];
            layero.style.top = area[3];

            minIndex--;
            minLeft.push(layero.getAttribute('left'));
            minLine.push(layero.getAttribute('line'));
            minLeft.sort();
            minLine.sort();
            layero.removeAttribute('left');
            if(layero.getElementsByClassName('ant-modal-max')[0]) {
                layero.getElementsByClassName('ant-modal-max')[0].removeAttribute('style');
            } else if(layero.getElementsByClassName('ant-modal-max-without-close')[0]) {
                layero.getElementsByClassName('ant-modal-max-without-close')[0].removeAttribute('style');
            }
            if(layero.getElementsByClassName('ant-modal-min')[0]) {
                layero.getElementsByClassName('ant-modal-min')[0].removeAttribute('style');
            } else if(layero.getElementsByClassName('ant-modal-min-without-one')[0]) {
                layero.getElementsByClassName('ant-modal-min-without-one')[0].removeAttribute('style');
            } else if(layero.getElementsByClassName('ant-modal-min-without-both')[0]) {
                layero.getElementsByClassName('ant-modal-min-without-both')[0].removeAttribute('style');
            }
            if(layero.getElementsByClassName('ant-modal-restore')[0]) {
                layero.getElementsByClassName('ant-modal-restore')[0].removeAttribute('style');
            } else if(layero.getElementsByClassName('ant-modal-restore-without-both')[0]) {
                layero.getElementsByClassName('ant-modal-restore-without-both')[0].removeAttribute('style');
            }
            if(ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-mask-hidden')[0] && isClose !== true) {
                ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-mask-hidden')[0].className = 'ant-modal-mask';
                if(ReactDOM.findDOMNode(_this).getElementsByClassName('header-cant-move')[0]) {
                    ReactDOM.findDOMNode(_this).getElementsByClassName('header-cant-move')[0].className = 'ant-modal-header';
                }
            }
            if(ReactDOM.findDOMNode(_this).getElementsByClassName('ant-confirm')[0]) {
                ReactDOM.findDOMNode(_this).getElementsByClassName('ant-modal-body-for-min')[0].className = 'ant-modal-body';
            }
        };
        // minmax end
        _this.checkScrollbar = function () {
            var fullWindowWidth = window.innerWidth;
            if (!fullWindowWidth) {
                // workaround for missing window.innerWidth in IE8
                var documentElementRect = document.documentElement.getBoundingClientRect();
                fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
            }
            _this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
            if (_this.bodyIsOverflowing) {
                _this.scrollbarWidth = getScrollBarSize();
            }
        };
        _this.resetScrollbar = function () {
            document.body.style.paddingRight = '';
        };
        _this.adjustDialog = function () {
            if (_this.wrap && _this.scrollbarWidth !== undefined) {
                var modalIsOverflowing = _this.wrap.scrollHeight > document.documentElement.clientHeight;
                _this.wrap.style.paddingLeft = (!_this.bodyIsOverflowing && modalIsOverflowing ? _this.scrollbarWidth : '') + 'px';
                _this.wrap.style.paddingRight = (_this.bodyIsOverflowing && !modalIsOverflowing ? _this.scrollbarWidth : '') + 'px';
            }
        };
        _this.resetAdjustments = function () {
            if (_this.wrap) {
                _this.wrap.style.paddingLeft = _this.wrap.style.paddingLeft = '';
            }
        };
        _this.saveRef = function (name) {
            return function (node) {
                _this[name] = node;
            };
        };
        return _this;
    }

    Dialog.prototype.componentWillMount = function componentWillMount() {
        this.inTransition = false;
        this.titleId = 'rcDialogTitle' + uuid++;
    };

    Dialog.prototype.componentDidMount = function componentDidMount() {
        this.componentDidUpdate({});
    };

    Dialog.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        var props = this.props;
        var mousePosition = this.props.mousePosition;
        if (props.visible) {
            // first show
            if (!prevProps.visible) {
                this.openTime = Date.now();
                this.addScrollingEffect();
                this.tryFocus();
                var dialogNode = ReactDOM.findDOMNode(this.dialog);
                if (mousePosition) {
                    var elOffset = offset(dialogNode);
                    setTransformOrigin(dialogNode, mousePosition.x - elOffset.left + 'px ' + (mousePosition.y - elOffset.top) + 'px');
                } else {
                    setTransformOrigin(dialogNode, '');
                }
            }
        } else if (prevProps.visible) {
            this.inTransition = true;
            if (props.mask && this.lastOutSideFocusNode) {
                try {
                    this.lastOutSideFocusNode.focus();
                } catch (e) {
                    this.lastOutSideFocusNode = null;
                }
                this.lastOutSideFocusNode = null;
            }
        }
    };

    Dialog.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.props.visible || this.inTransition) {
            this.removeScrollingEffect();
        }
    };

    Dialog.prototype.tryFocus = function tryFocus() {
        if (!contains(this.wrap, document.activeElement)) {
            this.lastOutSideFocusNode = document.activeElement;
            this.wrap.focus();
        }
    };

    Dialog.prototype.render = function render() {
        var props = this.props;
        var prefixCls = props.prefixCls,
            maskClosable = props.maskClosable;

        var style = this.getWrapStyle();
        // clear hide display
        // and only set display after async anim, not here for hide
        if (props.visible) {
            style.display = null;
        }
        return React.createElement("div", null, this.getMaskElement(), React.createElement( "span", _extends({ tabIndex: -1, onKeyDown: this.onKeyDown, className: prefixCls + '-wrap ' + (props.wrapClassName || ''), ref: this.saveRef('wrap'), onClick: maskClosable ? this.onMaskClick : undefined, role: "dialog", "aria-labelledby": props.title ? this.titleId : null, style: style, onMouseMove: this.onMouseMove, onMouseUp: this.onMouseUp }, props.wrapProps), this.getDialogElement()));
    };

    return Dialog;
}(React.Component);

export default Dialog;

Dialog.defaultProps = {
    className: '',
    mask: true,
    visible: false,
    keyboard: true,
    closable: true,
    maxable:true,
    minable: true,
    draggable: true,
    maskClosable: true,
    destroyOnClose: false,
    prefixCls: 'rc-dialog'
};