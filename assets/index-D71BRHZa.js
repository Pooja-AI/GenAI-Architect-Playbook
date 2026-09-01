var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,o)=>(o=n==null?{}:e(i(n)),c(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var ee=Array.isArray;function S(){}var C={H:null,A:null,T:null,S:null},w=Object.prototype.hasOwnProperty;function T(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function te(e,t){return T(e.type,t,e.props)}function E(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ne(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var D=/\/+/g;function re(e,t){return typeof e==`object`&&e&&e.key!=null?ne(``+e.key):t.toString(36)}function ie(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(S,S):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function ae(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,ae(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+re(e,0):a,ee(o)?(i=``,c!=null&&(i=c.replace(D,`$&/`)+`/`),ae(o,r,i,``,function(e){return e})):o!=null&&(E(o)&&(o=te(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(D,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(ee(e))for(var u=0;u<e.length;u++)a=e[u],s=l+re(a,u),c+=ae(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+re(a,u++),c+=ae(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return ae(ie(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function oe(e,t,n){if(e==null)return e;var r=[],i=0;return ae(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function se(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var O=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},k={map:oe,forEach:function(e,t,n){oe(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return oe(e,function(){t++}),t},toArray:function(e){return oe(e,function(e){return e})||[]},only:function(e){if(!E(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=k,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=C,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return C.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!w.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return T(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)w.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return T(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=E,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:se}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=C.T,n={};C.T=n;try{var r=e(),i=C.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(S,O)}catch(e){O(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),C.T=t}},e.unstable_useCacheRefresh=function(){return C.H.useCacheRefresh()},e.use=function(e){return C.H.use(e)},e.useActionState=function(e,t,n){return C.H.useActionState(e,t,n)},e.useCallback=function(e,t){return C.H.useCallback(e,t)},e.useContext=function(e){return C.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return C.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return C.H.useEffect(e,t)},e.useEffectEvent=function(e){return C.H.useEffectEvent(e)},e.useId=function(){return C.H.useId()},e.useImperativeHandle=function(e,t,n){return C.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return C.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return C.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return C.H.useMemo(e,t)},e.useOptimistic=function(e,t){return C.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return C.H.useReducer(e,t,n)},e.useRef=function(e){return C.H.useRef(e)},e.useState=function(e){return C.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return C.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return C.H.useTransition()},e.version=`19.2.8`})),d=o(((e,t)=>{t.exports=u()})),f=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,ee||(ee=!0,E());else{var t=n(l);t!==null&&re(x,t.startTime-e)}}}var ee=!1,S=-1,C=5,w=-1;function T(){return g?!0:!(e.unstable_now()-w<C)}function te(){if(g=!1,ee){var t=e.unstable_now();w=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(S),S=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&T());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&re(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?E():ee=!1}}}var E;if(typeof y==`function`)E=function(){y(te)};else if(typeof MessageChannel<`u`){var ne=new MessageChannel,D=ne.port2;ne.port1.onmessage=te,E=function(){D.postMessage(null)}}else E=function(){_(te,0)};function re(t,n){S=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):C=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(S),S=-1):h=!0,re(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,ee||(ee=!0,E()))),r},e.unstable_shouldYield=T,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),p=o(((e,t)=>{t.exports=f()})),m=o((e=>{var t=d();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`);function o(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var s=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function c(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return o(e,t,null,r)},e.flushSync=function(e){var t=s.T,n=i.p;try{if(s.T=null,i.p=2,e)return e()}finally{s.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=c(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??i.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=c(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else i.d.m(e)}},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return s.H.useFormState(e,t,n)},e.useFormStatus=function(){return s.H.useHostTransitionStatus()},e.version=`19.2.8`})),h=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=m()})),g=o((e=>{var t=p(),n=d(),r=h();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function f(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=f(e),t!==null)return t;e=e.sibling}return null}var m=Object.assign,g=Symbol.for(`react.element`),_=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),ee=Symbol.for(`react.consumer`),S=Symbol.for(`react.context`),C=Symbol.for(`react.forward_ref`),w=Symbol.for(`react.suspense`),T=Symbol.for(`react.suspense_list`),te=Symbol.for(`react.memo`),E=Symbol.for(`react.lazy`),ne=Symbol.for(`react.activity`),D=Symbol.for(`react.memo_cache_sentinel`),re=Symbol.iterator;function ie(e){return typeof e!=`object`||!e?null:(e=re&&e[re]||e[`@@iterator`],typeof e==`function`?e:null)}var ae=Symbol.for(`react.client.reference`);function oe(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===ae?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case w:return`Suspense`;case T:return`SuspenseList`;case ne:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case S:return e.displayName||`Context`;case ee:return(e._context.displayName||`Context`)+`.Consumer`;case C:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case te:return t=e.displayName||null,t===null?oe(e.type)||`Memo`:t;case E:t=e._payload,e=e._init;try{return oe(e(t))}catch{}}return null}var se=Array.isArray,O=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,k=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ce={pending:!1,data:null,method:null,action:null},le=[],ue=-1;function de(e){return{current:e}}function fe(e){0>ue||(e.current=le[ue],le[ue]=null,ue--)}function A(e,t){ue++,le[ue]=e.current,e.current=t}var pe=de(null),me=de(null),he=de(null),ge=de(null);function _e(e,t){switch(A(he,t),A(me,e),A(pe,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vd(t),e=Hd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}fe(pe),A(pe,e)}function ve(){fe(pe),fe(me),fe(he)}function ye(e){e.memoizedState!==null&&A(ge,e);var t=pe.current,n=Hd(t,e.type);t!==n&&(A(me,e),A(pe,n))}function be(e){me.current===e&&(fe(pe),fe(me)),ge.current===e&&(fe(ge),Qf._currentValue=ce)}var xe,Se;function Ce(e){if(xe===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);xe=t&&t[1]||``,Se=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+xe+e+Se}var we=!1;function Te(e,t){if(!e||we)return``;we=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{we=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Ce(n):``}function Ee(e,t){switch(e.tag){case 26:case 27:case 5:return Ce(e.type);case 16:return Ce(`Lazy`);case 13:return e.child!==t&&t!==null?Ce(`Suspense Fallback`):Ce(`Suspense`);case 19:return Ce(`SuspenseList`);case 0:case 15:return Te(e.type,!1);case 11:return Te(e.type.render,!1);case 1:return Te(e.type,!0);case 31:return Ce(`Activity`);default:return``}}function De(e){try{var t=``,n=null;do t+=Ee(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Oe=Object.prototype.hasOwnProperty,ke=t.unstable_scheduleCallback,Ae=t.unstable_cancelCallback,je=t.unstable_shouldYield,Me=t.unstable_requestPaint,Ne=t.unstable_now,Pe=t.unstable_getCurrentPriorityLevel,Fe=t.unstable_ImmediatePriority,Ie=t.unstable_UserBlockingPriority,Le=t.unstable_NormalPriority,Re=t.unstable_LowPriority,ze=t.unstable_IdlePriority,Be=t.log,Ve=t.unstable_setDisableYieldValue,He=null,Ue=null;function We(e){if(typeof Be==`function`&&Ve(e),Ue&&typeof Ue.setStrictMode==`function`)try{Ue.setStrictMode(He,e)}catch{}}var Ge=Math.clz32?Math.clz32:Je,Ke=Math.log,qe=Math.LN2;function Je(e){return e>>>=0,e===0?32:31-(Ke(e)/qe|0)|0}var Ye=256,Xe=262144,Ze=4194304;function Qe(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function $e(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=Qe(n))):i=Qe(o):i=Qe(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=Qe(n))):i=Qe(o)):i=Qe(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function et(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function tt(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function nt(){var e=Ze;return Ze<<=1,!(Ze&62914560)&&(Ze=4194304),e}function rt(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function it(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function at(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-Ge(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&ot(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function ot(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-Ge(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function st(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Ge(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function ct(e,t){var n=t&-t;return n=n&42?1:lt(n),(n&(e.suspendedLanes|t))===0?n:0}function lt(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ut(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function dt(){var e=k.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function ft(e,t){var n=k.p;try{return k.p=e,t()}finally{k.p=n}}var pt=Math.random().toString(36).slice(2),mt=`__reactFiber$`+pt,ht=`__reactProps$`+pt,gt=`__reactContainer$`+pt,_t=`__reactEvents$`+pt,vt=`__reactListeners$`+pt,yt=`__reactHandles$`+pt,bt=`__reactResources$`+pt,xt=`__reactMarker$`+pt;function St(e){delete e[mt],delete e[ht],delete e[_t],delete e[vt],delete e[yt]}function Ct(e){var t=e[mt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[gt]||n[mt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[mt])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function wt(e){if(e=e[mt]||e[gt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Tt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function Et(e){var t=e[bt];return t||=e[bt]={hoistableStyles:new Map,hoistableScripts:new Map},t}function Dt(e){e[xt]=!0}var Ot=new Set,kt={};function At(e,t){jt(e,t),jt(e+`Capture`,t)}function jt(e,t){for(kt[e]=t,e=0;e<t.length;e++)Ot.add(t[e])}var Mt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Nt={},Pt={};function Ft(e){return Oe.call(Pt,e)?!0:Oe.call(Nt,e)?!1:Mt.test(e)?Pt[e]=!0:(Nt[e]=!0,!1)}function It(e,t,n){if(Ft(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}}function Lt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function Rt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function zt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Bt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Vt(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ht(e){if(!e._valueTracker){var t=Bt(e)?`checked`:`value`;e._valueTracker=Vt(e,t,``+e[t])}}function Ut(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Bt(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}function Wt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var Gt=/[\n"\\]/g;function Kt(e){return e.replace(Gt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function qt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+zt(t)):e.value!==``+zt(t)&&(e.value=``+zt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Yt(e,o,zt(n)):Yt(e,o,zt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+zt(s):e.removeAttribute(`name`)}function Jt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Ht(e);return}n=n==null?``:``+zt(n),t=t==null?n:``+zt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Ht(e)}function Yt(e,t,n){t===`number`&&Wt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Xt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+zt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Zt(e,t,n){if(t!=null&&(t=``+zt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+zt(n)}function Qt(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(se(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=zt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Ht(e)}function $t(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var en=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function tn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||en.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function nn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&tn(e,a,r)}else for(var o in t)t.hasOwnProperty(o)&&tn(e,o,t[o])}function rn(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var an=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),on=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function sn(e){return on.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function cn(){}var ln=null;function un(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var dn=null,fn=null;function pn(e){var t=wt(e);if(t&&(e=t.stateNode)){var n=e[ht]||null;a:switch(e=t.stateNode,t.type){case`input`:if(qt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+Kt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[ht]||null;if(!a)throw Error(i(90));qt(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Ut(r)}break a;case`textarea`:Zt(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Xt(e,!!n.multiple,t,!1)}}}var mn=!1;function hn(e,t,n){if(mn)return e(t,n);mn=!0;try{return e(t)}finally{if(mn=!1,(dn!==null||fn!==null)&&(bu(),dn&&(t=dn,e=fn,fn=dn=null,pn(t),e)))for(t=0;t<e.length;t++)pn(e[t])}}function gn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[ht]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var _n=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),vn=!1;if(_n)try{var yn={};Object.defineProperty(yn,"passive",{get:function(){vn=!0}}),window.addEventListener(`test`,yn,yn),window.removeEventListener(`test`,yn,yn)}catch{vn=!1}var bn=null,xn=null,Sn=null;function Cn(){if(Sn)return Sn;var e,t=xn,n=t.length,r,i=`value`in bn?bn.value:bn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Sn=i.slice(e,1<r?1-r:void 0)}function wn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Tn(){return!0}function En(){return!1}function Dn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Tn:En,this.isPropagationStopped=En,this}return m(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Tn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Tn)},persist:function(){},isPersistent:Tn}),t}var On={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},kn=Dn(On),An=m({},On,{view:0,detail:0}),jn=Dn(An),Mn,Nn,Pn,Fn=m({},An,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Gn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Pn&&(Pn&&e.type===`mousemove`?(Mn=e.screenX-Pn.screenX,Nn=e.screenY-Pn.screenY):Nn=Mn=0,Pn=e),Mn)},movementY:function(e){return`movementY`in e?e.movementY:Nn}}),In=Dn(Fn),Ln=Dn(m({},Fn,{dataTransfer:0})),Rn=Dn(m({},An,{relatedTarget:0})),zn=Dn(m({},On,{animationName:0,elapsedTime:0,pseudoElement:0})),Bn=Dn(m({},On,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Vn=Dn(m({},On,{data:0})),Hn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Un={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Wn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function j(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Wn[e])?!!t[e]:!1}function Gn(){return j}var Kn=Dn(m({},An,{key:function(e){if(e.key){var t=Hn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=wn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Un[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Gn,charCode:function(e){return e.type===`keypress`?wn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?wn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),qn=Dn(m({},Fn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Jn=Dn(m({},An,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Gn})),Yn=Dn(m({},On,{propertyName:0,elapsedTime:0,pseudoElement:0})),Xn=Dn(m({},Fn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Zn=Dn(m({},On,{newState:0,oldState:0})),Qn=[9,13,27,32],$n=_n&&`CompositionEvent`in window,er=null;_n&&`documentMode`in document&&(er=document.documentMode);var tr=_n&&`TextEvent`in window&&!er,nr=_n&&(!$n||er&&8<er&&11>=er),rr=` `,ir=!1;function ar(e,t){switch(e){case`keyup`:return Qn.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function or(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var M=!1;function sr(e,t){switch(e){case`compositionend`:return or(t);case`keypress`:return t.which===32?(ir=!0,rr):null;case`textInput`:return e=t.data,e===rr&&ir?null:e;default:return null}}function cr(e,t){if(M)return e===`compositionend`||!$n&&ar(e,t)?(e=Cn(),Sn=xn=bn=null,M=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return nr&&t.locale!==`ko`?null:t.data;default:return null}}var N={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function P(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!N[e.type]:t===`textarea`}function lr(e,t,n,r){dn?fn?fn.push(r):fn=[r]:dn=r,t=Ed(t,`onChange`),0<t.length&&(n=new kn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var ur=null,dr=null;function fr(e){yd(e,0)}function pr(e){if(Ut(Tt(e)))return e}function mr(e,t){if(e===`change`)return t}var hr=!1;if(_n){var gr;if(_n){var _r=`oninput`in document;if(!_r){var vr=document.createElement(`div`);vr.setAttribute(`oninput`,`return;`),_r=typeof vr.oninput==`function`}gr=_r}else gr=!1;hr=gr&&(!document.documentMode||9<document.documentMode)}function yr(){ur&&(ur.detachEvent(`onpropertychange`,br),dr=ur=null)}function br(e){if(e.propertyName===`value`&&pr(dr)){var t=[];lr(t,dr,e,un(e)),hn(fr,t)}}function xr(e,t,n){e===`focusin`?(yr(),ur=t,dr=n,ur.attachEvent(`onpropertychange`,br)):e===`focusout`&&yr()}function Sr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return pr(dr)}function Cr(e,t){if(e===`click`)return pr(t)}function wr(e,t){if(e===`input`||e===`change`)return pr(t)}function Tr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Er=typeof Object.is==`function`?Object.is:Tr;function Dr(e,t){if(Er(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Oe.call(t,i)||!Er(e[i],t[i]))return!1}return!0}function Or(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function kr(e,t){var n=Or(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Or(n)}}function Ar(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ar(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function jr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Wt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Wt(e.document)}return t}function Mr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Nr=_n&&`documentMode`in document&&11>=document.documentMode,Pr=null,Fr=null,Ir=null,Lr=!1;function Rr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Lr||Pr==null||Pr!==Wt(r)||(r=Pr,`selectionStart`in r&&Mr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Ir&&Dr(Ir,r)||(Ir=r,r=Ed(Fr,`onSelect`),0<r.length&&(t=new kn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Pr)))}function zr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Br={animationend:zr(`Animation`,`AnimationEnd`),animationiteration:zr(`Animation`,`AnimationIteration`),animationstart:zr(`Animation`,`AnimationStart`),transitionrun:zr(`Transition`,`TransitionRun`),transitionstart:zr(`Transition`,`TransitionStart`),transitioncancel:zr(`Transition`,`TransitionCancel`),transitionend:zr(`Transition`,`TransitionEnd`)},Vr={},Hr={};_n&&(Hr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Br.animationend.animation,delete Br.animationiteration.animation,delete Br.animationstart.animation),`TransitionEvent`in window||delete Br.transitionend.transition);function Ur(e){if(Vr[e])return Vr[e];if(!Br[e])return e;var t=Br[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Hr)return Vr[e]=t[n];return e}var Wr=Ur(`animationend`),Gr=Ur(`animationiteration`),Kr=Ur(`animationstart`),qr=Ur(`transitionrun`),Jr=Ur(`transitionstart`),Yr=Ur(`transitioncancel`),Xr=Ur(`transitionend`),Zr=new Map,Qr=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);Qr.push(`scrollEnd`);function $r(e,t){Zr.set(e,t),At(t,[e])}var ei=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},ti=[],ni=0,ri=0;function ii(){for(var e=ni,t=ri=ni=0;t<e;){var n=ti[t];ti[t++]=null;var r=ti[t];ti[t++]=null;var i=ti[t];ti[t++]=null;var a=ti[t];if(ti[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&ci(n,i,a)}}function ai(e,t,n,r){ti[ni++]=e,ti[ni++]=t,ti[ni++]=n,ti[ni++]=r,ri|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function oi(e,t,n,r){return ai(e,t,n,r),li(e)}function si(e,t){return ai(e,null,null,t),li(e)}function ci(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-Ge(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function li(e){if(50<du)throw du=0,fu=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ui={};function di(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function fi(e,t,n,r){return new di(e,t,n,r)}function pi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function mi(e,t){var n=e.alternate;return n===null?(n=fi(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function hi(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function gi(e,t,n,r,a,o){var s=0;if(r=e,typeof e==`function`)pi(e)&&(s=1);else if(typeof e==`string`)s=Uf(e,n,pe.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case ne:return e=fi(31,n,t,a),e.elementType=ne,e.lanes=o,e;case y:return _i(n.children,a,o,t);case b:s=8,a|=24;break;case x:return e=fi(12,n,t,a|2),e.elementType=x,e.lanes=o,e;case w:return e=fi(13,n,t,a),e.elementType=w,e.lanes=o,e;case T:return e=fi(19,n,t,a),e.elementType=T,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case S:s=10;break a;case ee:s=9;break a;case C:s=11;break a;case te:s=14;break a;case E:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=fi(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function _i(e,t,n,r){return e=fi(7,e,r,t),e.lanes=n,e}function vi(e,t,n){return e=fi(6,e,null,t),e.lanes=n,e}function yi(e){var t=fi(18,null,null,0);return t.stateNode=e,t}function bi(e,t,n){return t=fi(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var xi=new WeakMap;function Si(e,t){if(typeof e==`object`&&e){var n=xi.get(e);return n===void 0?(t={value:e,source:t,stack:De(t)},xi.set(e,t),t):n}return{value:e,source:t,stack:De(t)}}var Ci=[],wi=0,Ti=null,Ei=0,Di=[],Oi=0,ki=null,Ai=1,ji=``;function Mi(e,t){Ci[wi++]=Ei,Ci[wi++]=Ti,Ti=e,Ei=t}function Ni(e,t,n){Di[Oi++]=Ai,Di[Oi++]=ji,Di[Oi++]=ki,ki=e;var r=Ai;e=ji;var i=32-Ge(r)-1;r&=~(1<<i),n+=1;var a=32-Ge(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Ai=1<<32-Ge(t)+i|n<<i|r,ji=a+e}else Ai=1<<a|n<<i|r,ji=e}function Pi(e){e.return!==null&&(Mi(e,1),Ni(e,1,0))}function Fi(e){for(;e===Ti;)Ti=Ci[--wi],Ci[wi]=null,Ei=Ci[--wi],Ci[wi]=null;for(;e===ki;)ki=Di[--Oi],Di[Oi]=null,ji=Di[--Oi],Di[Oi]=null,Ai=Di[--Oi],Di[Oi]=null}function Ii(e,t){Di[Oi++]=Ai,Di[Oi++]=ji,Di[Oi++]=ki,Ai=t.id,ji=t.overflow,ki=e}var F=null,I=null,L=!1,Li=null,Ri=!1,zi=Error(i(519));function Bi(e){throw Ui(Si(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),zi}function Vi(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[mt]=e,t[ht]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<_d.length;n++)Q(_d[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),Jt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),Qt(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Md(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=cn),t=!0):t=!1,t||Bi(e,!0)}function R(e){for(F=e.return;F;)switch(F.tag){case 5:case 31:case 13:Ri=!1;return;case 27:case 3:Ri=!0;return;default:F=F.return}}function z(e){if(e!==F)return!1;if(!L)return R(e),L=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||Ud(e.type,e.memoizedProps)),n=!n),n&&I&&Bi(e),R(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));I=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));I=uf(e)}else t===27?(t=I,Zd(e.type)?(e=lf,lf=null,I=e):I=t):I=F?cf(e.stateNode.nextSibling):null;return!0}function B(){I=F=null,L=!1}function Hi(){var e=Li;return e!==null&&(Zl===null?Zl=e:Zl.push.apply(Zl,e),Li=null),e}function Ui(e){Li===null?Li=[e]:Li.push(e)}var Wi=de(null),Gi=null,V=null;function Ki(e,t,n){A(Wi,t._currentValue),t._currentValue=n}function qi(e){e._currentValue=Wi.current,fe(Wi)}function Ji(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function Yi(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),Ji(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),Ji(s,n,e),s=null}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function Xi(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Er(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===ge.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}a=a.return}e!==null&&Yi(t,e,n,r),t.flags|=262144}function Zi(e){for(e=e.firstContext;e!==null;){if(!Er(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Qi(e){Gi=e,V=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function $i(e){return ta(Gi,e)}function ea(e,t){return Gi===null&&Qi(e),ta(e,t)}function ta(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},V===null){if(e===null)throw Error(i(308));V=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else V=V.next=t;return n}var na=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},ra=t.unstable_scheduleCallback,ia=t.unstable_NormalPriority,aa={$$typeof:S,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function oa(){return{controller:new na,data:new Map,refCount:0}}function sa(e){e.refCount--,e.refCount===0&&ra(ia,function(){e.controller.abort()})}var ca=null,la=0,ua=0,da=null;function fa(e,t){if(ca===null){var n=ca=[];la=0,ua=dd(),da={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return la++,t.then(pa,pa),t}function pa(){if(--la===0&&ca!==null){da!==null&&(da.status=`fulfilled`);var e=ca;ca=null,ua=0,da=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function ma(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var ha=O.S;O.S=function(e,t){eu=Ne(),typeof t==`object`&&t&&typeof t.then==`function`&&fa(e,t),ha!==null&&ha(e,t)};var ga=de(null);function _a(){var e=ga.current;return e===null?q.pooledCache:e}function va(e,t){t===null?A(ga,ga.current):A(ga,t.pool)}function ya(){var e=_a();return e===null?null:{parent:aa._currentValue,pool:e}}var ba=Error(i(460)),xa=Error(i(474)),Sa=Error(i(542)),Ca={then:function(){}};function wa(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Ta(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(cn,cn),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,ka(e),e;default:if(typeof t.status==`string`)t.then(cn,cn);else{if(e=q,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,ka(e),e}throw Da=t,ba}}function Ea(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(Da=e,ba):e}}var Da=null;function Oa(){if(Da===null)throw Error(i(459));var e=Da;return Da=null,e}function ka(e){if(e===ba||e===Sa)throw Error(i(483))}var Aa=null,ja=0;function Ma(e){var t=ja;return ja+=1,Aa===null&&(Aa=[]),Ta(Aa,e,t)}function Na(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function Pa(e,t){throw t.$$typeof===g?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Fa(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=mi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=vi(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===E&&Ea(i)===t.type)?(t=a(t,n.props),Na(t,n),t.return=e,t):(t=gi(n.type,n.key,n.props,null,e.mode,r),Na(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=bi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=_i(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=vi(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case _:return n=gi(t.type,t.key,t.props,null,e.mode,n),Na(n,t),n.return=e,n;case v:return t=bi(t,e.mode,n),t.return=e,t;case E:return t=Ea(t),f(e,t,n)}if(se(t)||ie(t))return t=_i(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,Ma(t),n);if(t.$$typeof===S)return f(e,ea(e,t),n);Pa(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case _:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case E:return n=Ea(n),p(e,t,n,r)}if(se(n)||ie(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,Ma(n),r);if(n.$$typeof===S)return p(e,t,ea(e,n),r);Pa(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case _:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case E:return r=Ea(r),m(e,t,n,r,i)}if(se(r)||ie(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,Ma(r),i);if(r.$$typeof===S)return m(e,t,n,ea(t,r),i);Pa(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),L&&Mi(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return L&&Mi(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),L&&Mi(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),L&&Mi(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return L&&Mi(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),L&&Mi(a,g),u}function b(e,r,o,c){if(typeof o==`object`&&o&&o.type===y&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case _:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===y){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===E&&Ea(l)===r.type){n(e,r.sibling),c=a(r,o.props),Na(c,o),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}o.type===y?(c=_i(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=gi(o.type,o.key,o.props,null,e.mode,c),Na(c,o),c.return=e,e=c)}return s(e);case v:a:{for(l=o.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=bi(o,e.mode,c),c.return=e,e=c}return s(e);case E:return o=Ea(o),b(e,r,o,c)}if(se(o))return h(e,r,o,c);if(ie(o)){if(l=ie(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return b(e,r,Ma(o),c);if(o.$$typeof===S)return b(e,r,ea(e,o),c);Pa(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=vi(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{ja=0;var i=b(e,t,n,r);return Aa=null,i}catch(t){if(t===ba||t===Sa)throw t;var a=fi(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Ia=Fa(!0),La=Fa(!1),Ra=!1;function za(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ba(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Va(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ha(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,K&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=li(e),ci(e,null,n),t}return ai(e,r,t,n),li(e)}function Ua(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,st(e,n)}}function Wa(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Ga=!1;function Ka(){if(Ga){var e=da;if(e!==null)throw e}}function qa(e,t,n,r){Ga=!1;var i=e.updateQueue;Ra=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(Y&f)===f:(r&f)===f){f!==0&&f===ua&&(Ga=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var h=e,g=s;f=t;var _=n;switch(g.tag){case 1:if(h=g.payload,typeof h==`function`){d=h.call(_,d,f);break a}d=h;break a;case 3:h.flags=h.flags&-65537|128;case 0:if(h=g.payload,f=typeof h==`function`?h.call(_,d,f):h,f==null)break a;d=m({},d,f);break a;case 2:Ra=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Gl|=o,e.lanes=o,e.memoizedState=d}}function Ja(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function Ya(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Ja(n[e],t)}var Xa=de(null),Za=de(0);function Qa(e,t){e=Ul,A(Za,e),A(Xa,t),Ul=e|t.baseLanes}function $a(){A(Za,Ul),A(Xa,Xa.current)}function eo(){Ul=Za.current,fe(Xa),fe(Za)}var to=de(null),no=null;function ro(e){var t=e.alternate;A(co,co.current&1),A(to,e),no===null&&(t===null||Xa.current!==null||t.memoizedState!==null)&&(no=e)}function io(e){A(co,co.current),A(to,e),no===null&&(no=e)}function ao(e){e.tag===22?(A(co,co.current),A(to,e),no===null&&(no=e)):oo(e)}function oo(){A(co,co.current),A(to,to.current)}function so(e){fe(to),no===e&&(no=null),fe(co)}var co=de(0);function lo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var uo=0,H=null,U=null,fo=null,po=!1,mo=!1,ho=!1,go=0,_o=0,vo=null,yo=0;function bo(){throw Error(i(321))}function xo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Er(e[n],t[n]))return!1;return!0}function So(e,t,n,r,i,a){return uo=a,H=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,O.H=e===null||e.memoizedState===null?zs:Bs,ho=!1,a=n(r,i),ho=!1,mo&&(a=wo(t,n,r,i)),Co(e),a}function Co(e){O.H=Rs;var t=U!==null&&U.next!==null;if(uo=0,fo=U=H=null,po=!1,_o=0,vo=null,t)throw Error(i(300));e===null||rc||(e=e.dependencies,e!==null&&Zi(e)&&(rc=!0))}function wo(e,t,n,r){H=e;var a=0;do{if(mo&&(vo=null),_o=0,mo=!1,25<=a)throw Error(i(301));if(a+=1,fo=U=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}O.H=Vs,o=t(n,r)}while(mo);return o}function To(){var e=O.H,t=e.useState()[0];return t=typeof t.then==`function`?Mo(t):t,e=e.useState()[0],(U===null?null:U.memoizedState)!==e&&(H.flags|=1024),t}function Eo(){var e=go!==0;return go=0,e}function Do(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Oo(e){if(po){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}po=!1}uo=0,fo=U=H=null,mo=!1,_o=go=0,vo=null}function ko(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return fo===null?H.memoizedState=fo=e:fo=fo.next=e,fo}function Ao(){if(U===null){var e=H.alternate;e=e===null?null:e.memoizedState}else e=U.next;var t=fo===null?H.memoizedState:fo.next;if(t!==null)fo=t,U=e;else{if(e===null)throw H.alternate===null?Error(i(467)):Error(i(310));U=e,e={memoizedState:U.memoizedState,baseState:U.baseState,baseQueue:U.baseQueue,queue:U.queue,next:null},fo===null?H.memoizedState=fo=e:fo=fo.next=e}return fo}function jo(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Mo(e){var t=_o;return _o+=1,vo===null&&(vo=[]),e=Ta(vo,e,t),t=H,(fo===null?t.memoizedState:fo.next)===null&&(t=t.alternate,O.H=t===null||t.memoizedState===null?zs:Bs),e}function No(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Mo(e);if(e.$$typeof===S)return $i(e)}throw Error(i(438,String(e)))}function Po(e){var t=null,n=H.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=H.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=jo(),H.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=D;return t.index++,n}function Fo(e,t){return typeof t==`function`?t(e):t}function Io(e){return Lo(Ao(),U,e)}function Lo(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(uo&f)===f:(Y&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===ua&&(d=!0);else if((uo&p)===p){u=u.next,p===ua&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,H.lanes|=p,Gl|=p;f=u.action,ho&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,H.lanes|=f,Gl|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Er(o,e.memoizedState)&&(rc=!0,d&&(n=da,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Ro(e){var t=Ao(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Er(o,t.memoizedState)||(rc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function zo(e,t,n){var r=H,a=Ao(),o=L;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Er((U||a).memoizedState,n);if(s&&(a.memoizedState=n,rc=!0),a=a.queue,us(Ho.bind(null,r,a,e),[e]),a.getSnapshot!==t||s||fo!==null&&fo.memoizedState.tag&1){if(r.flags|=2048,as(9,{destroy:void 0},Vo.bind(null,r,a,n,t),null),q===null)throw Error(i(349));o||uo&127||Bo(r,t,n)}return n}function Bo(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=H.updateQueue,t===null?(t=jo(),H.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Vo(e,t,n,r){t.value=n,t.getSnapshot=r,Uo(t)&&Wo(e)}function Ho(e,t,n){return n(function(){Uo(t)&&Wo(e)})}function Uo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Er(e,n)}catch{return!0}}function Wo(e){var t=si(e,2);t!==null&&hu(t,e,2)}function Go(e){var t=ko();if(typeof e==`function`){var n=e;if(e=n(),ho){We(!0);try{n()}finally{We(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Fo,lastRenderedState:e},t}function Ko(e,t,n,r){return e.baseState=n,Lo(e,U,typeof r==`function`?r:Fo)}function qo(e,t,n,r,a){if(Fs(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};O.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,Jo(t,o)):(o.next=n.next,t.pending=n.next=o)}}function Jo(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=O.T,o={};O.T=o;try{var s=n(i,r),c=O.S;c!==null&&c(o,s),Yo(e,t,s)}catch(n){Zo(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),O.T=a}}else try{a=n(i,r),Yo(e,t,a)}catch(n){Zo(e,t,n)}}function Yo(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){Xo(e,t,n)},function(n){return Zo(e,t,n)}):Xo(e,t,n)}function Xo(e,t,n){t.status=`fulfilled`,t.value=n,Qo(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Jo(e,n)))}function Zo(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,Qo(t),t=t.next;while(t!==r)}e.action=null}function Qo(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function $o(e,t){return t}function es(e,t){if(L){var n=q.formState;if(n!==null){a:{var r=H;if(L){if(I){b:{for(var i=I,a=Ri;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){I=cf(i.nextSibling),r=i.data===`F!`;break a}}Bi(r)}r=!1}r&&(t=n[0])}}return n=ko(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:$o,lastRenderedState:t},n.queue=r,n=Ms.bind(null,H,r),r.dispatch=n,r=Go(!1),a=Ps.bind(null,H,!1,r.queue),r=ko(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=qo.bind(null,H,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function ts(e){return ns(Ao(),U,e)}function ns(e,t,n){if(t=Lo(e,t,$o)[0],e=Io(Fo)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Mo(t)}catch(e){throw e===ba?Sa:e}else r=t;t=Ao();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(H.flags|=2048,as(9,{destroy:void 0},rs.bind(null,i,n),null)),[r,a,e]}function rs(e,t){e.action=t}function is(e){var t=Ao(),n=U;if(n!==null)return ns(t,n,e);Ao(),t=t.memoizedState,n=Ao();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function as(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=H.updateQueue,t===null&&(t=jo(),H.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function os(){return Ao().memoizedState}function ss(e,t,n,r){var i=ko();H.flags|=e,i.memoizedState=as(1|t,{destroy:void 0},n,r===void 0?null:r)}function cs(e,t,n,r){var i=Ao();r=r===void 0?null:r;var a=i.memoizedState.inst;U!==null&&r!==null&&xo(r,U.memoizedState.deps)?i.memoizedState=as(t,a,n,r):(H.flags|=e,i.memoizedState=as(1|t,a,n,r))}function ls(e,t){ss(8390656,8,e,t)}function us(e,t){cs(2048,8,e,t)}function ds(e){H.flags|=4;var t=H.updateQueue;if(t===null)t=jo(),H.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function fs(e){var t=Ao().memoizedState;return ds({ref:t,nextImpl:e}),function(){if(K&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function ps(e,t){return cs(4,2,e,t)}function ms(e,t){return cs(4,4,e,t)}function hs(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function gs(e,t,n){n=n==null?null:n.concat([e]),cs(4,4,hs.bind(null,t,e),n)}function _s(){}function vs(e,t){var n=Ao();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&xo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ys(e,t){var n=Ao();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&xo(t,r[1]))return r[0];if(r=e(),ho){We(!0);try{e()}finally{We(!1)}}return n.memoizedState=[r,t],r}function bs(e,t,n){return n===void 0||uo&1073741824&&!(Y&261930)?e.memoizedState=t:(e.memoizedState=n,e=mu(),H.lanes|=e,Gl|=e,n)}function xs(e,t,n,r){return Er(n,t)?n:Xa.current===null?!(uo&42)||uo&1073741824&&!(Y&261930)?(rc=!0,e.memoizedState=n):(e=mu(),H.lanes|=e,Gl|=e,t):(e=bs(e,n,r),Er(e,t)||(rc=!0),e)}function Ss(e,t,n,r,i){var a=k.p;k.p=a!==0&&8>a?a:8;var o=O.T,s={};O.T=s,Ps(e,!1,t,n);try{var c=i(),l=O.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?Ns(e,t,ma(c,r),pu(e)):Ns(e,t,r,pu(e))}catch(n){Ns(e,t,{then:function(){},status:`rejected`,reason:n},pu())}finally{k.p=a,o!==null&&s.types!==null&&(o.types=s.types),O.T=o}}function Cs(){}function ws(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=Ts(e).queue;Ss(e,a,t,ce,n===null?Cs:function(){return Es(e),n(r)})}function Ts(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ce,baseState:ce,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Fo,lastRenderedState:ce},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Fo,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Es(e){var t=Ts(e);t.next===null&&(t=e.alternate.memoizedState),Ns(e,t.next.queue,{},pu())}function Ds(){return $i(Qf)}function Os(){return Ao().memoizedState}function ks(){return Ao().memoizedState}function As(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=pu();e=Va(n);var r=Ha(t,e,n);r!==null&&(hu(r,t,n),Ua(r,t,n)),t={cache:oa()},e.payload=t;return}t=t.return}}function js(e,t,n){var r=pu();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Fs(e)?Is(t,n):(n=oi(e,t,n,r),n!==null&&(hu(n,e,r),Ls(n,t,r)))}function Ms(e,t,n){Ns(e,t,n,pu())}function Ns(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Fs(e))Is(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Er(s,o))return ai(e,t,i,0),q===null&&ii(),!1}catch{}if(n=oi(e,t,i,r),n!==null)return hu(n,e,r),Ls(n,t,r),!0}return!1}function Ps(e,t,n,r){if(r={lane:2,revertLane:dd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Fs(e)){if(t)throw Error(i(479))}else t=oi(e,n,r,2),t!==null&&hu(t,e,2)}function Fs(e){var t=e.alternate;return e===H||t!==null&&t===H}function Is(e,t){mo=po=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Ls(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,st(e,n)}}var Rs={readContext:$i,use:No,useCallback:bo,useContext:bo,useEffect:bo,useImperativeHandle:bo,useLayoutEffect:bo,useInsertionEffect:bo,useMemo:bo,useReducer:bo,useRef:bo,useState:bo,useDebugValue:bo,useDeferredValue:bo,useTransition:bo,useSyncExternalStore:bo,useId:bo,useHostTransitionStatus:bo,useFormState:bo,useActionState:bo,useOptimistic:bo,useMemoCache:bo,useCacheRefresh:bo};Rs.useEffectEvent=bo;var zs={readContext:$i,use:No,useCallback:function(e,t){return ko().memoizedState=[e,t===void 0?null:t],e},useContext:$i,useEffect:ls,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),ss(4194308,4,hs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ss(4194308,4,e,t)},useInsertionEffect:function(e,t){ss(4,2,e,t)},useMemo:function(e,t){var n=ko();t=t===void 0?null:t;var r=e();if(ho){We(!0);try{e()}finally{We(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=ko();if(n!==void 0){var i=n(t);if(ho){We(!0);try{n(t)}finally{We(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=js.bind(null,H,e),[r.memoizedState,e]},useRef:function(e){var t=ko();return e={current:e},t.memoizedState=e},useState:function(e){e=Go(e);var t=e.queue,n=Ms.bind(null,H,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:_s,useDeferredValue:function(e,t){return bs(ko(),e,t)},useTransition:function(){var e=Go(!1);return e=Ss.bind(null,H,e.queue,!0,!1),ko().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=H,a=ko();if(L){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),q===null)throw Error(i(349));Y&127||Bo(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,ls(Ho.bind(null,r,o,e),[e]),r.flags|=2048,as(9,{destroy:void 0},Vo.bind(null,r,o,n,t),null),n},useId:function(){var e=ko(),t=q.identifierPrefix;if(L){var n=ji,r=Ai;n=(r&~(1<<32-Ge(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=go++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=yo++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:Ds,useFormState:es,useActionState:es,useOptimistic:function(e){var t=ko();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Ps.bind(null,H,!0,n),n.dispatch=t,[e,t]},useMemoCache:Po,useCacheRefresh:function(){return ko().memoizedState=As.bind(null,H)},useEffectEvent:function(e){var t=ko(),n={impl:e};return t.memoizedState=n,function(){if(K&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},Bs={readContext:$i,use:No,useCallback:vs,useContext:$i,useEffect:us,useImperativeHandle:gs,useInsertionEffect:ps,useLayoutEffect:ms,useMemo:ys,useReducer:Io,useRef:os,useState:function(){return Io(Fo)},useDebugValue:_s,useDeferredValue:function(e,t){return xs(Ao(),U.memoizedState,e,t)},useTransition:function(){var e=Io(Fo)[0],t=Ao().memoizedState;return[typeof e==`boolean`?e:Mo(e),t]},useSyncExternalStore:zo,useId:Os,useHostTransitionStatus:Ds,useFormState:ts,useActionState:ts,useOptimistic:function(e,t){return Ko(Ao(),U,e,t)},useMemoCache:Po,useCacheRefresh:ks};Bs.useEffectEvent=fs;var Vs={readContext:$i,use:No,useCallback:vs,useContext:$i,useEffect:us,useImperativeHandle:gs,useInsertionEffect:ps,useLayoutEffect:ms,useMemo:ys,useReducer:Ro,useRef:os,useState:function(){return Ro(Fo)},useDebugValue:_s,useDeferredValue:function(e,t){var n=Ao();return U===null?bs(n,e,t):xs(n,U.memoizedState,e,t)},useTransition:function(){var e=Ro(Fo)[0],t=Ao().memoizedState;return[typeof e==`boolean`?e:Mo(e),t]},useSyncExternalStore:zo,useId:Os,useHostTransitionStatus:Ds,useFormState:is,useActionState:is,useOptimistic:function(e,t){var n=Ao();return U===null?(n.baseState=e,[e,n.queue.dispatch]):Ko(n,U,e,t)},useMemoCache:Po,useCacheRefresh:ks};Vs.useEffectEvent=fs;function Hs(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:m({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Us={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Va(r);i.payload=t,n!=null&&(i.callback=n),t=Ha(e,i,r),t!==null&&(hu(t,e,r),Ua(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Va(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Ha(e,i,r),t!==null&&(hu(t,e,r),Ua(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=pu(),r=Va(n);r.tag=2,t!=null&&(r.callback=t),t=Ha(e,r,n),t!==null&&(hu(t,e,n),Ua(t,e,n))}};function Ws(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Dr(n,r)||!Dr(i,a):!0}function Gs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Us.enqueueReplaceState(t,t.state,null)}function Ks(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=m({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function qs(e){ei(e)}function Js(e){console.error(e)}function Ys(e){ei(e)}function Xs(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function Zs(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function Qs(e,t,n){return n=Va(n),n.tag=3,n.payload={element:null},n.callback=function(){Xs(e,t)},n}function $s(e){return e=Va(e),e.tag=3,e}function ec(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){Zs(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){Zs(t,n,r),typeof i!=`function`&&(ru===null?ru=new Set([this]):ru.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function tc(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&Xi(t,n,a,!0),n=to.current,n!==null){switch(n.tag){case 31:case 13:return no===null?Du():n.alternate===null&&Wl===0&&(Wl=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Ca?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Gu(e,r,a)),!1;case 22:return n.flags|=65536,r===Ca?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Gu(e,r,a)),!1}throw Error(i(435,n.tag))}return Gu(e,r,a),Du(),!1}if(L)return t=to.current,t===null?(r!==zi&&(t=Error(i(423),{cause:r}),Ui(Si(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Si(r,n),a=Qs(e.stateNode,r,a),Wa(e,a),Wl!==4&&(Wl=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==zi&&(e=Error(i(422),{cause:r}),Ui(Si(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Si(o,n),Xl===null?Xl=[o]:Xl.push(o),Wl!==4&&(Wl=2),t===null)return!0;r=Si(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Qs(n.stateNode,r,e),Wa(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(ru===null||!ru.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=$s(a),ec(a,e,n,r),Wa(n,a),!1}n=n.return}while(n!==null);return!1}var nc=Error(i(461)),rc=!1;function ic(e,t,n,r){t.child=e===null?La(t,null,n,r):Ia(t,e.child,n,r)}function ac(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return Qi(t),r=So(e,t,n,o,a,i),s=Eo(),e!==null&&!rc?(Do(e,t,i),kc(e,t,i)):(L&&s&&Pi(t),t.flags|=1,ic(e,t,r,i),t.child)}function oc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!pi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,sc(e,t,a,r,i)):(e=gi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Ac(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Dr:n,n(o,r)&&e.ref===t.ref)return kc(e,t,i)}return t.flags|=1,e=mi(a,r),e.ref=t.ref,e.return=t,t.child=e}function sc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Dr(a,r)&&e.ref===t.ref){if(rc=!1,t.pendingProps=r=a,Ac(e,i))e.flags&131072&&(rc=!0);else return t.lanes=e.lanes,kc(e,t,i)}}return hc(e,t,n,r,i)}function cc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return uc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&va(t,a===null?null:a.cachePool),a===null?$a():Qa(t,a),ao(t);else return r=t.lanes=536870912,uc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&va(t,null),$a(),oo(t)):(va(t,a.cachePool),Qa(t,a),oo(t),t.memoizedState=null);return ic(e,t,i,n),t.child}function lc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function uc(e,t,n,r,i){var a=_a();return a=a===null?null:{parent:aa._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&va(t,null),$a(),ao(t),e!==null&&Xi(e,t,r,!0),t.childLanes=i,null}function dc(e,t){return t=wc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function fc(e,t,n){return Ia(t,e.child,null,n),e=dc(t,t.pendingProps),e.flags|=2,so(t),t.memoizedState=null,e}function pc(e,t,n){var r=t.pendingProps,a=!!(t.flags&128);if(t.flags&=-129,e===null){if(L){if(r.mode===`hidden`)return e=dc(t,r),t.lanes=536870912,lc(null,e);if(io(t),(e=I)?(e=rf(e,Ri),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ki===null?null:{id:Ai,overflow:ji},retryLane:536870912,hydrationErrors:null},n=yi(e),n.return=t,t.child=n,F=t,I=null)):e=null,e===null)throw Bi(t);return t.lanes=536870912,null}return dc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(io(t),a){if(t.flags&256)t.flags&=-257,t=fc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558))}else if(rc||Xi(e,t,n,!1),a=(n&e.childLanes)!==0,rc||a){if(r=q,r!==null&&(s=ct(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,si(e,s),hu(r,e,s),nc;Du(),t=fc(e,t,n)}else e=o.treeContext,I=cf(s.nextSibling),F=t,L=!0,Li=null,Ri=!1,e!==null&&Ii(t,e),t=dc(t,r),t.flags|=4096;return t}return e=mi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function mc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function hc(e,t,n,r,i){return Qi(t),n=So(e,t,n,r,void 0,i),r=Eo(),e!==null&&!rc?(Do(e,t,i),kc(e,t,i)):(L&&r&&Pi(t),t.flags|=1,ic(e,t,n,i),t.child)}function gc(e,t,n,r,i,a){return Qi(t),t.updateQueue=null,n=wo(t,r,n,i),Co(e),r=Eo(),e!==null&&!rc?(Do(e,t,a),kc(e,t,a)):(L&&r&&Pi(t),t.flags|=1,ic(e,t,n,a),t.child)}function _c(e,t,n,r,i){if(Qi(t),t.stateNode===null){var a=ui,o=n.contextType;typeof o==`object`&&o&&(a=$i(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Us,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},za(t),o=n.contextType,a.context=typeof o==`object`&&o?$i(o):ui,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(Hs(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&Us.enqueueReplaceState(a,a.state,null),qa(t,r,a,i),Ka(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Ks(n,s);a.props=c;var l=a.context,u=n.contextType;o=ui,typeof u==`object`&&u&&(o=$i(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&Gs(t,a,r,o),Ra=!1;var f=t.memoizedState;a.state=f,qa(t,r,a,i),Ka(),l=t.memoizedState,s||f!==l||Ra?(typeof d==`function`&&(Hs(t,n,d,r),l=t.memoizedState),(c=Ra||Ws(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Ba(e,t),o=t.memoizedProps,u=Ks(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=ui,typeof l==`object`&&l&&(c=$i(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&Gs(t,a,r,c),Ra=!1,f=t.memoizedState,a.state=f,qa(t,r,a,i),Ka();var p=t.memoizedState;o!==d||f!==p||Ra||e!==null&&e.dependencies!==null&&Zi(e.dependencies)?(typeof s==`function`&&(Hs(t,n,s,r),p=t.memoizedState),(u=Ra||Ws(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&Zi(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,mc(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Ia(t,e.child,null,i),t.child=Ia(t,null,n,i)):ic(e,t,n,i),t.memoizedState=a.state,e=t.child):e=kc(e,t,i),e}function vc(e,t,n,r){return B(),t.flags|=256,ic(e,t,n,r),t.child}var yc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function bc(e){return{baseLanes:e,cachePool:ya()}}function xc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=Jl),e}function Sc(e,t,n){var r=t.pendingProps,a=!1,o=!!(t.flags&128),s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:!!(co.current&2)),s&&(a=!0,t.flags&=-129),s=!!(t.flags&32),t.flags&=-33,e===null){if(L){if(a?ro(t):oo(t),(e=I)?(e=rf(e,Ri),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ki===null?null:{id:Ai,overflow:ji},retryLane:536870912,hydrationErrors:null},n=yi(e),n.return=t,t.child=n,F=t,I=null)):e=null,e===null)throw Bi(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,a?(oo(t),a=t.mode,c=wc({mode:`hidden`,children:c},a),r=_i(r,a,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=bc(n),r.childLanes=xc(e,s,n),t.memoizedState=yc,lc(null,r)):(ro(t),Cc(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(ro(t),t.flags&=-257,t=Tc(e,t,n)):t.memoizedState===null?(oo(t),c=r.fallback,a=t.mode,r=wc({mode:`visible`,children:r.children},a),c=_i(c,a,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Ia(t,e.child,null,n),r=t.child,r.memoizedState=bc(n),r.childLanes=xc(e,s,n),t.memoizedState=yc,t=lc(null,r)):(oo(t),t.child=e.child,t.flags|=128,t=null);else if(ro(t),of(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(i(419)),r.stack=``,r.digest=s,Ui({value:r,source:null,stack:null}),t=Tc(e,t,n)}else if(rc||Xi(e,t,n,!1),s=(n&e.childLanes)!==0,rc||s){if(s=q,s!==null&&(r=ct(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,si(e,r),hu(s,e,r),nc;af(c)||Du(),t=Tc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,I=cf(c.nextSibling),F=t,L=!0,Li=null,Ri=!1,e!==null&&Ii(t,e),t=Cc(t,r.children),t.flags|=4096);return t}return a?(oo(t),c=r.fallback,a=t.mode,l=e.child,u=l.sibling,r=mi(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=_i(c,a,n,null),c.flags|=2):c=mi(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,lc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=bc(n):(a=c.cachePool,a===null?a=ya():(l=aa._currentValue,a=a.parent===l?a:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:a}),r.memoizedState=c,r.childLanes=xc(e,s,n),t.memoizedState=yc,lc(e.child,r)):(ro(t),n=e.child,e=n.sibling,n=mi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function Cc(e,t){return t=wc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function wc(e,t){return e=fi(22,e,null,t),e.lanes=0,e}function Tc(e,t,n){return Ia(t,e.child,null,n),e=Cc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Ec(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Ji(e.return,t,n)}function Dc(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function Oc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=co.current,s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,A(co,o),ic(e,t,r,n),r=L?Ei:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ec(e,n,t);else if(e.tag===19)Ec(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&lo(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),Dc(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&lo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}Dc(t,!0,n,null,a,r);break;case`together`:Dc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function kc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Gl|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(Xi(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=mi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=mi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Ac(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&Zi(e)))}function jc(e,t,n){switch(t.tag){case 3:_e(t,t.stateNode.containerInfo),Ki(t,aa,e.memoizedState.cache),B();break;case 27:case 5:ye(t);break;case 4:_e(t,t.stateNode.containerInfo);break;case 10:Ki(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,io(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(ro(t),e=kc(e,t,n),e===null?null:e.sibling):Sc(e,t,n):(ro(t),t.flags|=128,null);ro(t);break;case 19:var i=!!(e.flags&128);if(r=(n&t.childLanes)!==0,r||=(Xi(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return Oc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),A(co,co.current),r)break;return null;case 22:return t.lanes=0,cc(e,t,n,t.pendingProps);case 24:Ki(t,aa,e.memoizedState.cache)}return kc(e,t,n)}function Mc(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)rc=!0;else{if(!Ac(e,n)&&!(t.flags&128))return rc=!1,jc(e,t,n);rc=!!(e.flags&131072)}}else rc=!1,L&&t.flags&1048576&&Ni(t,Ei,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=Ea(t.elementType),t.type=e,typeof e==`function`)pi(e)?(r=Ks(e,r),t.tag=1,t=_c(null,t,e,r,n)):(t.tag=0,t=hc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===C){t.tag=11,t=ac(null,t,e,r,n);break a}if(a===te){t.tag=14,t=oc(null,t,e,r,n);break a}}throw t=oe(e)||e,Error(i(306,t,``))}}return t;case 0:return hc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=Ks(r,t.pendingProps),_c(e,t,r,a,n);case 3:a:{if(_e(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,Ba(e,t),qa(t,r,null,n);var s=t.memoizedState;if(r=s.cache,Ki(t,aa,r),r!==o.cache&&Yi(t,[aa],n,!0),Ka(),r=s.element,o.isDehydrated){if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=vc(e,t,r,n);break a}if(r!==a){a=Si(Error(i(424)),t),Ui(a),t=vc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(I=cf(e.firstChild),F=t,L=!0,Li=null,Ri=!0,n=La(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(B(),r===a){t=kc(e,t,n);break a}ic(e,t,r,n)}t=t.child}return t;case 26:return mc(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:L||(n=t.type,e=t.pendingProps,r=Bd(he.current).createElement(n),r[mt]=t,r[ht]=e,Pd(r,n,e),Dt(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return ye(t),e===null&&L&&(r=t.stateNode=ff(t.type,t.pendingProps,he.current),F=t,Ri=!0,a=I,Zd(t.type)?(lf=a,I=cf(r.firstChild)):I=a),ic(e,t,t.pendingProps.children,n),mc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&L&&((a=r=I)&&(r=tf(r,t.type,t.pendingProps,Ri),r===null?a=!1:(t.stateNode=r,F=t,I=cf(r.firstChild),Ri=!1,a=!0)),a||Bi(t)),ye(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Ud(a,o)?r=null:s!==null&&Ud(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=So(e,t,To,null,null,n),Qf._currentValue=a),mc(e,t),ic(e,t,r,n),t.child;case 6:return e===null&&L&&((e=n=I)&&(n=nf(n,t.pendingProps,Ri),n===null?e=!1:(t.stateNode=n,F=t,I=null,e=!0)),e||Bi(t)),null;case 13:return Sc(e,t,n);case 4:return _e(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Ia(t,null,r,n):ic(e,t,r,n),t.child;case 11:return ac(e,t,t.type,t.pendingProps,n);case 7:return ic(e,t,t.pendingProps,n),t.child;case 8:return ic(e,t,t.pendingProps.children,n),t.child;case 12:return ic(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,Ki(t,t.type,r.value),ic(e,t,r.children,n),t.child;case 9:return a=t.type._context,r=t.pendingProps.children,Qi(t),a=$i(a),r=r(a),t.flags|=1,ic(e,t,r,n),t.child;case 14:return oc(e,t,t.type,t.pendingProps,n);case 15:return sc(e,t,t.type,t.pendingProps,n);case 19:return Oc(e,t,n);case 31:return pc(e,t,n);case 22:return cc(e,t,n,t.pendingProps);case 24:return Qi(t),r=$i(aa),e===null?(a=_a(),a===null&&(a=q,o=oa(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},za(t),Ki(t,aa,a)):((e.lanes&n)!==0&&(Ba(e,t),qa(t,null,null,n),Ka()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,Ki(t,aa,r),r!==a.cache&&Yi(t,[aa],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Ki(t,aa,r))),ic(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function Nc(e){e.flags|=4}function Pc(e,t,n,r,i){if((t=!!(e.mode&32))&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(wu())e.flags|=8192;else throw Da=Ca,xa}}else e.flags&=-16777217}function Fc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t)){if(wu())e.flags|=8192;else throw Da=Ca,xa}}function Ic(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:nt(),e.lanes|=t,Yl|=t)}function Lc(e,t){if(!L)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function W(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Rc(e,t,n){var r=t.pendingProps;switch(Fi(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return W(t),null;case 1:return W(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),qi(aa),ve(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(z(t)?Nc(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Hi())),W(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(Nc(t),o===null?(W(t),Pc(t,a,null,r,n)):(W(t),Fc(t,o))):o?o===e.memoizedState?(W(t),t.flags&=-16777217):(Nc(t),W(t),Fc(t,o)):(e=e.memoizedProps,e!==r&&Nc(t),W(t),Pc(t,a,e,r,n)),null;case 27:if(be(t),n=he.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Nc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return W(t),null}e=pe.current,z(t)?Vi(t,e):(e=ff(a,r,n),t.stateNode=e,Nc(t))}return W(t),null;case 5:if(be(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Nc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return W(t),null}if(o=pe.current,z(t))Vi(t,o);else{var s=Bd(he.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[mt]=t,o[ht]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(Pd(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&Nc(t)}}return W(t),Pc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Nc(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=he.current,z(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=F,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[mt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Md(e.nodeValue,n)),e||Bi(t,!0)}else e=Bd(e).createTextNode(r),e[mt]=t,t.stateNode=e}return W(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=z(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[mt]=t}else B(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;W(t),e=!1}else n=Hi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(so(t),t):(so(t),null);if(t.flags&128)throw Error(i(558))}return W(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=z(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[mt]=t}else B(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;W(t),a=!1}else a=Hi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(so(t),t):(so(t),null)}return so(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Ic(t,t.updateQueue),W(t),null);case 4:return ve(),e===null&&Sd(t.stateNode.containerInfo),W(t),null;case 10:return qi(t.type),W(t),null;case 19:if(fe(co),r=t.memoizedState,r===null)return W(t),null;if(a=!!(t.flags&128),o=r.rendering,o===null){if(a)Lc(r,!1);else{if(Wl!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=lo(e),o!==null){for(t.flags|=128,Lc(r,!1),e=o.updateQueue,t.updateQueue=e,Ic(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)hi(n,e),n=n.sibling;return A(co,co.current&1|2),L&&Mi(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Ne()>tu&&(t.flags|=128,a=!0,Lc(r,!1),t.lanes=4194304)}}else{if(!a){if(e=lo(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Ic(t,e),Lc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!L)return W(t),null}else 2*Ne()-r.renderingStartTime>tu&&n!==536870912&&(t.flags|=128,a=!0,Lc(r,!1),t.lanes=4194304)}r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(W(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Ne(),e.sibling=null,n=co.current,A(co,a?n&1|2:n&1),L&&Mi(t,r.treeForkCount),e);case 22:case 23:return so(t),eo(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(W(t),t.subtreeFlags&6&&(t.flags|=8192)):W(t),n=t.updateQueue,n!==null&&Ic(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&fe(ga),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),qi(aa),W(t),null;case 25:return null;case 30:return null}throw Error(i(156,t.tag))}function zc(e,t){switch(Fi(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return qi(aa),ve(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return be(t),null;case 31:if(t.memoizedState!==null){if(so(t),t.alternate===null)throw Error(i(340));B()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(so(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));B()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return fe(co),null;case 4:return ve(),null;case 10:return qi(t.type),null;case 22:case 23:return so(t),eo(),e!==null&&fe(ga),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return qi(aa),null;case 25:return null;default:return null}}function Bc(e,t){switch(Fi(t),t.tag){case 3:qi(aa),ve();break;case 26:case 27:case 5:be(t);break;case 4:ve();break;case 31:t.memoizedState!==null&&so(t);break;case 13:so(t);break;case 19:fe(co);break;case 10:qi(t.type);break;case 22:case 23:so(t),eo(),e!==null&&fe(ga);break;case 24:qi(aa)}}function Vc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Hc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function Uc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Ya(t,n)}catch(t){Z(e,e.return,t)}}}function Wc(e,t,n){n.props=Ks(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function Gc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function Kc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}}function qc(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Jc(e,t,n){try{var r=e.stateNode;Fd(r,e.type,n,t),r[ht]=t}catch(t){Z(e,e.return,t)}}function Yc(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function Xc(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Yc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Zc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=cn));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Zc(e,t,n),e=e.sibling;e!==null;)Zc(e,t,n),e=e.sibling}function Qc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Qc(e,t,n),e=e.sibling;e!==null;)Qc(e,t,n),e=e.sibling}function $c(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Pd(t,r,n),t[mt]=e,t[ht]=n}catch(t){Z(e,e.return,t)}}var el=!1,tl=!1,nl=!1,rl=typeof WeakSet==`function`?WeakSet:Set,il=null;function al(e,t){if(e=e.containerInfo,Rd=sp,e=jr(e),Mr(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(zd={focusedElem:e,selectionRange:n},sp=!1,il=t;il!==null;)if(t=il,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,il=e;else for(;il!==null;){switch(t=il,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,a=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=Ks(n.type,a);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){Z(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(i(163))}if(e=t.sibling,e!==null){e.return=t.return,il=e;break}il=t.return}}function ol(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:bl(e,n),r&4&&Vc(5,n);break;case 1:if(bl(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=Ks(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}}r&64&&Uc(n),r&512&&Gc(n,n.return);break;case 3:if(bl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Ya(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&$c(n);case 26:case 5:bl(e,n),t===null&&r&4&&qc(n),r&512&&Gc(n,n.return);break;case 12:bl(e,n);break;case 31:bl(e,n),r&4&&dl(e,n);break;case 13:bl(e,n),r&4&&fl(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Ju.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||el,!r){t=t!==null&&t.memoizedState!==null||tl,i=el;var a=tl;el=r,(tl=t)&&!a?Sl(e,n,!!(n.subtreeFlags&8772)):bl(e,n),el=i,tl=a}break;case 30:break;default:bl(e,n)}}function sl(e){var t=e.alternate;t!==null&&(e.alternate=null,sl(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&St(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var G=null,cl=!1;function ll(e,t,n){for(n=n.child;n!==null;)ul(e,t,n),n=n.sibling}function ul(e,t,n){if(Ue&&typeof Ue.onCommitFiberUnmount==`function`)try{Ue.onCommitFiberUnmount(He,n)}catch{}switch(n.tag){case 26:tl||Kc(n,t),ll(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:tl||Kc(n,t);var r=G,i=cl;Zd(n.type)&&(G=n.stateNode,cl=!1),ll(e,t,n),pf(n.stateNode),G=r,cl=i;break;case 5:tl||Kc(n,t);case 6:if(r=G,i=cl,G=null,ll(e,t,n),G=r,cl=i,G!==null){if(cl)try{(G.nodeType===9?G.body:G.nodeName===`HTML`?G.ownerDocument.body:G).removeChild(n.stateNode)}catch(e){Z(n,t,e)}else try{G.removeChild(n.stateNode)}catch(e){Z(n,t,e)}}break;case 18:G!==null&&(cl?(e=G,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(G,n.stateNode));break;case 4:r=G,i=cl,G=n.stateNode.containerInfo,cl=!0,ll(e,t,n),G=r,cl=i;break;case 0:case 11:case 14:case 15:Hc(2,n,t),tl||Hc(4,n,t),ll(e,t,n);break;case 1:tl||(Kc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&Wc(n,t,r)),ll(e,t,n);break;case 21:ll(e,t,n);break;case 22:tl=(r=tl)||n.memoizedState!==null,ll(e,t,n),tl=r;break;default:ll(e,t,n)}}function dl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){Z(t,t.return,e)}}}function fl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){Z(t,t.return,e)}}function pl(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new rl),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new rl),t;default:throw Error(i(435,e.tag))}}function ml(e,t){var n=pl(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Yu.bind(null,e,t);t.then(r,r)}})}function hl(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){G=c.stateNode,cl=!1;break a}break;case 5:G=c.stateNode,cl=!1;break a;case 3:case 4:G=c.stateNode.containerInfo,cl=!0;break a}c=c.return}if(G===null)throw Error(i(160));ul(o,s,a),G=null,cl=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)_l(t,e),t=t.sibling}var gl=null;function _l(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:hl(t,e),vl(e),r&4&&(Hc(3,e,e.return),Vc(3,e),Hc(5,e,e.return));break;case 1:hl(t,e),vl(e),r&512&&(tl||n===null||Kc(n,n.return)),r&64&&el&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var a=gl;if(hl(t,e),vl(e),r&512&&(tl||n===null||Kc(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null){if(r===null){if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,a=a.ownerDocument||a;b:switch(r){case`title`:o=a.getElementsByTagName(`title`)[0],(!o||o[xt]||o[mt]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=a.createElement(r),a.head.insertBefore(o,a.querySelector(`head > title`))),Pd(o,r,n),o[mt]=e,Dt(o),r=o;break a;case`link`:var s=Vf(`link`,`href`,a).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;case`meta`:if(s=Vf(`meta`,`content`,a).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;default:throw Error(i(468,r))}o[mt]=e,Dt(o),r=o}e.stateNode=r}else Hf(a,e.type,e.stateNode)}else e.stateNode=If(a,r,e.memoizedProps)}else o===r?r===null&&e.stateNode!==null&&Jc(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Hf(a,e.type,e.stateNode):If(a,r,e.memoizedProps))}break;case 27:hl(t,e),vl(e),r&512&&(tl||n===null||Kc(n,n.return)),n!==null&&r&4&&Jc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(hl(t,e),vl(e),r&512&&(tl||n===null||Kc(n,n.return)),e.flags&32){a=e.stateNode;try{$t(a,``)}catch(t){Z(e,e.return,t)}}r&4&&e.stateNode!=null&&(a=e.memoizedProps,Jc(e,a,n===null?a:n.memoizedProps)),r&1024&&(nl=!0);break;case 6:if(hl(t,e),vl(e),r&4){if(e.stateNode===null)throw Error(i(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){Z(e,e.return,t)}}break;case 3:if(Bf=null,a=gl,gl=gf(t.containerInfo),hl(t,e),gl=a,vl(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){Z(e,e.return,t)}nl&&(nl=!1,yl(e));break;case 4:r=gl,gl=gf(e.stateNode.containerInfo),hl(t,e),vl(e),gl=r;break;case 12:hl(t,e),vl(e);break;case 31:hl(t,e),vl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,ml(e,r)));break;case 13:hl(t,e),vl(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&($l=Ne()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,ml(e,r)));break;case 22:a=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=el,d=tl;if(el=u||a,tl=d||l,hl(t,e),tl=d,el=u,vl(e),r&8192)a:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||l||el||tl||xl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,a)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){Z(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=a?``:l.memoizedProps}catch(e){Z(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;a?$d(m,!0):$d(l.stateNode,!1)}catch(e){Z(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,ml(e,n))));break;case 19:hl(t,e),vl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,ml(e,r)));break;case 30:break;case 21:break;default:hl(t,e),vl(e)}}function vl(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Yc(r)){n=r;break}r=r.return}if(n==null)throw Error(i(160));switch(n.tag){case 27:var a=n.stateNode;Qc(e,Xc(e),a);break;case 5:var o=n.stateNode;n.flags&32&&($t(o,``),n.flags&=-33),Qc(e,Xc(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;Zc(e,Xc(e),s);break;default:throw Error(i(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function yl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;yl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function bl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)ol(e,t.alternate,t),t=t.sibling}function xl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Hc(4,t,t.return),xl(t);break;case 1:Kc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&Wc(t,t.return,n),xl(t);break;case 27:pf(t.stateNode);case 26:case 5:Kc(t,t.return),xl(t);break;case 22:t.memoizedState===null&&xl(t);break;case 30:xl(t);break;default:xl(t)}e=e.sibling}}function Sl(e,t,n){for(n&&=!!(t.subtreeFlags&8772),t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:Sl(i,a,n),Vc(4,a);break;case 1:if(Sl(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)Ja(c[i],s)}catch(e){Z(r,r.return,e)}}n&&o&64&&Uc(a),Gc(a,a.return);break;case 27:$c(a);case 26:case 5:Sl(i,a,n),n&&r===null&&o&4&&qc(a),Gc(a,a.return);break;case 12:Sl(i,a,n);break;case 31:Sl(i,a,n),n&&o&4&&dl(i,a);break;case 13:Sl(i,a,n),n&&o&4&&fl(i,a);break;case 22:a.memoizedState===null&&Sl(i,a,n),Gc(a,a.return);break;case 30:break;default:Sl(i,a,n)}t=t.sibling}}function Cl(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&sa(n))}function wl(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&sa(e))}function Tl(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)El(e,t,n,r),t=t.sibling}function El(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:Tl(e,t,n,r),i&2048&&Vc(9,t);break;case 1:Tl(e,t,n,r);break;case 3:Tl(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&sa(e)));break;case 12:if(i&2048){Tl(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else Tl(e,t,n,r);break;case 31:Tl(e,t,n,r);break;case 13:Tl(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?Tl(e,t,n,r):(a._visibility|=2,Dl(e,t,n,r,!!(t.subtreeFlags&10256)||!1)):a._visibility&2?Tl(e,t,n,r):Ol(e,t),i&2048&&Cl(o,t);break;case 24:Tl(e,t,n,r),i&2048&&wl(t.alternate,t);break;default:Tl(e,t,n,r)}}function Dl(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Dl(a,o,s,c,i),Vc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Dl(a,o,s,c,i)):u._visibility&2?Dl(a,o,s,c,i):Ol(a,o),i&&l&2048&&Cl(o.alternate,o);break;case 24:Dl(a,o,s,c,i),i&&l&2048&&wl(o.alternate,o);break;default:Dl(a,o,s,c,i)}t=t.sibling}}function Ol(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Ol(n,r),i&2048&&Cl(r.alternate,r);break;case 24:Ol(n,r),i&2048&&wl(r.alternate,r);break;default:Ol(n,r)}t=t.sibling}}var kl=8192;function Al(e,t,n){if(e.subtreeFlags&kl)for(e=e.child;e!==null;)jl(e,t,n),e=e.sibling}function jl(e,t,n){switch(e.tag){case 26:Al(e,t,n),e.flags&kl&&e.memoizedState!==null&&Gf(n,gl,e.memoizedState,e.memoizedProps);break;case 5:Al(e,t,n);break;case 3:case 4:var r=gl;gl=gf(e.stateNode.containerInfo),Al(e,t,n),gl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=kl,kl=16777216,Al(e,t,n),kl=r):Al(e,t,n));break;default:Al(e,t,n)}}function Ml(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Nl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];il=r,Il(r,e)}Ml(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Pl(e),e=e.sibling}function Pl(e){switch(e.tag){case 0:case 11:case 15:Nl(e),e.flags&2048&&Hc(9,e,e.return);break;case 3:Nl(e);break;case 12:Nl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Fl(e)):Nl(e);break;default:Nl(e)}}function Fl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];il=r,Il(r,e)}Ml(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Hc(8,t,t.return),Fl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Fl(t));break;default:Fl(t)}e=e.sibling}}function Il(e,t){for(;il!==null;){var n=il;switch(n.tag){case 0:case 11:case 15:Hc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:sa(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,il=r;else a:for(n=e;il!==null;){r=il;var i=r.sibling,a=r.return;if(sl(r),r===n){il=null;break a}if(i!==null){i.return=a,il=i;break a}il=a}}}var Ll={getCacheForType:function(e){var t=$i(aa),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return $i(aa).controller.signal}},Rl=typeof WeakMap==`function`?WeakMap:Map,K=0,q=null,J=null,Y=0,X=0,zl=null,Bl=!1,Vl=!1,Hl=!1,Ul=0,Wl=0,Gl=0,Kl=0,ql=0,Jl=0,Yl=0,Xl=null,Zl=null,Ql=!1,$l=0,eu=0,tu=1/0,nu=null,ru=null,iu=0,au=null,ou=null,su=0,cu=0,lu=null,uu=null,du=0,fu=null;function pu(){return K&2&&Y!==0?Y&-Y:O.T===null?dt():dd()}function mu(){if(Jl===0){if(!(Y&536870912)||L){var e=Xe;Xe<<=1,!(Xe&3932160)&&(Xe=262144),Jl=e}else Jl=536870912}return e=to.current,e!==null&&(e.flags|=32),Jl}function hu(e,t,n){(e===q&&(X===2||X===9)||e.cancelPendingCommit!==null)&&(Su(e,0),yu(e,Y,Jl,!1)),it(e,n),(!(K&2)||e!==q)&&(e===q&&(!(K&2)&&(Kl|=n),Wl===4&&yu(e,Y,Jl,!1)),rd(e))}function gu(e,t,n){if(K&6)throw Error(i(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||et(e,t),a=r?Au(e,t):Ou(e,t,!0),o=r;do{if(a===0){Vl&&!r&&yu(e,t,0,!1);break}if(n=e.current.alternate,o&&!vu(n)){a=Ou(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=Xl;var l=c.current.memoizedState.isDehydrated;if(l&&(Su(c,s).flags|=256),s=Ou(c,s,!1),s!==2){if(Hl&&!l){c.errorRecoveryDisabledLanes|=o,Kl|=o,a=4;break a}o=Zl,Zl=a,o!==null&&(Zl===null?Zl=o:Zl.push.apply(Zl,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){Su(e,0),yu(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t)break;case 6:yu(r,t,Jl,!Bl);break a;case 2:Zl=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=$l+300-Ne(),10<a)){if(yu(r,t,Jl,!Bl),$e(r,0,!0)!==0)break a;su=t,r.timeoutHandle=Kd(_u.bind(null,r,n,Zl,nu,Ql,t,Jl,Kl,Yl,Bl,o,`Throttled`,-0,0),a);break a}_u(r,n,Zl,nu,Ql,t,Jl,Kl,Yl,Bl,o,null,-0,0)}break}while(1);rd(e)}function _u(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:cn},jl(t,a,d);var m=(a&62914560)===a?$l-Ne():(a&4194048)===a?eu-Ne():0;if(m=qf(d,m),m!==null){su=a,e.cancelPendingCommit=m(Lu.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),yu(e,a,o,!l);return}}Lu(e,t,a,n,r,i,o,s,c)}function vu(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Er(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function yu(e,t,n,r){t&=~ql,t&=~Kl,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-Ge(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&ot(e,n,t)}function bu(){return K&6?!0:(id(0,!1),!1)}function xu(){if(J!==null){if(X===0)var e=J.return;else e=J,V=Gi=null,Oo(e),Aa=null,ja=0,e=J;for(;e!==null;)Bc(e.alternate,e),e=e.return;J=null}}function Su(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,qd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),su=0,xu(),q=e,J=n=mi(e.current,null),Y=t,X=0,zl=null,Bl=!1,Vl=et(e,t),Hl=!1,Yl=Jl=ql=Kl=Gl=Wl=0,Zl=Xl=null,Ql=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-Ge(r),a=1<<i;t|=e[i],r&=~a}return Ul=t,ii(),n}function Cu(e,t){H=null,O.H=Rs,t===ba||t===Sa?(t=Oa(),X=3):t===xa?(t=Oa(),X=4):X=t===nc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,zl=t,J===null&&(Wl=1,Xs(e,Si(t,e.current)))}function wu(){var e=to.current;return e===null?!0:(Y&4194048)===Y?no===null:(Y&62914560)===Y||Y&536870912?e===no:!1}function Tu(){var e=O.H;return O.H=Rs,e===null?Rs:e}function Eu(){var e=O.A;return O.A=Ll,e}function Du(){Wl=4,Bl||(Y&4194048)!==Y&&to.current!==null||(Vl=!0),!(Gl&134217727)&&!(Kl&134217727)||q===null||yu(q,Y,Jl,!1)}function Ou(e,t,n){var r=K;K|=2;var i=Tu(),a=Eu();(q!==e||Y!==t)&&(nu=null,Su(e,t)),t=!1;var o=Wl;a:do try{if(X!==0&&J!==null){var s=J,c=zl;switch(X){case 8:xu(),o=6;break a;case 3:case 2:case 9:case 6:to.current===null&&(t=!0);var l=X;if(X=0,zl=null,Pu(e,s,c,l),n&&Vl){o=0;break a}break;default:l=X,X=0,zl=null,Pu(e,s,c,l)}}ku(),o=Wl;break}catch(t){Cu(e,t)}while(1);return t&&e.shellSuspendCounter++,V=Gi=null,K=r,O.H=i,O.A=a,J===null&&(q=null,Y=0,ii()),o}function ku(){for(;J!==null;)Mu(J)}function Au(e,t){var n=K;K|=2;var r=Tu(),a=Eu();q!==e||Y!==t?(nu=null,tu=Ne()+500,Su(e,t)):Vl=et(e,t);a:do try{if(X!==0&&J!==null){t=J;var o=zl;b:switch(X){case 1:X=0,zl=null,Pu(e,t,o,1);break;case 2:case 9:if(wa(o)){X=0,zl=null,Nu(t);break}t=function(){X!==2&&X!==9||q!==e||(X=7),rd(e)},o.then(t,t);break a;case 3:X=7;break a;case 4:X=5;break a;case 7:wa(o)?(X=0,zl=null,Nu(t)):(X=0,zl=null,Pu(e,t,o,7));break;case 5:var s=null;switch(J.tag){case 26:s=J.memoizedState;case 5:case 27:var c=J;if(s?Wf(s):c.stateNode.complete){X=0,zl=null;var l=c.sibling;if(l!==null)J=l;else{var u=c.return;u===null?J=null:(J=u,Fu(u))}break b}}X=0,zl=null,Pu(e,t,o,5);break;case 6:X=0,zl=null,Pu(e,t,o,6);break;case 8:xu(),Wl=6;break a;default:throw Error(i(462))}}ju();break}catch(t){Cu(e,t)}while(1);return V=Gi=null,O.H=r,O.A=a,K=n,J===null?(q=null,Y=0,ii(),Wl):0}function ju(){for(;J!==null&&!je();)Mu(J)}function Mu(e){var t=Mc(e.alternate,e,Ul);e.memoizedProps=e.pendingProps,t===null?Fu(e):J=t}function Nu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=gc(n,t,t.pendingProps,t.type,void 0,Y);break;case 11:t=gc(n,t,t.pendingProps,t.type.render,t.ref,Y);break;case 5:Oo(t);default:Bc(n,t),t=J=hi(t,Ul),t=Mc(n,t,Ul)}e.memoizedProps=e.pendingProps,t===null?Fu(e):J=t}function Pu(e,t,n,r){V=Gi=null,Oo(t),Aa=null,ja=0;var i=t.return;try{if(tc(e,i,t,n,Y)){Wl=1,Xs(e,Si(n,e.current)),J=null;return}}catch(t){if(i!==null)throw J=i,t;Wl=1,Xs(e,Si(n,e.current)),J=null;return}t.flags&32768?(L||r===1?e=!0:Vl||Y&536870912?e=!1:(Bl=e=!0,(r===2||r===9||r===3||r===6)&&(r=to.current,r!==null&&r.tag===13&&(r.flags|=16384))),Iu(t,e)):Fu(t)}function Fu(e){var t=e;do{if(t.flags&32768){Iu(t,Bl);return}e=t.return;var n=Rc(t.alternate,t,Ul);if(n!==null){J=n;return}if(t=t.sibling,t!==null){J=t;return}J=t=e}while(t!==null);Wl===0&&(Wl=5)}function Iu(e,t){do{var n=zc(e.alternate,e);if(n!==null){n.flags&=32767,J=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){J=e;return}J=e=n}while(e!==null);Wl=6,J=null}function Lu(e,t,n,r,a,o,s,c,l){e.cancelPendingCommit=null;do Hu();while(iu!==0);if(K&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));if(o=t.lanes|t.childLanes,o|=ri,at(e,n,o,s,c,l),e===q&&(J=q=null,Y=0),ou=t,au=e,su=n,cu=o,lu=a,uu=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Xu(Le,function(){return Uu(),null})):(e.callbackNode=null,e.callbackPriority=0),r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=O.T,O.T=null,a=k.p,k.p=2,s=K,K|=4;try{al(e,t,n)}finally{K=s,k.p=a,O.T=r}}iu=1,Ru(),zu(),Bu()}}function Ru(){if(iu===1){iu=0;var e=au,t=ou,n=!!(t.flags&13878);if(t.subtreeFlags&13878||n){n=O.T,O.T=null;var r=k.p;k.p=2;var i=K;K|=4;try{_l(t,e);var a=zd,o=jr(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Ar(s.ownerDocument.documentElement,s)){if(c!==null&&Mr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=kr(s,h),v=kr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!Rd,zd=Rd=null}finally{K=i,k.p=r,O.T=n}}e.current=t,iu=2}}function zu(){if(iu===2){iu=0;var e=au,t=ou,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=O.T,O.T=null;var r=k.p;k.p=2;var i=K;K|=4;try{ol(e,t.alternate,t)}finally{K=i,k.p=r,O.T=n}}iu=3}}function Bu(){if(iu===4||iu===3){iu=0,Me();var e=au,t=ou,n=su,r=uu;t.subtreeFlags&10256||t.flags&10256?iu=5:(iu=0,ou=au=null,Vu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(ru=null),ut(n),t=t.stateNode,Ue&&typeof Ue.onCommitFiberRoot==`function`)try{Ue.onCommitFiberRoot(He,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=O.T,i=k.p,k.p=2,O.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{O.T=t,k.p=i}}su&3&&Hu(),rd(e),i=e.pendingLanes,n&261930&&i&42?e===fu?du++:(du=0,fu=e):du=0,id(0,!1)}}function Vu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,sa(t)))}function Hu(){return Ru(),zu(),Bu(),Uu()}function Uu(){if(iu!==5)return!1;var e=au,t=cu;cu=0;var n=ut(su),r=O.T,a=k.p;try{k.p=32>n?32:n,O.T=null,n=lu,lu=null;var o=au,s=su;if(iu=0,ou=au=null,su=0,K&6)throw Error(i(331));var c=K;if(K|=4,Pl(o.current),El(o,o.current,s,n),K=c,id(0,!1),Ue&&typeof Ue.onPostCommitFiberRoot==`function`)try{Ue.onPostCommitFiberRoot(He,o)}catch{}return!0}finally{k.p=a,O.T=r,Vu(e,t)}}function Wu(e,t,n){t=Si(n,t),t=Qs(e.stateNode,t,2),e=Ha(e,t,2),e!==null&&(it(e,2),rd(e))}function Z(e,t,n){if(e.tag===3)Wu(e,e,n);else for(;t!==null;){if(t.tag===3){Wu(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(ru===null||!ru.has(r))){e=Si(n,e),n=$s(2),r=Ha(t,n,2),r!==null&&(ec(n,r,t,e),it(r,2),rd(r));break}}t=t.return}}function Gu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Rl;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Hl=!0,i.add(n),e=Ku.bind(null,e,t,n),t.then(e,e))}function Ku(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,q===e&&(Y&n)===n&&(Wl===4||Wl===3&&(Y&62914560)===Y&&300>Ne()-$l?!(K&2)&&Su(e,0):ql|=n,Yl===Y&&(Yl=0)),rd(e)}function qu(e,t){t===0&&(t=nt()),e=si(e,t),e!==null&&(it(e,t),rd(e))}function Ju(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),qu(e,n)}function Yu(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),qu(e,n)}function Xu(e,t){return ke(e,t)}var Zu=null,Qu=null,$u=!1,ed=!1,td=!1,nd=0;function rd(e){e!==Qu&&e.next===null&&(Qu===null?Zu=Qu=e:Qu=Qu.next=e),ed=!0,$u||($u=!0,ud())}function id(e,t){if(!td&&ed){td=!0;do for(var n=!1,r=Zu;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-Ge(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,ld(r,a))}else a=Y,a=$e(r,r===q?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||et(r,a)||(n=!0,ld(r,a))}r=r.next}while(n);td=!1}}function ad(){od()}function od(){ed=$u=!1;var e=0;nd!==0&&Gd()&&(e=nd);for(var t=Ne(),n=null,r=Zu;r!==null;){var i=r.next,a=sd(r,t);a===0?(r.next=null,n===null?Zu=i:n.next=i,i===null&&(Qu=n)):(n=r,(e!==0||a&3)&&(ed=!0)),r=i}iu!==0&&iu!==5||id(e,!1),nd!==0&&(nd=0)}function sd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-Ge(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=tt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=q,n=Y,n=$e(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(X===2||X===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Ae(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||et(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Ae(r),ut(n)){case 2:case 8:n=Ie;break;case 32:n=Le;break;case 268435456:n=ze;break;default:n=Le}return r=cd.bind(null,e),n=ke(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Ae(r),e.callbackPriority=2,e.callbackNode=null,2}function cd(e,t){if(iu!==0&&iu!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Hu()&&e.callbackNode!==n)return null;var r=Y;return r=$e(e,e===q?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(gu(e,r,t),sd(e,Ne()),e.callbackNode!=null&&e.callbackNode===n?cd.bind(null,e):null)}function ld(e,t){if(Hu())return null;gu(e,t,!0)}function ud(){Yd(function(){K&6?ke(Fe,ad):od()})}function dd(){if(nd===0){var e=ua;e===0&&(e=Ye,Ye<<=1,!(Ye&261888)&&(Ye=256)),nd=e}return nd}function fd(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:sn(``+e)}function pd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function md(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=fd((i[ht]||null).action),o=r.submitter;o&&(t=(t=o[ht]||null)?fd(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new kn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(nd!==0){var e=o?pd(i,o):new FormData(i);ws(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?pd(i,o):new FormData(i),ws(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var hd=0;hd<Qr.length;hd++){var gd=Qr[hd];$r(gd.toLowerCase(),`on`+(gd[0].toUpperCase()+gd.slice(1)))}$r(Wr,`onAnimationEnd`),$r(Gr,`onAnimationIteration`),$r(Kr,`onAnimationStart`),$r(`dblclick`,`onDoubleClick`),$r(`focusin`,`onFocus`),$r(`focusout`,`onBlur`),$r(qr,`onTransitionRun`),$r(Jr,`onTransitionStart`),$r(Yr,`onTransitionCancel`),$r(Xr,`onTransitionEnd`),jt(`onMouseEnter`,[`mouseout`,`mouseover`]),jt(`onMouseLeave`,[`mouseout`,`mouseover`]),jt(`onPointerEnter`,[`pointerout`,`pointerover`]),jt(`onPointerLeave`,[`pointerout`,`pointerover`]),At(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),At(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),At(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),At(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),At(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),At(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var _d=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),vd=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(_d));function yd(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ei(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ei(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[_t];n===void 0&&(n=t[_t]=new Set);var r=e+`__bubble`;n.has(r)||(Cd(t,e,2,!1),n.add(r))}function bd(e,t,n){var r=0;t&&(r|=4),Cd(n,e,r,t)}var xd=`_reactListening`+Math.random().toString(36).slice(2);function Sd(e){if(!e[xd]){e[xd]=!0,Ot.forEach(function(t){t!==`selectionchange`&&(vd.has(t)||bd(t,!1,e),bd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[xd]||(t[xd]=!0,bd(`selectionchange`,!1,t))}}function Cd(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!vn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function wd(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=Ct(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}hn(function(){var r=a,i=un(n),s=[];a:{var c=Zr.get(e);if(c!==void 0){var l=kn,u=e;switch(e){case`keypress`:if(wn(n)===0)break a;case`keydown`:case`keyup`:l=Kn;break;case`focusin`:u=`focus`,l=Rn;break;case`focusout`:u=`blur`,l=Rn;break;case`beforeblur`:case`afterblur`:l=Rn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=In;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Ln;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=Jn;break;case Wr:case Gr:case Kr:l=zn;break;case Xr:l=Yn;break;case`scroll`:case`scrollend`:l=jn;break;case`wheel`:l=Xn;break;case`copy`:case`cut`:case`paste`:l=Bn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=qn;break;case`toggle`:case`beforetoggle`:l=Zn}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=gn(m,p),g!=null&&d.push(Td(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(c=e===`mouseover`||e===`pointerover`,l=e===`mouseout`||e===`pointerout`,c&&n!==ln&&(u=n.relatedTarget||n.fromElement)&&(Ct(u)||u[gt]))break a;if((l||c)&&(c=i.window===i?i:(c=i.ownerDocument)?c.defaultView||c.parentWindow:window,l?(u=n.relatedTarget||n.toElement,l=r,u=u?Ct(u):null,u!==null&&(f=o(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(l=null,u=r),l!==u)){if(d=In,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=qn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=l==null?c:Tt(l),h=u==null?c:Tt(u),c=new d(g,m+`leave`,l,n,i),c.target=f,c.relatedTarget=h,g=null,Ct(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,l&&u)b:{for(d=Dd,p=l,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;l!==null&&Od(s,c,l,d,!1),u!==null&&f!==null&&Od(s,f,u,d,!0)}}a:{if(c=r?Tt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var v=mr;else if(P(c)){if(hr)v=wr;else{v=Sr;var y=xr}}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&rn(r.elementType)&&(v=mr):v=Cr;if(v&&=v(e,r)){lr(s,v,n,i);break a}y&&y(e,c,r),e===`focusout`&&r&&c.type===`number`&&r.memoizedProps.value!=null&&Yt(c,`number`,c.value)}switch(y=r?Tt(r):window,e){case`focusin`:(P(y)||y.contentEditable===`true`)&&(Pr=y,Fr=r,Ir=null);break;case`focusout`:Ir=Fr=Pr=null;break;case`mousedown`:Lr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Lr=!1,Rr(s,n,i);break;case`selectionchange`:if(Nr)break;case`keydown`:case`keyup`:Rr(s,n,i)}var b;if($n)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else M?ar(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(nr&&n.locale!==`ko`&&(M||x!==`onCompositionStart`?x===`onCompositionEnd`&&M&&(b=Cn()):(bn=i,xn=`value`in bn?bn.value:bn.textContent,M=!0)),y=Ed(r,x),0<y.length&&(x=new Vn(x,e,null,n,i),s.push({event:x,listeners:y}),b?x.data=b:(b=or(n),b!==null&&(x.data=b)))),(b=tr?sr(e,n):cr(e,n))&&(x=Ed(r,`onBeforeInput`),0<x.length&&(y=new Vn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:y,listeners:x}),y.data=b)),md(s,e,r,n,i)}yd(s,t)})}function Td(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ed(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=gn(e,n),i!=null&&r.unshift(Td(e,i,a)),i=gn(e,t),i!=null&&r.push(Td(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Dd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Od(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=gn(n,a),l!=null&&o.unshift(Td(n,l,c))):i||(l=gn(n,a),l!=null&&o.push(Td(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var kd=/\r\n?/g,Ad=/\u0000|\uFFFD/g;function jd(e){return(typeof e==`string`?e:``+e).replace(kd,`
`).replace(Ad,``)}function Md(e,t){return t=jd(t),jd(e)===t}function $(e,t,n,r,a,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||$t(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&$t(e,``+r);break;case`className`:Lt(e,`class`,r);break;case`tabIndex`:Lt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Lt(e,n,r);break;case`style`:nn(e,r,o);break;case`data`:if(t!==`object`){Lt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=sn(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,a.name,a,null),$(e,t,`formEncType`,a.formEncType,a,null),$(e,t,`formMethod`,a.formMethod,a,null),$(e,t,`formTarget`,a.formTarget,a,null)):($(e,t,`encType`,a.encType,a,null),$(e,t,`method`,a.method,a,null),$(e,t,`target`,a.target,a,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=sn(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=cn);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=sn(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),It(e,`popover`,r);break;case`xlinkActuate`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:It(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=an.get(n)||n,It(e,n,r))}}function Nd(e,t,n,r,a,o){switch(n){case`style`:nn(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?$t(e,r):(typeof r==`number`||typeof r==`bigint`)&&$t(e,``+r);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=cn);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!kt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),t=n.slice(2,a?n.length-7:void 0),o=e[ht]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,a),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,a);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):It(e,n,r)}}}function Pd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,o,s,n,null)}}a&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:$(e,t,r,d,n,null)}}Jt(e,o,c,l,u,s,a,!1);return;case`select`:for(a in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Xt(e,!!r,n,!0):Xt(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:$(e,t,s,c,n,null)}Qt(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<_d.length;r++)Q(_d[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,u,r,n,null)}return;default:if(rn(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Nd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}function Fd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:a=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}qt(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&$(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Xt(e,!!n,n?[]:``,!1):Xt(e,!!n,t,!0)):Xt(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:p=a;break;case`defaultValue`:m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&$(e,t,s,a,r,o)}Zt(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(rn(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Nd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Nd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function Id(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ld(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Id(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Id(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Rd=null,zd=null;function Bd(e){return e.nodeType===9?e:e.ownerDocument}function Vd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Hd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Ud(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Wd=null;function Gd(){var e=window.event;return e&&e.type===`popstate`?e!==Wd&&(Wd=e,!0):(Wd=null,!1)}var Kd=typeof setTimeout==`function`?setTimeout:void 0,qd=typeof clearTimeout==`function`?clearTimeout:void 0,Jd=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:Jd===void 0?Kd:function(e){return Jd.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[xt]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body)}n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),St(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[xt])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Bd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);St(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=k.d;k.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=bu();return e||t}function yf(e){var t=wt(e);t!==null&&t.tag===5&&t.type===`form`?Es(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=Kt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Pd(t,`link`,e),Dt(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+Kt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+Kt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+Kt(n.imageSizes)+`"]`)):i+=`[href="`+Kt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=m({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),Pd(t,`link`,e),Dt(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+Kt(r)+`"][href="`+Kt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=m({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),Pd(r,`link`,e),Dt(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=Et(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=m({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);Dt(c),Pd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=Et(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),Dt(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=Et(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),Dt(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var a=(a=he.current)?gf(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=Et(a).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var o=Et(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(jf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),o||Nf(a,e,n,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=Et(a).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Af(e){return`href="`+Kt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return m({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Pd(t,`link`,n),Dt(t),e.head.appendChild(t))}function Pf(e){return`[src="`+Kt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+Kt(n.href)+`"]`);if(r)return t.instance=r,Dt(r),r;var a=m({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),Dt(r),Pd(r,`style`,a),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Af(n.href);var o=e.querySelector(jf(a));if(o)return t.state.loading|=4,t.instance=o,Dt(o),o;r=Mf(n),(a=mf.get(a))&&Rf(r,a),o=(e.ownerDocument||e).createElement(`link`),Dt(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),Pd(o,`link`,r),t.state.loading|=4,Lf(o,n.precedence,e),t.instance=o;case`script`:return o=Pf(n.src),(a=e.querySelector(Ff(o)))?(t.instance=a,Dt(a),a):(r=n,(a=mf.get(o))&&(r=m({},n),zf(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),Dt(a),Pd(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[xt]||a[mt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,Dt(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),Dt(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Pd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Ld());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:S,Provider:null,Consumer:null,_currentValue:ce,_currentValue2:ce,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=rt(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=rt(0),this.hiddenUpdates=rt(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=fi(3,null,null,t),e.current=a,a.stateNode=e,t=oa(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},za(a),e}function tp(e){return e?(e=ui,e):ui}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=Va(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=Ha(e,r,t),n!==null&&(hu(n,e,t),Ua(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=si(e,67108864);t!==null&&hu(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=pu();t=lt(t);var n=si(e,t);n!==null&&hu(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=O.T;O.T=null;var a=k.p;try{k.p=2,up(e,t,n,r)}finally{k.p=a,O.T=i}}function lp(e,t,n,r){var i=O.T;O.T=null;var a=k.p;try{k.p=8,up(e,t,n,r)}finally{k.p=a,O.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)wd(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=wt(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=Qe(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-Ge(o);s.entanglements[1]|=c,o&=~c}rd(a),!(K&6)&&(tu=Ne()+500,id(0,!1))}}break;case 31:case 13:s=si(a,2),s!==null&&hu(s,a,2),bu(),ip(a,2)}if(a=dp(r),a===null&&wd(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else wd(e,t,r,null,n)}}function dp(e){return e=un(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=Ct(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Pe()){case Fe:return 2;case Ie:return 8;case Le:case Re:return 32;case ze:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=wt(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=Ct(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,ft(e.priority,function(){op(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,ft(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ln=r,n.target.dispatchEvent(r),ln=null}else return t=wt(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=wt(n);a!==null&&(e.splice(t,3),t-=3,ws(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[ht]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[ht]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;np(n,pu(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),bu(),t[gt]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=dt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=n.version;if(Lp!==`19.2.8`)throw Error(i(527,Lp,`19.2.8`));k.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:f(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.8`,rendererPackageName:`react-dom`,currentDispatcherRef:O,reconcilerVersion:`19.2.8`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{He=zp.inject(Rp),Ue=zp}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=qs,s=Js,c=Ys;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,o,s,c,Pp),e[gt]=t.current,Sd(e),new Fp(t)}})),_=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()})),v=l(d(),1),y=_(),b=`modulepreload`,x=function(e){return`/GenAI-Architect-Playbook/`+e},ee={},S=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=x(t,n),t=s(t),t in ee)return;ee[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:b,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},C=/^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i,w=/^[\\/]{2}/;function T(e,t){return t+e.replace(/\\/g,`/`)}var te=`popstate`;function E(e){return typeof e==`object`&&!!e&&`pathname`in e&&`search`in e&&`hash`in e&&`state`in e&&`key`in e}function ne(e={}){function t(e,t){let n=t.state?.masked,{pathname:r,search:i,hash:a}=n||e.location;return oe(``,{pathname:r,search:i,hash:a},t.state&&t.state.usr||null,t.state&&t.state.key||`default`,n?{pathname:e.location.pathname,search:e.location.search,hash:e.location.hash}:void 0)}function n(e,t){return typeof t==`string`?t:se(t)}return k(t,n,null,e)}function D(e,t){if(e===!1||e==null)throw Error(t)}function re(e,t){if(!e){typeof console<`u`&&console.warn(t);try{throw Error(t)}catch{}}}function ie(){return Math.random().toString(36).substring(2,10)}function ae(e,t){return{usr:e.state,key:e.key,idx:t,masked:e.mask?{pathname:e.pathname,search:e.search,hash:e.hash}:void 0}}function oe(e,t,n=null,r,i){return{pathname:typeof e==`string`?e:e.pathname,search:``,hash:``,...typeof t==`string`?O(t):t,state:n,key:t&&t.key||r||ie(),mask:i}}function se({pathname:e=`/`,search:t=``,hash:n=``}){return t&&t!==`?`&&(e+=t.charAt(0)===`?`?t:`?`+t),n&&n!==`#`&&(e+=n.charAt(0)===`#`?n:`#`+n),e}function O(e){let t={};if(e){let n=e.indexOf(`#`);n>=0&&(t.hash=e.substring(n),e=e.substring(0,n));let r=e.indexOf(`?`);r>=0&&(t.search=e.substring(r),e=e.substring(0,r)),e&&(t.pathname=e)}return t}function k(e,t,n,r={}){let{window:i=document.defaultView,v5Compat:a=!1}=r,o=i.history,s=`POP`,c=null,l=u();l??(l=0,o.replaceState({...o.state,idx:l},``));function u(){return(o.state||{idx:null}).idx}function d(){s=`POP`;let e=u(),t=e==null?null:e-l;l=e,c&&c({action:s,location:h.location,delta:t})}function f(e,t){s=`PUSH`;let r=E(e)?e:oe(h.location,e,t);n&&n(r,e),l=u()+1;let d=ae(r,l),f=h.createHref(r.mask||r);try{o.pushState(d,``,f)}catch(e){if(e instanceof DOMException&&e.name===`DataCloneError`)throw e;i.location.assign(f)}a&&c&&c({action:s,location:h.location,delta:1})}function p(e,t){s=`REPLACE`;let r=E(e)?e:oe(h.location,e,t);n&&n(r,e),l=u();let i=ae(r,l),d=h.createHref(r.mask||r);o.replaceState(i,``,d),a&&c&&c({action:s,location:h.location,delta:0})}function m(e){return ce(i,e)}let h={get action(){return s},get location(){return e(i,o)},listen(e){if(c)throw Error(`A history only accepts one active listener`);return i.addEventListener(te,d),c=e,()=>{i.removeEventListener(te,d),c=null}},createHref(e){return t(i,e)},createURL:m,encodeLocation(e){let t=m(e);return{pathname:t.pathname,search:t.search,hash:t.hash}},push:f,replace:p,go(e){return o.go(e)}};return h}function ce(e,t,n=!1){let r=`http://localhost`;e&&(r=e.location.origin===`null`?e.location.href:e.location.origin),D(r,`No window.location.(origin|href) available to create URL`);let i=typeof t==`string`?t:se(t);return i=i.replace(/ $/,`%20`),!n&&w.test(i)&&(i=r+i),new URL(i,r)}function le(e,t,n=`/`){return ue(e,t,n,!1)}function ue(e,t,n,r,i){let a=Oe((typeof t==`string`?O(t):t).pathname||`/`,n);if(a==null)return null;let o=i??de(e),s=null,c=De(a);for(let e=0;s==null&&e<o.length;++e)s=Ce(o[e],c,r);return s}function de(e){let t=fe(e);return pe(t),t}function fe(e,t=[],n=[],r=``,i=!1){let a=(e,a,o=i,s)=>{let c={relativePath:s===void 0?e.path||``:s,caseSensitive:e.caseSensitive===!0,childrenIndex:a,route:e};if(c.relativePath.startsWith(`/`)){if(!c.relativePath.startsWith(r)&&o)return;D(c.relativePath.startsWith(r),`Absolute route path "${c.relativePath}" nested under path "${r}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),c.relativePath=c.relativePath.slice(r.length)}let l=Ie([r,c.relativePath]),u=n.concat(c);e.children&&e.children.length>0&&(D(e.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${l}".`),fe(e.children,t,u,l,o)),!(e.path==null&&!e.index)&&t.push({path:l,score:xe(l,e.index),routesMeta:u.map((e,t)=>{let[n,r]=Ee(e.relativePath,e.caseSensitive,t===u.length-1);return{...e,matcher:n,compiledParams:r}})})};return e.forEach((e,t)=>{if(e.path===``||!e.path?.includes(`?`))a(e,t);else for(let n of A(e.path))a(e,t,!0,n)}),t}function A(e){let t=e.split(`/`);if(t.length===0)return[];let[n,...r]=t,i=n.endsWith(`?`),a=n.replace(/\?$/,``);if(r.length===0)return i?[a,``]:[a];let o=A(r.join(`/`)),s=[];return s.push(...o.map(e=>e===``?a:[a,e].join(`/`))),i&&s.push(...o),s.map(t=>e.startsWith(`/`)&&t===``?`/`:t)}function pe(e){e.sort((e,t)=>e.score===t.score?Se(e.routesMeta.map(e=>e.childrenIndex),t.routesMeta.map(e=>e.childrenIndex)):t.score-e.score)}var me=/^:[\w-]+$/,he=3,ge=2,_e=1,ve=10,ye=-2,be=e=>e===`*`;function xe(e,t){let n=e.split(`/`),r=n.length;return n.some(be)&&(r+=ye),t&&(r+=ge),n.filter(e=>!be(e)).reduce((e,t)=>e+(me.test(t)?he:t===``?_e:ve),r)}function Se(e,t){return e.length===t.length&&e.slice(0,-1).every((e,n)=>e===t[n])?e[e.length-1]-t[t.length-1]:0}function Ce(e,t,n=!1){let{routesMeta:r}=e,i={},a=`/`,o=[];for(let e=0;e<r.length;++e){let s=r[e],c=e===r.length-1,l=a===`/`?t:t.slice(a.length)||`/`,u={path:s.relativePath,caseSensitive:s.caseSensitive,end:c},d=s.matcher&&s.compiledParams?Te(u,l,s.matcher,s.compiledParams):we(u,l),f=s.route;if(!d&&c&&n&&!r[r.length-1].route.index&&(d=we({path:s.relativePath,caseSensitive:s.caseSensitive,end:!1},l)),!d)return null;Object.assign(i,d.params),o.push({params:i,pathname:Ie([a,d.pathname]),pathnameBase:Re(Ie([a,d.pathnameBase])),route:f}),d.pathnameBase!==`/`&&(a=Ie([a,d.pathnameBase]))}return o}function we(e,t){typeof e==`string`&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=Ee(e.path,e.caseSensitive,e.end);return Te(e,t,n,r)}function Te(e,t,n,r){let i=t.match(n);if(!i)return null;let a=i[0],o=Le(a,1),s=i.slice(1);return{params:r.reduce((e,{paramName:t,isOptional:n},r)=>{if(t===`*`){let e=s[r]||``;o=Le(a.slice(0,a.length-e.length),1)}let i=s[r];return e[t]=n&&!i?void 0:(i||``).replace(/%2F/g,`/`),e},{}),pathname:a,pathnameBase:o,pattern:e}}function Ee(e,t=!1,n=!0){re(e===`*`||!e.endsWith(`*`)||e.endsWith(`/*`),`Route path "${e}" will be treated as if it were "${e.replace(/\*$/,`/*`)}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/,`/*`)}".`);let r=[],i=`^`+e.replace(/\/*\*?$/,``).replace(/^\/*/,`/`).replace(/[\\.*+^${}|()[\]]/g,`\\$&`).replace(/\/:([\w-]+)(\?)?/g,(e,t,n,i,a)=>{if(r.push({paramName:t,isOptional:n!=null}),n){let t=a.charAt(i+e.length);return t&&t!==`/`?`/([^\\/]*)`:`(?:/([^\\/]*))?`}return`/([^\\/]+)`}).replace(/\/([\w-]+)\?(\/|$)/g,`(/$1)?$2`);return e.endsWith(`*`)?(r.push({paramName:`*`}),i+=e===`*`||e===`/*`?`(.*)$`:`(?:\\/(.+)|\\/*)$`):n?i+=`\\/*$`:e!==``&&e!==`/`&&(i+=`(?:(?=\\/|$))`),[new RegExp(i,t?void 0:`i`),r]}function De(e){try{return e.split(`/`).map(e=>decodeURIComponent(e).replace(/\//g,`%2F`)).join(`/`)}catch(t){return re(!1,`The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`),e}}function Oe(e,t){if(t===`/`)return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith(`/`)?t.length-1:t.length,r=e.charAt(n);return r&&r!==`/`?null:e.slice(n)||`/`}function ke(e,t=`/`){let{pathname:n,search:r=``,hash:i=``}=typeof e==`string`?O(e):e,a;return n?(n=Fe(n),a=n.startsWith(`/`)||n.startsWith(`\\`)?Ae(n.substring(1),`/`):Ae(n,t)):a=t,{pathname:a,search:ze(r),hash:Be(i)}}function Ae(e,t){let n=Le(t).split(`/`);return e.split(`/`).forEach(e=>{e===`..`?n.length>1&&n.pop():e!==`.`&&n.push(e)}),n.length>1?n.join(`/`):`/`}function je(e,t,n,r){return`Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(r)}].  Please separate it out to the \`to.${n}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function Me(e){return e.filter((e,t)=>t===0||e.route.path&&e.route.path.length>0)}function Ne(e){let t=Me(e);return t.map((e,n)=>n===t.length-1?e.pathname:e.pathnameBase)}function Pe(e,t,n,r=!1){let i;typeof e==`string`?i=O(e):(i={...e},D(!i.pathname||!i.pathname.includes(`?`),je(`?`,`pathname`,`search`,i)),D(!i.pathname||!i.pathname.includes(`#`),je(`#`,`pathname`,`hash`,i)),D(!i.search||!i.search.includes(`#`),je(`#`,`search`,`hash`,i)));let a=e===``||i.pathname===``,o=a?`/`:i.pathname,s;if(o==null)s=n;else{let e=t.length-1;if(!r&&o.startsWith(`..`)){let t=o.split(`/`);for(;t[0]===`..`;)t.shift(),--e;i.pathname=t.join(`/`)}s=e>=0?t[e]:`/`}let c=ke(i,s),l=o&&o!==`/`&&o.endsWith(`/`),u=(a||o===`.`)&&n.endsWith(`/`);return!c.pathname.endsWith(`/`)&&(l||u)&&(c.pathname+=`/`),c}var Fe=e=>e.replace(/[\\/]{2,}/g,`/`),Ie=e=>Fe(e.join(`/`));function Le(e,t=0){let n=e.length;for(;n>t&&e.charCodeAt(n-1)===47;)n--;return n===e.length?e:e.slice(0,n)}var Re=e=>Le(e).replace(/^\/*/,`/`),ze=e=>!e||e===`?`?``:e.startsWith(`?`)?e:`?`+e,Be=e=>!e||e===`#`?``:e.startsWith(`#`)?e:`#`+e,Ve=class{constructor(e,t,n,r=!1){this.status=e,this.statusText=t||``,this.internal=r,n instanceof Error?(this.data=n.toString(),this.error=n):this.data=n}};function He(e){return e!=null&&typeof e.status==`number`&&typeof e.statusText==`string`&&typeof e.internal==`boolean`&&`data`in e}function Ue(e){return Ie(e.map(e=>e.route.path).filter(Boolean))||`/`}var We=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0;function Ge(e,t){let n=e;if(typeof n!=`string`||!C.test(n))return{absoluteURL:void 0,isExternal:!1,to:n};let r=n,i=!1;if(We)try{let e=new URL(window.location.href),r=w.test(n)?new URL(T(n,e.protocol)):new URL(n),a=Oe(r.pathname,t);r.origin===e.origin&&a!=null?n=a+r.search+r.hash:i=!0}catch{re(!1,`<Link to="${n}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:r,isExternal:i,to:n}}Object.getOwnPropertyNames(Object.prototype).sort().join(`\0`);var Ke=new URL(`http://localhost`);function qe(e){if(e.createURL)return e.createURL(`/`);try{return new URL(e.createHref(`/`),Ke)}catch{return Ke}}function Je(e,t){return e.origin===t.origin&&(e.origin!==`null`||e.protocol===t.protocol&&e.host===t.host)}function Ye(e,t){if(e.startsWith(`//`))return!0;let n=t.protocol.toLowerCase();return e.toLowerCase().startsWith(n)?t.host===``||e.slice(n.length).startsWith(`//`):!1}function Xe(e,t,n,r){let i=null;try{i=e==null?null:new URL(e,n)}catch{}let a=new URL(t,n),o=i!=null&&!Je(i,n),s=!Je(a,n);if(r===`reject`){if(o||s)throw Error(`External navigation is not allowed`)}else if(s&&(i==null||!Ye(e,i)||!Je(i,a)))throw Error(`External navigation is not allowed`)}var Ze=[`POST`,`PUT`,`PATCH`,`DELETE`];new Set(Ze);var Qe=[`GET`,...Ze];new Set(Qe);var $e=[`about:`,`blob:`,`chrome:`,`chrome-untrusted:`,`content:`,`data:`,`devtools:`,`file:`,`filesystem:`,`javascript:`];function et(e){try{return $e.includes(new URL(e).protocol)}catch{return!1}}var tt=v.createContext(null);tt.displayName=`DataRouter`;var nt=v.createContext(null);nt.displayName=`DataRouterState`;var rt=v.createContext(!1);function it(){return v.useContext(rt)}var at=v.createContext({isTransitioning:!1});at.displayName=`ViewTransition`;var ot=v.createContext(new Map);ot.displayName=`Fetchers`;var st=v.createContext(null);st.displayName=`Await`;var ct=v.createContext(null);ct.displayName=`Navigation`;var lt=v.createContext(null);lt.displayName=`Location`;var ut=v.createContext({outlet:null,matches:[],isDataRoute:!1});ut.displayName=`Route`;var dt=v.createContext(null);dt.displayName=`RouteError`;var ft=`REACT_ROUTER_ERROR`,pt=`REDIRECT`,mt=`ROUTE_ERROR_RESPONSE`;function ht(e){if(e.startsWith(`${ft}:${pt}:{`))try{let t=JSON.parse(e.slice(28));if(typeof t==`object`&&t&&typeof t.status==`number`&&typeof t.statusText==`string`&&typeof t.location==`string`&&typeof t.reloadDocument==`boolean`&&typeof t.replace==`boolean`)return t}catch{}}function gt(e){if(e.startsWith(`${ft}:${mt}:{`))try{let t=JSON.parse(e.slice(40));if(typeof t==`object`&&t&&typeof t.status==`number`&&typeof t.statusText==`string`)return new Ve(t.status,t.statusText,t.data)}catch{}}function _t(e,{relative:t}={}){D(vt(),`useHref() may be used only in the context of a <Router> component.`);let{basename:n,navigator:r}=v.useContext(ct),{hash:i,pathname:a,search:o}=wt(e,{relative:t}),s=a;return n!==`/`&&(s=a===`/`?n:Ie([n,a])),r.createHref({pathname:s,search:o,hash:i})}function vt(){return v.useContext(lt)!=null}function yt(){return D(vt(),`useLocation() may be used only in the context of a <Router> component.`),v.useContext(lt).location}var bt=`You should call navigate() in a React.useEffect(), not when your component is first rendered.`;function xt(e){v.useContext(ct).static||v.useLayoutEffect(e)}function St(){let{isDataRoute:e}=v.useContext(ut);return e?Vt():Ct()}function Ct(){D(vt(),`useNavigate() may be used only in the context of a <Router> component.`);let e=v.useContext(tt),{basename:t,navigator:n}=v.useContext(ct),{matches:r}=v.useContext(ut),{pathname:i}=yt(),a=JSON.stringify(Ne(r)),o=v.useRef(!1);return xt(()=>{o.current=!0}),v.useCallback((r,s={})=>{if(re(o.current,bt),!o.current)return;if(typeof r==`number`){n.go(r);return}let c=Pe(r,JSON.parse(a),i,s.relative===`path`);e==null&&t!==`/`&&(c.pathname=c.pathname===`/`?t:Ie([t,c.pathname])),Xe(typeof r==`string`?r:se(r),n.createHref(c),qe(n),`reject`),(s.replace?n.replace:n.push)(c,s.state,s)},[t,n,a,i,e])}v.createContext(null);function wt(e,{relative:t}={}){let{matches:n}=v.useContext(ut),{pathname:r}=yt(),i=JSON.stringify(Ne(n));return v.useMemo(()=>Pe(e,JSON.parse(i),r,t===`path`),[e,i,r,t])}function Tt(e,t){return Et(e,t)}function Et(e,t,n){D(vt(),`useRoutes() may be used only in the context of a <Router> component.`);let{navigator:r}=v.useContext(ct),{matches:i}=v.useContext(ut),a=i[i.length-1],o=a?a.params:{},s=a?a.pathname:`/`,c=a?a.pathnameBase:`/`,l=a&&a.route;{let e=l&&l.path||``;Ut(s,!l||e.endsWith(`*`)||e.endsWith(`*?`),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${s}" (under <Route path="${e}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${e}"> to <Route path="${e===`/`?`*`:`${e}/*`}">.`)}let u=yt(),d;if(t){let e=typeof t==`string`?O(t):t;D(c===`/`||e.pathname?.startsWith(c),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${c}" but pathname "${e.pathname}" was given in the \`location\` prop.`),d=e}else d=u;let f=d.pathname||`/`,p=f;if(c!==`/`){let e=c.replace(/^\//,``).split(`/`);p=`/`+f.replace(/^\//,``).split(`/`).slice(e.length).join(`/`)}let m=n&&n.state.matches.length?n.state.matches.map(e=>Object.assign(e,{route:n.manifest[e.route.id]||e.route})):le(e,{pathname:p});re(l||m!=null,`No routes matched location "${d.pathname}${d.search}${d.hash}" `),re(m==null||m[m.length-1].route.element!==void 0||m[m.length-1].route.Component!==void 0||m[m.length-1].route.lazy!==void 0,`Matched leaf route at location "${d.pathname}${d.search}${d.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let h=Nt(m&&m.map(e=>Object.assign({},e,{params:Object.assign({},o,e.params),pathname:Ie([c,r.encodeLocation?r.encodeLocation(e.pathname.replace(/%/g,`%25`).replace(/\?/g,`%3F`).replace(/#/g,`%23`)).pathname:e.pathname]),pathnameBase:e.pathnameBase===`/`?c:Ie([c,r.encodeLocation?r.encodeLocation(e.pathnameBase.replace(/%/g,`%25`).replace(/\?/g,`%3F`).replace(/#/g,`%23`)).pathname:e.pathnameBase])})),i,n);return t&&h?v.createElement(lt.Provider,{value:{location:{pathname:`/`,search:``,hash:``,state:null,key:`default`,mask:void 0,...d},navigationType:`POP`}},h):h}function Dt(){let e=Bt(),t=He(e)?`${e.status} ${e.statusText}`:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,r=`rgba(200,200,200, 0.5)`,i={padding:`0.5rem`,backgroundColor:r},a={padding:`2px 4px`,backgroundColor:r},o=null;return console.error(`Error handled by React Router default ErrorBoundary:`,e),o=v.createElement(v.Fragment,null,v.createElement(`p`,null,`💿 Hey developer 👋`),v.createElement(`p`,null,`You can provide a way better UX than this when your app throws errors by providing your own `,v.createElement(`code`,{style:a},`ErrorBoundary`),` or`,` `,v.createElement(`code`,{style:a},`errorElement`),` prop on your route.`)),v.createElement(v.Fragment,null,v.createElement(`h2`,null,`Unexpected Application Error!`),v.createElement(`h3`,{style:{fontStyle:`italic`}},t),n?v.createElement(`pre`,{style:i},n):null,o)}var Ot=v.createElement(Dt,null),kt=class extends v.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,t){return t.location!==e.location||t.revalidation!==`idle`&&e.revalidation===`idle`?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error===void 0?t.error:e.error,location:t.location,revalidation:e.revalidation||t.revalidation}}componentDidCatch(e,t){this.props.onError?this.props.onError(e,t):console.error(`React Router caught the following error during render`,e)}render(){let e=this.state.error;if(this.context&&typeof e==`object`&&e&&`digest`in e&&typeof e.digest==`string`){let t=gt(e.digest);t&&(e=t)}let t=e===void 0?this.props.children:v.createElement(ut.Provider,{value:this.props.routeContext},v.createElement(dt.Provider,{value:e,children:this.props.component}));return this.context?v.createElement(jt,{error:e},t):t}};kt.contextType=rt;var At=new WeakMap;function jt({children:e,error:t}){let{basename:n,navigator:r}=v.useContext(ct);if(typeof t==`object`&&t&&`digest`in t&&typeof t.digest==`string`){let e=ht(t.digest);if(e){let i=At.get(t);if(i)throw i;let a=Ge(e.location,n),o=a.absoluteURL||a.to;if(Xe(e.location,o,qe(r),`allow-explicit`),et(o))throw Error(`Invalid redirect location`);if(We&&!At.get(t)){if(a.isExternal||e.reloadDocument)window.location.href=o;else{let n=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(a.to,{replace:e.replace}));throw At.set(t,n),n}}return v.createElement(`meta`,{httpEquiv:`refresh`,content:`0;url=${o}`})}}return e}function Mt({routeContext:e,match:t,children:n}){let r=v.useContext(tt);return r&&r.static&&r.staticContext&&(t.route.errorElement||t.route.ErrorBoundary)&&(r.staticContext._deepestRenderedBoundaryId=t.route.id),v.createElement(ut.Provider,{value:e},n)}function Nt(e,t=[],n){let r=n?.state;if(e==null){if(!r)return null;if(r.errors)e=r.matches;else if(t.length===0&&!r.initialized&&r.matches.length>0)e=r.matches;else return null}let i=e,a=r?.errors;if(a!=null){let e=i.findIndex(e=>e.route.id&&a?.[e.route.id]!==void 0);D(e>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(a).join(`,`)}`),i=i.slice(0,Math.min(i.length,e+1))}let o=!1,s=-1;if(n&&r){o=r.renderFallback;for(let e=0;e<i.length;e++){let t=i[e];if((t.route.HydrateFallback||t.route.hydrateFallbackElement)&&(s=e),t.route.id){let{loaderData:e,errors:a}=r,c=t.route.loader&&!e.hasOwnProperty(t.route.id)&&(!a||a[t.route.id]===void 0);if(t.route.lazy||c){n.isStatic&&(o=!0),i=s>=0?i.slice(0,s+1):[i[0]];break}}}}let c=n?.onError,l=r&&c?(e,t)=>{c(e,{location:r.location,params:r.matches?.[0]?.params??{},pattern:Ue(r.matches),errorInfo:t})}:void 0;return i.reduceRight((e,n,c)=>{let u,d=!1,f=null,p=null;r&&(u=a&&n.route.id?a[n.route.id]:void 0,f=n.route.errorElement||Ot,o&&(s<0&&c===0?(Ut(`route-fallback`,!1,"No `HydrateFallback` element provided to render during initial hydration"),d=!0,p=null):s===c&&(d=!0,p=n.route.hydrateFallbackElement||null)));let m=t.concat(i.slice(0,c+1)),h=()=>{let t;return t=u?f:d?p:n.route.Component?v.createElement(n.route.Component,null):n.route.element?n.route.element:e,v.createElement(Mt,{match:n,routeContext:{outlet:e,matches:m,isDataRoute:r!=null},children:t})};return r&&(n.route.ErrorBoundary||n.route.errorElement||c===0)?v.createElement(kt,{location:r.location,revalidation:r.revalidation,component:f,error:u,children:h(),routeContext:{outlet:null,matches:m,isDataRoute:!0},onError:l}):h()},null)}function Pt(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Ft(e){let t=v.useContext(tt);return D(t,Pt(e)),t}function It(e){let t=v.useContext(nt);return D(t,Pt(e)),t}function Lt(e){let t=v.useContext(ut);return D(t,Pt(e)),t}function Rt(e){let t=Lt(e),n=t.matches[t.matches.length-1];return D(n.route.id,`${e} can only be used on routes that contain a unique "id"`),n.route.id}function zt(){return Rt(`useRouteId`)}function Bt(){let e=v.useContext(dt),t=It(`useRouteError`),n=Rt(`useRouteError`);return e===void 0?t.errors?.[n]:e}function Vt(){let{router:e}=Ft(`useNavigate`),t=Rt(`useNavigate`),n=v.useRef(!1);return xt(()=>{n.current=!0}),v.useCallback(async(r,i={})=>{re(n.current,bt),n.current&&(typeof r==`number`?await e.navigate(r):await e.navigate(r,{fromRouteId:t,...i}))},[e,t])}var Ht={};function Ut(e,t,n){!t&&!Ht[e]&&(Ht[e]=!0,re(!1,n))}v.memo(Wt);function Wt({routes:e,manifest:t,future:n,state:r,isStatic:i,onError:a}){return Et(e,void 0,{manifest:t,state:r,isStatic:i,onError:a,future:n})}function Gt(e){D(!1,`A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.`)}function Kt({basename:e=`/`,children:t=null,location:n,navigationType:r=`POP`,navigator:i,static:a=!1,useTransitions:o}){D(!vt(),`You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`);let s=e.replace(/^\/*/,`/`),c=v.useMemo(()=>({basename:s,navigator:i,static:a,useTransitions:o,future:{}}),[s,i,a,o]);typeof n==`string`&&(n=O(n));let{pathname:l=`/`,search:u=``,hash:d=``,state:f=null,key:p=`default`,mask:m}=n,h=v.useMemo(()=>{let e=Oe(l,s);return e==null?null:{location:{pathname:e,search:u,hash:d,state:f,key:p,mask:m},navigationType:r}},[s,l,u,d,f,p,r,m]);return re(h!=null,`<Router basename="${s}"> is not able to match the URL "${l}${u}${d}" because it does not start with the basename, so the <Router> won't render anything.`),h==null?null:v.createElement(ct.Provider,{value:c},v.createElement(lt.Provider,{children:t,value:h}))}function qt({children:e,location:t}){return Tt(Jt(e),t)}v.Component;function Jt(e,t=[]){let n=[];return v.Children.forEach(e,(e,r)=>{if(!v.isValidElement(e))return;let i=[...t,r];if(e.type===v.Fragment){n.push.apply(n,Jt(e.props.children,i));return}D(e.type===Gt,`[${typeof e.type==`string`?e.type:e.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),D(!e.props.index||!e.props.children,`An index route cannot have child routes.`);let a={id:e.props.id||i.join(`-`),caseSensitive:e.props.caseSensitive,element:e.props.element,Component:e.props.Component,index:e.props.index,path:e.props.path,middleware:e.props.middleware,loader:e.props.loader,action:e.props.action,hydrateFallbackElement:e.props.hydrateFallbackElement,HydrateFallback:e.props.HydrateFallback,errorElement:e.props.errorElement,ErrorBoundary:e.props.ErrorBoundary,hasErrorBoundary:e.props.hasErrorBoundary===!0||e.props.ErrorBoundary!=null||e.props.errorElement!=null,shouldRevalidate:e.props.shouldRevalidate,handle:e.props.handle,lazy:e.props.lazy};e.props.children&&(a.children=Jt(e.props.children,i)),n.push(a)}),n}var Yt=`get`,Xt=`application/x-www-form-urlencoded`;function Zt(e){return typeof HTMLElement<`u`&&e instanceof HTMLElement}function Qt(e){return Zt(e)&&e.tagName.toLowerCase()===`button`}function $t(e){return Zt(e)&&e.tagName.toLowerCase()===`form`}function en(e){return Zt(e)&&e.tagName.toLowerCase()===`input`}function tn(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function nn(e,t){return e.button===0&&(!t||t===`_self`)&&!tn(e)}var rn=null;function an(){if(rn===null)try{new FormData(document.createElement(`form`),0),rn=!1}catch{rn=!0}return rn}var on=new Set([`application/x-www-form-urlencoded`,`multipart/form-data`,`text/plain`]);function sn(e){return e!=null&&!on.has(e)?(re(!1,`"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Xt}"`),null):e}function cn(e,t){let n,r,i,a,o;if($t(e)){let o=e.getAttribute(`action`);r=o?Oe(o,t):null,n=e.getAttribute(`method`)||Yt,i=sn(e.getAttribute(`enctype`))||Xt,a=new FormData(e)}else if(Qt(e)||en(e)&&(e.type===`submit`||e.type===`image`)){let o=e.form;if(o==null)throw Error(`Cannot submit a <button> or <input type="submit"> without a <form>`);let s=e.getAttribute(`formaction`)||o.getAttribute(`action`);if(r=s?Oe(s,t):null,n=e.getAttribute(`formmethod`)||o.getAttribute(`method`)||Yt,i=sn(e.getAttribute(`formenctype`))||sn(o.getAttribute(`enctype`))||Xt,a=new FormData(o,e),!an()){let{name:t,type:n,value:r}=e;if(n===`image`){let e=t?`${t}.`:``;a.append(`${e}x`,`0`),a.append(`${e}y`,`0`)}else t&&a.append(t,r)}}else if(Zt(e))throw Error(`Cannot submit element that is not <form>, <button>, or <input type="submit|image">`);else n=Yt,r=null,i=Xt,o=e;return a&&i===`text/plain`&&(o=a,a=void 0),{action:r,method:n.toLowerCase(),encType:i,formData:a,body:o}}Object.getOwnPropertyNames(Object.prototype).sort().join(`\0`);function ln(e,t){if(e===!1||e==null)throw Error(t)}function un(e,t,n,r){let i=typeof e==`string`?new URL(e,typeof window>`u`?`server://singlefetch/`:window.location.origin):e;return i.pathname=n?i.pathname.endsWith(`/`)?`${i.pathname}_.${r}`:`${i.pathname}.${r}`:i.pathname===`/`?`_root.${r}`:t&&Oe(i.pathname,t)===`/`?`${Le(t)}/_root.${r}`:`${Le(i.pathname)}.${r}`,i}async function dn(e,t){if(e.id in t)return t[e.id];try{let n=await S(()=>import(e.module),[]);return t[e.id]=n,n}catch(t){return console.error(`Error loading route module \`${e.module}\`, reloading page...`),console.error(t),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function fn(e){return e!=null&&typeof e.page==`string`}function pn(e){return e==null?!1:e.href==null?e.rel===`preload`&&typeof e.imageSrcSet==`string`&&typeof e.imageSizes==`string`:typeof e.rel==`string`&&typeof e.href==`string`}async function mn(e,t,n){return yn((await Promise.all(e.map(async e=>{let r=t.routes[e.route.id];if(r){let e=await dn(r,n);return e.links?e.links():[]}return[]}))).flat(1).filter(pn).filter(e=>e.rel===`stylesheet`||e.rel===`preload`).map(e=>e.rel===`stylesheet`?{...e,rel:`prefetch`,as:`style`}:{...e,rel:`prefetch`}))}function hn(e,t,n,r,i,a){let o=(e,t)=>!n[t]||e.route.id!==n[t].route.id,s=(e,t)=>n[t].pathname!==e.pathname||n[t].route.path?.endsWith(`*`)&&n[t].params[`*`]!==e.params[`*`];return a===`assets`?t.filter((e,t)=>o(e,t)||s(e,t)):a===`data`?t.filter((t,a)=>{let c=r.routes[t.route.id];if(!c||!c.hasLoader)return!1;if(o(t,a)||s(t,a))return!0;if(t.route.shouldRevalidate){let r=t.route.shouldRevalidate({currentUrl:new URL(i.pathname+i.search+i.hash,window.origin),currentParams:n[0]?.params||{},nextUrl:new URL(e,window.origin),nextParams:t.params,defaultShouldRevalidate:!0});if(typeof r==`boolean`)return r}return!0}):[]}function gn(e,t,{includeHydrateFallback:n}={}){return _n(e.map(e=>{let r=t.routes[e.route.id];if(!r)return[];let i=[r.module];return r.clientActionModule&&(i=i.concat(r.clientActionModule)),r.clientLoaderModule&&(i=i.concat(r.clientLoaderModule)),n&&r.hydrateFallbackModule&&(i=i.concat(r.hydrateFallbackModule)),r.imports&&(i=i.concat(r.imports)),i}).flat(1))}function _n(e){return[...new Set(e)]}function vn(e){let t={},n=Object.keys(e).sort();for(let r of n)t[r]=e[r];return t}function yn(e,t){let n=new Set,r=new Set(t);return e.reduce((e,i)=>{if(t&&!fn(i)&&i.as===`script`&&i.href&&r.has(i.href))return e;let a=JSON.stringify(vn(i));return n.has(a)||(n.add(a),e.push({key:a,link:i})),e},[])}function bn(){let e=v.useContext(tt);return ln(e,`You must render this element inside a <DataRouterContext.Provider> element`),e}function xn(){let e=v.useContext(nt);return ln(e,`You must render this element inside a <DataRouterStateContext.Provider> element`),e}var Sn=v.createContext(void 0);Sn.displayName=`FrameworkContext`;function Cn(){let e=v.useContext(Sn);return ln(e,`You must render this element inside a <HydratedRouter> element`),e}function wn(e,t){let n=v.useContext(Sn),[r,i]=v.useState(!1),[a,o]=v.useState(!1),{onFocus:s,onBlur:c,onMouseEnter:l,onMouseLeave:u,onTouchStart:d}=t,f=v.useRef(null);v.useEffect(()=>{if(e===`render`&&o(!0),e===`viewport`){let e=new IntersectionObserver(e=>{e.forEach(e=>{o(e.isIntersecting)})},{threshold:.5});return f.current&&e.observe(f.current),()=>{e.disconnect()}}},[e]),v.useEffect(()=>{if(r){let e=setTimeout(()=>{o(!0)},100);return()=>{clearTimeout(e)}}},[r]);let p=()=>{i(!0)},m=()=>{i(!1),o(!1)};return n?e===`intent`?[a,f,{onFocus:Tn(s,p),onBlur:Tn(c,m),onMouseEnter:Tn(l,p),onMouseLeave:Tn(u,m),onTouchStart:Tn(d,p)}]:[a,f,{}]:[!1,f,{}]}function Tn(e,t){return n=>{e&&e(n),n.defaultPrevented||t(n)}}function En({page:e,...t}){let n=it(),{nonce:r}=Cn(),{router:i}=bn(),a=v.useMemo(()=>le(i.routes,e,i.basename),[i.routes,e,i.basename]);return a?(t.nonce==null&&r&&(t={...t,nonce:r}),n?v.createElement(On,{page:e,matches:a,...t}):v.createElement(kn,{page:e,matches:a,...t})):null}function Dn(e){let{manifest:t,routeModules:n}=Cn(),[r,i]=v.useState([]);return v.useEffect(()=>{let r=!1;return mn(e,t,n).then(e=>{r||i(e)}),()=>{r=!0}},[e,t,n]),r}function On({page:e,matches:t,...n}){let r=yt(),{future:i}=Cn(),{basename:a}=bn(),o=v.useMemo(()=>{if(e===r.pathname+r.search+r.hash)return[];let n=un(e,a,i.v8_trailingSlashAwareDataRequests,`rsc`),o=!1,s=[];for(let e of t)typeof e.route.shouldRevalidate==`function`?o=!0:s.push(e.route.id);return o&&s.length>0&&n.searchParams.set(`_routes`,s.join(`,`)),[n.pathname+n.search]},[a,i.v8_trailingSlashAwareDataRequests,e,r,t]);return v.createElement(v.Fragment,null,o.map(e=>v.createElement(`link`,{key:e,rel:`prefetch`,as:`fetch`,href:e,...n})))}function kn({page:e,matches:t,...n}){let r=yt(),{future:i,manifest:a,routeModules:o}=Cn(),{basename:s}=bn(),{loaderData:c,matches:l}=xn(),u=v.useMemo(()=>hn(e,t,l,a,r,`data`),[e,t,l,a,r]),d=v.useMemo(()=>hn(e,t,l,a,r,`assets`),[e,t,l,a,r]),f=v.useMemo(()=>{if(e===r.pathname+r.search+r.hash)return[];let n=new Set,l=!1;if(t.forEach(e=>{let t=a.routes[e.route.id];!t||!t.hasLoader||(!u.some(t=>t.route.id===e.route.id)&&e.route.id in c&&o[e.route.id]?.shouldRevalidate||t.hasClientLoader?l=!0:n.add(e.route.id))}),n.size===0)return[];let d=un(e,s,i.v8_trailingSlashAwareDataRequests,`data`);return l&&n.size>0&&d.searchParams.set(`_routes`,t.filter(e=>n.has(e.route.id)).map(e=>e.route.id).join(`,`)),[d.pathname+d.search]},[s,i.v8_trailingSlashAwareDataRequests,c,r,a,u,t,e,o]),p=v.useMemo(()=>gn(d,a),[d,a]),m=Dn(d);return v.createElement(v.Fragment,null,f.map(e=>v.createElement(`link`,{key:e,rel:`prefetch`,as:`fetch`,href:e,...n})),p.map(e=>v.createElement(`link`,{key:e,rel:`modulepreload`,href:e,...n})),m.map(({key:e,link:t})=>v.createElement(`link`,{key:e,nonce:n.nonce,...t,crossOrigin:t.crossOrigin??n.crossOrigin})))}function An(...e){return t=>{e.forEach(e=>{typeof e==`function`?e(t):e!=null&&(e.current=t)})}}v.Component;var jn=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0;try{jn&&(window.__reactRouterVersion=`7.18.3`)}catch{}function Mn({basename:e,children:t,useTransitions:n,window:r}){let i=v.useRef();i.current??=ne({window:r,v5Compat:!0});let a=i.current,[o,s]=v.useState({action:a.action,location:a.location}),c=v.useCallback(e=>{n===!1?s(e):v.startTransition(()=>s(e))},[n]);return v.useLayoutEffect(()=>a.listen(c),[a,c]),v.createElement(Kt,{basename:e,children:t,location:o.location,navigationType:o.action,navigator:a,useTransitions:n})}var Nn=v.forwardRef(function({onClick:e,discover:t=`render`,prefetch:n=`none`,relative:r,reloadDocument:i,replace:a,mask:o,state:s,target:c,to:l,preventScrollReset:u,viewTransition:d,defaultShouldRevalidate:f,...p},m){let{basename:h,navigator:g,useTransitions:_}=v.useContext(ct),y=typeof l==`string`&&C.test(l),b=Ge(l,h);l=b.to;let x=_t(l,{relative:r}),ee=yt(),S=null;if(o){let e=Pe(o,[],ee.mask?ee.mask.pathname:`/`,!0);h!==`/`&&(e.pathname=e.pathname===`/`?h:Ie([h,e.pathname])),S=g.createHref(e)}let[w,T,te]=wn(n,p),E=Rn(l,{replace:a,mask:o,state:s,target:c,preventScrollReset:u,relative:r,viewTransition:d,defaultShouldRevalidate:f,useTransitions:_});function ne(t){e&&e(t),t.defaultPrevented||E(t)}let D=!(b.isExternal||i),re=v.createElement(`a`,{...p,...te,href:(D?S:void 0)||b.absoluteURL||x,onClick:D?ne:e,ref:An(m,T),target:c,"data-discover":!y&&t===`render`?`true`:void 0});return w&&!y?v.createElement(v.Fragment,null,re,v.createElement(En,{page:x})):re});Nn.displayName=`Link`;var Pn=v.forwardRef(function({"aria-current":e=`page`,caseSensitive:t=!1,className:n=``,end:r=!1,style:i,to:a,viewTransition:o,children:s,...c},l){let u=wt(a,{relative:c.relative}),d=yt(),f=v.useContext(nt),{navigator:p,basename:m}=v.useContext(ct),h=f!=null&&Un(u)&&o===!0,g=p.encodeLocation?p.encodeLocation(u).pathname:u.pathname,_=d.pathname,y=f&&f.navigation&&f.navigation.location?f.navigation.location.pathname:null;t||(_=_.toLowerCase(),y=y?y.toLowerCase():null,g=g.toLowerCase()),y&&m&&(y=Oe(y,m)||y);let b=g!==`/`&&g.endsWith(`/`)?g.length-1:g.length,x=_===g||!r&&_.startsWith(g)&&_.charAt(b)===`/`,ee=y!=null&&(y===g||!r&&y.startsWith(g)&&y.charAt(g.length)===`/`),S={isActive:x,isPending:ee,isTransitioning:h},C=x?e:void 0,w;w=typeof n==`function`?n(S):[n,x?`active`:null,ee?`pending`:null,h?`transitioning`:null].filter(Boolean).join(` `);let T=typeof i==`function`?i(S):i;return v.createElement(Nn,{...c,"aria-current":C,className:w,ref:l,style:T,to:a,viewTransition:o},typeof s==`function`?s(S):s)});Pn.displayName=`NavLink`;var Fn=v.forwardRef(({discover:e=`render`,fetcherKey:t,navigate:n,reloadDocument:r,replace:i,state:a,method:o=Yt,action:s,onSubmit:c,relative:l,preventScrollReset:u,viewTransition:d,defaultShouldRevalidate:f,...p},m)=>{let{useTransitions:h}=v.useContext(ct),g=Vn(),_=Hn(s,{relative:l}),y=o.toLowerCase()===`get`?`get`:`post`,b=typeof s==`string`&&C.test(s);return v.createElement(`form`,{ref:m,method:y,action:_,onSubmit:r?c:e=>{if(c&&c(e),e.defaultPrevented)return;e.preventDefault();let r=e.nativeEvent.submitter,s=r?.getAttribute(`formmethod`)||o,p=()=>g(r||e.currentTarget,{fetcherKey:t,method:s,navigate:n,replace:i,state:a,relative:l,preventScrollReset:u,viewTransition:d,defaultShouldRevalidate:f});h&&n!==!1?v.startTransition(()=>p()):p()},...p,"data-discover":!b&&e===`render`?`true`:void 0})});Fn.displayName=`Form`;function In(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Ln(e){let t=v.useContext(tt);return D(t,In(e)),t}function Rn(e,{target:t,replace:n,mask:r,state:i,preventScrollReset:a,relative:o,viewTransition:s,defaultShouldRevalidate:c,useTransitions:l}={}){let u=St(),d=yt(),f=wt(e,{relative:o});return v.useCallback(p=>{if(nn(p,t)){p.preventDefault();let t=n===void 0?se(d)===se(f):n,m=()=>u(e,{replace:t,mask:r,state:i,preventScrollReset:a,relative:o,viewTransition:s,defaultShouldRevalidate:c});l?v.startTransition(()=>m()):m()}},[d,u,f,n,r,i,t,e,a,o,s,c,l])}var zn=0,Bn=()=>`__${String(++zn)}__`;function Vn(){let{router:e}=Ln(`useSubmit`),{basename:t}=v.useContext(ct),n=zt(),r=e.fetch,i=e.navigate;return v.useCallback(async(e,a={})=>{let{action:o,method:s,encType:c,formData:l,body:u}=cn(e,t);if(a.navigate===!1){let e=a.fetcherKey||Bn();await r(e,n,a.action||o,{defaultShouldRevalidate:a.defaultShouldRevalidate,preventScrollReset:a.preventScrollReset,formData:l,body:u,formMethod:a.method||s,formEncType:a.encType||c,flushSync:a.flushSync})}else await i(a.action||o,{defaultShouldRevalidate:a.defaultShouldRevalidate,preventScrollReset:a.preventScrollReset,formData:l,body:u,formMethod:a.method||s,formEncType:a.encType||c,replace:a.replace,state:a.state,fromRouteId:n,flushSync:a.flushSync,viewTransition:a.viewTransition})},[r,i,t,n])}function Hn(e,{relative:t}={}){let{basename:n}=v.useContext(ct),r=v.useContext(ut);D(r,`useFormAction must be used inside a RouteContext`);let[i]=r.matches.slice(-1),a={...wt(e||`.`,{relative:t})},o=yt();if(e==null){a.search=o.search;let e=new URLSearchParams(a.search),t=e.getAll(`index`);if(t.some(e=>e===``)){e.delete(`index`),t.filter(e=>e).forEach(t=>e.append(`index`,t));let n=e.toString();a.search=n?`?${n}`:``}}return(!e||e===`.`)&&i.route.index&&(a.search=a.search?a.search.replace(/^\?/,`?index&`):`?index`),n!==`/`&&(a.pathname=a.pathname===`/`?n:Ie([n,a.pathname])),se(a)}function Un(e,{relative:t}={}){let n=v.useContext(at);D(n!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:r}=Ln(`useViewTransitionState`),i=wt(e,{relative:t});if(!n.isTransitioning)return!1;let a=Oe(n.currentLocation.pathname,r)||n.currentLocation.pathname,o=Oe(n.nextLocation.pathname,r)||n.nextLocation.pathname;return we(i.pathname,o)!=null||we(i.pathname,a)!=null}var Wn=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),j=o(((e,t)=>{t.exports=Wn()}))();function Gn(){return(0,j.jsxs)(`section`,{className:`hero`,children:[(0,j.jsxs)(`div`,{className:`hero-bg`,children:[(0,j.jsx)(`div`,{className:`glow glow1`}),(0,j.jsx)(`div`,{className:`glow glow2`}),(0,j.jsx)(`div`,{className:`grid`})]}),(0,j.jsxs)(`div`,{className:`hero-content`,children:[(0,j.jsx)(`span`,{className:`badge`,children:`AI/ML • Generative AI • Agentic AI • RAG • LLMOps • MLOps`}),(0,j.jsx)(`h1`,{children:`IntelliCatalyst AI Labs`}),(0,j.jsx)(`h2`,{children:`Engineering the Future of Intelligent Systems`}),(0,j.jsx)(`p`,{children:`IntelliCatalyst AI Labs is a premier AI innovation platform dedicated to building, exploring, and showcasing cutting-edge solutions in Artificial Intelligence, Machine Learning, Generative AI, Agentic AI, Multi-Agent Systems, and Enterprise AI Architecture.`}),(0,j.jsx)(`p`,{children:`Discover real-world projects, scalable AI architectures, production-ready implementations, and modern engineering practices that transform innovative ideas into intelligent business solutions.`}),(0,j.jsxs)(`div`,{className:`hero-buttons`,children:[(0,j.jsx)(`button`,{className:`primary-btn`,children:`Explore Projects`}),(0,j.jsx)(`button`,{className:`secondary-btn`,children:`Learn More`})]})]})]})}function Kn(){return(0,j.jsx)(j.Fragment,{children:(0,j.jsx)(Gn,{})})}function qn(e,t){let n=t||{};return(e[e.length-1]===``?[...e,``]:e).join((n.padRight?` `:``)+`,`+(n.padLeft===!1?``:` `)).trim()}var Jn=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,Yn=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,Xn={};function Zn(e,t){return((t||Xn).jsx?Yn:Jn).test(e)}var Qn=/[ \t\n\f\r]/g;function $n(e){return typeof e==`object`?e.type===`text`&&er(e.value):er(e)}function er(e){return e.replace(Qn,``)===``}var tr=class{constructor(e,t,n){this.normal=t,this.property=e,n&&(this.space=n)}};tr.prototype.normal={},tr.prototype.property={},tr.prototype.space=void 0;function nr(e,t){let n={},r={};for(let t of e)Object.assign(n,t.property),Object.assign(r,t.normal);return new tr(n,r,t)}function rr(e){return e.toLowerCase()}var ir=class{constructor(e,t){this.attribute=t,this.property=e}};ir.prototype.attribute=``,ir.prototype.booleanish=!1,ir.prototype.boolean=!1,ir.prototype.commaOrSpaceSeparated=!1,ir.prototype.commaSeparated=!1,ir.prototype.defined=!1,ir.prototype.mustUseProperty=!1,ir.prototype.number=!1,ir.prototype.overloadedBoolean=!1,ir.prototype.property=``,ir.prototype.spaceSeparated=!1,ir.prototype.space=void 0;var ar=s({boolean:()=>M,booleanish:()=>sr,commaOrSpaceSeparated:()=>ur,commaSeparated:()=>lr,number:()=>N,overloadedBoolean:()=>cr,spaceSeparated:()=>P}),or=0,M=dr(),sr=dr(),cr=dr(),N=dr(),P=dr(),lr=dr(),ur=dr();function dr(){return 2**++or}var fr=Object.keys(ar),pr=class extends ir{constructor(e,t,n,r){let i=-1;if(super(e,t),mr(this,`space`,r),typeof n==`number`)for(;++i<fr.length;){let e=fr[i];mr(this,fr[i],(n&ar[e])===ar[e])}}};pr.prototype.defined=!0;function mr(e,t,n){n&&(e[t]=n)}function hr(e){let t={},n={};for(let[r,i]of Object.entries(e.properties)){let a=new pr(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(a.mustUseProperty=!0),t[r]=a,n[rr(r)]=r,n[rr(a.attribute)]=r}return new tr(t,n,e.space)}var gr=hr({properties:{ariaActiveDescendant:null,ariaAtomic:sr,ariaAutoComplete:null,ariaBusy:sr,ariaChecked:sr,ariaColCount:N,ariaColIndex:N,ariaColSpan:N,ariaControls:P,ariaCurrent:null,ariaDescribedBy:P,ariaDetails:null,ariaDisabled:sr,ariaDropEffect:P,ariaErrorMessage:null,ariaExpanded:sr,ariaFlowTo:P,ariaGrabbed:sr,ariaHasPopup:null,ariaHidden:sr,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:P,ariaLevel:N,ariaLive:null,ariaModal:sr,ariaMultiLine:sr,ariaMultiSelectable:sr,ariaOrientation:null,ariaOwns:P,ariaPlaceholder:null,ariaPosInSet:N,ariaPressed:sr,ariaReadOnly:sr,ariaRelevant:null,ariaRequired:sr,ariaRoleDescription:P,ariaRowCount:N,ariaRowIndex:N,ariaRowSpan:N,ariaSelected:sr,ariaSetSize:N,ariaSort:null,ariaValueMax:N,ariaValueMin:N,ariaValueNow:N,ariaValueText:null,role:null},transform(e,t){return t===`role`?t:`aria-`+t.slice(4).toLowerCase()}});function _r(e,t){return t in e?e[t]:t}function vr(e,t){return _r(e,t.toLowerCase())}var yr=hr({attributes:{acceptcharset:`accept-charset`,classname:`class`,htmlfor:`for`,httpequiv:`http-equiv`},mustUseProperty:[`checked`,`multiple`,`muted`,`selected`],properties:{abbr:null,accept:lr,acceptCharset:P,accessKey:P,action:null,allow:null,allowFullScreen:M,allowPaymentRequest:M,allowUserMedia:M,alpha:M,alt:null,as:null,async:M,autoCapitalize:null,autoComplete:P,autoFocus:M,autoPlay:M,blocking:P,capture:null,charSet:null,checked:M,cite:null,className:P,closedBy:null,colorSpace:null,cols:N,colSpan:N,command:null,commandFor:null,content:null,contentEditable:sr,controls:M,controlsList:P,coords:N|lr,crossOrigin:null,data:null,dateTime:null,decoding:null,default:M,defer:M,dir:null,dirName:null,disabled:M,download:cr,draggable:sr,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:M,formTarget:null,headers:P,height:N,hidden:cr,high:N,href:null,hrefLang:null,htmlFor:P,httpEquiv:P,id:null,imageSizes:null,imageSrcSet:null,inert:M,inputMode:null,integrity:null,is:null,isMap:M,itemId:null,itemProp:P,itemRef:P,itemScope:M,itemType:P,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:M,low:N,manifest:null,max:null,maxLength:N,media:null,method:null,min:null,minLength:N,multiple:M,muted:M,name:null,nonce:null,noModule:M,noValidate:M,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:M,optimum:N,pattern:null,ping:P,placeholder:null,playsInline:M,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:M,referrerPolicy:null,rel:P,required:M,reversed:M,rows:N,rowSpan:N,sandbox:P,scope:null,scoped:M,seamless:M,selected:M,shadowRootClonable:M,shadowRootCustomElementRegistry:M,shadowRootDelegatesFocus:M,shadowRootMode:null,shadowRootSerializable:M,shape:null,size:N,sizes:null,slot:null,span:N,spellCheck:sr,src:null,srcDoc:null,srcLang:null,srcSet:null,start:N,step:null,style:null,tabIndex:N,target:null,title:null,translate:null,type:null,typeMustMatch:M,useMap:null,value:sr,width:N,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:P,axis:null,background:null,bgColor:null,border:N,borderColor:null,bottomMargin:N,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:M,declare:M,event:null,face:null,frame:null,frameBorder:null,hSpace:N,leftMargin:N,link:null,longDesc:null,lowSrc:null,marginHeight:N,marginWidth:N,noResize:M,noHref:M,noShade:M,noWrap:M,object:null,profile:null,prompt:null,rev:null,rightMargin:N,rules:null,scheme:null,scrolling:sr,standby:null,summary:null,text:null,topMargin:N,valueType:null,version:null,vAlign:null,vLink:null,vSpace:N,allowTransparency:null,autoCorrect:null,autoSave:null,credentialless:M,disablePictureInPicture:M,disableRemotePlayback:M,exportParts:lr,part:P,prefix:null,property:null,results:N,security:null,unselectable:null},space:`html`,transform:vr}),br=hr({attributes:{accentHeight:`accent-height`,alignmentBaseline:`alignment-baseline`,arabicForm:`arabic-form`,baselineShift:`baseline-shift`,capHeight:`cap-height`,className:`class`,clipPath:`clip-path`,clipRule:`clip-rule`,colorInterpolation:`color-interpolation`,colorInterpolationFilters:`color-interpolation-filters`,colorProfile:`color-profile`,colorRendering:`color-rendering`,crossOrigin:`crossorigin`,dataType:`datatype`,dominantBaseline:`dominant-baseline`,enableBackground:`enable-background`,fillOpacity:`fill-opacity`,fillRule:`fill-rule`,floodColor:`flood-color`,floodOpacity:`flood-opacity`,fontFamily:`font-family`,fontSize:`font-size`,fontSizeAdjust:`font-size-adjust`,fontStretch:`font-stretch`,fontStyle:`font-style`,fontVariant:`font-variant`,fontWeight:`font-weight`,glyphName:`glyph-name`,glyphOrientationHorizontal:`glyph-orientation-horizontal`,glyphOrientationVertical:`glyph-orientation-vertical`,hrefLang:`hreflang`,horizAdvX:`horiz-adv-x`,horizOriginX:`horiz-origin-x`,horizOriginY:`horiz-origin-y`,imageRendering:`image-rendering`,letterSpacing:`letter-spacing`,lightingColor:`lighting-color`,markerEnd:`marker-end`,markerMid:`marker-mid`,markerStart:`marker-start`,maskType:`mask-type`,navDown:`nav-down`,navDownLeft:`nav-down-left`,navDownRight:`nav-down-right`,navLeft:`nav-left`,navNext:`nav-next`,navPrev:`nav-prev`,navRight:`nav-right`,navUp:`nav-up`,navUpLeft:`nav-up-left`,navUpRight:`nav-up-right`,onAbort:`onabort`,onActivate:`onactivate`,onAfterPrint:`onafterprint`,onBeforePrint:`onbeforeprint`,onBegin:`onbegin`,onCancel:`oncancel`,onCanPlay:`oncanplay`,onCanPlayThrough:`oncanplaythrough`,onChange:`onchange`,onClick:`onclick`,onClose:`onclose`,onCopy:`oncopy`,onCueChange:`oncuechange`,onCut:`oncut`,onDblClick:`ondblclick`,onDrag:`ondrag`,onDragEnd:`ondragend`,onDragEnter:`ondragenter`,onDragExit:`ondragexit`,onDragLeave:`ondragleave`,onDragOver:`ondragover`,onDragStart:`ondragstart`,onDrop:`ondrop`,onDurationChange:`ondurationchange`,onEmptied:`onemptied`,onEnd:`onend`,onEnded:`onended`,onError:`onerror`,onFocus:`onfocus`,onFocusIn:`onfocusin`,onFocusOut:`onfocusout`,onHashChange:`onhashchange`,onInput:`oninput`,onInvalid:`oninvalid`,onKeyDown:`onkeydown`,onKeyPress:`onkeypress`,onKeyUp:`onkeyup`,onLoad:`onload`,onLoadedData:`onloadeddata`,onLoadedMetadata:`onloadedmetadata`,onLoadStart:`onloadstart`,onMessage:`onmessage`,onMouseDown:`onmousedown`,onMouseEnter:`onmouseenter`,onMouseLeave:`onmouseleave`,onMouseMove:`onmousemove`,onMouseOut:`onmouseout`,onMouseOver:`onmouseover`,onMouseUp:`onmouseup`,onMouseWheel:`onmousewheel`,onOffline:`onoffline`,onOnline:`ononline`,onPageHide:`onpagehide`,onPageShow:`onpageshow`,onPaste:`onpaste`,onPause:`onpause`,onPlay:`onplay`,onPlaying:`onplaying`,onPopState:`onpopstate`,onProgress:`onprogress`,onRateChange:`onratechange`,onRepeat:`onrepeat`,onReset:`onreset`,onResize:`onresize`,onScroll:`onscroll`,onSeeked:`onseeked`,onSeeking:`onseeking`,onSelect:`onselect`,onShow:`onshow`,onStalled:`onstalled`,onStorage:`onstorage`,onSubmit:`onsubmit`,onSuspend:`onsuspend`,onTimeUpdate:`ontimeupdate`,onToggle:`ontoggle`,onUnload:`onunload`,onVolumeChange:`onvolumechange`,onWaiting:`onwaiting`,onZoom:`onzoom`,overlinePosition:`overline-position`,overlineThickness:`overline-thickness`,paintOrder:`paint-order`,panose1:`panose-1`,pointerEvents:`pointer-events`,referrerPolicy:`referrerpolicy`,renderingIntent:`rendering-intent`,shapeRendering:`shape-rendering`,stopColor:`stop-color`,stopOpacity:`stop-opacity`,strikethroughPosition:`strikethrough-position`,strikethroughThickness:`strikethrough-thickness`,strokeDashArray:`stroke-dasharray`,strokeDashOffset:`stroke-dashoffset`,strokeLineCap:`stroke-linecap`,strokeLineJoin:`stroke-linejoin`,strokeMiterLimit:`stroke-miterlimit`,strokeOpacity:`stroke-opacity`,strokeWidth:`stroke-width`,tabIndex:`tabindex`,textAnchor:`text-anchor`,textDecoration:`text-decoration`,textRendering:`text-rendering`,transformOrigin:`transform-origin`,typeOf:`typeof`,underlinePosition:`underline-position`,underlineThickness:`underline-thickness`,unicodeBidi:`unicode-bidi`,unicodeRange:`unicode-range`,unitsPerEm:`units-per-em`,vAlphabetic:`v-alphabetic`,vHanging:`v-hanging`,vIdeographic:`v-ideographic`,vMathematical:`v-mathematical`,vectorEffect:`vector-effect`,vertAdvY:`vert-adv-y`,vertOriginX:`vert-origin-x`,vertOriginY:`vert-origin-y`,wordSpacing:`word-spacing`,writingMode:`writing-mode`,xHeight:`x-height`,playbackOrder:`playbackorder`,timelineBegin:`timelinebegin`},properties:{about:ur,accentHeight:N,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:N,amplitude:N,arabicForm:null,ascent:N,attributeName:null,attributeType:null,azimuth:N,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:N,by:null,calcMode:null,capHeight:N,className:P,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:N,diffuseConstant:N,direction:null,display:null,dur:null,divisor:N,dominantBaseline:null,download:M,dx:null,dy:null,edgeMode:null,editable:null,elevation:N,enableBackground:null,end:null,event:null,exponent:N,externalResourcesRequired:null,fill:null,fillOpacity:N,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:lr,g2:lr,glyphName:lr,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:N,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:N,horizOriginX:N,horizOriginY:N,id:null,ideographic:N,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:N,k:N,k1:N,k2:N,k3:N,k4:N,kernelMatrix:ur,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:N,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskType:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:N,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:N,overlineThickness:N,paintOrder:null,panose1:null,path:null,pathLength:N,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:P,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:N,pointsAtY:N,pointsAtZ:N,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:ur,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:ur,rev:ur,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:ur,requiredFeatures:ur,requiredFonts:ur,requiredFormats:ur,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:N,specularExponent:N,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:N,strikethroughThickness:N,string:null,stroke:null,strokeDashArray:ur,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:N,strokeOpacity:N,strokeWidth:null,style:null,surfaceScale:N,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:ur,tabIndex:N,tableValues:null,target:null,targetX:N,targetY:N,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:ur,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:N,underlineThickness:N,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:N,values:null,vAlphabetic:N,vMathematical:N,vectorEffect:null,vHanging:N,vIdeographic:N,version:null,vertAdvY:N,vertOriginX:N,vertOriginY:N,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:N,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:`svg`,transform:_r}),xr=hr({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:`xlink`,transform(e,t){return`xlink:`+t.slice(5).toLowerCase()}}),Sr=hr({attributes:{xmlnsxlink:`xmlns:xlink`},properties:{xmlnsXLink:null,xmlns:null},space:`xmlns`,transform:vr}),Cr=hr({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:`xml`,transform(e,t){return`xml:`+t.slice(3).toLowerCase()}}),wr={classId:`classID`,dataType:`datatype`,itemId:`itemID`,strokeDashArray:`strokeDasharray`,strokeDashOffset:`strokeDashoffset`,strokeLineCap:`strokeLinecap`,strokeLineJoin:`strokeLinejoin`,strokeMiterLimit:`strokeMiterlimit`,typeOf:`typeof`,xLinkActuate:`xlinkActuate`,xLinkArcRole:`xlinkArcrole`,xLinkHref:`xlinkHref`,xLinkRole:`xlinkRole`,xLinkShow:`xlinkShow`,xLinkTitle:`xlinkTitle`,xLinkType:`xlinkType`,xmlnsXLink:`xmlnsXlink`},Tr=/[A-Z]/g,Er=/-[a-z]/g,Dr=/^data[-\w.:]+$/i;function Or(e,t){let n=rr(t),r=t,i=ir;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)===`data`&&Dr.test(t)){if(t.charAt(4)===`-`){let e=t.slice(5).replace(Er,Ar);r=`data`+e.charAt(0).toUpperCase()+e.slice(1)}else{let e=t.slice(4);if(!Er.test(e)){let n=e.replace(Tr,kr);n.charAt(0)!==`-`&&(n=`-`+n),t=`data`+n}}i=pr}return new i(r,t)}function kr(e){return`-`+e.toLowerCase()}function Ar(e){return e.charAt(1).toUpperCase()}var jr=nr([gr,yr,xr,Sr,Cr],`html`),Mr=nr([gr,br,xr,Sr,Cr],`svg`);function Nr(e){return e.join(` `).trim()}var Pr=o(((e,t)=>{var n=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,r=/\n/g,i=/^\s*/,a=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,o=/^:\s*/,s=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,c=/^[;\s]*/,l=/^\s+|\s+$/g;function u(e,t){if(typeof e!=`string`)throw TypeError(`First argument must be a string`);if(!e)return[];t||={};var l=1,u=1;function f(e){var t=e.match(r);t&&(l+=t.length);var n=e.lastIndexOf(`
`);u=~n?e.length-n:u+e.length}function p(){var e={line:l,column:u};return function(t){return t.position=new m(e),_(),t}}function m(e){this.start=e,this.end={line:l,column:u},this.source=t.source}m.prototype.content=e;function h(n){var r=Error(t.source+`:`+l+`:`+u+`: `+n);if(r.reason=n,r.filename=t.source,r.line=l,r.column=u,r.source=e,!t.silent)throw r}function g(t){var n=t.exec(e);if(n){var r=n[0];return f(r),e=e.slice(r.length),n}}function _(){g(i)}function v(e){var t;for(e||=[];t=y();)t!==!1&&e.push(t);return e}function y(){var t=p();if(e.charAt(0)==`/`&&e.charAt(1)==`*`){for(var n=2;e.charAt(n)!=``&&(e.charAt(n)!=`*`||e.charAt(n+1)!=`/`);)++n;if(n+=2,e.charAt(n-1)===``)return h(`End of comment missing`);var r=e.slice(2,n-2);return u+=2,f(r),e=e.slice(n),u+=2,t({type:`comment`,comment:r})}}function b(){var e=p(),t=g(a);if(t){if(y(),!g(o))return h(`property missing ':'`);var r=g(s),i=e({type:`declaration`,property:d(t[0].replace(n,``)),value:r?d(r[0].replace(n,``)):``});return g(c),i}}function x(){var e=[];v(e);for(var t;t=b();)t!==!1&&(e.push(t),v(e));return e}return _(),x()}function d(e){return e?e.replace(l,``):``}t.exports=u})),Fr=o((e=>{var t=e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,"__esModule",{value:!0}),e.default=r;var n=t(Pr());function r(e,t){let r=null;if(!e||typeof e!=`string`)return r;let i=(0,n.default)(e),a=typeof t==`function`;return i.forEach(e=>{if(e.type!==`declaration`)return;let{property:n,value:i}=e;a?t(n,i,e):i&&(r||={},r[n]=i)}),r}})),Ir=o((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.camelCase=void 0;var t=/^--[a-zA-Z0-9_-]+$/,n=/-([a-z])/g,r=/^[^-]+$/,i=/^-(webkit|moz|ms|o|khtml)-/,a=/^-(ms)-/,o=function(e){return!e||r.test(e)||t.test(e)},s=function(e,t){return t.toUpperCase()},c=function(e,t){return`${t}-`};e.camelCase=function(e,t){return t===void 0&&(t={}),o(e)?e:(e=e.toLowerCase(),e=t.reactCompat?e.replace(a,c):e.replace(i,c),e.replace(n,s))}})),Lr=o(((e,t)=>{var n=(e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}})(Fr()),r=Ir();function i(e,t){var i={};return!e||typeof e!=`string`||(0,n.default)(e,function(e,n){e&&n&&(i[(0,r.camelCase)(e,t)]=n)}),i}i.default=i,t.exports=i})),Rr=Br(`end`),zr=Br(`start`);function Br(e){return t;function t(t){let n=t&&t.position&&t.position[e]||{};if(typeof n.line==`number`&&n.line>0&&typeof n.column==`number`&&n.column>0)return{line:n.line,column:n.column,offset:typeof n.offset==`number`&&n.offset>-1?n.offset:void 0}}}function Vr(e){let t=zr(e),n=Rr(e);if(t&&n)return{start:t,end:n}}function Hr(e){return!e||typeof e!=`object`?``:`position`in e||`type`in e?Wr(e.position):`start`in e||`end`in e?Wr(e):`line`in e||`column`in e?Ur(e):``}function Ur(e){return Gr(e&&e.line)+`:`+Gr(e&&e.column)}function Wr(e){return Ur(e&&e.start)+`-`+Ur(e&&e.end)}function Gr(e){return e&&typeof e==`number`?e:1}var Kr=class extends Error{constructor(e,t,n){super(),typeof t==`string`&&(n=t,t=void 0);let r=``,i={},a=!1;if(t&&(i=`line`in t&&`column`in t||`start`in t&&`end`in t?{place:t}:`type`in t?{ancestors:[t],place:t.position}:{...t}),typeof e==`string`?r=e:!i.cause&&e&&(a=!0,r=e.message,i.cause=e),!i.ruleId&&!i.source&&typeof n==`string`){let e=n.indexOf(`:`);e===-1?i.ruleId=n:(i.source=n.slice(0,e),i.ruleId=n.slice(e+1))}if(!i.place&&i.ancestors&&i.ancestors){let e=i.ancestors[i.ancestors.length-1];e&&(i.place=e.position)}let o=i.place&&`start`in i.place?i.place.start:i.place;this.ancestors=i.ancestors||void 0,this.cause=i.cause||void 0,this.column=o?o.column:void 0,this.fatal=void 0,this.file=``,this.message=r,this.line=o?o.line:void 0,this.name=Hr(i.place)||`1:1`,this.place=i.place||void 0,this.reason=this.message,this.ruleId=i.ruleId||void 0,this.source=i.source||void 0,this.stack=a&&i.cause&&typeof i.cause.stack==`string`?i.cause.stack:``,this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}};Kr.prototype.file=``,Kr.prototype.name=``,Kr.prototype.reason=``,Kr.prototype.message=``,Kr.prototype.stack=``,Kr.prototype.column=void 0,Kr.prototype.line=void 0,Kr.prototype.ancestors=void 0,Kr.prototype.cause=void 0,Kr.prototype.fatal=void 0,Kr.prototype.place=void 0,Kr.prototype.ruleId=void 0,Kr.prototype.source=void 0;var qr=l(Lr(),1),Jr={}.hasOwnProperty,Yr=new Map,Xr=/[A-Z]/g,Zr=new Set([`table`,`tbody`,`thead`,`tfoot`,`tr`]),Qr=new Set([`td`,`th`]),$r=`https://github.com/syntax-tree/hast-util-to-jsx-runtime`;function ei(e,t){if(!t||t.Fragment===void 0)throw TypeError("Expected `Fragment` in options");let n=t.filePath||void 0,r;if(t.development){if(typeof t.jsxDEV!=`function`)throw TypeError("Expected `jsxDEV` in options when `development: true`");r=di(n,t.jsxDEV)}else{if(typeof t.jsx!=`function`)throw TypeError("Expected `jsx` in production options");if(typeof t.jsxs!=`function`)throw TypeError("Expected `jsxs` in production options");r=ui(n,t.jsx,t.jsxs)}let i={Fragment:t.Fragment,ancestors:[],components:t.components||{},create:r,elementAttributeNameCase:t.elementAttributeNameCase||`react`,evaluater:t.createEvaluater?t.createEvaluater():void 0,filePath:n,ignoreInvalidStyle:t.ignoreInvalidStyle||!1,passKeys:t.passKeys!==!1,passNode:t.passNode||!1,schema:t.space===`svg`?Mr:jr,stylePropertyNameCase:t.stylePropertyNameCase||`dom`,tableCellAlignToStyle:t.tableCellAlignToStyle!==!1},a=ti(i,e,void 0);return a&&typeof a!=`string`?a:i.create(e,i.Fragment,{children:a||void 0},void 0)}function ti(e,t,n){if(t.type===`element`)return ni(e,t,n);if(t.type===`mdxFlowExpression`||t.type===`mdxTextExpression`)return ri(e,t);if(t.type===`mdxJsxFlowElement`||t.type===`mdxJsxTextElement`)return ai(e,t,n);if(t.type===`mdxjsEsm`)return ii(e,t);if(t.type===`root`)return oi(e,t,n);if(t.type===`text`)return si(e,t)}function ni(e,t,n){let r=e.schema,i=r;t.tagName.toLowerCase()===`svg`&&r.space===`html`&&(i=Mr,e.schema=i),e.ancestors.push(t);let a=_i(e,t.tagName,!1),o=fi(e,t),s=mi(e,t);return Zr.has(t.tagName)&&(s=s.filter(function(e){return typeof e!=`string`||!$n(e)})),ci(e,o,a,t),li(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function ri(e,t){if(t.data&&t.data.estree&&e.evaluater){let n=t.data.estree.body[0];return n.type,e.evaluater.evaluateExpression(n.expression)}vi(e,t.position)}function ii(e,t){if(t.data&&t.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(t.data.estree);vi(e,t.position)}function ai(e,t,n){let r=e.schema,i=r;t.name===`svg`&&r.space===`html`&&(i=Mr,e.schema=i),e.ancestors.push(t);let a=t.name===null?e.Fragment:_i(e,t.name,!0),o=pi(e,t),s=mi(e,t);return ci(e,o,a,t),li(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function oi(e,t,n){let r={};return li(r,mi(e,t)),e.create(t,e.Fragment,r,n)}function si(e,t){return t.value}function ci(e,t,n,r){typeof n!=`string`&&n!==e.Fragment&&e.passNode&&(t.node=r)}function li(e,t){if(t.length>0){let n=t.length>1?t:t[0];n&&(e.children=n)}}function ui(e,t,n){return r;function r(e,r,i,a){let o=Array.isArray(i.children)?n:t;return a?o(r,i,a):o(r,i)}}function di(e,t){return n;function n(n,r,i,a){let o=Array.isArray(i.children),s=zr(n);return t(r,i,a,o,{columnNumber:s?s.column-1:void 0,fileName:e,lineNumber:s?s.line:void 0},void 0)}}function fi(e,t){let n={},r,i;for(i in t.properties)if(i!==`children`&&Jr.call(t.properties,i)){let a=hi(e,i,t.properties[i]);if(a){let[i,o]=a;e.tableCellAlignToStyle&&i===`align`&&typeof o==`string`&&Qr.has(t.tagName)?r=o:n[i]=o}}if(r){let t=n.style||={};t[e.stylePropertyNameCase===`css`?`text-align`:`textAlign`]=r}return n}function pi(e,t){let n={};for(let r of t.attributes)if(r.type===`mdxJsxExpressionAttribute`){if(r.data&&r.data.estree&&e.evaluater){let t=r.data.estree.body[0];t.type;let i=t.expression;i.type;let a=i.properties[0];a.type,Object.assign(n,e.evaluater.evaluateExpression(a.argument))}else vi(e,t.position)}else{let i=r.name,a;if(r.value&&typeof r.value==`object`){if(r.value.data&&r.value.data.estree&&e.evaluater){let t=r.value.data.estree.body[0];t.type,a=e.evaluater.evaluateExpression(t.expression)}else vi(e,t.position)}else a=r.value===null||r.value;n[i]=a}return n}function mi(e,t){let n=[],r=-1,i=e.passKeys?new Map:Yr;for(;++r<t.children.length;){let a=t.children[r],o;if(e.passKeys){let e=a.type===`element`?a.tagName:a.type===`mdxJsxFlowElement`||a.type===`mdxJsxTextElement`?a.name:void 0;if(e){let t=i.get(e)||0;o=e+`-`+t,i.set(e,t+1)}}let s=ti(e,a,o);s!==void 0&&n.push(s)}return n}function hi(e,t,n){let r=Or(e.schema,t);if(!(n==null||typeof n==`number`&&Number.isNaN(n))){if(Array.isArray(n)&&(n=r.commaSeparated?qn(n):Nr(n)),r.property===`style`){let t=typeof n==`object`?n:gi(e,String(n));return e.stylePropertyNameCase===`css`&&(t=yi(t)),[`style`,t]}return[e.elementAttributeNameCase===`react`&&r.space?wr[r.property]||r.property:r.attribute,n]}}function gi(e,t){try{return(0,qr.default)(t,{reactCompat:!0})}catch(t){if(e.ignoreInvalidStyle)return{};let n=t,r=new Kr("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:n,ruleId:`style`,source:`hast-util-to-jsx-runtime`});throw r.file=e.filePath||void 0,r.url=$r+`#cannot-parse-style-attribute`,r}}function _i(e,t,n){let r;if(!n)r={type:`Literal`,value:t};else if(t.includes(`.`)){let e=t.split(`.`),n=-1,i;for(;++n<e.length;){let t=Zn(e[n])?{type:`Identifier`,name:e[n]}:{type:`Literal`,value:e[n]};i=i?{type:`MemberExpression`,object:i,property:t,computed:!!(n&&t.type===`Literal`),optional:!1}:t}r=i}else r=Zn(t)&&!/^[a-z]/.test(t)?{type:`Identifier`,name:t}:{type:`Literal`,value:t};if(r.type===`Literal`){let t=r.value;return Jr.call(e.components,t)?e.components[t]:t}if(e.evaluater)return e.evaluater.evaluateExpression(r);vi(e)}function vi(e,t){let n=new Kr("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:t,ruleId:`mdx-estree`,source:`hast-util-to-jsx-runtime`});throw n.file=e.filePath||void 0,n.url=$r+`#cannot-handle-mdx-estrees-without-createevaluater`,n}function yi(e){let t={},n;for(n in e)Jr.call(e,n)&&(t[bi(n)]=e[n]);return t}function bi(e){let t=e.replace(Xr,xi);return t.slice(0,3)===`ms-`&&(t=`-`+t),t}function xi(e){return`-`+e.toLowerCase()}var Si={action:[`form`],cite:[`blockquote`,`del`,`ins`,`q`],data:[`object`],formAction:[`button`,`input`],href:[`a`,`area`,`base`,`link`],icon:[`menuitem`],itemId:null,manifest:[`html`],ping:[`a`,`area`],poster:[`video`],src:[`audio`,`embed`,`iframe`,`img`,`input`,`script`,`source`,`track`,`video`]},Ci={};function wi(e,t){let n=t||Ci;return Ti(e,typeof n.includeImageAlt!=`boolean`||n.includeImageAlt,typeof n.includeHtml!=`boolean`||n.includeHtml)}function Ti(e,t,n){if(Di(e)){if(`value`in e)return e.type===`html`&&!n?``:e.value;if(t&&`alt`in e&&e.alt)return e.alt;if(`children`in e)return Ei(e.children,t,n)}return Array.isArray(e)?Ei(e,t,n):``}function Ei(e,t,n){let r=[],i=-1;for(;++i<e.length;)r[i]=Ti(e[i],t,n);return r.join(``)}function Di(e){return!!(e&&typeof e==`object`)}var Oi=document.createElement(`i`);function ki(e){let t=`&`+e+`;`;Oi.innerHTML=t;let n=Oi.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`?!1:n!==t&&n}function Ai(e,t,n,r){let i=e.length,a=0,o;if(t=t<0?-t>i?0:i+t:t>i?i:t,n=n>0?n:0,r.length<1e4)o=Array.from(r),o.unshift(t,n),e.splice(...o);else for(n&&e.splice(t,n);a<r.length;)o=r.slice(a,a+1e4),o.unshift(t,0),e.splice(...o),a+=1e4,t+=1e4}function ji(e,t){return e.length>0?(Ai(e,e.length,0,t),e):t}var Mi={}.hasOwnProperty;function Ni(e){let t={},n=-1;for(;++n<e.length;)Pi(t,e[n]);return t}function Pi(e,t){let n;for(n in t){let r=(Mi.call(e,n)?e[n]:void 0)||(e[n]={}),i=t[n],a;if(i)for(a in i){Mi.call(r,a)||(r[a]=[]);let e=i[a];Fi(r[a],Array.isArray(e)?e:e?[e]:[])}}}function Fi(e,t){let n=-1,r=[];for(;++n<t.length;)(t[n].add===`after`?e:r).push(t[n]);Ai(e,0,0,r)}function Ii(e,t){let n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)==65535||(n&65535)==65534||n>1114111?`�`:String.fromCodePoint(n)}function F(e){return e.replace(/[\t\n\r ]+/g,` `).replace(/^ | $/g,``).toLowerCase().toUpperCase()}var I=Wi(/[A-Za-z]/),L=Wi(/[\dA-Za-z]/),Li=Wi(/[#-'*+\--9=?A-Z^-~]/);function Ri(e){return e!==null&&(e<32||e===127)}var zi=Wi(/\d/),Bi=Wi(/[\dA-Fa-f]/),Vi=Wi(/[!-/:-@[-`{-~]/);function R(e){return e!==null&&e<-2}function z(e){return e!==null&&(e<0||e===32)}function B(e){return e===-2||e===-1||e===32}var Hi=Wi(/\p{P}|\p{S}/u),Ui=Wi(/\s/);function Wi(e){return t;function t(t){return t!==null&&t>-1&&e.test(String.fromCharCode(t))}}function Gi(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let a=e.charCodeAt(n),o=``;if(a===37&&L(e.charCodeAt(n+1))&&L(e.charCodeAt(n+2)))i=2;else if(a<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a))||(o=String.fromCharCode(a));else if(a>55295&&a<57344){let t=e.charCodeAt(n+1);a<56320&&t>56319&&t<57344?(o=String.fromCharCode(a,t),i=1):o=`�`}else o=String.fromCharCode(a);o&&=(t.push(e.slice(r,n),encodeURIComponent(o)),r=n+i+1,``),i&&=(n+=i,0)}return t.join(``)+e.slice(r)}function V(e,t,n,r){let i=r?r-1:1/0,a=0;return o;function o(r){return B(r)?(e.enter(n),s(r)):t(r)}function s(r){return B(r)&&a++<i?(e.consume(r),s):(e.exit(n),t(r))}}var Ki={tokenize:qi};function qi(e){let t=e.attempt(this.parser.constructs.contentInitial,r,i),n;return t;function r(n){if(n===null){e.consume(n);return}return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),V(e,t,`linePrefix`)}function i(t){return e.enter(`paragraph`),a(t)}function a(t){let r=e.enter(`chunkText`,{contentType:`text`,previous:n});return n&&(n.next=r),n=r,o(t)}function o(t){if(t===null){e.exit(`chunkText`),e.exit(`paragraph`),e.consume(t);return}return R(t)?(e.consume(t),e.exit(`chunkText`),a):(e.consume(t),o)}}var Ji={tokenize:Xi},Yi={tokenize:Zi};function Xi(e){let t=this,n=[],r=0,i,a,o;return s;function s(i){if(r<n.length){let a=n[r];return t.containerState=a[1],e.attempt(a[0].continuation,c,l)(i)}return l(i)}function c(e){if(r++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,i&&v();let n=t.events.length,a=n,o;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){o=t.events[a][1].end;break}_(r);let s=n;for(;s<t.events.length;)t.events[s][1].end={...o},s++;return Ai(t.events,a+1,0,t.events.slice(n)),t.events.length=s,l(e)}return s(e)}function l(a){if(r===n.length){if(!i)return f(a);if(i.currentConstruct&&i.currentConstruct.concrete)return m(a);t.interrupt=!!(i.currentConstruct&&!i._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(Yi,u,d)(a)}function u(e){return i&&v(),_(r),f(e)}function d(e){return t.parser.lazy[t.now().line]=r!==n.length,o=t.now().offset,m(e)}function f(n){return t.containerState={},e.attempt(Yi,p,m)(n)}function p(e){return r++,n.push([t.currentConstruct,t.containerState]),f(e)}function m(n){if(n===null){i&&v(),_(0),e.consume(n);return}return i||=t.parser.flow(t.now()),e.enter(`chunkFlow`,{_tokenizer:i,contentType:`flow`,previous:a}),h(n)}function h(n){if(n===null){g(e.exit(`chunkFlow`),!0),_(0),e.consume(n);return}return R(n)?(e.consume(n),g(e.exit(`chunkFlow`)),r=0,t.interrupt=void 0,s):(e.consume(n),h)}function g(e,n){let s=t.sliceStream(e);if(n&&s.push(null),e.previous=a,a&&(a.next=e),a=e,i.defineSkip(e.start),i.write(s),t.parser.lazy[e.start.line]){let e=i.events.length;for(;e--;)if(i.events[e][1].start.offset<o&&(!i.events[e][1].end||i.events[e][1].end.offset>o))return;let n=t.events.length,a=n,s,c;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){if(s){c=t.events[a][1].end;break}s=!0}for(_(r),e=n;e<t.events.length;)t.events[e][1].end={...c},e++;Ai(t.events,a+1,0,t.events.slice(n)),t.events.length=e}}function _(r){let i=n.length;for(;i-->r;){let r=n[i];t.containerState=r[1],r[0].exit.call(t,e)}n.length=r}function v(){i.write([null]),a=void 0,i=void 0,t.containerState._closeFlow=void 0}}function Zi(e,t,n){return V(e,e.attempt(this.parser.constructs.document,t,n),`linePrefix`,this.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)}function Qi(e){if(e===null||z(e)||Ui(e))return 1;if(Hi(e))return 2}function $i(e,t,n){let r=[],i=-1;for(;++i<e.length;){let a=e[i].resolveAll;a&&!r.includes(a)&&(t=a(t,n),r.push(a))}return t}var ea={name:`attention`,resolveAll:ta,tokenize:na};function ta(e,t){let n=-1,r,i,a,o,s,c,l,u;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`attentionSequence`&&e[n][1]._close){for(r=n;r--;)if(e[r][0]===`exit`&&e[r][1].type===`attentionSequence`&&e[r][1]._open&&t.sliceSerialize(e[r][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[r][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[r][1].end.offset-e[r][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;c=e[r][1].end.offset-e[r][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1;let d={...e[r][1].end},f={...e[n][1].start};ra(d,-c),ra(f,c),o={type:c>1?`strongSequence`:`emphasisSequence`,start:d,end:{...e[r][1].end}},s={type:c>1?`strongSequence`:`emphasisSequence`,start:{...e[n][1].start},end:f},a={type:c>1?`strongText`:`emphasisText`,start:{...e[r][1].end},end:{...e[n][1].start}},i={type:c>1?`strong`:`emphasis`,start:{...o.start},end:{...s.end}},e[r][1].end={...o.start},e[n][1].start={...s.end},l=[],e[r][1].end.offset-e[r][1].start.offset&&(l=ji(l,[[`enter`,e[r][1],t],[`exit`,e[r][1],t]])),l=ji(l,[[`enter`,i,t],[`enter`,o,t],[`exit`,o,t],[`enter`,a,t]]),l=ji(l,$i(t.parser.constructs.insideSpan.null,e.slice(r+1,n),t)),l=ji(l,[[`exit`,a,t],[`enter`,s,t],[`exit`,s,t],[`exit`,i,t]]),e[n][1].end.offset-e[n][1].start.offset?(u=2,l=ji(l,[[`enter`,e[n][1],t],[`exit`,e[n][1],t]])):u=0,Ai(e,r-1,n-r+3,l),n=r+l.length-u-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`attentionSequence`&&(e[n][1].type=`data`);return e}function na(e,t){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=Qi(r),a;return o;function o(t){return a=t,e.enter(`attentionSequence`),s(t)}function s(o){if(o===a)return e.consume(o),s;let c=e.exit(`attentionSequence`),l=Qi(o),u=!l||l===2&&i||n.includes(o),d=!i||i===2&&l||n.includes(r);return c._open=!!(a===42?u:u&&(i||!d)),c._close=!!(a===42?d:d&&(l||!u)),t(o)}}function ra(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}var ia={name:`autolink`,tokenize:aa};function aa(e,t,n){let r=0;return i;function i(t){return e.enter(`autolink`),e.enter(`autolinkMarker`),e.consume(t),e.exit(`autolinkMarker`),e.enter(`autolinkProtocol`),a}function a(t){return I(t)?(e.consume(t),o):t===64?n(t):l(t)}function o(e){return e===43||e===45||e===46||L(e)?(r=1,s(e)):l(e)}function s(t){return t===58?(e.consume(t),r=0,c):(t===43||t===45||t===46||L(t))&&r++<32?(e.consume(t),s):(r=0,l(t))}function c(r){return r===62?(e.exit(`autolinkProtocol`),e.enter(`autolinkMarker`),e.consume(r),e.exit(`autolinkMarker`),e.exit(`autolink`),t):r===null||r===32||r===60||Ri(r)?n(r):(e.consume(r),c)}function l(t){return t===64?(e.consume(t),u):Li(t)?(e.consume(t),l):n(t)}function u(e){return L(e)?d(e):n(e)}function d(n){return n===46?(e.consume(n),r=0,u):n===62?(e.exit(`autolinkProtocol`).type=`autolinkEmail`,e.enter(`autolinkMarker`),e.consume(n),e.exit(`autolinkMarker`),e.exit(`autolink`),t):f(n)}function f(t){if((t===45||L(t))&&r++<63){let n=t===45?f:d;return e.consume(t),n}return n(t)}}var oa={partial:!0,tokenize:sa};function sa(e,t,n){return r;function r(t){return B(t)?V(e,i,`linePrefix`)(t):i(t)}function i(e){return e===null||R(e)?t(e):n(e)}}var ca={continuation:{tokenize:ua},exit:da,name:`blockQuote`,tokenize:la};function la(e,t,n){let r=this;return i;function i(t){if(t===62){let n=r.containerState;return n.open||=(e.enter(`blockQuote`,{_container:!0}),!0),e.enter(`blockQuotePrefix`),e.enter(`blockQuoteMarker`),e.consume(t),e.exit(`blockQuoteMarker`),a}return n(t)}function a(n){return B(n)?(e.enter(`blockQuotePrefixWhitespace`),e.consume(n),e.exit(`blockQuotePrefixWhitespace`),e.exit(`blockQuotePrefix`),t):(e.exit(`blockQuotePrefix`),t(n))}}function ua(e,t,n){let r=this;return i;function i(t){return B(t)?V(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):a(t)}function a(r){return e.attempt(ca,t,n)(r)}}function da(e){e.exit(`blockQuote`)}var fa={name:`characterEscape`,tokenize:pa};function pa(e,t,n){return r;function r(t){return e.enter(`characterEscape`),e.enter(`escapeMarker`),e.consume(t),e.exit(`escapeMarker`),i}function i(r){return Vi(r)?(e.enter(`characterEscapeValue`),e.consume(r),e.exit(`characterEscapeValue`),e.exit(`characterEscape`),t):n(r)}}var ma={name:`characterReference`,tokenize:ha};function ha(e,t,n){let r=this,i=0,a,o;return s;function s(t){return e.enter(`characterReference`),e.enter(`characterReferenceMarker`),e.consume(t),e.exit(`characterReferenceMarker`),c}function c(t){return t===35?(e.enter(`characterReferenceMarkerNumeric`),e.consume(t),e.exit(`characterReferenceMarkerNumeric`),l):(e.enter(`characterReferenceValue`),a=31,o=L,u(t))}function l(t){return t===88||t===120?(e.enter(`characterReferenceMarkerHexadecimal`),e.consume(t),e.exit(`characterReferenceMarkerHexadecimal`),e.enter(`characterReferenceValue`),a=6,o=Bi,u):(e.enter(`characterReferenceValue`),a=7,o=zi,u(t))}function u(s){if(s===59&&i){let i=e.exit(`characterReferenceValue`);return o===L&&!ki(r.sliceSerialize(i))?n(s):(e.enter(`characterReferenceMarker`),e.consume(s),e.exit(`characterReferenceMarker`),e.exit(`characterReference`),t)}return o(s)&&i++<a?(e.consume(s),u):n(s)}}var ga={partial:!0,tokenize:ya},_a={concrete:!0,name:`codeFenced`,tokenize:va};function va(e,t,n){let r=this,i={partial:!0,tokenize:x},a=0,o=0,s;return c;function c(e){return l(e)}function l(t){let n=r.events[r.events.length-1];return a=n&&n[1].type===`linePrefix`?n[2].sliceSerialize(n[1],!0).length:0,s=t,e.enter(`codeFenced`),e.enter(`codeFencedFence`),e.enter(`codeFencedFenceSequence`),u(t)}function u(t){return t===s?(o++,e.consume(t),u):o<3?n(t):(e.exit(`codeFencedFenceSequence`),B(t)?V(e,d,`whitespace`)(t):d(t))}function d(n){return n===null||R(n)?(e.exit(`codeFencedFence`),r.interrupt?t(n):e.check(ga,h,b)(n)):(e.enter(`codeFencedFenceInfo`),e.enter(`chunkString`,{contentType:`string`}),f(n))}function f(t){return t===null||R(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),d(t)):B(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),V(e,p,`whitespace`)(t)):t===96&&t===s?n(t):(e.consume(t),f)}function p(t){return t===null||R(t)?d(t):(e.enter(`codeFencedFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),m(t))}function m(t){return t===null||R(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceMeta`),d(t)):t===96&&t===s?n(t):(e.consume(t),m)}function h(t){return e.attempt(i,b,g)(t)}function g(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),_}function _(t){return a>0&&B(t)?V(e,v,`linePrefix`,a+1)(t):v(t)}function v(t){return t===null||R(t)?e.check(ga,h,b)(t):(e.enter(`codeFlowValue`),y(t))}function y(t){return t===null||R(t)?(e.exit(`codeFlowValue`),v(t)):(e.consume(t),y)}function b(n){return e.exit(`codeFenced`),t(n)}function x(e,t,n){let i=0;return a;function a(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c}function c(t){return e.enter(`codeFencedFence`),B(t)?V(e,l,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):l(t)}function l(t){return t===s?(e.enter(`codeFencedFenceSequence`),u(t)):n(t)}function u(t){return t===s?(i++,e.consume(t),u):i>=o?(e.exit(`codeFencedFenceSequence`),B(t)?V(e,d,`whitespace`)(t):d(t)):n(t)}function d(r){return r===null||R(r)?(e.exit(`codeFencedFence`),t(r)):n(r)}}}function ya(e,t,n){let r=this;return i;function i(t){return t===null?n(t):(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}var ba={name:`codeIndented`,tokenize:Sa},xa={partial:!0,tokenize:Ca};function Sa(e,t,n){let r=this;return i;function i(t){return e.enter(`codeIndented`),V(e,a,`linePrefix`,5)(t)}function a(e){let t=r.events[r.events.length-1];return t&&t[1].type===`linePrefix`&&t[2].sliceSerialize(t[1],!0).length>=4?o(e):n(e)}function o(t){return t===null?c(t):R(t)?e.attempt(xa,o,c)(t):(e.enter(`codeFlowValue`),s(t))}function s(t){return t===null||R(t)?(e.exit(`codeFlowValue`),o(t)):(e.consume(t),s)}function c(n){return e.exit(`codeIndented`),t(n)}}function Ca(e,t,n){let r=this;return i;function i(t){return r.parser.lazy[r.now().line]?n(t):R(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),i):V(e,a,`linePrefix`,5)(t)}function a(e){let a=r.events[r.events.length-1];return a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(e):R(e)?i(e):n(e)}}var wa={name:`codeText`,previous:Ea,resolve:Ta,tokenize:Da};function Ta(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`codeTextData`){e[n][1].type=`codeTextPadding`,e[t][1].type=`codeTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`codeTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function Ea(e){return e!==96||this.events[this.events.length-1][1].type===`characterEscape`}function Da(e,t,n){let r=0,i,a;return o;function o(t){return e.enter(`codeText`),e.enter(`codeTextSequence`),s(t)}function s(t){return t===96?(e.consume(t),r++,s):(e.exit(`codeTextSequence`),c(t))}function c(t){return t===null?n(t):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),c):t===96?(a=e.enter(`codeTextSequence`),i=0,u(t)):R(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c):(e.enter(`codeTextData`),l(t))}function l(t){return t===null||t===32||t===96||R(t)?(e.exit(`codeTextData`),c(t)):(e.consume(t),l)}function u(n){return n===96?(e.consume(n),i++,u):i===r?(e.exit(`codeTextSequence`),e.exit(`codeText`),t(n)):(a.type=`codeTextData`,l(n))}}var Oa=class{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,t){let n=t??1/0;return n<this.left.length?this.left.slice(e,n):e>this.left.length?this.right.slice(this.right.length-n+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-n+this.left.length).reverse())}splice(e,t,n){let r=t||0;this.setCursor(Math.trunc(e));let i=this.right.splice(this.right.length-r,1/0);return n&&ka(this.left,n),i.reverse()}pop(){return this.setCursor(1/0),this.left.pop()}push(e){this.setCursor(1/0),this.left.push(e)}pushMany(e){this.setCursor(1/0),ka(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),ka(this.right,e.reverse())}setCursor(e){if(!(e===this.left.length||e>this.left.length&&this.right.length===0||e<0&&this.left.length===0)){if(e<this.left.length){let t=this.left.splice(e,1/0);ka(this.right,t.reverse())}else{let t=this.right.splice(this.left.length+this.right.length-e,1/0);ka(this.left,t.reverse())}}}};function ka(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function Aa(e){let t={},n=-1,r,i,a,o,s,c,l,u=new Oa(e);for(;++n<u.length;){for(;n in t;)n=t[n];if(r=u.get(n),n&&r[1].type===`chunkFlow`&&u.get(n-1)[1].type===`listItemPrefix`&&(c=r[1]._tokenizer.events,a=0,a<c.length&&c[a][1].type===`lineEndingBlank`&&(a+=2),a<c.length&&c[a][1].type===`content`))for(;++a<c.length&&c[a][1].type!==`content`;)c[a][1].type===`chunkText`&&(c[a][1]._isInFirstContentOfListItem=!0,a++);if(r[0]===`enter`)r[1].contentType&&(Object.assign(t,ja(u,n)),n=t[n],l=!0);else if(r[1]._container){for(a=n,i=void 0;a--;)if(o=u.get(a),o[1].type===`lineEnding`||o[1].type===`lineEndingBlank`)o[0]===`enter`&&(i&&(u.get(i)[1].type=`lineEndingBlank`),o[1].type=`lineEnding`,i=a);else if(o[1].type!==`linePrefix`&&o[1].type!==`listItemIndent`)break;i&&(r[1].end={...u.get(i)[1].start},s=u.slice(i,n),s.unshift(r),u.splice(i,n-i+1,s))}}return Ai(e,0,1/0,u.slice(0)),!l}function ja(e,t){let n=e.get(t)[1],r=e.get(t)[2],i=t-1,a=[],o=n._tokenizer;o||(o=r.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(o._contentTypeTextTrailing=!0));let s=o.events,c=[],l={},u,d,f=-1,p=n,m=0,h=0,g=[h];for(;p;){for(;e.get(++i)[1]!==p;);a.push(i),p._tokenizer||(u=r.sliceStream(p),p.next||u.push(null),d&&o.defineSkip(p.start),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=!0),o.write(u),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=void 0)),d=p,p=p.next}for(p=n;++f<s.length;)s[f][0]===`exit`&&s[f-1][0]===`enter`&&s[f][1].type===s[f-1][1].type&&s[f][1].start.line!==s[f][1].end.line&&(h=f+1,g.push(h),p._tokenizer=void 0,p.previous=void 0,p=p.next);for(o.events=[],p?(p._tokenizer=void 0,p.previous=void 0):g.pop(),f=g.length;f--;){let t=s.slice(g[f],g[f+1]),n=a.pop();c.push([n,n+t.length-1]),e.splice(n,2,t)}for(c.reverse(),f=-1;++f<c.length;)l[m+c[f][0]]=m+c[f][1],m+=c[f][1]-c[f][0]-1;return l}var Ma={resolve:Pa,tokenize:Fa},Na={partial:!0,tokenize:Ia};function Pa(e){return Aa(e),e}function Fa(e,t){let n;return r;function r(t){return e.enter(`content`),n=e.enter(`chunkContent`,{contentType:`content`}),i(t)}function i(t){return t===null?a(t):R(t)?e.check(Na,o,a)(t):(e.consume(t),i)}function a(n){return e.exit(`chunkContent`),e.exit(`content`),t(n)}function o(t){return e.consume(t),e.exit(`chunkContent`),n.next=e.enter(`chunkContent`,{contentType:`content`,previous:n}),n=n.next,i}}function Ia(e,t,n){let r=this;return i;function i(t){return e.exit(`chunkContent`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),V(e,a,`linePrefix`)}function a(i){if(i===null||R(i))return n(i);let a=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes(`codeIndented`)&&a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(i):e.interrupt(r.parser.constructs.flow,n,t)(i)}}function La(e,t,n,r,i,a,o,s,c){let l=c||1/0,u=0;return d;function d(t){return t===60?(e.enter(r),e.enter(i),e.enter(a),e.consume(t),e.exit(a),f):t===null||t===32||t===41||Ri(t)?n(t):(e.enter(r),e.enter(o),e.enter(s),e.enter(`chunkString`,{contentType:`string`}),h(t))}function f(n){return n===62?(e.enter(a),e.consume(n),e.exit(a),e.exit(i),e.exit(r),t):(e.enter(s),e.enter(`chunkString`,{contentType:`string`}),p(n))}function p(t){return t===62?(e.exit(`chunkString`),e.exit(s),f(t)):t===null||t===60||R(t)?n(t):(e.consume(t),t===92?m:p)}function m(t){return t===60||t===62||t===92?(e.consume(t),p):p(t)}function h(i){return!u&&(i===null||i===41||z(i))?(e.exit(`chunkString`),e.exit(s),e.exit(o),e.exit(r),t(i)):u<l&&i===40?(e.consume(i),u++,h):i===41?(e.consume(i),u--,h):i===null||i===32||i===40||Ri(i)?n(i):(e.consume(i),i===92?g:h)}function g(t){return t===40||t===41||t===92?(e.consume(t),h):h(t)}}function Ra(e,t,n,r,i,a){let o=this,s=0,c;return l;function l(t){return e.enter(r),e.enter(i),e.consume(t),e.exit(i),e.enter(a),u}function u(l){return s>999||l===null||l===91||l===93&&!c||l===94&&!s&&`_hiddenFootnoteSupport`in o.parser.constructs?n(l):l===93?(e.exit(a),e.enter(i),e.consume(l),e.exit(i),e.exit(r),t):R(l)?(e.enter(`lineEnding`),e.consume(l),e.exit(`lineEnding`),u):(e.enter(`chunkString`,{contentType:`string`}),d(l))}function d(t){return t===null||t===91||t===93||R(t)||s++>999?(e.exit(`chunkString`),u(t)):(e.consume(t),c||=!B(t),t===92?f:d)}function f(t){return t===91||t===92||t===93?(e.consume(t),s++,d):d(t)}}function za(e,t,n,r,i,a){let o;return s;function s(t){return t===34||t===39||t===40?(e.enter(r),e.enter(i),e.consume(t),e.exit(i),o=t===40?41:t,c):n(t)}function c(n){return n===o?(e.enter(i),e.consume(n),e.exit(i),e.exit(r),t):(e.enter(a),l(n))}function l(t){return t===o?(e.exit(a),c(o)):t===null?n(t):R(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),V(e,l,`linePrefix`)):(e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===o||t===null||R(t)?(e.exit(`chunkString`),l(t)):(e.consume(t),t===92?d:u)}function d(t){return t===o||t===92?(e.consume(t),u):u(t)}}function Ba(e,t){let n;return r;function r(i){return R(i)?(e.enter(`lineEnding`),e.consume(i),e.exit(`lineEnding`),n=!0,r):B(i)?V(e,r,n?`linePrefix`:`lineSuffix`)(i):t(i)}}var Va={name:`definition`,tokenize:Ua},Ha={partial:!0,tokenize:Wa};function Ua(e,t,n){let r=this,i;return a;function a(t){return e.enter(`definition`),o(t)}function o(t){return Ra.call(r,e,s,n,`definitionLabel`,`definitionLabelMarker`,`definitionLabelString`)(t)}function s(t){return i=F(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),c):n(t)}function c(t){return z(t)?Ba(e,l)(t):l(t)}function l(t){return La(e,u,n,`definitionDestination`,`definitionDestinationLiteral`,`definitionDestinationLiteralMarker`,`definitionDestinationRaw`,`definitionDestinationString`)(t)}function u(t){return e.attempt(Ha,d,d)(t)}function d(t){return B(t)?V(e,f,`whitespace`)(t):f(t)}function f(a){return a===null||R(a)?(e.exit(`definition`),r.parser.defined.push(i),t(a)):n(a)}}function Wa(e,t,n){return r;function r(t){return z(t)?Ba(e,i)(t):n(t)}function i(t){return za(e,a,n,`definitionTitle`,`definitionTitleMarker`,`definitionTitleString`)(t)}function a(t){return B(t)?V(e,o,`whitespace`)(t):o(t)}function o(e){return e===null||R(e)?t(e):n(e)}}var Ga={name:`hardBreakEscape`,tokenize:Ka};function Ka(e,t,n){return r;function r(t){return e.enter(`hardBreakEscape`),e.consume(t),i}function i(r){return R(r)?(e.exit(`hardBreakEscape`),t(r)):n(r)}}var qa={name:`headingAtx`,resolve:Ja,tokenize:Ya};function Ja(e,t){let n=e.length-2,r=3,i,a;return e[r][1].type===`whitespace`&&(r+=2),n-2>r&&e[n][1].type===`whitespace`&&(n-=2),e[n][1].type===`atxHeadingSequence`&&(r===n-1||n-4>r&&e[n-2][1].type===`whitespace`)&&(n-=r+1===n?2:4),n>r&&(i={type:`atxHeadingText`,start:e[r][1].start,end:e[n][1].end},a={type:`chunkText`,start:e[r][1].start,end:e[n][1].end,contentType:`text`},Ai(e,r,n-r+1,[[`enter`,i,t],[`enter`,a,t],[`exit`,a,t],[`exit`,i,t]])),e}function Ya(e,t,n){let r=0;return i;function i(t){return e.enter(`atxHeading`),a(t)}function a(t){return e.enter(`atxHeadingSequence`),o(t)}function o(t){return t===35&&r++<6?(e.consume(t),o):t===null||z(t)?(e.exit(`atxHeadingSequence`),s(t)):n(t)}function s(n){return n===35?(e.enter(`atxHeadingSequence`),c(n)):n===null||R(n)?(e.exit(`atxHeading`),t(n)):B(n)?V(e,s,`whitespace`)(n):(e.enter(`atxHeadingText`),l(n))}function c(t){return t===35?(e.consume(t),c):(e.exit(`atxHeadingSequence`),s(t))}function l(t){return t===null||t===35||z(t)?(e.exit(`atxHeadingText`),s(t)):(e.consume(t),l)}}var Xa=`address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul`.split(`.`),Za=[`pre`,`script`,`style`,`textarea`],Qa={concrete:!0,name:`htmlFlow`,resolveTo:to,tokenize:no},$a={partial:!0,tokenize:io},eo={partial:!0,tokenize:ro};function to(e){let t=e.length;for(;t--&&(e[t][0]!==`enter`||e[t][1].type!==`htmlFlow`););return t>1&&e[t-2][1].type===`linePrefix`&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function no(e,t,n){let r=this,i,a,o,s,c;return l;function l(e){return u(e)}function u(t){return e.enter(`htmlFlow`),e.enter(`htmlFlowData`),e.consume(t),d}function d(s){return s===33?(e.consume(s),f):s===47?(e.consume(s),a=!0,h):s===63?(e.consume(s),i=3,r.interrupt?t:O):I(s)?(e.consume(s),o=String.fromCharCode(s),g):n(s)}function f(a){return a===45?(e.consume(a),i=2,p):a===91?(e.consume(a),i=5,s=0,m):I(a)?(e.consume(a),i=4,r.interrupt?t:O):n(a)}function p(i){return i===45?(e.consume(i),r.interrupt?t:O):n(i)}function m(i){return i===`CDATA[`.charCodeAt(s++)?(e.consume(i),s===6?r.interrupt?t:E:m):n(i)}function h(t){return I(t)?(e.consume(t),o=String.fromCharCode(t),g):n(t)}function g(s){if(s===null||s===47||s===62||z(s)){let c=s===47,l=o.toLowerCase();return!c&&!a&&Za.includes(l)?(i=1,r.interrupt?t(s):E(s)):Xa.includes(o.toLowerCase())?(i=6,c?(e.consume(s),_):r.interrupt?t(s):E(s)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(s):a?v(s):y(s))}return s===45||L(s)?(e.consume(s),o+=String.fromCharCode(s),g):n(s)}function _(i){return i===62?(e.consume(i),r.interrupt?t:E):n(i)}function v(t){return B(t)?(e.consume(t),v):T(t)}function y(t){return t===47?(e.consume(t),T):t===58||t===95||I(t)?(e.consume(t),b):B(t)?(e.consume(t),y):T(t)}function b(t){return t===45||t===46||t===58||t===95||L(t)?(e.consume(t),b):x(t)}function x(t){return t===61?(e.consume(t),ee):B(t)?(e.consume(t),x):y(t)}function ee(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),c=t,S):B(t)?(e.consume(t),ee):C(t)}function S(t){return t===c?(e.consume(t),c=null,w):t===null||R(t)?n(t):(e.consume(t),S)}function C(t){return t===null||t===34||t===39||t===47||t===60||t===61||t===62||t===96||z(t)?x(t):(e.consume(t),C)}function w(e){return e===47||e===62||B(e)?y(e):n(e)}function T(t){return t===62?(e.consume(t),te):n(t)}function te(t){return t===null||R(t)?E(t):B(t)?(e.consume(t),te):n(t)}function E(t){return t===45&&i===2?(e.consume(t),ie):t===60&&i===1?(e.consume(t),ae):t===62&&i===4?(e.consume(t),k):t===63&&i===3?(e.consume(t),O):t===93&&i===5?(e.consume(t),se):R(t)&&(i===6||i===7)?(e.exit(`htmlFlowData`),e.check($a,ce,ne)(t)):t===null||R(t)?(e.exit(`htmlFlowData`),ne(t)):(e.consume(t),E)}function ne(t){return e.check(eo,D,ce)(t)}function D(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),re}function re(t){return t===null||R(t)?ne(t):(e.enter(`htmlFlowData`),E(t))}function ie(t){return t===45?(e.consume(t),O):E(t)}function ae(t){return t===47?(e.consume(t),o=``,oe):E(t)}function oe(t){if(t===62){let n=o.toLowerCase();return Za.includes(n)?(e.consume(t),k):E(t)}return I(t)&&o.length<8?(e.consume(t),o+=String.fromCharCode(t),oe):E(t)}function se(t){return t===93?(e.consume(t),O):E(t)}function O(t){return t===62?(e.consume(t),k):t===45&&i===2?(e.consume(t),O):E(t)}function k(t){return t===null||R(t)?(e.exit(`htmlFlowData`),ce(t)):(e.consume(t),k)}function ce(n){return e.exit(`htmlFlow`),t(n)}}function ro(e,t,n){let r=this;return i;function i(t){return R(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a):n(t)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}function io(e,t,n){return r;function r(r){return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),e.attempt(oa,t,n)}}var ao={name:`htmlText`,tokenize:oo};function oo(e,t,n){let r=this,i,a,o;return s;function s(t){return e.enter(`htmlText`),e.enter(`htmlTextData`),e.consume(t),c}function c(t){return t===33?(e.consume(t),l):t===47?(e.consume(t),x):t===63?(e.consume(t),y):I(t)?(e.consume(t),C):n(t)}function l(t){return t===45?(e.consume(t),u):t===91?(e.consume(t),a=0,m):I(t)?(e.consume(t),v):n(t)}function u(t){return t===45?(e.consume(t),p):n(t)}function d(t){return t===null?n(t):t===45?(e.consume(t),f):R(t)?(o=d,ae(t)):(e.consume(t),d)}function f(t){return t===45?(e.consume(t),p):d(t)}function p(e){return e===62?ie(e):e===45?f(e):d(e)}function m(t){return t===`CDATA[`.charCodeAt(a++)?(e.consume(t),a===6?h:m):n(t)}function h(t){return t===null?n(t):t===93?(e.consume(t),g):R(t)?(o=h,ae(t)):(e.consume(t),h)}function g(t){return t===93?(e.consume(t),_):h(t)}function _(t){return t===62?ie(t):t===93?(e.consume(t),_):h(t)}function v(t){return t===null||t===62?ie(t):R(t)?(o=v,ae(t)):(e.consume(t),v)}function y(t){return t===null?n(t):t===63?(e.consume(t),b):R(t)?(o=y,ae(t)):(e.consume(t),y)}function b(e){return e===62?ie(e):y(e)}function x(t){return I(t)?(e.consume(t),ee):n(t)}function ee(t){return t===45||L(t)?(e.consume(t),ee):S(t)}function S(t){return R(t)?(o=S,ae(t)):B(t)?(e.consume(t),S):ie(t)}function C(t){return t===45||L(t)?(e.consume(t),C):t===47||t===62||z(t)?w(t):n(t)}function w(t){return t===47?(e.consume(t),ie):t===58||t===95||I(t)?(e.consume(t),T):R(t)?(o=w,ae(t)):B(t)?(e.consume(t),w):ie(t)}function T(t){return t===45||t===46||t===58||t===95||L(t)?(e.consume(t),T):te(t)}function te(t){return t===61?(e.consume(t),E):R(t)?(o=te,ae(t)):B(t)?(e.consume(t),te):w(t)}function E(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),i=t,ne):R(t)?(o=E,ae(t)):B(t)?(e.consume(t),E):(e.consume(t),D)}function ne(t){return t===i?(e.consume(t),i=void 0,re):t===null?n(t):R(t)?(o=ne,ae(t)):(e.consume(t),ne)}function D(t){return t===null||t===34||t===39||t===60||t===61||t===96?n(t):t===47||t===62||z(t)?w(t):(e.consume(t),D)}function re(e){return e===47||e===62||z(e)?w(e):n(e)}function ie(r){return r===62?(e.consume(r),e.exit(`htmlTextData`),e.exit(`htmlText`),t):n(r)}function ae(t){return e.exit(`htmlTextData`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),oe}function oe(t){return B(t)?V(e,se,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):se(t)}function se(t){return e.enter(`htmlTextData`),o(t)}}var so={name:`labelEnd`,resolveAll:H,resolveTo:U,tokenize:fo},co={tokenize:po},lo={tokenize:mo},uo={tokenize:ho};function H(e){let t=-1,n=[];for(;++t<e.length;){let r=e[t][1];if(n.push(e[t]),r.type===`labelImage`||r.type===`labelLink`||r.type===`labelEnd`){let e=r.type===`labelImage`?4:2;r.type=`data`,t+=e}}return e.length!==n.length&&Ai(e,0,e.length,n),e}function U(e,t){let n=e.length,r=0,i,a,o,s;for(;n--;)if(i=e[n][1],a){if(i.type===`link`||i.type===`labelLink`&&i._inactive)break;e[n][0]===`enter`&&i.type===`labelLink`&&(i._inactive=!0)}else if(o){if(e[n][0]===`enter`&&(i.type===`labelImage`||i.type===`labelLink`)&&!i._balanced&&(a=n,i.type!==`labelLink`)){r=2;break}}else i.type===`labelEnd`&&(o=n);let c={type:e[a][1].type===`labelLink`?`link`:`image`,start:{...e[a][1].start},end:{...e[e.length-1][1].end}},l={type:`label`,start:{...e[a][1].start},end:{...e[o][1].end}},u={type:`labelText`,start:{...e[a+r+2][1].end},end:{...e[o-2][1].start}};return s=[[`enter`,c,t],[`enter`,l,t]],s=ji(s,e.slice(a+1,a+r+3)),s=ji(s,[[`enter`,u,t]]),s=ji(s,$i(t.parser.constructs.insideSpan.null,e.slice(a+r+4,o-3),t)),s=ji(s,[[`exit`,u,t],e[o-2],e[o-1],[`exit`,l,t]]),s=ji(s,e.slice(o+1)),s=ji(s,[[`exit`,c,t]]),Ai(e,a,e.length,s),e}function fo(e,t,n){let r=this,i=r.events.length,a,o;for(;i--;)if((r.events[i][1].type===`labelImage`||r.events[i][1].type===`labelLink`)&&!r.events[i][1]._balanced){a=r.events[i][1];break}return s;function s(t){return a?a._inactive?d(t):(o=r.parser.defined.includes(F(r.sliceSerialize({start:a.end,end:r.now()}))),e.enter(`labelEnd`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelEnd`),c):n(t)}function c(t){return t===40?e.attempt(co,u,o?u:d)(t):t===91?e.attempt(lo,u,o?l:d)(t):o?u(t):d(t)}function l(t){return e.attempt(uo,u,d)(t)}function u(e){return t(e)}function d(e){return a._balanced=!0,n(e)}}function po(e,t,n){return r;function r(t){return e.enter(`resource`),e.enter(`resourceMarker`),e.consume(t),e.exit(`resourceMarker`),i}function i(t){return z(t)?Ba(e,a)(t):a(t)}function a(t){return t===41?u(t):La(e,o,s,`resourceDestination`,`resourceDestinationLiteral`,`resourceDestinationLiteralMarker`,`resourceDestinationRaw`,`resourceDestinationString`,32)(t)}function o(t){return z(t)?Ba(e,c)(t):u(t)}function s(e){return n(e)}function c(t){return t===34||t===39||t===40?za(e,l,n,`resourceTitle`,`resourceTitleMarker`,`resourceTitleString`)(t):u(t)}function l(t){return z(t)?Ba(e,u)(t):u(t)}function u(r){return r===41?(e.enter(`resourceMarker`),e.consume(r),e.exit(`resourceMarker`),e.exit(`resource`),t):n(r)}}function mo(e,t,n){let r=this;return i;function i(t){return Ra.call(r,e,a,o,`reference`,`referenceMarker`,`referenceString`)(t)}function a(e){return r.parser.defined.includes(F(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(e):n(e)}function o(e){return n(e)}}function ho(e,t,n){return r;function r(t){return e.enter(`reference`),e.enter(`referenceMarker`),e.consume(t),e.exit(`referenceMarker`),i}function i(r){return r===93?(e.enter(`referenceMarker`),e.consume(r),e.exit(`referenceMarker`),e.exit(`reference`),t):n(r)}}var go={name:`labelStartImage`,resolveAll:so.resolveAll,tokenize:_o};function _o(e,t,n){let r=this;return i;function i(t){return e.enter(`labelImage`),e.enter(`labelImageMarker`),e.consume(t),e.exit(`labelImageMarker`),a}function a(t){return t===91?(e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelImage`),o):n(t)}function o(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var vo={name:`labelStartLink`,resolveAll:so.resolveAll,tokenize:yo};function yo(e,t,n){let r=this;return i;function i(t){return e.enter(`labelLink`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelLink`),a}function a(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var bo={name:`lineEnding`,tokenize:xo};function xo(e,t){return n;function n(n){return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),V(e,t,`linePrefix`)}}var So={name:`thematicBreak`,tokenize:Co};function Co(e,t,n){let r=0,i;return a;function a(t){return e.enter(`thematicBreak`),o(t)}function o(e){return i=e,s(e)}function s(a){return a===i?(e.enter(`thematicBreakSequence`),c(a)):r>=3&&(a===null||R(a))?(e.exit(`thematicBreak`),t(a)):n(a)}function c(t){return t===i?(e.consume(t),r++,c):(e.exit(`thematicBreakSequence`),B(t)?V(e,s,`whitespace`)(t):s(t))}}var wo={continuation:{tokenize:Oo},exit:Ao,name:`list`,tokenize:Do},To={partial:!0,tokenize:jo},Eo={partial:!0,tokenize:ko};function Do(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){let i=r.containerState.type||(t===42||t===43||t===45?`listUnordered`:`listOrdered`);if(i===`listUnordered`?!r.containerState.marker||t===r.containerState.marker:zi(t)){if(r.containerState.type||(r.containerState.type=i,e.enter(i,{_container:!0})),i===`listUnordered`)return e.enter(`listItemPrefix`),t===42||t===45?e.check(So,n,l)(t):l(t);if(!r.interrupt||t===49)return e.enter(`listItemPrefix`),e.enter(`listItemValue`),c(t)}return n(t)}function c(t){return zi(t)&&++o<10?(e.consume(t),c):(!r.interrupt||o<2)&&(r.containerState.marker?t===r.containerState.marker:t===41||t===46)?(e.exit(`listItemValue`),l(t)):n(t)}function l(t){return e.enter(`listItemMarker`),e.consume(t),e.exit(`listItemMarker`),r.containerState.marker=r.containerState.marker||t,e.check(oa,r.interrupt?n:u,e.attempt(To,f,d))}function u(e){return r.containerState.initialBlankLine=!0,a++,f(e)}function d(t){return B(t)?(e.enter(`listItemPrefixWhitespace`),e.consume(t),e.exit(`listItemPrefixWhitespace`),f):n(t)}function f(n){return r.containerState.size=a+r.sliceSerialize(e.exit(`listItemPrefix`),!0).length,t(n)}}function Oo(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(oa,i,a);function i(n){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,V(e,t,`listItemIndent`,r.containerState.size+1)(n)}function a(n){return r.containerState.furtherBlankLines||!B(n)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,o(n)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(Eo,t,o)(n))}function o(i){return r.containerState._closeFlow=!0,r.interrupt=void 0,V(e,e.attempt(wo,t,n),`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(i)}}function ko(e,t,n){let r=this;return V(e,i,`listItemIndent`,r.containerState.size+1);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`listItemIndent`&&i[2].sliceSerialize(i[1],!0).length===r.containerState.size?t(e):n(e)}}function Ao(e){e.exit(this.containerState.type)}function jo(e,t,n){let r=this;return V(e,i,`listItemPrefixWhitespace`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:5);function i(e){let i=r.events[r.events.length-1];return!B(e)&&i&&i[1].type===`listItemPrefixWhitespace`?t(e):n(e)}}var Mo={name:`setextUnderline`,resolveTo:No,tokenize:Po};function No(e,t){let n=e.length,r,i,a;for(;n--;)if(e[n][0]===`enter`){if(e[n][1].type===`content`){r=n;break}e[n][1].type===`paragraph`&&(i=n)}else e[n][1].type===`content`&&e.splice(n,1),!a&&e[n][1].type===`definition`&&(a=n);let o={type:`setextHeading`,start:{...e[r][1].start},end:{...e[e.length-1][1].end}};return e[i][1].type=`setextHeadingText`,a?(e.splice(i,0,[`enter`,o,t]),e.splice(a+1,0,[`exit`,e[r][1],t]),e[r][1].end={...e[a][1].end}):e[r][1]=o,e.push([`exit`,o,t]),e}function Po(e,t,n){let r=this,i;return a;function a(t){let a=r.events.length,s;for(;a--;)if(r.events[a][1].type!==`lineEnding`&&r.events[a][1].type!==`linePrefix`&&r.events[a][1].type!==`content`){s=r.events[a][1].type===`paragraph`;break}return!r.parser.lazy[r.now().line]&&(r.interrupt||s)?(e.enter(`setextHeadingLine`),i=t,o(t)):n(t)}function o(t){return e.enter(`setextHeadingLineSequence`),s(t)}function s(t){return t===i?(e.consume(t),s):(e.exit(`setextHeadingLineSequence`),B(t)?V(e,c,`lineSuffix`)(t):c(t))}function c(r){return r===null||R(r)?(e.exit(`setextHeadingLine`),t(r)):n(r)}}var Fo={tokenize:Io};function Io(e){let t=this,n=e.attempt(oa,r,e.attempt(this.parser.constructs.flowInitial,i,V(e,e.attempt(this.parser.constructs.flow,i,e.attempt(Ma,i)),`linePrefix`)));return n;function r(r){if(r===null){e.consume(r);return}return e.enter(`lineEndingBlank`),e.consume(r),e.exit(`lineEndingBlank`),t.currentConstruct=void 0,n}function i(r){if(r===null){e.consume(r);return}return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),t.currentConstruct=void 0,n}}var Lo={resolveAll:Vo()},Ro=Bo(`string`),zo=Bo(`text`);function Bo(e){return{resolveAll:Vo(e===`text`?Ho:void 0),tokenize:t};function t(t){let n=this,r=this.parser.constructs[e],i=t.attempt(r,a,o);return a;function a(e){return c(e)?i(e):o(e)}function o(e){if(e===null){t.consume(e);return}return t.enter(`data`),t.consume(e),s}function s(e){return c(e)?(t.exit(`data`),i(e)):(t.consume(e),s)}function c(e){if(e===null)return!0;let t=r[e],i=-1;if(t)for(;++i<t.length;){let e=t[i];if(!e.previous||e.previous.call(n,n.previous))return!0}return!1}}}function Vo(e){return t;function t(t,n){let r=-1,i;for(;++r<=t.length;)i===void 0?t[r]&&t[r][1].type===`data`&&(i=r,r++):(!t[r]||t[r][1].type!==`data`)&&(r!==i+2&&(t[i][1].end=t[r-1][1].end,t.splice(i+2,r-i-2),r=i+2),i=void 0);return e?e(t,n):t}}function Ho(e,t){let n=0;for(;++n<=e.length;)if((n===e.length||e[n][1].type===`lineEnding`)&&e[n-1][1].type===`data`){let r=e[n-1][1],i=t.sliceStream(r),a=i.length,o=-1,s=0,c;for(;a--;){let e=i[a];if(typeof e==`string`){for(o=e.length;e.charCodeAt(o-1)===32;)s++,o--;if(o)break;o=-1}else if(e===-2)c=!0,s++;else if(e!==-1){a++;break}}if(t._contentTypeTextTrailing&&n===e.length&&(s=0),s){let i={type:n===e.length||c||s<2?`lineSuffix`:`hardBreakTrailing`,start:{_bufferIndex:a?o:r.start._bufferIndex+o,_index:r.start._index+a,line:r.end.line,column:r.end.column-s,offset:r.end.offset-s},end:{...r.end}};r.end={...i.start},r.start.offset===r.end.offset?Object.assign(r,i):(e.splice(n,0,[`enter`,i,t],[`exit`,i,t]),n+=2)}n++}return e}var Uo=s({attentionMarkers:()=>Zo,contentInitial:()=>Go,disable:()=>Qo,document:()=>Wo,flow:()=>qo,flowInitial:()=>Ko,insideSpan:()=>Xo,string:()=>Jo,text:()=>Yo}),Wo={42:wo,43:wo,45:wo,48:wo,49:wo,50:wo,51:wo,52:wo,53:wo,54:wo,55:wo,56:wo,57:wo,62:ca},Go={91:Va},Ko={[-2]:ba,[-1]:ba,32:ba},qo={35:qa,42:So,45:[Mo,So],60:Qa,61:Mo,95:So,96:_a,126:_a},Jo={38:ma,92:fa},Yo={[-5]:bo,[-4]:bo,[-3]:bo,33:go,38:ma,42:ea,60:[ia,ao],91:vo,92:[Ga,fa],93:so,95:ea,96:wa},Xo={null:[ea,Lo]},Zo={null:[42,95]},Qo={null:[]};function $o(e,t,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},a=[],o=[],s=[],c={attempt:S(x),check:S(ee),consume:v,enter:y,exit:b,interrupt:S(ee,{interrupt:!0})},l={code:null,containerState:{},defineSkip:h,events:[],now:m,parser:e,previous:null,sliceSerialize:f,sliceStream:p,write:d},u=t.tokenize.call(l,c);return t.resolveAll&&a.push(t),l;function d(e){return o=ji(o,e),g(),o[o.length-1]===null?(C(t,0),l.events=$i(a,l.events,l),l.events):[]}function f(e,t){return ts(p(e),t)}function p(e){return es(o,e)}function m(){let{_bufferIndex:e,_index:t,line:n,column:i,offset:a}=r;return{_bufferIndex:e,_index:t,line:n,column:i,offset:a}}function h(e){i[e.line]=e.column,T()}function g(){let e;for(;r._index<o.length;){let t=o[r._index];if(typeof t==`string`)for(e=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===e&&r._bufferIndex<t.length;)_(t.charCodeAt(r._bufferIndex));else _(t)}}function _(e){u=u(e)}function v(e){R(e)?(r.line++,r.column=1,r.offset+=e===-3?2:1,T()):e!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===o[r._index].length&&(r._bufferIndex=-1,r._index++)),l.previous=e}function y(e,t){let n=t||{};return n.type=e,n.start=m(),l.events.push([`enter`,n,l]),s.push(n),n}function b(e){let t=s.pop();return t.end=m(),l.events.push([`exit`,t,l]),t}function x(e,t){C(e,t.from)}function ee(e,t){t.restore()}function S(e,t){return n;function n(n,r,i){let a,o,s,u;return Array.isArray(n)?f(n):`tokenize`in n?f([n]):d(n);function d(e){return t;function t(t){let n=t!==null&&e[t],r=t!==null&&e.null;return f([...Array.isArray(n)?n:n?[n]:[],...Array.isArray(r)?r:r?[r]:[]])(t)}}function f(e){return a=e,o=0,e.length===0?i:p(e[o])}function p(e){return n;function n(n){return u=w(),s=e,e.partial||(l.currentConstruct=e),e.name&&l.parser.constructs.disable.null.includes(e.name)?h(n):e.tokenize.call(t?Object.assign(Object.create(l),t):l,c,m,h)(n)}}function m(t){return e(s,u),r}function h(e){return u.restore(),++o<a.length?p(a[o]):i}}}function C(e,t){e.resolveAll&&!a.includes(e)&&a.push(e),e.resolve&&Ai(l.events,t,l.events.length-t,e.resolve(l.events.slice(t),l)),e.resolveTo&&(l.events=e.resolveTo(l.events,l))}function w(){let e=m(),t=l.previous,n=l.currentConstruct,i=l.events.length,a=Array.from(s);return{from:i,restore:o};function o(){r=e,l.previous=t,l.currentConstruct=n,l.events.length=i,s=a,T()}}function T(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function es(e,t){let n=t.start._index,r=t.start._bufferIndex,i=t.end._index,a=t.end._bufferIndex,o;if(n===i)o=[e[n].slice(r,a)];else{if(o=e.slice(n,i),r>-1){let e=o[0];typeof e==`string`?o[0]=e.slice(r):o.shift()}a>0&&o.push(e[i].slice(0,a))}return o}function ts(e,t){let n=-1,r=[],i;for(;++n<e.length;){let a=e[n],o;if(typeof a==`string`)o=a;else switch(a){case-5:o=`\r`;break;case-4:o=`
`;break;case-3:o=`\r
`;break;case-2:o=t?` `:`	`;break;case-1:if(!t&&i)continue;o=` `;break;default:o=String.fromCharCode(a)}i=a===-2,r.push(o)}return r.join(``)}function ns(e){let t={constructs:Ni([Uo,...(e||{}).extensions||[]]),content:n(Ki),defined:[],document:n(Ji),flow:n(Fo),lazy:{},string:n(Ro),text:n(zo)};return t;function n(e){return n;function n(n){return $o(t,e,n)}}}function rs(e){for(;!Aa(e););return e}var is=/[\0\t\n\r]/g;function as(){let e=1,t=``,n=!0,r;return i;function i(i,a,o){let s=[],c,l,u,d,f;for(i=t+(typeof i==`string`?i.toString():new TextDecoder(a||void 0).decode(i)),u=0,t=``,n&&=(i.charCodeAt(0)===65279&&u++,void 0);u<i.length;){if(is.lastIndex=u,c=is.exec(i),d=c&&c.index!==void 0?c.index:i.length,f=i.charCodeAt(d),!c){t=i.slice(u);break}if(f===10&&u===d&&r)s.push(-3),r=void 0;else switch(r&&=(s.push(-5),void 0),u<d&&(s.push(i.slice(u,d)),e+=d-u),f){case 0:s.push(65533),e++;break;case 9:for(l=Math.ceil(e/4)*4,s.push(-2);e++<l;)s.push(-1);break;case 10:s.push(-4),e=1;break;default:r=!0,e=1}u=d+1}return o&&(r&&s.push(-5),t&&s.push(t),s.push(null)),s}}var os=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function ss(e){return e.replace(os,cs)}function cs(e,t,n){if(t)return t;if(n.charCodeAt(0)===35){let e=n.charCodeAt(1),t=e===120||e===88;return Ii(n.slice(t?2:1),t?16:10)}return ki(n)||e}var ls={}.hasOwnProperty;function us(e,t,n){return t&&typeof t==`object`&&(n=t,t=void 0),ds(n)(rs(ns(n).document().write(as()(e,t,!0))))}function ds(e){let t={transforms:[],canContainEols:[`emphasis`,`fragment`,`heading`,`paragraph`,`strong`],enter:{autolink:a(we),autolinkProtocol:w,autolinkEmail:w,atxHeading:a(be),blockQuote:a(he),characterEscape:w,characterReference:w,codeFenced:a(ge),codeFencedFenceInfo:o,codeFencedFenceMeta:o,codeIndented:a(ge,o),codeText:a(_e,o),codeTextData:w,data:w,codeFlowValue:w,definition:a(ve),definitionDestinationString:o,definitionLabelString:o,definitionTitleString:o,emphasis:a(ye),hardBreakEscape:a(xe),hardBreakTrailing:a(xe),htmlFlow:a(Se,o),htmlFlowData:w,htmlText:a(Se,o),htmlTextData:w,image:a(Ce),label:o,link:a(we),listItem:a(Ee),listItemValue:f,listOrdered:a(Te,d),listUnordered:a(Te),paragraph:a(De),reference:le,referenceString:o,resourceDestinationString:o,resourceTitleString:o,setextHeading:a(be),strong:a(Oe),thematicBreak:a(Ae)},exit:{atxHeading:c(),atxHeadingSequence:x,autolink:c(),autolinkEmail:me,autolinkProtocol:pe,blockQuote:c(),characterEscapeValue:T,characterReferenceMarkerHexadecimal:de,characterReferenceMarkerNumeric:de,characterReferenceValue:fe,characterReference:A,codeFenced:c(g),codeFencedFence:h,codeFencedFenceInfo:p,codeFencedFenceMeta:m,codeFlowValue:T,codeIndented:c(_),codeText:c(re),codeTextData:T,data:T,definition:c(),definitionDestinationString:b,definitionLabelString:v,definitionTitleString:y,emphasis:c(),hardBreakEscape:c(E),hardBreakTrailing:c(E),htmlFlow:c(ne),htmlFlowData:T,htmlText:c(D),htmlTextData:T,image:c(ae),label:se,labelText:oe,lineEnding:te,link:c(ie),listItem:c(),listOrdered:c(),listUnordered:c(),paragraph:c(),referenceString:ue,resourceDestinationString:O,resourceTitleString:k,resource:ce,setextHeading:c(C),setextHeadingLineSequence:S,setextHeadingText:ee,strong:c(),thematicBreak:c()}};ps(t,(e||{}).mdastExtensions||[]);let n={};return r;function r(e){let r={type:`root`,children:[]},a={stack:[r],tokenStack:[],config:t,enter:s,exit:l,buffer:o,resume:u,data:n},c=[],d=-1;for(;++d<e.length;)(e[d][1].type===`listOrdered`||e[d][1].type===`listUnordered`)&&(e[d][0]===`enter`?c.push(d):d=i(e,c.pop(),d));for(d=-1;++d<e.length;){let n=t[e[d][0]];ls.call(n,e[d][1].type)&&n[e[d][1].type].call(Object.assign({sliceSerialize:e[d][2].sliceSerialize},a),e[d][1])}if(a.tokenStack.length>0){let e=a.tokenStack[a.tokenStack.length-1];(e[1]||hs).call(a,void 0,e[0])}for(r.position={start:fs(e.length>0?e[0][1].start:{line:1,column:1,offset:0}),end:fs(e.length>0?e[e.length-2][1].end:{line:1,column:1,offset:0})},d=-1;++d<t.transforms.length;)r=t.transforms[d](r)||r;return r}function i(e,t,n){let r=t-1,i=-1,a=!1,o,s,c,l;for(;++r<=n;){let t=e[r];switch(t[1].type){case`listUnordered`:case`listOrdered`:case`blockQuote`:t[0]===`enter`?i++:i--,l=void 0;break;case`lineEndingBlank`:t[0]===`enter`&&(o&&!l&&!i&&!c&&(c=r),l=void 0);break;case`linePrefix`:case`listItemValue`:case`listItemMarker`:case`listItemPrefix`:case`listItemPrefixWhitespace`:break;default:l=void 0}if(!i&&t[0]===`enter`&&t[1].type===`listItemPrefix`||i===-1&&t[0]===`exit`&&(t[1].type===`listUnordered`||t[1].type===`listOrdered`)){if(o){let i=r;for(s=void 0;i--;){let t=e[i];if(t[1].type===`lineEnding`||t[1].type===`lineEndingBlank`){if(t[0]===`exit`)continue;s&&(e[s][1].type=`lineEndingBlank`,a=!0),t[1].type=`lineEnding`,s=i}else if(t[1].type!==`linePrefix`&&t[1].type!==`blockQuotePrefix`&&t[1].type!==`blockQuotePrefixWhitespace`&&t[1].type!==`blockQuoteMarker`&&t[1].type!==`listItemIndent`)break}c&&(!s||c<s)&&(o._spread=!0),o.end=Object.assign({},s?e[s][1].start:t[1].end),e.splice(s||r,0,[`exit`,o,t[2]]),r++,n++}if(t[1].type===`listItemPrefix`){let i={type:`listItem`,_spread:!1,start:Object.assign({},t[1].start),end:void 0};o=i,e.splice(r,0,[`enter`,i,t[2]]),r++,n++,c=void 0,l=!0}}}return e[t][1]._spread=a,n}function a(e,t){return n;function n(n){s.call(this,e(n),n),t&&t.call(this,n)}}function o(){this.stack.push({type:`fragment`,children:[]})}function s(e,t,n){this.stack[this.stack.length-1].children.push(e),this.stack.push(e),this.tokenStack.push([t,n||void 0]),e.position={start:fs(t.start),end:void 0}}function c(e){return t;function t(t){e&&e.call(this,t),l.call(this,t)}}function l(e,t){let n=this.stack.pop(),r=this.tokenStack.pop();if(r)r[0].type!==e.type&&(t?t.call(this,e,r[0]):(r[1]||hs).call(this,e,r[0]));else throw Error("Cannot close `"+e.type+"` ("+Hr({start:e.start,end:e.end})+`): it’s not open`);n.position.end=fs(e.end)}function u(){return wi(this.stack.pop())}function d(){this.data.expectingFirstListItemValue=!0}function f(e){if(this.data.expectingFirstListItemValue){let t=this.stack[this.stack.length-2];t.start=Number.parseInt(this.sliceSerialize(e),10),this.data.expectingFirstListItemValue=void 0}}function p(){let e=this.resume(),t=this.stack[this.stack.length-1];t.lang=e}function m(){let e=this.resume(),t=this.stack[this.stack.length-1];t.meta=e}function h(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function g(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,``),this.data.flowCodeInside=void 0}function _(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/(\r?\n|\r)$/g,``)}function v(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=F(this.sliceSerialize(e)).toLowerCase()}function y(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function b(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function x(e){let t=this.stack[this.stack.length-1];t.depth||=this.sliceSerialize(e).length}function ee(){this.data.setextHeadingSlurpLineEnding=!0}function S(e){let t=this.stack[this.stack.length-1];t.depth=this.sliceSerialize(e).codePointAt(0)===61?1:2}function C(){this.data.setextHeadingSlurpLineEnding=void 0}function w(e){let t=this.stack[this.stack.length-1].children,n=t[t.length-1];(!n||n.type!==`text`)&&(n=ke(),n.position={start:fs(e.start),end:void 0},t.push(n)),this.stack.push(n)}function T(e){let t=this.stack.pop();t.value+=this.sliceSerialize(e),t.position.end=fs(e.end)}function te(e){let n=this.stack[this.stack.length-1];if(this.data.atHardBreak){let t=n.children[n.children.length-1];t.position.end=fs(e.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&t.canContainEols.includes(n.type)&&(w.call(this,e),T.call(this,e))}function E(){this.data.atHardBreak=!0}function ne(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function D(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function re(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function ie(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function ae(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function oe(e){let t=this.sliceSerialize(e),n=this.stack[this.stack.length-2];n.label=ss(t),n.identifier=F(t).toLowerCase()}function se(){let e=this.stack[this.stack.length-1],t=this.resume(),n=this.stack[this.stack.length-1];this.data.inReference=!0,n.type===`link`?n.children=e.children:n.alt=t}function O(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function k(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function ce(){this.data.inReference=void 0}function le(){this.data.referenceType=`collapsed`}function ue(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=F(this.sliceSerialize(e)).toLowerCase(),this.data.referenceType=`full`}function de(e){this.data.characterReferenceType=e.type}function fe(e){let t=this.sliceSerialize(e),n=this.data.characterReferenceType,r;n?(r=Ii(t,n===`characterReferenceMarkerNumeric`?10:16),this.data.characterReferenceType=void 0):r=ki(t);let i=this.stack[this.stack.length-1];i.value+=r}function A(e){let t=this.stack.pop();t.position.end=fs(e.end)}function pe(e){T.call(this,e);let t=this.stack[this.stack.length-1];t.url=this.sliceSerialize(e)}function me(e){T.call(this,e);let t=this.stack[this.stack.length-1];t.url=`mailto:`+this.sliceSerialize(e)}function he(){return{type:`blockquote`,children:[]}}function ge(){return{type:`code`,lang:null,meta:null,value:``}}function _e(){return{type:`inlineCode`,value:``}}function ve(){return{type:`definition`,identifier:``,label:null,title:null,url:``}}function ye(){return{type:`emphasis`,children:[]}}function be(){return{type:`heading`,depth:0,children:[]}}function xe(){return{type:`break`}}function Se(){return{type:`html`,value:``}}function Ce(){return{type:`image`,title:null,url:``,alt:null}}function we(){return{type:`link`,title:null,url:``,children:[]}}function Te(e){return{type:`list`,ordered:e.type===`listOrdered`,start:null,spread:e._spread,children:[]}}function Ee(e){return{type:`listItem`,spread:e._spread,checked:null,children:[]}}function De(){return{type:`paragraph`,children:[]}}function Oe(){return{type:`strong`,children:[]}}function ke(){return{type:`text`,value:``}}function Ae(){return{type:`thematicBreak`}}}function fs(e){return{line:e.line,column:e.column,offset:e.offset}}function ps(e,t){let n=-1;for(;++n<t.length;){let r=t[n];Array.isArray(r)?ps(e,r):ms(e,r)}}function ms(e,t){let n;for(n in t)if(ls.call(t,n))switch(n){case`canContainEols`:{let r=t[n];r&&e[n].push(...r);break}case`transforms`:{let r=t[n];r&&e[n].push(...r);break}case`enter`:case`exit`:{let r=t[n];r&&Object.assign(e[n],r);break}}}function hs(e,t){throw Error(e?"Cannot close `"+e.type+"` ("+Hr({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+Hr({start:t.start,end:t.end})+`) is open`:"Cannot close document, a token (`"+t.type+"`, "+Hr({start:t.start,end:t.end})+`) is still open`)}function gs(e){let t=this;t.parser=n;function n(n){return us(n,{...t.data(`settings`),...e,extensions:t.data(`micromarkExtensions`)||[],mdastExtensions:t.data(`fromMarkdownExtensions`)||[]})}}function _s(e,t){let n={type:`element`,tagName:`blockquote`,properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)}function vs(e,t){let n={type:`element`,tagName:`br`,properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:`text`,value:`
`}]}function ys(e,t){let n=t.value?t.value+`
`:``,r={},i=t.lang?t.lang.split(/\s+/):[];i.length>0&&(r.className=[`language-`+i[0]]);let a={type:`element`,tagName:`code`,properties:r,children:[{type:`text`,value:n}]};return t.meta&&(a.data={meta:t.meta}),e.patch(t,a),a=e.applyData(t,a),a={type:`element`,tagName:`pre`,properties:{},children:[a]},e.patch(t,a),a}function bs(e,t){let n={type:`element`,tagName:`del`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function xs(e,t){let n={type:`element`,tagName:`em`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Ss(e,t){let n=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,r=String(t.identifier).toUpperCase(),i=Gi(r.toLowerCase()),a=e.footnoteOrder.indexOf(r),o,s=e.footnoteCounts.get(r);s===void 0?(s=0,e.footnoteOrder.push(r),o=e.footnoteOrder.length):o=a+1,s+=1,e.footnoteCounts.set(r,s);let c={type:`element`,tagName:`a`,properties:{href:`#`+n+`fn-`+i,id:n+`fnref-`+i+(s>1?`-`+s:``),dataFootnoteRef:!0,ariaDescribedBy:[`footnote-label`]},children:[{type:`text`,value:String(o)}]};e.patch(t,c);let l={type:`element`,tagName:`sup`,properties:{},children:[c]};return e.patch(t,l),e.applyData(t,l)}function Cs(e,t){let n={type:`element`,tagName:`h`+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function ws(e,t){if(e.options.allowDangerousHtml){let n={type:`raw`,value:t.value};return e.patch(t,n),e.applyData(t,n)}}function Ts(e,t){let n=t.referenceType,r=`]`;if(n===`collapsed`?r+=`[]`:n===`full`&&(r+=`[`+(t.label||t.identifier)+`]`),t.type===`imageReference`)return[{type:`text`,value:`![`+t.alt+r}];let i=e.all(t),a=i[0];a&&a.type===`text`?a.value=`[`+a.value:i.unshift({type:`text`,value:`[`});let o=i[i.length-1];return o&&o.type===`text`?o.value+=r:i.push({type:`text`,value:r}),i}function Es(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Ts(e,t);let i={src:Gi(r.url||``),alt:t.alt};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`img`,properties:i,children:[]};return e.patch(t,a),e.applyData(t,a)}function Ds(e,t){let n={src:Gi(t.url)};t.alt!==null&&t.alt!==void 0&&(n.alt=t.alt),t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`img`,properties:n,children:[]};return e.patch(t,r),e.applyData(t,r)}function Os(e,t){let n={type:`text`,value:t.value.replace(/\r?\n|\r/g,` `)};e.patch(t,n);let r={type:`element`,tagName:`code`,properties:{},children:[n]};return e.patch(t,r),e.applyData(t,r)}function ks(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Ts(e,t);let i={href:Gi(r.url||``)};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`a`,properties:i,children:e.all(t)};return e.patch(t,a),e.applyData(t,a)}function As(e,t){let n={href:Gi(t.url)};t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`a`,properties:n,children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function js(e,t,n){let r=e.all(t),i=n?Ms(n):Ns(t),a={},o=[];if(typeof t.checked==`boolean`){let e=r[0],n;e&&e.type===`element`&&e.tagName===`p`?n=e:(n={type:`element`,tagName:`p`,properties:{},children:[]},r.unshift(n)),n.children.length>0&&n.children.unshift({type:`text`,value:` `}),n.children.unshift({type:`element`,tagName:`input`,properties:{type:`checkbox`,checked:t.checked,disabled:!0},children:[]}),a.className=[`task-list-item`]}let s=-1;for(;++s<r.length;){let e=r[s];(i||s!==0||e.type!==`element`||e.tagName!==`p`)&&o.push({type:`text`,value:`
`}),e.type===`element`&&e.tagName===`p`&&!i?o.push(...e.children):o.push(e)}let c=r[r.length-1];c&&(i||c.type!==`element`||c.tagName!==`p`)&&o.push({type:`text`,value:`
`});let l={type:`element`,tagName:`li`,properties:a,children:o};return e.patch(t,l),e.applyData(t,l)}function Ms(e){let t=!1;if(e.type===`list`){t=e.spread||!1;let n=e.children,r=-1;for(;!t&&++r<n.length;)t=Ns(n[r])}return t}function Ns(e){return e.spread??e.children.length>1}function Ps(e,t){let n={},r=e.all(t),i=-1;for(typeof t.start==`number`&&t.start!==1&&(n.start=t.start);++i<r.length;){let e=r[i];if(e.type===`element`&&e.tagName===`li`&&e.properties&&Array.isArray(e.properties.className)&&e.properties.className.includes(`task-list-item`)){n.className=[`contains-task-list`];break}}let a={type:`element`,tagName:t.ordered?`ol`:`ul`,properties:n,children:e.wrap(r,!0)};return e.patch(t,a),e.applyData(t,a)}function Fs(e,t){let n={type:`element`,tagName:`p`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Is(e,t){let n={type:`root`,children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)}function Ls(e,t){let n={type:`element`,tagName:`strong`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Rs(e,t){let n=e.all(t),r=n.shift(),i=[];if(r){let n={type:`element`,tagName:`thead`,properties:{},children:e.wrap([r],!0)};e.patch(t.children[0],n),i.push(n)}if(n.length>0){let r={type:`element`,tagName:`tbody`,properties:{},children:e.wrap(n,!0)},a=zr(t.children[1]),o=Rr(t.children[t.children.length-1]);a&&o&&(r.position={start:a,end:o}),i.push(r)}let a={type:`element`,tagName:`table`,properties:{},children:e.wrap(i,!0)};return e.patch(t,a),e.applyData(t,a)}function zs(e,t,n){let r=n?n.children:void 0,i=(r?r.indexOf(t):1)===0?`th`:`td`,a=n&&n.type===`table`?n.align:void 0,o=a?a.length:t.children.length,s=-1,c=[];for(;++s<o;){let n=t.children[s],r={},o=a?a[s]:void 0;o&&(r.align=o);let l={type:`element`,tagName:i,properties:r,children:[]};n&&(l.children=e.all(n),e.patch(n,l),l=e.applyData(n,l)),c.push(l)}let l={type:`element`,tagName:`tr`,properties:{},children:e.wrap(c,!0)};return e.patch(t,l),e.applyData(t,l)}function Bs(e,t){let n={type:`element`,tagName:`td`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}var Vs=9,Hs=32;function Us(e){let t=String(e),n=/\r?\n|\r/g,r=n.exec(t),i=0,a=[];for(;r;)a.push(Ws(t.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=n.exec(t);return a.push(Ws(t.slice(i),i>0,!1)),a.join(``)}function Ws(e,t,n){let r=0,i=e.length;if(t){let t=e.codePointAt(r);for(;t===Vs||t===Hs;)r++,t=e.codePointAt(r)}if(n){let t=e.codePointAt(i-1);for(;t===Vs||t===Hs;)i--,t=e.codePointAt(i-1)}return i>r?e.slice(r,i):``}function Gs(e,t){let n={type:`text`,value:Us(String(t.value))};return e.patch(t,n),e.applyData(t,n)}function Ks(e,t){let n={type:`element`,tagName:`hr`,properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)}var qs={blockquote:_s,break:vs,code:ys,delete:bs,emphasis:xs,footnoteReference:Ss,heading:Cs,html:ws,imageReference:Es,image:Ds,inlineCode:Os,linkReference:ks,link:As,listItem:js,list:Ps,paragraph:Fs,root:Is,strong:Ls,table:Rs,tableCell:Bs,tableRow:zs,text:Gs,thematicBreak:Ks,toml:Js,yaml:Js,definition:Js,footnoteDefinition:Js};function Js(){}var{defineProperty:Ys}=Object,Xs=typeof self==`object`?self:globalThis,Zs=(e,t)=>{switch(e){case`Function`:case`SharedWorker`:case`Worker`:case`eval`:case`setInterval`:case`setTimeout`:throw TypeError(`unable to deserialize `+e)}return new Xs[e](t)},Qs=(e,t)=>{let n=(t,n)=>(e.set(n,t),t),r=i=>{if(e.has(i))return e.get(i);let[a,o]=t[i];switch(a){case 0:case-1:return n(o,i);case 1:{let e=n([],i);for(let t of o)e.push(r(t));return e}case 2:{let e=n({},i);for(let[t,n]of o){let i=r(t),a=r(n);i===`__proto__`?Ys(e,i,{value:a,configurable:!0,enumerable:!0,writable:!0}):e[i]=a}return e}case 3:return n(new Date(o),i);case 4:{let{source:e,flags:t}=o;return n(new RegExp(e,t),i)}case 5:{let e=n(new Map,i);for(let[t,n]of o)e.set(r(t),r(n));return e}case 6:{let e=n(new Set,i);for(let t of o)e.add(r(t));return e}case 7:{let{name:e,message:t}=o;return n(typeof Xs[e]==`function`?Zs(e,t):Error(t),i)}case 8:return n(BigInt(o),i);case`BigInt`:return n(Object(BigInt(o)),i);case`ArrayBuffer`:return n(new Uint8Array(o).buffer,o);case`DataView`:{let{buffer:e}=new Uint8Array(o);return n(new DataView(e),o)}case`-0`:return-0}return n(Zs(a,o),i)};return r},$s=e=>Qs(new Map,e)(0),ec=``,{toString:tc}={},{keys:nc,is:rc}=Object,ic=e=>{let t=typeof e;if(t!==`object`||!e)return[0,t];let n=tc.call(e).slice(8,-1);switch(n){case`Array`:return[1,ec];case`Object`:return[2,ec];case`Date`:return[3,ec];case`RegExp`:return[4,ec];case`Map`:return[5,ec];case`Set`:return[6,ec];case`DataView`:return[1,n]}return n.includes(`Array`)?[1,n]:e instanceof Error?[7,e.name||`Error`]:[2,n]},ac=([e,t])=>e===0&&(t===`function`||t===`symbol`),oc=(e,t,n,r)=>{let i=(e,t)=>{let i=r.push(e)-1;return n.set(t,i),i},a=o=>{if(n.has(o))return n.get(o);let[s,c]=ic(o);switch(s){case 0:{let t=o;switch(c){case`bigint`:s=8,t=o.toString();break;case`number`:if(!o&&rc(o,-0))return r.push([`-0`])-1;break;case`function`:case`symbol`:if(e)throw TypeError(`unable to serialize `+c);t=null;break;case`undefined`:return i([-1],o)}return i([s,t],o)}case 1:{if(c){let e=o;return c===`DataView`?e=new Uint8Array(o.buffer):c===`ArrayBuffer`&&(e=new Uint8Array(o)),i([c,[...e]],o)}let e=[],t=i([s,e],o);for(let t of o)e.push(a(t));return t}case 2:{if(c)switch(c){case`BigInt`:return i([c,o.toString()],o);case`Boolean`:case`Number`:case`String`:return i([c,o.valueOf()],o)}if(t&&`toJSON`in o)return a(o.toJSON());let n=[],r=i([s,n],o);for(let t of nc(o))(e||!ac(ic(o[t])))&&n.push([a(t),a(o[t])]);return r}case 3:return i([s,isNaN(o.getTime())?ec:o.toISOString()],o);case 4:{let{source:e,flags:t}=o;return i([s,{source:e,flags:t}],o)}case 5:{let t=[],n=i([s,t],o);for(let[n,r]of o)(e||!(ac(ic(n))||ac(ic(r))))&&t.push([a(n),a(r)]);return n}case 6:{let t=[],n=i([s,t],o);for(let n of o)(e||!ac(ic(n)))&&t.push(a(n));return n}}let{message:l}=o;return i([s,{name:c,message:l}],o)};return a},sc=(e,{json:t,lossy:n}={})=>{let r=[];return oc(!(t||n),!!t,new Map,r)(e),r},cc=typeof structuredClone==`function`?(e,t)=>t&&(`json`in t||`lossy`in t)?$s(sc(e,t)):structuredClone(e):(e,t)=>$s(sc(e,t));function lc(e,t){let n=[{type:`text`,value:`↩`}];return t>1&&n.push({type:`element`,tagName:`sup`,properties:{},children:[{type:`text`,value:String(t)}]}),n}function uc(e,t){return`Back to reference `+(e+1)+(t>1?`-`+t:``)}function dc(e){let t=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,n=e.options.footnoteBackContent||lc,r=e.options.footnoteBackLabel||uc,i=e.options.footnoteLabel||`Footnotes`,a=e.options.footnoteLabelTagName||`h2`,o=e.options.footnoteLabelProperties||{className:[`sr-only`]},s=[],c=-1;for(;++c<e.footnoteOrder.length;){let i=e.footnoteById.get(e.footnoteOrder[c]);if(!i)continue;let a=e.all(i),o=String(i.identifier).toUpperCase(),l=Gi(o.toLowerCase()),u=0,d=[],f=e.footnoteCounts.get(o);for(;f!==void 0&&++u<=f;){d.length>0&&d.push({type:`text`,value:` `});let e=typeof n==`string`?n:n(c,u);typeof e==`string`&&(e={type:`text`,value:e}),d.push({type:`element`,tagName:`a`,properties:{href:`#`+t+`fnref-`+l+(u>1?`-`+u:``),dataFootnoteBackref:``,ariaLabel:typeof r==`string`?r:r(c,u),className:[`data-footnote-backref`]},children:Array.isArray(e)?e:[e]})}let p=a[a.length-1];if(p&&p.type===`element`&&p.tagName===`p`){let e=p.children[p.children.length-1];e&&e.type===`text`?e.value+=` `:p.children.push({type:`text`,value:` `}),p.children.push(...d)}else a.push(...d);let m={type:`element`,tagName:`li`,properties:{id:t+`fn-`+l},children:e.wrap(a,!0)};e.patch(i,m),s.push(m)}if(s.length!==0)return{type:`element`,tagName:`section`,properties:{dataFootnotes:!0,className:[`footnotes`]},children:[{type:`element`,tagName:a,properties:{...cc(o),id:`footnote-label`},children:[{type:`text`,value:i}]},{type:`text`,value:`
`},{type:`element`,tagName:`ol`,properties:{},children:e.wrap(s,!0)},{type:`text`,value:`
`}]}}var fc=(function(e){if(e==null)return _c;if(typeof e==`function`)return gc(e);if(typeof e==`object`)return Array.isArray(e)?pc(e):mc(e);if(typeof e==`string`)return hc(e);throw Error(`Expected function, string, or object as test`)});function pc(e){let t=[],n=-1;for(;++n<e.length;)t[n]=fc(e[n]);return gc(r);function r(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1}}function mc(e){let t=e;return gc(n);function n(n){let r=n,i;for(i in e)if(r[i]!==t[i])return!1;return!0}}function hc(e){return gc(t);function t(t){return t&&t.type===e}}function gc(e){return t;function t(t,n,r){return!!(vc(t)&&e.call(this,t,typeof n==`number`?n:void 0,r||void 0))}}function _c(){return!0}function vc(e){return typeof e==`object`&&!!e&&`type`in e}function yc(e){return e}var bc=[];function xc(e,t,n,r){let i;typeof t==`function`&&typeof n!=`function`?(r=n,n=t):i=t;let a=fc(i),o=r?-1:1;s(e,void 0,[])();function s(e,i,c){let l=e&&typeof e==`object`?e:{};if(typeof l.type==`string`){let t=typeof l.tagName==`string`?l.tagName:typeof l.name==`string`?l.name:void 0;Object.defineProperty(u,"name",{value:`node (`+yc(e.type+(t?`<`+t+`>`:``))+`)`})}return u;function u(){let l=bc,u,d,f;if((!t||a(e,i,c[c.length-1]||void 0))&&(l=Sc(n(e,c)),l[0]===!1))return l;if(`children`in e&&e.children){let t=e;if(t.children&&l[0]!==`skip`)for(d=(r?t.children.length:-1)+o,f=c.concat(t);d>-1&&d<t.children.length;){let e=t.children[d];if(u=s(e,d,f)(),u[0]===!1)return u;d=typeof u[1]==`number`?u[1]:d+o}}return l}}}function Sc(e){return Array.isArray(e)?e:typeof e==`number`?[!0,e]:e==null?bc:[e]}function Cc(e,t,n,r){let i,a,o;typeof t==`function`&&typeof n!=`function`?(a=void 0,o=t,i=n):(a=t,o=n,i=r),xc(e,a,s,i);function s(e,t){let n=t[t.length-1],r=n?n.children.indexOf(e):void 0;return o(e,r,n)}}var wc={}.hasOwnProperty,Tc={};function Ec(e,t){let n=t||Tc,r=new Map,i=new Map,a={all:s,applyData:Oc,definitionById:r,footnoteById:i,footnoteCounts:new Map,footnoteOrder:[],handlers:{...qs,...n.handlers},one:o,options:n,patch:Dc,wrap:Ac};return Cc(e,function(e){if(e.type===`definition`||e.type===`footnoteDefinition`){let t=e.type===`definition`?r:i,n=String(e.identifier).toUpperCase();t.has(n)||t.set(n,e)}}),a;function o(e,t){let n=e.type,r=a.handlers[n];if(wc.call(a.handlers,n)&&r)return r(a,e,t);if(a.options.passThrough&&a.options.passThrough.includes(n)){if(`children`in e){let{children:t,...n}=e,r=cc(n);return r.children=a.all(e),r}return cc(e)}return(a.options.unknownHandler||kc)(a,e,t)}function s(e){let t=[];if(`children`in e){let n=e.children,r=-1;for(;++r<n.length;){let i=a.one(n[r],e);if(i){if(r&&n[r-1].type===`break`&&(!Array.isArray(i)&&i.type===`text`&&(i.value=jc(i.value)),!Array.isArray(i)&&i.type===`element`)){let e=i.children[0];e&&e.type===`text`&&(e.value=jc(e.value))}Array.isArray(i)?t.push(...i):t.push(i)}}}return t}}function Dc(e,t){e.position&&(t.position=Vr(e))}function Oc(e,t){let n=t;if(e&&e.data){let t=e.data.hName,r=e.data.hChildren,i=e.data.hProperties;typeof t==`string`&&(n.type===`element`?n.tagName=t:n={type:`element`,tagName:t,properties:{},children:`children`in n?n.children:[n]}),n.type===`element`&&i&&Object.assign(n.properties,cc(i)),`children`in n&&n.children&&r!=null&&(n.children=r)}return n}function kc(e,t){let n=t.data||{},r=`value`in t&&!(wc.call(n,`hProperties`)||wc.call(n,`hChildren`))?{type:`text`,value:t.value}:{type:`element`,tagName:`div`,properties:{},children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function Ac(e,t){let n=[],r=-1;for(t&&n.push({type:`text`,value:`
`});++r<e.length;)r&&n.push({type:`text`,value:`
`}),n.push(e[r]);return t&&e.length>0&&n.push({type:`text`,value:`
`}),n}function jc(e){let t=0,n=e.charCodeAt(t);for(;n===9||n===32;)t++,n=e.charCodeAt(t);return e.slice(t)}function Mc(e,t){let n=Ec(e,t),r=n.one(e,void 0),i=dc(n),a=Array.isArray(r)?{type:`root`,children:r}:r||{type:`root`,children:[]};return i&&(`children`in a,a.children.push({type:`text`,value:`
`},i)),a}function Nc(e,t){return e&&`run`in e?async function(n,r){let i=Mc(n,{file:r,...t});await e.run(i,r)}:function(n,r){return Mc(n,{file:r,...e||t})}}function Pc(e){if(e)throw e}var Fc=o(((e,t)=>{var n=Object.prototype.hasOwnProperty,r=Object.prototype.toString,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=function(e){return typeof Array.isArray==`function`?Array.isArray(e):r.call(e)===`[object Array]`},s=function(e){if(!e||r.call(e)!==`[object Object]`)return!1;var t=n.call(e,`constructor`),i=e.constructor&&e.constructor.prototype&&n.call(e.constructor.prototype,`isPrototypeOf`);if(e.constructor&&!t&&!i)return!1;for(var a in e);return a===void 0||n.call(e,a)},c=function(e,t){i&&t.name===`__proto__`?i(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},l=function(e,t){if(t===`__proto__`){if(!n.call(e,t))return;if(a)return a(e,t).value}return e[t]};t.exports=function e(){var t,n,r,i,a,u,d=arguments[0],f=1,p=arguments.length,m=!1;for(typeof d==`boolean`&&(m=d,d=arguments[1]||{},f=2),(d==null||typeof d!=`object`&&typeof d!=`function`)&&(d={});f<p;++f)if(t=arguments[f],t!=null)for(n in t)r=l(d,n),i=l(t,n),d!==i&&(m&&i&&(s(i)||(a=o(i)))?(a?(a=!1,u=r&&o(r)?r:[]):u=r&&s(r)?r:{},c(d,{name:n,newValue:e(m,u,i)})):i!==void 0&&c(d,{name:n,newValue:i}));return d}}));function Ic(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function Lc(){let e=[],t={run:n,use:r};return t;function n(...t){let n=-1,r=t.pop();if(typeof r!=`function`)throw TypeError(`Expected function as last argument, not `+r);i(null,...t);function i(a,...o){let s=e[++n],c=-1;if(a){r(a);return}for(;++c<t.length;)(o[c]===null||o[c]===void 0)&&(o[c]=t[c]);t=o,s?W(s,i)(...o):r(null,...o)}}function r(n){if(typeof n!=`function`)throw TypeError("Expected `middelware` to be a function, not "+n);return e.push(n),t}}function W(e,t){let n;return r;function r(...t){let r=e.length>t.length,o;r&&t.push(i);try{o=e.apply(this,t)}catch(e){let t=e;if(r&&n)throw t;return i(t)}r||(o&&o.then&&typeof o.then==`function`?o.then(a,i):o instanceof Error?i(o):a(o))}function i(e,...r){n||(n=!0,t(e,...r))}function a(e){i(null,e)}}var Rc={basename:zc,dirname:Bc,extname:Vc,join:Hc,sep:`/`};function zc(e,t){if(t!==void 0&&typeof t!=`string`)throw TypeError(`"ext" argument must be a string`);Gc(e);let n=0,r=-1,i=e.length,a;if(t===void 0||t.length===0||t.length>e.length){for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else r<0&&(a=!0,r=i+1);return r<0?``:e.slice(n,r)}if(t===e)return``;let o=-1,s=t.length-1;for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else o<0&&(a=!0,o=i+1),s>-1&&(e.codePointAt(i)===t.codePointAt(s--)?s<0&&(r=i):(s=-1,r=o));return n===r?r=o:r<0&&(r=e.length),e.slice(n,r)}function Bc(e){if(Gc(e),e.length===0)return`.`;let t=-1,n=e.length,r;for(;--n;)if(e.codePointAt(n)===47){if(r){t=n;break}}else r||=!0;return t<0?e.codePointAt(0)===47?`/`:`.`:t===1&&e.codePointAt(0)===47?`//`:e.slice(0,t)}function Vc(e){Gc(e);let t=e.length,n=-1,r=0,i=-1,a=0,o;for(;t--;){let s=e.codePointAt(t);if(s===47){if(o){r=t+1;break}continue}n<0&&(o=!0,n=t+1),s===46?i<0?i=t:a!==1&&(a=1):i>-1&&(a=-1)}return i<0||n<0||a===0||a===1&&i===n-1&&i===r+1?``:e.slice(i,n)}function Hc(...e){let t=-1,n;for(;++t<e.length;)Gc(e[t]),e[t]&&(n=n===void 0?e[t]:n+`/`+e[t]);return n===void 0?`.`:Uc(n)}function Uc(e){Gc(e);let t=e.codePointAt(0)===47,n=Wc(e,!t);return n.length===0&&!t&&(n=`.`),n.length>0&&e.codePointAt(e.length-1)===47&&(n+=`/`),t?`/`+n:n}function Wc(e,t){let n=``,r=0,i=-1,a=0,o=-1,s,c;for(;++o<=e.length;){if(o<e.length)s=e.codePointAt(o);else if(s===47)break;else s=47;if(s===47){if(i!==o-1&&a!==1){if(i!==o-1&&a===2){if(n.length<2||r!==2||n.codePointAt(n.length-1)!==46||n.codePointAt(n.length-2)!==46){if(n.length>2){if(c=n.lastIndexOf(`/`),c!==n.length-1){c<0?(n=``,r=0):(n=n.slice(0,c),r=n.length-1-n.lastIndexOf(`/`)),i=o,a=0;continue}}else if(n.length>0){n=``,r=0,i=o,a=0;continue}}t&&(n=n.length>0?n+`/..`:`..`,r=2)}else n.length>0?n+=`/`+e.slice(i+1,o):n=e.slice(i+1,o),r=o-i-1}i=o,a=0}else s===46&&a>-1?a++:a=-1}return n}function Gc(e){if(typeof e!=`string`)throw TypeError(`Path must be a string. Received `+JSON.stringify(e))}var Kc={cwd:qc};function qc(){return`/`}function Jc(e){return!!(typeof e==`object`&&e&&`href`in e&&e.href&&`protocol`in e&&e.protocol&&e.auth===void 0)}function Yc(e){if(typeof e==`string`)e=new URL(e);else if(!Jc(e)){let t=TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw t.code=`ERR_INVALID_ARG_TYPE`,t}if(e.protocol!==`file:`){let e=TypeError(`The URL must be of scheme file`);throw e.code=`ERR_INVALID_URL_SCHEME`,e}return Xc(e)}function Xc(e){if(e.hostname!==``){let e=TypeError(`File URL host must be "localhost" or empty on darwin`);throw e.code=`ERR_INVALID_FILE_URL_HOST`,e}let t=e.pathname,n=-1;for(;++n<t.length;)if(t.codePointAt(n)===37&&t.codePointAt(n+1)===50){let e=t.codePointAt(n+2);if(e===70||e===102){let e=TypeError(`File URL path must not include encoded / characters`);throw e.code=`ERR_INVALID_FILE_URL_PATH`,e}}return decodeURIComponent(t)}var Zc=[`history`,`path`,`basename`,`stem`,`extname`,`dirname`],Qc=class{constructor(e){let t;t=e?Jc(e)?{path:e}:typeof e==`string`||nl(e)?{value:e}:e:{},this.cwd=`cwd`in t?``:Kc.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let n=-1;for(;++n<Zc.length;){let e=Zc[n];e in t&&t[e]!==void 0&&t[e]!==null&&(this[e]=e===`history`?[...t[e]]:t[e])}let r;for(r in t)Zc.includes(r)||(this[r]=t[r])}get basename(){return typeof this.path==`string`?Rc.basename(this.path):void 0}set basename(e){el(e,`basename`),$c(e,`basename`),this.path=Rc.join(this.dirname||``,e)}get dirname(){return typeof this.path==`string`?Rc.dirname(this.path):void 0}set dirname(e){tl(this.basename,`dirname`),this.path=Rc.join(e||``,this.basename)}get extname(){return typeof this.path==`string`?Rc.extname(this.path):void 0}set extname(e){if($c(e,`extname`),tl(this.dirname,`extname`),e){if(e.codePointAt(0)!==46)throw Error("`extname` must start with `.`");if(e.includes(`.`,1))throw Error("`extname` cannot contain multiple dots")}this.path=Rc.join(this.dirname,this.stem+(e||``))}get path(){return this.history[this.history.length-1]}set path(e){Jc(e)&&(e=Yc(e)),el(e,`path`),this.path!==e&&this.history.push(e)}get stem(){return typeof this.path==`string`?Rc.basename(this.path,this.extname):void 0}set stem(e){el(e,`stem`),$c(e,`stem`),this.path=Rc.join(this.dirname||``,e+(this.extname||``))}fail(e,t,n){let r=this.message(e,t,n);throw r.fatal=!0,r}info(e,t,n){let r=this.message(e,t,n);return r.fatal=void 0,r}message(e,t,n){let r=new Kr(e,t,n);return this.path&&(r.name=this.path+`:`+r.name,r.file=this.path),r.fatal=!1,this.messages.push(r),r}toString(e){return this.value===void 0?``:typeof this.value==`string`?this.value:new TextDecoder(e||void 0).decode(this.value)}};function $c(e,t){if(e&&e.includes(Rc.sep))throw Error("`"+t+"` cannot be a path: did not expect `"+Rc.sep+"`")}function el(e,t){if(!e)throw Error("`"+t+"` cannot be empty")}function tl(e,t){if(!e)throw Error("Setting `"+t+"` requires `path` to be set too")}function nl(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var rl=(function(e){let t=this.constructor.prototype,n=t[e],r=function(){return n.apply(r,arguments)};return Object.setPrototypeOf(r,t),r}),il=l(Fc(),1),al={}.hasOwnProperty,ol=new class e extends rl{constructor(){super(`copy`),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=Lc()}copy(){let t=new e,n=-1;for(;++n<this.attachers.length;){let e=this.attachers[n];t.use(...e)}return t.data((0,il.default)(!0,{},this.namespace)),t}data(e,t){return typeof e==`string`?arguments.length===2?(cl(`data`,this.frozen),this.namespace[e]=t,this):al.call(this.namespace,e)&&this.namespace[e]||void 0:e?(cl(`data`,this.frozen),this.namespace=e,this):this.namespace}freeze(){if(this.frozen)return this;let e=this;for(;++this.freezeIndex<this.attachers.length;){let[t,...n]=this.attachers[this.freezeIndex];if(n[0]===!1)continue;n[0]===!0&&(n[0]=void 0);let r=t.call(e,...n);typeof r==`function`&&this.transformers.use(r)}return this.frozen=!0,this.freezeIndex=1/0,this}parse(e){this.freeze();let t=dl(e),n=this.parser||this.Parser;return sl(`parse`,n),n(String(t),t)}process(e,t){let n=this;return this.freeze(),sl(`process`,this.parser||this.Parser),G(`process`,this.compiler||this.Compiler),t?r(void 0,t):new Promise(r);function r(r,i){let a=dl(e),o=n.parse(a);n.run(o,a,function(e,t,r){if(e||!t||!r)return s(e);let i=t,a=n.stringify(i,r);pl(a)?r.value=a:r.result=a,s(e,r)});function s(e,n){e||!n?i(e):r?r(n):t(void 0,n)}}}processSync(e){let t=!1,n;return this.freeze(),sl(`processSync`,this.parser||this.Parser),G(`processSync`,this.compiler||this.Compiler),this.process(e,r),ul(`processSync`,`process`,t),n;function r(e,r){t=!0,Pc(e),n=r}}run(e,t,n){ll(e),this.freeze();let r=this.transformers;return!n&&typeof t==`function`&&(n=t,t=void 0),n?i(void 0,n):new Promise(i);function i(i,a){let o=dl(t);r.run(e,o,s);function s(t,r,o){let s=r||e;t?a(t):i?i(s):n(void 0,s,o)}}}runSync(e,t){let n=!1,r;return this.run(e,t,i),ul(`runSync`,`run`,n),r;function i(e,t){Pc(e),r=t,n=!0}}stringify(e,t){this.freeze();let n=dl(t),r=this.compiler||this.Compiler;return G(`stringify`,r),ll(e),r(e,n)}use(e,...t){let n=this.attachers,r=this.namespace;if(cl(`use`,this.frozen),e!=null){if(typeof e==`function`)s(e,t);else if(typeof e==`object`)Array.isArray(e)?o(e):a(e);else throw TypeError("Expected usable value, not `"+e+"`")}return this;function i(e){if(typeof e==`function`)s(e,[]);else if(typeof e==`object`){if(Array.isArray(e)){let[t,...n]=e;s(t,n)}else a(e)}else throw TypeError("Expected usable value, not `"+e+"`")}function a(e){if(!(`plugins`in e)&&!(`settings`in e))throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");o(e.plugins),e.settings&&(r.settings=(0,il.default)(!0,r.settings,e.settings))}function o(e){let t=-1;if(e!=null){if(Array.isArray(e))for(;++t<e.length;){let n=e[t];i(n)}else throw TypeError("Expected a list of plugins, not `"+e+"`")}}function s(e,t){let r=-1,i=-1;for(;++r<n.length;)if(n[r][0]===e){i=r;break}if(i===-1)n.push([e,...t]);else if(t.length>0){let[r,...a]=t,o=n[i][1];Ic(o)&&Ic(r)&&(r=(0,il.default)(!0,o,r)),n[i]=[e,r,...a]}}}}().freeze();function sl(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `parser`")}function G(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `compiler`")}function cl(e,t){if(t)throw Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function ll(e){if(!Ic(e)||typeof e.type!=`string`)throw TypeError("Expected node, got `"+e+"`")}function ul(e,t,n){if(!n)throw Error("`"+e+"` finished async. Use `"+t+"` instead")}function dl(e){return fl(e)?e:new Qc(e)}function fl(e){return!!(e&&typeof e==`object`&&`message`in e&&`messages`in e)}function pl(e){return typeof e==`string`||ml(e)}function ml(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var hl=[],gl={allowDangerousHtml:!0},_l=/^(https?|ircs?|mailto|xmpp)$/i,vl=[{from:`astPlugins`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowDangerousHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowNode`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowElement`},{from:`allowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowedElements`},{from:`className`,id:`remove-classname`},{from:`disallowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`disallowedElements`},{from:`escapeHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`includeElementIndex`,id:`#remove-includeelementindex`},{from:`includeNodeIndex`,id:`change-includenodeindex-to-includeelementindex`},{from:`linkTarget`,id:`remove-linktarget`},{from:`plugins`,id:`change-plugins-to-remarkplugins`,to:`remarkPlugins`},{from:`rawSourcePos`,id:`#remove-rawsourcepos`},{from:`renderers`,id:`change-renderers-to-components`,to:`components`},{from:`source`,id:`change-source-to-children`,to:`children`},{from:`sourcePos`,id:`#remove-sourcepos`},{from:`transformImageUri`,id:`#add-urltransform`,to:`urlTransform`},{from:`transformLinkUri`,id:`#add-urltransform`,to:`urlTransform`}];function yl(e){let t=bl(e),n=xl(e);return Sl(t.runSync(t.parse(n),n),e)}function bl(e){let t=e.rehypePlugins||hl,n=e.remarkPlugins||hl,r=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...gl}:gl;return ol().use(gs).use(n).use(Nc,r).use(t)}function xl(e){let t=e.children||``,n=new Qc;return typeof t==`string`?n.value=t:``+t,n}function Sl(e,t){let n=t.allowedElements,r=t.allowElement,i=t.components,a=t.disallowedElements,o=t.skipHtml,s=t.unwrapDisallowed,c=t.urlTransform||Cl;for(let e of vl)Object.hasOwn(t,e.from)&&``+e.from+(e.to?"use `"+e.to+"` instead":`remove it`)+e.id;return Cc(e,l),ei(e,{Fragment:j.Fragment,components:i,ignoreInvalidStyle:!0,jsx:j.jsx,jsxs:j.jsxs,passKeys:!0,passNode:!0});function l(e,t,i){if(e.type===`raw`&&i&&typeof t==`number`)return o?i.children.splice(t,1):i.children[t]={type:`text`,value:e.value},t;if(e.type===`element`){let t;for(t in Si)if(Object.hasOwn(Si,t)&&Object.hasOwn(e.properties,t)){let n=e.properties[t],r=Si[t];(r===null||r.includes(e.tagName))&&(e.properties[t]=c(String(n||``),t,e))}}if(e.type===`element`){let o=n?!n.includes(e.tagName):a?a.includes(e.tagName):!1;if(!o&&r&&typeof t==`number`&&(o=!r(e,t,i)),o&&i&&typeof t==`number`)return s&&e.children?i.children.splice(t,1,...e.children):i.children.splice(t,1),t}}}function Cl(e){let t=e.indexOf(`:`),n=e.indexOf(`?`),r=e.indexOf(`#`),i=e.indexOf(`/`);return t===-1||i!==-1&&t>i||n!==-1&&t>n||r!==-1&&t>r||_l.test(e.slice(0,t))?e:``}function wl(e,t){let n=String(e);if(typeof t!=`string`)throw TypeError(`Expected character`);let r=0,i=n.indexOf(t);for(;i!==-1;)r++,i=n.indexOf(t,i+t.length);return r}function Tl(e){if(typeof e!=`string`)throw TypeError(`Expected a string`);return e.replace(/[|\\{}()[\]^$+*?.]/g,`\\$&`).replace(/-/g,`\\x2d`)}function El(e,t,n){let r=fc((n||{}).ignore||[]),i=Dl(t),a=-1;for(;++a<i.length;)xc(e,`text`,o);function o(e,t){let n=-1,i;for(;++n<t.length;){let e=t[n],a=i?i.children:void 0;if(r(e,a?a.indexOf(e):void 0,i))return;i=e}if(i)return s(e,t)}function s(e,t){let n=t[t.length-1],r=i[a][0],o=i[a][1],s=0,c=n.children.indexOf(e),l=!1,u=[];r.lastIndex=0;let d=r.exec(e.value);for(;d;){let n=d.index,i={index:d.index,input:d.input,stack:[...t,e]},a=o(...d,i);if(typeof a==`string`&&(a=a.length>0?{type:`text`,value:a}:void 0),a===!1?r.lastIndex=n+1:(s!==n&&u.push({type:`text`,value:e.value.slice(s,n)}),Array.isArray(a)?u.push(...a):a&&u.push(a),s=n+d[0].length,l=!0),!r.global)break;d=r.exec(e.value)}return l?(s<e.value.length&&u.push({type:`text`,value:e.value.slice(s)}),n.children.splice(c,1,...u)):u=[e],c+u.length}}function Dl(e){let t=[];if(!Array.isArray(e))throw TypeError(`Expected find and replace tuple or list of tuples`);let n=!e[0]||Array.isArray(e[0])?e:[e],r=-1;for(;++r<n.length;){let e=n[r];t.push([Ol(e[0]),kl(e[1])])}return t}function Ol(e){return typeof e==`string`?new RegExp(Tl(e),`g`):e}function kl(e){return typeof e==`function`?e:function(){return e}}var Al=`phrasing`,jl=[`autolink`,`link`,`image`,`label`];function Ml(){return{transforms:[q],enter:{literalAutolink:Pl,literalAutolinkEmail:Fl,literalAutolinkHttp:Fl,literalAutolinkWww:Fl},exit:{literalAutolink:K,literalAutolinkEmail:Rl,literalAutolinkHttp:Il,literalAutolinkWww:Ll}}}function Nl(){return{unsafe:[{character:`@`,before:`[+\\-.\\w]`,after:`[\\-.\\w]`,inConstruct:Al,notInConstruct:jl},{character:`.`,before:`[Ww]`,after:`[\\-.\\w]`,inConstruct:Al,notInConstruct:jl},{character:`:`,before:`[ps]`,after:`\\/`,inConstruct:Al,notInConstruct:jl}]}}function Pl(e){this.enter({type:`link`,title:null,url:``,children:[]},e)}function Fl(e){this.config.enter.autolinkProtocol.call(this,e)}function Il(e){this.config.exit.autolinkProtocol.call(this,e)}function Ll(e){this.config.exit.data.call(this,e);let t=this.stack[this.stack.length-1];t.type,t.url=`http://`+this.sliceSerialize(e)}function Rl(e){this.config.exit.autolinkEmail.call(this,e)}function K(e){this.exit(e)}function q(e){El(e,[[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi,J],[/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu,Y]],{ignore:[`link`,`linkReference`]})}function J(e,t,n,r,i){let a=``;if(!Bl(i)||(/^w/i.test(t)&&(n=t+n,t=``,a=`http://`),!X(n)))return!1;let o=zl(n+r);if(!o[0])return!1;let s={type:`link`,title:null,url:a+t+o[0],children:[{type:`text`,value:t+o[0]}]};return o[1]?[s,{type:`text`,value:o[1]}]:s}function Y(e,t,n,r){return!Bl(r,!0)||/[-\d_]$/.test(n)?!1:{type:`link`,title:null,url:`mailto:`+t+`@`+n,children:[{type:`text`,value:t+`@`+n}]}}function X(e){let t=e.split(`.`);return!(t.length<2||t[t.length-1]&&(/_/.test(t[t.length-1])||!/[a-zA-Z\d]/.test(t[t.length-1]))||t[t.length-2]&&(/_/.test(t[t.length-2])||!/[a-zA-Z\d]/.test(t[t.length-2])))}function zl(e){let t=/[!"&'),.:;<>?\]}]+$/.exec(e);if(!t)return[e,void 0];e=e.slice(0,t.index);let n=t[0],r=n.indexOf(`)`),i=wl(e,`(`),a=wl(e,`)`);for(;r!==-1&&i>a;)e+=n.slice(0,r+1),n=n.slice(r+1),r=n.indexOf(`)`),a++;return[e,n]}function Bl(e,t){let n=e.input.charCodeAt(e.index-1);return(e.index===0||Ui(n)||Hi(n))&&(!t||n!==47)}Xl.peek=Yl;function Vl(){this.buffer()}function Hl(e){this.enter({type:`footnoteReference`,identifier:``,label:``},e)}function Ul(){this.buffer()}function Wl(e){this.enter({type:`footnoteDefinition`,identifier:``,label:``,children:[]},e)}function Gl(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.type,n.identifier=F(this.sliceSerialize(e)).toLowerCase(),n.label=t}function Kl(e){this.exit(e)}function ql(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.type,n.identifier=F(this.sliceSerialize(e)).toLowerCase(),n.label=t}function Jl(e){this.exit(e)}function Yl(){return`[`}function Xl(e,t,n,r){let i=n.createTracker(r),a=i.move(`[^`),o=n.enter(`footnoteReference`),s=n.enter(`reference`);return a+=i.move(n.safe(n.associationId(e),{after:`]`,before:a})),s(),o(),a+=i.move(`]`),a}function Zl(){return{enter:{gfmFootnoteCallString:Vl,gfmFootnoteCall:Hl,gfmFootnoteDefinitionLabelString:Ul,gfmFootnoteDefinition:Wl},exit:{gfmFootnoteCallString:Gl,gfmFootnoteCall:Kl,gfmFootnoteDefinitionLabelString:ql,gfmFootnoteDefinition:Jl}}}function Ql(e){let t=!1;return e&&e.firstLineBlank&&(t=!0),{handlers:{footnoteDefinition:n,footnoteReference:Xl},unsafe:[{character:`[`,inConstruct:[`label`,`phrasing`,`reference`]}]};function n(e,n,r,i){let a=r.createTracker(i),o=a.move(`[^`),s=r.enter(`footnoteDefinition`),c=r.enter(`label`);return o+=a.move(r.safe(r.associationId(e),{before:o,after:`]`})),c(),o+=a.move(`]:`),e.children&&e.children.length>0&&(a.shift(4),o+=a.move((t?`
`:` `)+r.indentLines(r.containerFlow(e,a.current()),t?eu:$l))),s(),o}}function $l(e,t,n){return t===0?e:eu(e,t,n)}function eu(e,t,n){return(n?``:`    `)+e}var tu=[`autolink`,`destinationLiteral`,`destinationRaw`,`reference`,`titleQuote`,`titleApostrophe`];ou.peek=su;function nu(){return{canContainEols:[`delete`],enter:{strikethrough:iu},exit:{strikethrough:au}}}function ru(){return{unsafe:[{character:`~`,inConstruct:`phrasing`,notInConstruct:tu}],handlers:{delete:ou}}}function iu(e){this.enter({type:`delete`,children:[]},e)}function au(e){this.exit(e)}function ou(e,t,n,r){let i=n.createTracker(r),a=n.enter(`strikethrough`),o=i.move(`~~`);return o+=n.containerPhrasing(e,{...i.current(),before:o,after:`~`}),o+=i.move(`~~`),a(),o}function su(){return`~`}function cu(e){return e.length}function lu(e,t){let n=t||{},r=(n.align||[]).concat(),i=n.stringLength||cu,a=[],o=[],s=[],c=[],l=0,u=-1;for(;++u<e.length;){let t=[],r=[],a=-1;for(e[u].length>l&&(l=e[u].length);++a<e[u].length;){let o=uu(e[u][a]);if(n.alignDelimiters!==!1){let e=i(o);r[a]=e,(c[a]===void 0||e>c[a])&&(c[a]=e)}t.push(o)}o[u]=t,s[u]=r}let d=-1;if(typeof r==`object`&&`length`in r)for(;++d<l;)a[d]=du(r[d]);else{let e=du(r);for(;++d<l;)a[d]=e}d=-1;let f=[],p=[];for(;++d<l;){let e=a[d],t=``,r=``;e===99?(t=`:`,r=`:`):e===108?t=`:`:e===114&&(r=`:`);let i=n.alignDelimiters===!1?1:Math.max(1,c[d]-t.length-r.length),o=t+`-`.repeat(i)+r;n.alignDelimiters!==!1&&(i=t.length+i+r.length,i>c[d]&&(c[d]=i),p[d]=i),f[d]=o}o.splice(1,0,f),s.splice(1,0,p),u=-1;let m=[];for(;++u<o.length;){let e=o[u],t=s[u];d=-1;let r=[];for(;++d<l;){let i=e[d]||``,o=``,s=``;if(n.alignDelimiters!==!1){let e=c[d]-(t[d]||0),n=a[d];n===114?o=` `.repeat(e):n===99?e%2?(o=` `.repeat(e/2+.5),s=` `.repeat(e/2-.5)):(o=` `.repeat(e/2),s=o):s=` `.repeat(e)}n.delimiterStart!==!1&&!d&&r.push(`|`),n.padding!==!1&&(n.alignDelimiters!==!1||i!==``)&&(n.delimiterStart!==!1||d)&&r.push(` `),n.alignDelimiters!==!1&&r.push(o),r.push(i),n.alignDelimiters!==!1&&r.push(s),n.padding!==!1&&r.push(` `),(n.delimiterEnd!==!1||d!==l-1)&&r.push(`|`)}m.push(n.delimiterEnd===!1?r.join(``).replace(/ +$/,``):r.join(``))}return m.join(`
`)}function uu(e){return e==null?``:String(e)}function du(e){let t=typeof e==`string`?e.codePointAt(0):0;return t===67||t===99?99:t===76||t===108?108:t===82||t===114?114:0}function fu(e,t,n,r){let i=n.enter(`blockquote`),a=n.createTracker(r);a.move(`> `),a.shift(2);let o=n.indentLines(n.containerFlow(e,a.current()),pu);return i(),o}function pu(e,t,n){return`>`+(n?``:` `)+e}function mu(e,t){return hu(e,t.inConstruct,!0)&&!hu(e,t.notInConstruct,!1)}function hu(e,t,n){if(typeof t==`string`&&(t=[t]),!t||t.length===0)return n;let r=-1;for(;++r<t.length;)if(e.includes(t[r]))return!0;return!1}function gu(e,t,n,r){let i=-1;for(;++i<n.unsafe.length;)if(n.unsafe[i].character===`
`&&mu(n.stack,n.unsafe[i]))return/[ \t]/.test(r.before)?``:` `;return`\\
`}function _u(e,t){let n=String(e),r=n.indexOf(t),i=r,a=0,o=0;if(typeof t!=`string`)throw TypeError(`Expected substring`);for(;r!==-1;)r===i?++a>o&&(o=a):a=1,i=r+t.length,r=n.indexOf(t,i);return o}function vu(e,t){return!!(t.options.fences===!1&&e.value&&!e.lang&&/[^ \r\n]/.test(e.value)&&!/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value))}function yu(e){let t=e.options.fence||"`";if(t!=="`"&&t!==`~`)throw Error("Cannot serialize code with `"+t+"` for `options.fence`, expected `` ` `` or `~`");return t}function bu(e,t,n,r){let i=yu(n),a=e.value||``,o=i==="`"?`GraveAccent`:`Tilde`;if(vu(e,n)){let e=n.enter(`codeIndented`),t=n.indentLines(a,xu);return e(),t}let s=n.createTracker(r),c=i.repeat(Math.max(_u(a,i)+1,3)),l=n.enter(`codeFenced`),u=s.move(c);if(e.lang){let t=n.enter(`codeFencedLang${o}`);u+=s.move(n.safe(e.lang,{before:u,after:` `,encode:["`"],...s.current()})),t()}if(e.lang&&e.meta){let t=n.enter(`codeFencedMeta${o}`);u+=s.move(` `),u+=s.move(n.safe(e.meta,{before:u,after:`
`,encode:["`"],...s.current()})),t()}return u+=s.move(`
`),a&&(u+=s.move(a+`
`)),u+=s.move(c),l(),u}function xu(e,t,n){return(n?``:`    `)+e}function Su(e){let t=e.options.quote||`"`;if(t!==`"`&&t!==`'`)throw Error("Cannot serialize title with `"+t+"` for `options.quote`, expected `\"`, or `'`");return t}function Cu(e,t,n,r){let i=Su(n),a=i===`"`?`Quote`:`Apostrophe`,o=n.enter(`definition`),s=n.enter(`label`),c=n.createTracker(r),l=c.move(`[`);return l+=c.move(n.safe(n.associationId(e),{before:l,after:`]`,...c.current()})),l+=c.move(`]: `),s(),!e.url||/[\0- \u007F]/.test(e.url)?(s=n.enter(`destinationLiteral`),l+=c.move(`<`),l+=c.move(n.safe(e.url,{before:l,after:`>`,...c.current()})),l+=c.move(`>`)):(s=n.enter(`destinationRaw`),l+=c.move(n.safe(e.url,{before:l,after:e.title?` `:`
`,...c.current()}))),s(),e.title&&(s=n.enter(`title${a}`),l+=c.move(` `+i),l+=c.move(n.safe(e.title,{before:l,after:i,...c.current()})),l+=c.move(i),s()),o(),l}function wu(e){let t=e.options.emphasis||`*`;if(t!==`*`&&t!==`_`)throw Error("Cannot serialize emphasis with `"+t+"` for `options.emphasis`, expected `*`, or `_`");return t}function Tu(e){return`&#x`+e.toString(16).toUpperCase()+`;`}function Eu(e,t,n){let r=Qi(e),i=Qi(t);return r===void 0?i===void 0?n===`_`?{inside:!0,outside:!0}:{inside:!1,outside:!1}:i===1?{inside:!0,outside:!0}:{inside:!1,outside:!0}:r===1?i===void 0?{inside:!1,outside:!1}:i===1?{inside:!0,outside:!0}:{inside:!1,outside:!1}:i===void 0?{inside:!1,outside:!1}:i===1?{inside:!0,outside:!1}:{inside:!1,outside:!1}}Du.peek=Ou;function Du(e,t,n,r){let i=wu(n),a=n.enter(`emphasis`),o=n.createTracker(r),s=o.move(i),c=o.move(n.containerPhrasing(e,{after:i,before:s,...o.current()})),l=c.charCodeAt(0),u=Eu(r.before.charCodeAt(r.before.length-1),l,i);u.inside&&(c=Tu(l)+c.slice(1));let d=c.charCodeAt(c.length-1),f=Eu(r.after.charCodeAt(0),d,i);f.inside&&(c=c.slice(0,-1)+Tu(d));let p=o.move(i);return a(),n.attentionEncodeSurroundingInfo={after:f.outside,before:u.outside},s+c+p}function Ou(e,t,n){return n.options.emphasis||`*`}function ku(e,t){let n=!1;return Cc(e,function(e){if(`value`in e&&/\r?\n|\r/.test(e.value)||e.type===`break`)return n=!0,!1}),!!((!e.depth||e.depth<3)&&wi(e)&&(t.options.setext||n))}function Au(e,t,n,r){let i=Math.max(Math.min(6,e.depth||1),1),a=n.createTracker(r);if(ku(e,n)){let t=n.enter(`headingSetext`),r=n.enter(`phrasing`),o=n.containerPhrasing(e,{...a.current(),before:`
`,after:`
`});return r(),t(),o+`
`+(i===1?`=`:`-`).repeat(o.length-(Math.max(o.lastIndexOf(`\r`),o.lastIndexOf(`
`))+1))}let o=`#`.repeat(i),s=n.enter(`headingAtx`),c=n.enter(`phrasing`);a.move(o+` `);let l=n.containerPhrasing(e,{before:`# `,after:`
`,...a.current()});return/^[\t ]/.test(l)&&(l=Tu(l.charCodeAt(0))+l.slice(1)),l=l?o+` `+l:o,n.options.closeAtx&&(l+=` `+o),c(),s(),l}ju.peek=Mu;function ju(e){return e.value||``}function Mu(){return`<`}Nu.peek=Pu;function Nu(e,t,n,r){let i=Su(n),a=i===`"`?`Quote`:`Apostrophe`,o=n.enter(`image`),s=n.enter(`label`),c=n.createTracker(r),l=c.move(`![`);return l+=c.move(n.safe(e.alt,{before:l,after:`]`,...c.current()})),l+=c.move(`](`),s(),!e.url&&e.title||/[\0- \u007F]/.test(e.url)?(s=n.enter(`destinationLiteral`),l+=c.move(`<`),l+=c.move(n.safe(e.url,{before:l,after:`>`,...c.current()})),l+=c.move(`>`)):(s=n.enter(`destinationRaw`),l+=c.move(n.safe(e.url,{before:l,after:e.title?` `:`)`,...c.current()}))),s(),e.title&&(s=n.enter(`title${a}`),l+=c.move(` `+i),l+=c.move(n.safe(e.title,{before:l,after:i,...c.current()})),l+=c.move(i),s()),l+=c.move(`)`),o(),l}function Pu(){return`!`}Fu.peek=Iu;function Fu(e,t,n,r){let i=e.referenceType,a=n.enter(`imageReference`),o=n.enter(`label`),s=n.createTracker(r),c=s.move(`![`),l=n.safe(e.alt,{before:c,after:`]`,...s.current()});c+=s.move(l+`][`),o();let u=n.stack;n.stack=[],o=n.enter(`reference`);let d=n.safe(n.associationId(e),{before:c,after:`]`,...s.current()});return o(),n.stack=u,a(),i===`full`||!l||l!==d?c+=s.move(d+`]`):i===`shortcut`?c=c.slice(0,-1):c+=s.move(`]`),c}function Iu(){return`!`}Lu.peek=Ru;function Lu(e,t,n){let r=e.value||``,i="`",a=-1;for(;RegExp("(^|[^`])"+i+"([^`]|$)").test(r);)i+="`";for(/[^ \r\n]/.test(r)&&(/^[ \r\n]/.test(r)&&/[ \r\n]$/.test(r)||/^`|`$/.test(r))&&(r=` `+r+` `);++a<n.unsafe.length;){let e=n.unsafe[a],t=n.compilePattern(e),i;if(e.atBreak)for(;i=t.exec(r);){let e=i.index;r.charCodeAt(e)===10&&r.charCodeAt(e-1)===13&&e--,r=r.slice(0,e)+` `+r.slice(i.index+1)}}return i+r+i}function Ru(){return"`"}function zu(e,t){let n=wi(e);return!!(!t.options.resourceLink&&e.url&&!e.title&&e.children&&e.children.length===1&&e.children[0].type===`text`&&(n===e.url||`mailto:`+n===e.url)&&/^[a-z][a-z+.-]+:/i.test(e.url)&&!/[\0- <>\u007F]/.test(e.url))}Bu.peek=Vu;function Bu(e,t,n,r){let i=Su(n),a=i===`"`?`Quote`:`Apostrophe`,o=n.createTracker(r),s,c;if(zu(e,n)){let t=n.stack;n.stack=[],s=n.enter(`autolink`);let r=o.move(`<`);return r+=o.move(n.containerPhrasing(e,{before:r,after:`>`,...o.current()})),r+=o.move(`>`),s(),n.stack=t,r}s=n.enter(`link`),c=n.enter(`label`);let l=o.move(`[`);return l+=o.move(n.containerPhrasing(e,{before:l,after:`](`,...o.current()})),l+=o.move(`](`),c(),!e.url&&e.title||/[\0- \u007F]/.test(e.url)?(c=n.enter(`destinationLiteral`),l+=o.move(`<`),l+=o.move(n.safe(e.url,{before:l,after:`>`,...o.current()})),l+=o.move(`>`)):(c=n.enter(`destinationRaw`),l+=o.move(n.safe(e.url,{before:l,after:e.title?` `:`)`,...o.current()}))),c(),e.title&&(c=n.enter(`title${a}`),l+=o.move(` `+i),l+=o.move(n.safe(e.title,{before:l,after:i,...o.current()})),l+=o.move(i),c()),l+=o.move(`)`),s(),l}function Vu(e,t,n){return zu(e,n)?`<`:`[`}Hu.peek=Uu;function Hu(e,t,n,r){let i=e.referenceType,a=n.enter(`linkReference`),o=n.enter(`label`),s=n.createTracker(r),c=s.move(`[`),l=n.containerPhrasing(e,{before:c,after:`]`,...s.current()});c+=s.move(l+`][`),o();let u=n.stack;n.stack=[],o=n.enter(`reference`);let d=n.safe(n.associationId(e),{before:c,after:`]`,...s.current()});return o(),n.stack=u,a(),i===`full`||!l||l!==d?c+=s.move(d+`]`):i===`shortcut`?c=c.slice(0,-1):c+=s.move(`]`),c}function Uu(){return`[`}function Wu(e){let t=e.options.bullet||`*`;if(t!==`*`&&t!==`+`&&t!==`-`)throw Error("Cannot serialize items with `"+t+"` for `options.bullet`, expected `*`, `+`, or `-`");return t}function Z(e){let t=Wu(e),n=e.options.bulletOther;if(!n)return t===`*`?`-`:`*`;if(n!==`*`&&n!==`+`&&n!==`-`)throw Error("Cannot serialize items with `"+n+"` for `options.bulletOther`, expected `*`, `+`, or `-`");if(n===t)throw Error("Expected `bullet` (`"+t+"`) and `bulletOther` (`"+n+"`) to be different");return n}function Gu(e){let t=e.options.bulletOrdered||`.`;if(t!==`.`&&t!==`)`)throw Error("Cannot serialize items with `"+t+"` for `options.bulletOrdered`, expected `.` or `)`");return t}function Ku(e){let t=e.options.rule||`*`;if(t!==`*`&&t!==`-`&&t!==`_`)throw Error("Cannot serialize rules with `"+t+"` for `options.rule`, expected `*`, `-`, or `_`");return t}function qu(e,t,n,r){let i=n.enter(`list`),a=n.bulletCurrent,o=e.ordered?Gu(n):Wu(n),s=e.ordered?o===`.`?`)`:`.`:Z(n),c=t&&n.bulletLastUsed?o===n.bulletLastUsed:!1;if(!e.ordered){let t=e.children?e.children[0]:void 0;if((o===`*`||o===`-`)&&t&&(!t.children||!t.children[0])&&n.stack[n.stack.length-1]===`list`&&n.stack[n.stack.length-2]===`listItem`&&n.stack[n.stack.length-3]===`list`&&n.stack[n.stack.length-4]===`listItem`&&n.indexStack[n.indexStack.length-1]===0&&n.indexStack[n.indexStack.length-2]===0&&n.indexStack[n.indexStack.length-3]===0&&(c=!0),Ku(n)===o&&t){let t=-1;for(;++t<e.children.length;){let n=e.children[t];if(n&&n.type===`listItem`&&n.children&&n.children[0]&&n.children[0].type===`thematicBreak`){c=!0;break}}}}c&&(o=s),n.bulletCurrent=o;let l=n.containerFlow(e,r);return n.bulletLastUsed=o,n.bulletCurrent=a,i(),l}function Ju(e){let t=e.options.listItemIndent||`one`;if(t!==`tab`&&t!==`one`&&t!==`mixed`)throw Error("Cannot serialize items with `"+t+"` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");return t}function Yu(e,t,n,r){let i=Ju(n),a=n.bulletCurrent||Wu(n);t&&t.type===`list`&&t.ordered&&(a=(typeof t.start==`number`&&t.start>-1?t.start:1)+(n.options.incrementListMarker===!1?0:t.children.indexOf(e))+a);let o=a.length+1;(i===`tab`||i===`mixed`&&(t&&t.type===`list`&&t.spread||e.spread))&&(o=Math.ceil(o/4)*4);let s=n.createTracker(r);s.move(a+` `.repeat(o-a.length)),s.shift(o);let c=n.enter(`listItem`),l=n.indentLines(n.containerFlow(e,s.current()),u);return c(),l;function u(e,t,n){return t?(n?``:` `.repeat(o))+e:(n?a:a+` `.repeat(o-a.length))+e}}function Xu(e,t,n,r){let i=n.enter(`paragraph`),a=n.enter(`phrasing`),o=n.containerPhrasing(e,r);return a(),i(),o}var Zu=fc([`break`,`delete`,`emphasis`,`footnote`,`footnoteReference`,`image`,`imageReference`,`inlineCode`,`inlineMath`,`link`,`linkReference`,`mdxJsxTextElement`,`mdxTextExpression`,`strong`,`text`,`textDirective`]);function Qu(e,t,n,r){return(e.children.some(function(e){return Zu(e)})?n.containerPhrasing:n.containerFlow).call(n,e,r)}function $u(e){let t=e.options.strong||`*`;if(t!==`*`&&t!==`_`)throw Error("Cannot serialize strong with `"+t+"` for `options.strong`, expected `*`, or `_`");return t}ed.peek=td;function ed(e,t,n,r){let i=$u(n),a=n.enter(`strong`),o=n.createTracker(r),s=o.move(i+i),c=o.move(n.containerPhrasing(e,{after:i,before:s,...o.current()})),l=c.charCodeAt(0),u=Eu(r.before.charCodeAt(r.before.length-1),l,i);u.inside&&(c=Tu(l)+c.slice(1));let d=c.charCodeAt(c.length-1),f=Eu(r.after.charCodeAt(0),d,i);f.inside&&(c=c.slice(0,-1)+Tu(d));let p=o.move(i+i);return a(),n.attentionEncodeSurroundingInfo={after:f.outside,before:u.outside},s+c+p}function td(e,t,n){return n.options.strong||`*`}function nd(e,t,n,r){return n.safe(e.value,r)}function rd(e){let t=e.options.ruleRepetition||3;if(t<3)throw Error("Cannot serialize rules with repetition `"+t+"` for `options.ruleRepetition`, expected `3` or more");return t}function id(e,t,n){let r=(Ku(n)+(n.options.ruleSpaces?` `:``)).repeat(rd(n));return n.options.ruleSpaces?r.slice(0,-1):r}var ad={blockquote:fu,break:gu,code:bu,definition:Cu,emphasis:Du,hardBreak:gu,heading:Au,html:ju,image:Nu,imageReference:Fu,inlineCode:Lu,link:Bu,linkReference:Hu,list:qu,listItem:Yu,paragraph:Xu,root:Qu,strong:ed,text:nd,thematicBreak:id};function od(){return{enter:{table:sd,tableData:dd,tableHeader:dd,tableRow:ld},exit:{codeText:fd,table:cd,tableData:ud,tableHeader:ud,tableRow:ud}}}function sd(e){let t=e._align;this.enter({type:`table`,align:t.map(function(e){return e===`none`?null:e}),children:[]},e),this.data.inTable=!0}function cd(e){this.exit(e),this.data.inTable=void 0}function ld(e){this.enter({type:`tableRow`,children:[]},e)}function ud(e){this.exit(e)}function dd(e){this.enter({type:`tableCell`,children:[]},e)}function fd(e){let t=this.resume();this.data.inTable&&(t=t.replace(/\\([\\|])/g,pd));let n=this.stack[this.stack.length-1];n.type,n.value=t,this.exit(e)}function pd(e,t){return t===`|`?t:e}function md(e){let t=e||{},n=t.tableCellPadding,r=t.tablePipeAlign,i=t.stringLength,a=n?` `:`|`;return{unsafe:[{character:`\r`,inConstruct:`tableCell`},{character:`
`,inConstruct:`tableCell`},{atBreak:!0,character:`|`,after:`[	 :-]`},{character:`|`,inConstruct:`tableCell`},{atBreak:!0,character:`:`,after:`-`},{atBreak:!0,character:`-`,after:`[:|-]`}],handlers:{inlineCode:f,table:o,tableCell:c,tableRow:s}};function o(e,t,n,r){return l(u(e,n,r),e.align)}function s(e,t,n,r){let i=l([d(e,n,r)]);return i.slice(0,i.indexOf(`
`))}function c(e,t,n,r){let i=n.enter(`tableCell`),o=n.enter(`phrasing`),s=n.containerPhrasing(e,{...r,before:a,after:a});return o(),i(),s}function l(e,t){return lu(e,{align:t,alignDelimiters:r,padding:n,stringLength:i})}function u(e,t,n){let r=e.children,i=-1,a=[],o=t.enter(`table`);for(;++i<r.length;)a[i]=d(r[i],t,n);return o(),a}function d(e,t,n){let r=e.children,i=-1,a=[],o=t.enter(`tableRow`);for(;++i<r.length;)a[i]=c(r[i],e,t,n);return o(),a}function f(e,t,n){let r=ad.inlineCode(e,t,n);return n.stack.includes(`tableCell`)&&(r=r.replace(/\|/g,`\\$&`)),r}}function hd(){return{exit:{taskListCheckValueChecked:_d,taskListCheckValueUnchecked:_d,paragraph:vd}}}function gd(){return{unsafe:[{atBreak:!0,character:`-`,after:`[:|-]`}],handlers:{listItem:yd}}}function _d(e){let t=this.stack[this.stack.length-2];t.type,t.checked=e.type===`taskListCheckValueChecked`}function vd(e){let t=this.stack[this.stack.length-2];if(t&&t.type===`listItem`&&typeof t.checked==`boolean`){let e=this.stack[this.stack.length-1];e.type;let n=e.children[0];if(n&&n.type===`text`){let r=t.children,i=-1,a;for(;++i<r.length;){let e=r[i];if(e.type===`paragraph`){a=e;break}}a===e&&(n.value=n.value.slice(1),n.value.length===0?e.children.shift():e.position&&n.position&&typeof n.position.start.offset==`number`&&(n.position.start.column++,n.position.start.offset++,e.position.start=Object.assign({},n.position.start)))}}this.exit(e)}function yd(e,t,n,r){let i=e.children[0],a=typeof e.checked==`boolean`&&i&&i.type===`paragraph`,o=`[`+(e.checked?`x`:` `)+`] `,s=n.createTracker(r);a&&s.move(o);let c=ad.listItem(e,t,n,{...r,...s.current()});return a&&(c=c.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/,l)),c;function l(e){return e+o}}function Q(){return[Ml(),Zl(),nu(),od(),hd()]}function bd(e){return{extensions:[Nl(),Ql(e),ru(),md(e),gd()]}}var xd={tokenize:Pd,partial:!0},Sd={tokenize:Fd,partial:!0},Cd={tokenize:Id,partial:!0},wd={tokenize:Ld,partial:!0},Td={tokenize:Rd,partial:!0},Ed={name:`wwwAutolink`,tokenize:$,previous:zd},Dd={name:`protocolAutolink`,tokenize:Nd,previous:Bd},Od={name:`emailAutolink`,tokenize:Md,previous:Vd},kd={};function Ad(){return{text:kd}}for(var jd=48;jd<123;)kd[jd]=Od,jd++,jd===58?jd=65:jd===91&&(jd=97);kd[43]=Od,kd[45]=Od,kd[46]=Od,kd[95]=Od,kd[72]=[Od,Dd],kd[104]=[Od,Dd],kd[87]=[Od,Ed],kd[119]=[Od,Ed];function Md(e,t,n){let r=this,i,a;return o;function o(t){return!Hd(t)||!Vd.call(r,r.previous)||Ud(r.events)?n(t):(e.enter(`literalAutolink`),e.enter(`literalAutolinkEmail`),s(t))}function s(t){return Hd(t)?(e.consume(t),s):t===64?(e.consume(t),c):n(t)}function c(t){return t===46?e.check(Td,u,l)(t):t===45||t===95||L(t)?(a=!0,e.consume(t),c):u(t)}function l(t){return e.consume(t),i=!0,c}function u(o){return a&&i&&I(r.previous)?(e.exit(`literalAutolinkEmail`),e.exit(`literalAutolink`),t(o)):n(o)}}function $(e,t,n){let r=this;return i;function i(t){return t!==87&&t!==119||!zd.call(r,r.previous)||Ud(r.events)?n(t):(e.enter(`literalAutolink`),e.enter(`literalAutolinkWww`),e.check(xd,e.attempt(Sd,e.attempt(Cd,a),n),n)(t))}function a(n){return e.exit(`literalAutolinkWww`),e.exit(`literalAutolink`),t(n)}}function Nd(e,t,n){let r=this,i=``,a=!1;return o;function o(t){return(t===72||t===104)&&Bd.call(r,r.previous)&&!Ud(r.events)?(e.enter(`literalAutolink`),e.enter(`literalAutolinkHttp`),i+=String.fromCodePoint(t),e.consume(t),s):n(t)}function s(t){if(I(t)&&i.length<5)return i+=String.fromCodePoint(t),e.consume(t),s;if(t===58){let n=i.toLowerCase();if(n===`http`||n===`https`)return e.consume(t),c}return n(t)}function c(t){return t===47?(e.consume(t),a?l:(a=!0,c)):n(t)}function l(t){return t===null||Ri(t)||z(t)||Ui(t)||Hi(t)?n(t):e.attempt(Sd,e.attempt(Cd,u),n)(t)}function u(n){return e.exit(`literalAutolinkHttp`),e.exit(`literalAutolink`),t(n)}}function Pd(e,t,n){let r=0;return i;function i(t){return(t===87||t===119)&&r<3?(r++,e.consume(t),i):t===46&&r===3?(e.consume(t),a):n(t)}function a(e){return e===null?n(e):t(e)}}function Fd(e,t,n){let r,i,a;return o;function o(t){return t===46||t===95?e.check(wd,c,s)(t):t===null||z(t)||Ui(t)||t!==45&&Hi(t)?c(t):(a=!0,e.consume(t),o)}function s(t){return t===95?r=!0:(i=r,r=void 0),e.consume(t),o}function c(e){return i||r||!a?n(e):t(e)}}function Id(e,t){let n=0,r=0;return i;function i(o){return o===40?(n++,e.consume(o),i):o===41&&r<n?a(o):o===33||o===34||o===38||o===39||o===41||o===42||o===44||o===46||o===58||o===59||o===60||o===63||o===93||o===95||o===126?e.check(wd,t,a)(o):o===null||z(o)||Ui(o)?t(o):(e.consume(o),i)}function a(t){return t===41&&r++,e.consume(t),i}}function Ld(e,t,n){return r;function r(o){return o===33||o===34||o===39||o===41||o===42||o===44||o===46||o===58||o===59||o===63||o===95||o===126?(e.consume(o),r):o===38?(e.consume(o),a):o===93?(e.consume(o),i):o===60||o===null||z(o)||Ui(o)?t(o):n(o)}function i(e){return e===null||e===40||e===91||z(e)||Ui(e)?t(e):r(e)}function a(e){return I(e)?o(e):n(e)}function o(t){return t===59?(e.consume(t),r):I(t)?(e.consume(t),o):n(t)}}function Rd(e,t,n){return r;function r(t){return e.consume(t),i}function i(e){return L(e)?n(e):t(e)}}function zd(e){return e===null||e===40||e===42||e===95||e===91||e===93||e===126||z(e)}function Bd(e){return!I(e)}function Vd(e){return!(e===47||Hd(e))}function Hd(e){return e===43||e===45||e===46||e===95||L(e)}function Ud(e){let t=e.length,n=!1;for(;t--;){let r=e[t][1];if((r.type===`labelLink`||r.type===`labelImage`)&&!r._balanced){n=!0;break}if(r._gfmAutolinkLiteralWalkedInto){n=!1;break}}return e.length>0&&!n&&(e[e.length-1][1]._gfmAutolinkLiteralWalkedInto=!0),n}var Wd={tokenize:Qd,partial:!0};function Gd(){return{document:{91:{name:`gfmFootnoteDefinition`,tokenize:Yd,continuation:{tokenize:Xd},exit:Zd}},text:{91:{name:`gfmFootnoteCall`,tokenize:Jd},93:{name:`gfmPotentialFootnoteCall`,add:`after`,tokenize:Kd,resolveTo:qd}}}}function Kd(e,t,n){let r=this,i=r.events.length,a=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),o;for(;i--;){let e=r.events[i][1];if(e.type===`labelImage`){o=e;break}if(e.type===`gfmFootnoteCall`||e.type===`labelLink`||e.type===`label`||e.type===`image`||e.type===`link`)break}return s;function s(i){if(!o||!o._balanced)return n(i);let s=F(r.sliceSerialize({start:o.end,end:r.now()}));return s.codePointAt(0)!==94||!a.includes(s.slice(1))?n(i):(e.enter(`gfmFootnoteCallLabelMarker`),e.consume(i),e.exit(`gfmFootnoteCallLabelMarker`),t(i))}}function qd(e,t){let n=e.length;for(;n--;)if(e[n][1].type===`labelImage`&&e[n][0]===`enter`){e[n][1];break}e[n+1][1].type=`data`,e[n+3][1].type=`gfmFootnoteCallLabelMarker`;let r={type:`gfmFootnoteCall`,start:Object.assign({},e[n+3][1].start),end:Object.assign({},e[e.length-1][1].end)},i={type:`gfmFootnoteCallMarker`,start:Object.assign({},e[n+3][1].end),end:Object.assign({},e[n+3][1].end)};i.end.column++,i.end.offset++,i.end._bufferIndex++;let a={type:`gfmFootnoteCallString`,start:Object.assign({},i.end),end:Object.assign({},e[e.length-1][1].start)},o={type:`chunkString`,contentType:`string`,start:Object.assign({},a.start),end:Object.assign({},a.end)},s=[e[n+1],e[n+2],[`enter`,r,t],e[n+3],e[n+4],[`enter`,i,t],[`exit`,i,t],[`enter`,a,t],[`enter`,o,t],[`exit`,o,t],[`exit`,a,t],e[e.length-2],e[e.length-1],[`exit`,r,t]];return e.splice(n,e.length-n+1,...s),e}function Jd(e,t,n){let r=this,i=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),a=0,o;return s;function s(t){return e.enter(`gfmFootnoteCall`),e.enter(`gfmFootnoteCallLabelMarker`),e.consume(t),e.exit(`gfmFootnoteCallLabelMarker`),c}function c(t){return t===94?(e.enter(`gfmFootnoteCallMarker`),e.consume(t),e.exit(`gfmFootnoteCallMarker`),e.enter(`gfmFootnoteCallString`),e.enter(`chunkString`).contentType=`string`,l):n(t)}function l(s){if(a>999||s===93&&!o||s===null||s===91||z(s))return n(s);if(s===93){e.exit(`chunkString`);let a=e.exit(`gfmFootnoteCallString`);return i.includes(F(r.sliceSerialize(a)))?(e.enter(`gfmFootnoteCallLabelMarker`),e.consume(s),e.exit(`gfmFootnoteCallLabelMarker`),e.exit(`gfmFootnoteCall`),t):n(s)}return z(s)||(o=!0),a++,e.consume(s),s===92?u:l}function u(t){return t===91||t===92||t===93?(e.consume(t),a++,l):l(t)}}function Yd(e,t,n){let r=this,i=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),a,o=0,s;return c;function c(t){return e.enter(`gfmFootnoteDefinition`)._container=!0,e.enter(`gfmFootnoteDefinitionLabel`),e.enter(`gfmFootnoteDefinitionLabelMarker`),e.consume(t),e.exit(`gfmFootnoteDefinitionLabelMarker`),l}function l(t){return t===94?(e.enter(`gfmFootnoteDefinitionMarker`),e.consume(t),e.exit(`gfmFootnoteDefinitionMarker`),e.enter(`gfmFootnoteDefinitionLabelString`),e.enter(`chunkString`).contentType=`string`,u):n(t)}function u(t){if(o>999||t===93&&!s||t===null||t===91||z(t))return n(t);if(t===93){e.exit(`chunkString`);let n=e.exit(`gfmFootnoteDefinitionLabelString`);return a=F(r.sliceSerialize(n)),e.enter(`gfmFootnoteDefinitionLabelMarker`),e.consume(t),e.exit(`gfmFootnoteDefinitionLabelMarker`),e.exit(`gfmFootnoteDefinitionLabel`),f}return z(t)||(s=!0),o++,e.consume(t),t===92?d:u}function d(t){return t===91||t===92||t===93?(e.consume(t),o++,u):u(t)}function f(t){return t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),i.includes(a)||i.push(a),V(e,p,`gfmFootnoteDefinitionWhitespace`)):n(t)}function p(e){return t(e)}}function Xd(e,t,n){return e.check(oa,t,e.attempt(Wd,t,n))}function Zd(e){e.exit(`gfmFootnoteDefinition`)}function Qd(e,t,n){let r=this;return V(e,i,`gfmFootnoteDefinitionIndent`,5);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`gfmFootnoteDefinitionIndent`&&i[2].sliceSerialize(i[1],!0).length===4?t(e):n(e)}}function $d(e){let t=(e||{}).singleTilde,n={name:`strikethrough`,tokenize:i,resolveAll:r};return t??=!0,{text:{126:n},insideSpan:{null:[n]},attentionMarkers:{null:[126]}};function r(e,t){let n=-1;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`strikethroughSequenceTemporary`&&e[n][1]._close){let r=n;for(;r--;)if(e[r][0]===`exit`&&e[r][1].type===`strikethroughSequenceTemporary`&&e[r][1]._open&&e[n][1].end.offset-e[n][1].start.offset===e[r][1].end.offset-e[r][1].start.offset){e[n][1].type=`strikethroughSequence`,e[r][1].type=`strikethroughSequence`;let i={type:`strikethrough`,start:Object.assign({},e[r][1].start),end:Object.assign({},e[n][1].end)},a={type:`strikethroughText`,start:Object.assign({},e[r][1].end),end:Object.assign({},e[n][1].start)},o=[[`enter`,i,t],[`enter`,e[r][1],t],[`exit`,e[r][1],t],[`enter`,a,t]],s=t.parser.constructs.insideSpan.null;s&&Ai(o,o.length,0,$i(s,e.slice(r+1,n),t)),Ai(o,o.length,0,[[`exit`,a,t],[`enter`,e[n][1],t],[`exit`,e[n][1],t],[`exit`,i,t]]),Ai(e,r-1,n-r+3,o),n=r+o.length-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`strikethroughSequenceTemporary`&&(e[n][1].type=`data`);return e}function i(e,n,r){let i=this.previous,a=this.events,o=0;return s;function s(t){return i===126&&a[a.length-1][1].type!==`characterEscape`?r(t):(e.enter(`strikethroughSequenceTemporary`),c(t))}function c(a){let s=Qi(i);if(a===126)return o>1?r(a):(e.consume(a),o++,c);if(o<2&&!t)return r(a);let l=e.exit(`strikethroughSequenceTemporary`),u=Qi(a);return l._open=!u||u===2&&!!s,l._close=!s||s===2&&!!u,n(a)}}}var ef=class{constructor(){this.map=[]}add(e,t,n){tf(this,e,t,n)}consume(e){if(this.map.sort(function(e,t){return e[0]-t[0]}),this.map.length===0)return;let t=this.map.length,n=[];for(;t>0;)--t,n.push(e.slice(this.map[t][0]+this.map[t][1]),this.map[t][2]),e.length=this.map[t][0];n.push(e.slice()),e.length=0;let r=n.pop();for(;r;){for(let t of r)e.push(t);r=n.pop()}this.map.length=0}};function tf(e,t,n,r){let i=0;if(n!==0||r.length!==0){for(;i<e.map.length;){if(e.map[i][0]===t){e.map[i][1]+=n,e.map[i][2].push(...r);return}i+=1}e.map.push([t,n,r])}}function nf(e,t){let n=!1,r=[];for(;t<e.length;){let i=e[t];if(n){if(i[0]===`enter`)i[1].type===`tableContent`&&r.push(e[t+1][1].type===`tableDelimiterMarker`?`left`:`none`);else if(i[1].type===`tableContent`){if(e[t-1][1].type===`tableDelimiterMarker`){let e=r.length-1;r[e]=r[e]===`left`?`center`:`right`}}else if(i[1].type===`tableDelimiterRow`)break}else i[0]===`enter`&&i[1].type===`tableDelimiterRow`&&(n=!0);t+=1}return r}function rf(){return{flow:{null:{name:`table`,tokenize:af,resolveAll:of}}}}function af(e,t,n){let r=this,i=0,a=0,o;return s;function s(e){let t=r.events.length-1;for(;t>-1;){let e=r.events[t][1].type;if(e===`lineEnding`||e===`linePrefix`)t--;else break}let i=t>-1?r.events[t][1].type:null,a=i===`tableHead`||i===`tableRow`?ee:c;return a===ee&&r.parser.lazy[r.now().line]?n(e):a(e)}function c(t){return e.enter(`tableHead`),e.enter(`tableRow`),l(t)}function l(e){return e===124?u(e):(o=!0,a+=1,u(e))}function u(t){return t===null?n(t):R(t)?a>1?(a=0,r.interrupt=!0,e.exit(`tableRow`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),p):n(t):B(t)?V(e,u,`whitespace`)(t):(a+=1,o&&(o=!1,i+=1),t===124?(e.enter(`tableCellDivider`),e.consume(t),e.exit(`tableCellDivider`),o=!0,u):(e.enter(`data`),d(t)))}function d(t){return t===null||t===124||z(t)?(e.exit(`data`),u(t)):(e.consume(t),t===92?f:d)}function f(t){return t===92||t===124?(e.consume(t),d):d(t)}function p(t){return r.interrupt=!1,r.parser.lazy[r.now().line]?n(t):(e.enter(`tableDelimiterRow`),o=!1,B(t)?V(e,m,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):m(t))}function m(t){return t===45||t===58?g(t):t===124?(o=!0,e.enter(`tableCellDivider`),e.consume(t),e.exit(`tableCellDivider`),h):x(t)}function h(t){return B(t)?V(e,g,`whitespace`)(t):g(t)}function g(t){return t===58?(a+=1,o=!0,e.enter(`tableDelimiterMarker`),e.consume(t),e.exit(`tableDelimiterMarker`),_):t===45?(a+=1,_(t)):t===null||R(t)?b(t):x(t)}function _(t){return t===45?(e.enter(`tableDelimiterFiller`),v(t)):x(t)}function v(t){return t===45?(e.consume(t),v):t===58?(o=!0,e.exit(`tableDelimiterFiller`),e.enter(`tableDelimiterMarker`),e.consume(t),e.exit(`tableDelimiterMarker`),y):(e.exit(`tableDelimiterFiller`),y(t))}function y(t){return B(t)?V(e,b,`whitespace`)(t):b(t)}function b(n){return n===124?m(n):n===null||R(n)?!o||i!==a?x(n):(e.exit(`tableDelimiterRow`),e.exit(`tableHead`),t(n)):x(n)}function x(e){return n(e)}function ee(t){return e.enter(`tableRow`),S(t)}function S(n){return n===124?(e.enter(`tableCellDivider`),e.consume(n),e.exit(`tableCellDivider`),S):n===null||R(n)?(e.exit(`tableRow`),t(n)):B(n)?V(e,S,`whitespace`)(n):(e.enter(`data`),C(n))}function C(t){return t===null||t===124||z(t)?(e.exit(`data`),S(t)):(e.consume(t),t===92?w:C)}function w(t){return t===92||t===124?(e.consume(t),C):C(t)}}function of(e,t){let n=-1,r=!0,i=0,a=[0,0,0,0],o=[0,0,0,0],s=!1,c=0,l,u,d,f=new ef;for(;++n<e.length;){let p=e[n],m=p[1];p[0]===`enter`?m.type===`tableHead`?(s=!1,c!==0&&(cf(f,t,c,l,u),u=void 0,c=0),l={type:`table`,start:Object.assign({},m.start),end:Object.assign({},m.end)},f.add(n,0,[[`enter`,l,t]])):m.type===`tableRow`||m.type===`tableDelimiterRow`?(r=!0,d=void 0,a=[0,0,0,0],o=[0,n+1,0,0],s&&(s=!1,u={type:`tableBody`,start:Object.assign({},m.start),end:Object.assign({},m.end)},f.add(n,0,[[`enter`,u,t]])),i=m.type===`tableDelimiterRow`?2:u?3:1):i&&(m.type===`data`||m.type===`tableDelimiterMarker`||m.type===`tableDelimiterFiller`)?(r=!1,o[2]===0&&(a[1]!==0&&(o[0]=o[1],d=sf(f,t,a,i,void 0,d),a=[0,0,0,0]),o[2]=n)):m.type===`tableCellDivider`&&(r?r=!1:(a[1]!==0&&(o[0]=o[1],d=sf(f,t,a,i,void 0,d)),a=o,o=[a[1],n,0,0])):m.type===`tableHead`?(s=!0,c=n):m.type===`tableRow`||m.type===`tableDelimiterRow`?(c=n,a[1]===0?o[1]!==0&&(d=sf(f,t,o,i,n,d)):(o[0]=o[1],d=sf(f,t,a,i,n,d)),i=0):i&&(m.type===`data`||m.type===`tableDelimiterMarker`||m.type===`tableDelimiterFiller`)&&(o[3]=n)}for(c!==0&&cf(f,t,c,l,u),f.consume(t.events),n=-1;++n<t.events.length;){let e=t.events[n];e[0]===`enter`&&e[1].type===`table`&&(e[1]._align=nf(t.events,n))}return e}function sf(e,t,n,r,i,a){let o=r===1?`tableHeader`:r===2?`tableDelimiter`:`tableData`;n[0]!==0&&(a.end=Object.assign({},lf(t.events,n[0])),e.add(n[0],0,[[`exit`,a,t]]));let s=lf(t.events,n[1]);if(a={type:o,start:Object.assign({},s),end:Object.assign({},s)},e.add(n[1],0,[[`enter`,a,t]]),n[2]!==0){let i=lf(t.events,n[2]),a=lf(t.events,n[3]),o={type:`tableContent`,start:Object.assign({},i),end:Object.assign({},a)};if(e.add(n[2],0,[[`enter`,o,t]]),r!==2){let r=t.events[n[2]],i=t.events[n[3]];if(r[1].end=Object.assign({},i[1].end),r[1].type=`chunkText`,r[1].contentType=`text`,n[3]>n[2]+1){let t=n[2]+1,r=n[3]-n[2]-1;e.add(t,r,[])}}e.add(n[3]+1,0,[[`exit`,o,t]])}return i!==void 0&&(a.end=Object.assign({},lf(t.events,i)),e.add(i,0,[[`exit`,a,t]]),a=void 0),a}function cf(e,t,n,r,i){let a=[],o=lf(t.events,n);i&&(i.end=Object.assign({},o),a.push([`exit`,i,t])),r.end=Object.assign({},o),a.push([`exit`,r,t]),e.add(n+1,0,a)}function lf(e,t){let n=e[t],r=n[0]===`enter`?`start`:`end`;return n[1][r]}var uf={name:`tasklistCheck`,tokenize:ff};function df(){return{text:{91:uf}}}function ff(e,t,n){let r=this;return i;function i(t){return r.previous!==null||!r._gfmTasklistFirstContentOfListItem?n(t):(e.enter(`taskListCheck`),e.enter(`taskListCheckMarker`),e.consume(t),e.exit(`taskListCheckMarker`),a)}function a(t){return z(t)?(e.enter(`taskListCheckValueUnchecked`),e.consume(t),e.exit(`taskListCheckValueUnchecked`),o):t===88||t===120?(e.enter(`taskListCheckValueChecked`),e.consume(t),e.exit(`taskListCheckValueChecked`),o):n(t)}function o(t){return t===93?(e.enter(`taskListCheckMarker`),e.consume(t),e.exit(`taskListCheckMarker`),e.exit(`taskListCheck`),s):n(t)}function s(r){return R(r)?t(r):B(r)?e.check({tokenize:pf},t,n)(r):n(r)}}function pf(e,t,n){return V(e,r,`whitespace`);function r(e){return e===null?n(e):t(e)}}function mf(e){return Ni([Ad(),Gd(),$d(e),rf(),df()])}var hf={};function gf(e){let t=this,n=e||hf,r=t.data(),i=r.micromarkExtensions||=[],a=r.fromMarkdownExtensions||=[],o=r.toMarkdownExtensions||=[];i.push(mf(n)),a.push(Q()),o.push(bd(n))}var _f=[{id:`what-is-agentic-ai`,category:`Agentic AI Fundamentals`,title:`What is Agentic AI?`,difficulty:`Beginner`,time:`~10 min`,description:`Understand the concept of Agentic AI, its characteristics, autonomy, reasoning, planning, tool usage, decision-making, and how agents execute tasks toward a defined goal.`,concept:``,code:``},{id:`agentic-ai-vs-traditional-genai`,category:`Agentic AI Fundamentals`,title:`How is Agentic AI different from traditional GenAI?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the key differences between traditional Generative AI and Agentic AI across autonomy, planning, tool usage, memory, decision-making, execution, and multi-step task completion.`,concept:``,code:``},{id:`what-is-ai-agent`,category:`Agentic AI Fundamentals`,title:`What is an AI agent?`,difficulty:`Beginner`,time:`~10 min`,description:`Understand what an AI agent is, how it perceives context, reasons about goals, selects actions, invokes tools, observes results, and iteratively works toward task completion.`,concept:``,code:``},{id:`core-components-ai-agent`,category:`Agentic AI Fundamentals`,title:`What are the core components of an AI agent?`,difficulty:`Intermediate`,time:`~15 min`,description:`Understand the major components of an AI agent, including model, instructions, memory, state, tools, planning, reasoning, execution, observation, guardrails, and orchestration.`,concept:``,code:``},{id:`agent-vs-llm`,category:`Agentic AI Fundamentals`,title:`What is the difference between an agent and an LLM?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the distinction between an LLM as a reasoning and language-generation model and an agent as a system that uses an LLM with tools, memory, state, planning, and execution capabilities.`,concept:``,code:``},{id:`agent-vs-workflow`,category:`Agentic AI Fundamentals`,title:`What is the difference between an agent and a workflow?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the differences between agent-driven dynamic decision-making and deterministic workflows, including control flow, autonomy, predictability, and execution behavior.`,concept:``,code:``},{id:`autonomous-agent`,category:`Agentic AI Fundamentals`,title:`What is an autonomous agent?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand autonomous agents, their ability to independently plan, make decisions, use tools, observe outcomes, and continue execution with limited human intervention.`,concept:``,code:``},{id:`agentic-workflow`,category:`Agentic AI Fundamentals`,title:`What is an agentic workflow?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand agentic workflows where LLM-driven decisions dynamically determine the next action, tool, agent, or execution path based on the current state and task requirements.`,concept:``,code:``},{id:`react-pattern`,category:`Agentic AI Reasoning`,title:`What is the ReAct pattern?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the ReAct reasoning pattern and how agents combine reasoning and actions to interact with tools, observe results, and iteratively solve complex tasks.`,concept:``,code:``},{id:`agent-tool-selection`,category:`Agentic AI Tools`,title:`How does an agent decide which tool to use?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how agents select tools based on task requirements, tool descriptions, schemas, context, permissions, model reasoning, routing logic, and execution policies.`,concept:``,code:``},{id:`tool-function-calling`,category:`Agentic AI Tools`,title:`What is tool calling/function calling?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand how LLMs generate structured tool-call requests that applications or agents execute against external APIs, databases, services, and enterprise systems.`,concept:``,code:``},{id:`planning-agentic-ai`,category:`Agentic AI Reasoning`,title:`What is planning in Agentic AI?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how agents decompose complex goals into subtasks, determine execution order, select tools or agents, adapt plans, and track progress toward task completion.`,concept:``,code:``},{id:`reflection-self-reflection`,category:`Agentic AI Reasoning`,title:`What is reflection/self-reflection?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how an agent evaluates its own intermediate or final output, identifies errors or weaknesses, and revises its approach to improve task performance.`,concept:``,code:``},{id:`agent-memory`,category:`Agentic AI Fundamentals`,title:`What is memory in an agent?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand how agent memory stores and retrieves relevant information across interactions or tasks to provide continuity, personalization, and contextual awareness.`,concept:``,code:``},{id:`short-term-vs-long-term-memory`,category:`Agentic AI Memory`,title:`What is the difference between short-term and long-term memory?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the differences between short-term conversational or execution context and long-term persistent memory used across sessions and tasks.`,concept:``,code:``},{id:`agent-state-management`,category:`Agentic AI Architecture`,title:`What is state management in agents?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how agent state represents the current execution context, task progress, tool results, messages, decisions, and intermediate information throughout an agent workflow.`,concept:``,code:``},{id:`agent-execution-loop`,category:`Agentic AI Architecture`,title:`What is the agent execution loop?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the iterative agent execution cycle of receiving a goal, reasoning, planning, selecting an action or tool, executing it, observing the result, and determining whether to continue or terminate.`,concept:``,code:``},{id:`agent-hallucination-causes`,category:`Agentic AI Reliability`,title:`What causes an agent to hallucinate?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the causes of agent hallucination, including unreliable model outputs, insufficient context, poor retrieval, incorrect tool usage, ambiguous instructions, and flawed reasoning or planning.`,concept:``,code:``},{id:`prevent-agent-infinite-loop`,category:`Agentic AI Reliability`,title:`How do you prevent an agent from getting into an infinite loop?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand techniques for preventing infinite agent execution using maximum iteration limits, termination conditions, state tracking, duplicate-action detection, timeouts, retries, circuit breakers, and human escalation.`,concept:``,code:``}],vf=[`All`,`Advanced`],yf={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},bf={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function xf({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Sf({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Cf({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:bf[e.difficulty]||`#E6F1FB`,color:yf[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function wf({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:bf[e.difficulty]||`#E6F1FB`,color:yf[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(xf,{content:e.concept}),t===`code`&&(0,j.jsx)(Sf,{code:e.code})]})}function Tf({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:vf.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Cf,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Ef(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:_f.length},{label:`Patterns`,value:vf.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function Df(){let[e,t]=(0,v.useState)(_f[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Ef,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Tf,{recipes:_f,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(wf,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var Of=[{id:`production-grade-single-agent`,category:`Single-Agent Architecture`,title:`Design a production-grade single AI agent.`,difficulty:`Advanced`,time:`~20 min`,description:`Design an enterprise-ready single AI agent covering LLM integration, prompt management, tool calling, memory, state management, guardrails, security, observability, error handling, scalability, cost optimization, and deployment.`,concept:``,code:``},{id:`enterprise-agent-components`,category:`Single-Agent Architecture`,title:`What components would you include in an enterprise agent?`,difficulty:`Advanced`,time:`~15 min`,description:`Identify the core components of an enterprise AI agent, including model layer, prompt management, tools, memory, state, planning, orchestration, guardrails, authentication, authorization, observability, evaluation, and persistence.`,concept:``,code:``},{id:`agent-external-api-interaction`,category:`Agentic AI Tools`,title:`How does an agent interact with external APIs?`,difficulty:`Intermediate`,time:`~15 min`,description:`Understand how an agent uses tool or function calling to interact with external REST APIs and enterprise services, including request construction, authentication, validation, response processing, error handling, and security.`,concept:``,code:``},{id:`agent-multiple-tool-selection`,category:`Agentic AI Tools`,title:`How does an agent select between multiple tools?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how an agent selects the appropriate tool from multiple available tools using tool descriptions, schemas, task intent, context, routing logic, permissions, and model reasoning.`,concept:``,code:``},{id:`tool-failure-handling`,category:`Agentic AI Reliability`,title:`How do you handle tool failures?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to handle failed tool invocations using error classification, retries, fallback tools, timeouts, circuit breakers, graceful degradation, validation, logging, and human escalation.`,concept:``,code:``},{id:`agent-retry-implementation`,category:`Agentic AI Reliability`,title:`How do you implement retries?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to design reliable retry mechanisms for agent and tool execution using retry policies, exponential backoff, jitter, maximum attempts, retryable versus non-retryable errors, and idempotency.`,concept:``,code:``},{id:`agent-timeout-implementation`,category:`Agentic AI Reliability`,title:`How do you implement timeouts?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to implement timeouts for LLM calls, tool calls, API requests, and agent workflows to prevent stalled executions and protect system resources.`,concept:``,code:``},{id:`agent-state-across-interactions`,category:`Agentic AI State Management`,title:`How do you maintain state across agent interactions?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to maintain conversation state, task state, tool results, execution history, user context, and intermediate data across multiple agent interactions and workflow executions.`,concept:``,code:``},{id:`human-in-the-loop-agent`,category:`Agentic AI Governance`,title:`How do you implement human-in-the-loop?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to introduce human approval or intervention into agent workflows for high-risk, sensitive, ambiguous, or irreversible actions while supporting interruption, review, approval, rejection, and workflow resumption.`,concept:``,code:``},{id:`long-running-agent-tasks`,category:`Agentic AI Architecture`,title:`How do you handle long-running agent tasks?`,difficulty:`Advanced`,time:`~20 min`,description:`Design strategies for long-running agent workflows using asynchronous execution, task identifiers, durable state, checkpoints, queues, background workers, status tracking, callbacks, retries, and workflow recovery.`,concept:``,code:``},{id:`persist-agent-state`,category:`Agentic AI State Management`,title:`How do you persist agent state?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to persist agent execution state, conversation history, checkpoints, task progress, and intermediate results using appropriate databases, durable storage, checkpointing mechanisms, and state-management strategies.`,concept:``,code:``},{id:`unauthorized-tool-execution`,category:`Agentic AI Security`,title:`How do you prevent unauthorized tool execution?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to secure agent tool execution using authentication, authorization, RBAC, ABAC, least privilege, policy enforcement, tool-level permissions, input validation, approval workflows, and audit controls.`,concept:``,code:``},{id:`audit-agent-actions`,category:`Agentic AI Security`,title:`How do you audit agent actions?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to create an auditable trail of agent decisions, LLM calls, tool invocations, API requests, user approvals, responses, failures, timestamps, identities, and correlation IDs for enterprise governance and compliance.`,concept:``,code:``}],kf=[`All`,`Advanced`],Af={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},jf={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Mf({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Nf({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Pf({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:jf[e.difficulty]||`#E6F1FB`,color:Af[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Ff({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:jf[e.difficulty]||`#E6F1FB`,color:Af[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Mf,{content:e.concept}),t===`code`&&(0,j.jsx)(Nf,{code:e.code})]})}function If({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:kf.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Pf,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Lf(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:Of.length},{label:`Patterns`,value:kf.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function Rf(){let[e,t]=(0,v.useState)(Of[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Lf,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(If,{recipes:Of,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Ff,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var zf=[{id:`what-is-multi-agent-system`,category:`Multi-Agent Architecture`,title:`What is a multi-agent system?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the concept of multi-agent systems, how multiple specialized AI agents collaborate, communicate, coordinate, and execute tasks toward a common or distributed goal.`,concept:``,code:``},{id:`multi-agent-vs-single-agent`,category:`Multi-Agent Architecture`,title:`Why would you choose multi-agent architecture over a single agent?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand when multi-agent architecture provides advantages over a single agent through specialization, separation of responsibilities, scalability, parallel execution, security boundaries, and independent development.`,concept:``,code:``},{id:`multi-agent-patterns`,category:`Multi-Agent Architecture`,title:`What are the different multi-agent patterns?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand common multi-agent patterns including hierarchical, supervisor, peer-to-peer, sequential, parallel, pipeline, debate, swarm, and event-driven architectures.`,concept:``,code:``},{id:`hierarchical-multi-agent`,category:`Multi-Agent Architecture`,title:`What is hierarchical multi-agent architecture?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand hierarchical agent architectures where higher-level agents coordinate or delegate work to lower-level specialized agents through structured layers of responsibility.`,concept:``,code:``},{id:`supervisor-architecture`,category:`Multi-Agent Architecture`,title:`What is supervisor architecture?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the supervisor pattern where a central supervisor agent manages multiple specialized agents, determines task routing, coordinates execution, and aggregates results.`,concept:``,code:``},{id:`peer-to-peer-agent-communication`,category:`Multi-Agent Architecture`,title:`What is peer-to-peer agent communication?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand decentralized agent collaboration where agents communicate directly with one another without relying on a single centralized coordinator.`,concept:``,code:``},{id:`sequential-agent-orchestration`,category:`Multi-Agent Architecture`,title:`What is sequential agent orchestration?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand sequential agent execution where one agent completes its task and passes its output to the next agent in a predefined or dynamically controlled sequence.`,concept:``,code:``},{id:`parallel-agent-execution`,category:`Multi-Agent Architecture`,title:`What is parallel agent execution?`,difficulty:`Advanced`,time:`~10 min`,description:`Understand how multiple agents execute tasks concurrently to reduce latency, improve throughput, and independently process decomposed subtasks before results are aggregated.`,concept:``,code:``},{id:`coordinator-agent`,category:`Multi-Agent Architecture`,title:`What is a coordinator agent?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the role of a coordinator agent in managing task decomposition, routing, delegation, execution control, result aggregation, and overall multi-agent workflow coordination.`,concept:``,code:``},{id:`worker-agent`,category:`Multi-Agent Architecture`,title:`What is a worker agent?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the role of specialized worker agents that execute well-defined tasks using specific tools, knowledge, models, or business capabilities within a larger agentic workflow.`,concept:``,code:``},{id:`delegator-agent`,category:`Multi-Agent Architecture`,title:`What is a delegator agent?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the role of a delegator agent in decomposing domain-level tasks and assigning subtasks to specialized worker agents while coordinating their execution and results.`,concept:``,code:``},{id:`coordinator-agent-routing`,category:`Multi-Agent Orchestration`,title:`How does a coordinator decide which agent should execute a task?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how coordinators perform task routing using intent classification, agent capabilities, metadata, policies, context, tool availability, rules, and LLM-based decision-making.`,concept:``,code:``},{id:`agent-communication-methods`,category:`Multi-Agent Communication`,title:`How do agents communicate with each other?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand synchronous and asynchronous agent communication using protocols, APIs, messaging systems, event streams, structured messages, task identifiers, and standardized agent-to-agent protocols.`,concept:``,code:``},{id:`multi-agent-shared-state`,category:`Multi-Agent State Management`,title:`How do you manage shared state?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how shared state is maintained across multiple agents using centralized state stores, distributed databases, checkpoints, event logs, shared context, and controlled state transitions.`,concept:``,code:``},{id:`prevent-agent-duplicate-work`,category:`Multi-Agent Orchestration`,title:`How do you prevent agents from duplicating work?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand mechanisms for preventing duplicate agent execution using task ownership, unique task IDs, state tracking, distributed locks, capability boundaries, idempotency, and centralized coordination.`,concept:``,code:``},{id:`conflicting-agent-outputs`,category:`Multi-Agent Reliability`,title:`How do you handle conflicting outputs from agents?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to resolve conflicting agent outputs using validation, confidence scoring, evaluator agents, source verification, consensus mechanisms, ranking, and human escalation.`,concept:``,code:``},{id:`multi-agent-failure-handling`,category:`Multi-Agent Reliability`,title:`How do you handle one agent failure?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand failure recovery in multi-agent systems using retries, timeouts, fallback agents, circuit breakers, task reassignment, checkpoint recovery, graceful degradation, and error propagation.`,concept:``,code:``},{id:`multi-agent-monitoring`,category:`Multi-Agent Observability`,title:`How do you monitor a multi-agent system?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand end-to-end monitoring of agents, including distributed tracing, agent execution, LLM calls, tool calls, latency, token usage, failures, task outcomes, and business-level metrics.`,concept:``,code:``},{id:`multi-agent-cost-control`,category:`Multi-Agent Cost Optimization`,title:`How do you control multi-agent cost?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand strategies for controlling multi-agent costs through model selection, routing, token optimization, caching, execution limits, parallelism control, tool optimization, and agent-level cost monitoring.`,concept:``,code:``}],Bf=[`All`,`Advanced`],Vf={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},Hf={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Uf({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Wf({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Gf({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:Hf[e.difficulty]||`#E6F1FB`,color:Vf[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Kf({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:Hf[e.difficulty]||`#E6F1FB`,color:Vf[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Uf,{content:e.concept}),t===`code`&&(0,j.jsx)(Wf,{code:e.code})]})}function qf({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:Bf.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Gf,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Jf(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:zf.length},{label:`Patterns`,value:Bf.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function Yf(){let[e,t]=(0,v.useState)(zf[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Jf,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(qf,{recipes:zf,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Kf,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var Xf=[{id:`what-is-langgraph`,category:`LangGraph`,title:`What is LangGraph?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand LangGraph as a framework for building stateful, multi-step, and controllable agent workflows using graphs, nodes, edges, state, persistence, and human-in-the-loop capabilities.`,concept:``,code:``},{id:`langgraph-vs-langchain-agents`,category:`LangGraph`,title:`Why LangGraph instead of LangChain agents?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand why LangGraph may be selected over traditional LangChain agents for complex workflows requiring explicit orchestration, state management, conditional routing, loops, persistence, and production control.`,concept:``,code:``},{id:`langgraph-graph`,category:`LangGraph`,title:`What is a graph in LangGraph?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand how LangGraph represents an agent workflow as a graph containing nodes, edges, state transitions, and execution paths.`,concept:``,code:``},{id:`langgraph-nodes`,category:`LangGraph`,title:`What are nodes?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand nodes as executable units in LangGraph that perform operations such as calling an LLM, invoking tools, processing data, executing agents, or modifying state.`,concept:``,code:``},{id:`langgraph-edges`,category:`LangGraph`,title:`What are edges?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand edges as connections between LangGraph nodes that define how execution moves from one step to another.`,concept:``,code:``},{id:`langgraph-conditional-edges`,category:`LangGraph`,title:`What are conditional edges?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand how conditional edges dynamically route execution to different nodes based on the current state, model output, business rules, or execution results.`,concept:``,code:``},{id:`langgraph-state`,category:`LangGraph`,title:`What is state in LangGraph?`,difficulty:`Intermediate`,time:`~15 min`,description:`Understand LangGraph state as the shared data structure that carries conversation context, task information, tool results, intermediate outputs, and execution information between nodes.`,concept:``,code:``},{id:`langgraph-state-persistence`,category:`LangGraph`,title:`How do you persist state?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how LangGraph state can be persisted using checkpointing and external storage so workflows can resume, recover, and maintain continuity across executions.`,concept:``,code:``},{id:`langgraph-checkpoints`,category:`LangGraph`,title:`How do you implement checkpoints?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand checkpointing in LangGraph, including saving execution state at workflow boundaries to support persistence, recovery, debugging, human approval, and resumable execution.`,concept:``,code:``},{id:`langgraph-human-approval`,category:`LangGraph`,title:`How do you implement human approval?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how LangGraph workflows can pause before sensitive actions, request human approval, persist execution state, and resume or terminate based on the human decision.`,concept:``,code:``},{id:`langgraph-loops`,category:`LangGraph`,title:`How do you implement loops?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how LangGraph supports cyclic workflows where execution can return to previous nodes based on conditions until a defined completion or termination criterion is reached.`,concept:``,code:``},{id:`langgraph-retries`,category:`LangGraph`,title:`How do you implement retries?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand retry strategies for LangGraph node execution, including retry policies, retryable errors, maximum attempts, backoff, and handling transient versus permanent failures.`,concept:``,code:``},{id:`langgraph-parallel-execution`,category:`LangGraph`,title:`How do you implement parallel execution?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how LangGraph can execute independent branches concurrently and later merge their results to improve throughput and reduce end-to-end latency.`,concept:``,code:``},{id:`langgraph-error-handling`,category:`LangGraph`,title:`How do you handle errors in LangGraph?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand error handling in LangGraph using retries, exception handling, fallback paths, conditional routing, checkpoints, recovery, graceful termination, and error propagation.`,concept:``,code:``},{id:`langgraph-hierarchical-agents`,category:`LangGraph`,title:`How do you build hierarchical agents using LangGraph?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand how to implement hierarchical multi-agent architectures in LangGraph, such as Coordinator → Delegator → Worker, using subgraphs, routing, shared state, and controlled execution.`,concept:``,code:``},{id:`langgraph-supervisor-agent`,category:`LangGraph`,title:`How do you implement a supervisor agent?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand how to design a supervisor agent in LangGraph that analyzes tasks, selects specialized agents, routes execution, manages state, and aggregates results.`,concept:``,code:``},{id:`langgraph-infinite-loops`,category:`LangGraph`,title:`How do you prevent infinite loops?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to prevent uncontrolled cyclic execution using termination conditions, recursion limits, iteration counters, state tracking, validation, timeouts, and explicit end states.`,concept:``,code:``},{id:`langgraph-observability-debugging`,category:`LangGraph`,title:`How do you observe and debug LangGraph execution?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to trace LangGraph execution, inspect state transitions, monitor nodes and tool calls, identify failures, analyze latency and token usage, and debug complex agent workflows.`,concept:``,code:``},{id:`langgraph-production-deployment`,category:`LangGraph`,title:`How do you deploy LangGraph into production?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand production deployment of LangGraph applications, including API services, containerization, cloud infrastructure, persistence, scaling, authentication, observability, secrets management, reliability, and CI/CD.`,concept:``,code:``}],Zf=[`All`,`Advanced`],Qf={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},$f={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function ep({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function tp({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function np({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:$f[e.difficulty]||`#E6F1FB`,color:Qf[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function rp({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:$f[e.difficulty]||`#E6F1FB`,color:Qf[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(ep,{content:e.concept}),t===`code`&&(0,j.jsx)(tp,{code:e.code})]})}function ip({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:Zf.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(np,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function ap(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:Xf.length},{label:`Patterns`,value:Zf.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function op(){let[e,t]=(0,v.useState)(Xf[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(ap,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(ip,{recipes:Xf,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(rp,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var sp=[{id:`what-is-mcp`,category:`MCP`,title:`What is MCP?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the Model Context Protocol (MCP), its purpose, architecture, core components, and how it standardizes connections between AI applications and external tools, resources, and services.`,concept:``,code:``},{id:`why-mcp`,category:`MCP`,title:`Why do we need MCP?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand why MCP is needed to standardize how AI applications discover and interact with external tools, data sources, resources, and enterprise systems.`,concept:``,code:``},{id:`mcp-problem`,category:`MCP`,title:`What problem does MCP solve?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the integration and interoperability problems MCP addresses, including fragmented tool integrations, duplicated connectors, inconsistent interfaces, and tight coupling between AI applications and external systems.`,concept:``,code:``},{id:`mcp-client-server`,category:`MCP Architecture`,title:`What are MCP clients and servers?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the roles of MCP hosts, clients, and servers and how they interact to establish connections, discover capabilities, and exchange requests and results.`,concept:``,code:``},{id:`mcp-tools`,category:`MCP`,title:`What are MCP tools?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand MCP tools as executable capabilities exposed by MCP servers that allow AI applications to perform actions such as querying systems, calling APIs, modifying data, or triggering business operations.`,concept:``,code:``},{id:`mcp-resources`,category:`MCP`,title:`What are MCP resources?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand MCP resources as contextual data exposed by MCP servers, including documents, files, database information, application data, and other information that AI applications can retrieve.`,concept:``,code:``},{id:`mcp-prompts`,category:`MCP`,title:`What are MCP prompts?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand MCP prompts as reusable prompt templates or interaction patterns exposed by MCP servers to help clients and AI applications use domain-specific instructions consistently.`,concept:``,code:``},{id:`mcp-tool-discovery`,category:`MCP`,title:`How does an agent discover MCP tools?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how MCP clients connect to servers, discover available capabilities and tool schemas, and make those capabilities available to an AI agent for decision-making.`,concept:``,code:``},{id:`mcp-tool-invocation`,category:`MCP`,title:`How does an agent invoke an MCP tool?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the lifecycle of an MCP tool invocation, including tool selection, structured arguments, request transmission, server-side execution, validation, response handling, and error processing.`,concept:``,code:``},{id:`mcp-vs-rest-api`,category:`MCP Architecture`,title:`MCP vs REST API?`,difficulty:`Advanced`,time:`~15 min`,description:`Compare MCP and REST APIs in terms of purpose, discovery, standardization, tool schemas, resources, transport, interoperability, integration patterns, and appropriate enterprise use cases.`,concept:``,code:``},{id:`mcp-vs-function-calling`,category:`MCP Architecture`,title:`MCP vs function calling?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the difference between MCP as a standardized protocol for connecting AI applications with external capabilities and function calling as a model capability for generating structured requests to invoke functions.`,concept:``,code:``},{id:`mcp-vs-plugins`,category:`MCP Architecture`,title:`MCP vs plugins?`,difficulty:`Advanced`,time:`~15 min`,description:`Compare MCP with traditional plugin architectures in terms of interoperability, standardized discovery, tool definitions, portability, client-server separation, and ecosystem integration.`,concept:``,code:``},{id:`mcp-security`,category:`MCP Security`,title:`How do you secure MCP?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand MCP security controls including authentication, authorization, least privilege, input validation, output validation, secret management, network security, auditing, and tool-level access policies.`,concept:``,code:``},{id:`mcp-auth-authorization`,category:`MCP Security`,title:`How do you implement authentication/authorization for MCP?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to authenticate MCP clients and authorize tool and resource access using identity providers, OAuth, tokens, workload identity, RBAC, ABAC, scopes, and policy enforcement.`,concept:``,code:``},{id:`enterprise-mcp-server`,category:`MCP Architecture`,title:`How would you build an enterprise MCP server?`,difficulty:`Advanced`,time:`~20 min`,description:`Design an enterprise-grade MCP server covering tool and resource design, authentication, authorization, validation, secrets management, scalability, observability, rate limiting, error handling, versioning, and deployment.`,concept:``,code:``},{id:`mcp-server-failures`,category:`MCP Reliability`,title:`How do you handle MCP server failures?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand strategies for handling MCP server failures using timeouts, retries, circuit breakers, health checks, fallback mechanisms, graceful degradation, error classification, and observability.`,concept:``,code:``},{id:`dangerous-mcp-tools`,category:`MCP Security`,title:`How do you prevent an agent from calling dangerous MCP tools?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand how to control dangerous MCP tool execution using least privilege, tool-level authorization, policy engines, allowlists, deny lists, input validation, human approval, sandboxing, and audit controls.`,concept:``,code:``}],cp=[`All`,`Advanced`],lp={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},up={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function dp({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function fp({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function pp({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:up[e.difficulty]||`#E6F1FB`,color:lp[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function mp({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:up[e.difficulty]||`#E6F1FB`,color:lp[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(dp,{content:e.concept}),t===`code`&&(0,j.jsx)(fp,{code:e.code})]})}function hp({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:cp.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(pp,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function gp(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:sp.length},{label:`Patterns`,value:cp.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function _p(){let[e,t]=(0,v.useState)(sp[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(gp,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(hp,{recipes:sp,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(mp,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var vp=[{id:`what-is-a2a`,category:`Agentic AI Protocols`,title:`What is A2A?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the Agent2Agent (A2A) protocol, its purpose, core concepts, and how it enables interoperability and communication between independent AI agents.`,concept:``,code:``},{id:`why-agent-to-agent-communication`,category:`Agentic AI Protocols`,title:`Why do agents need agent-to-agent communication?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand why distributed AI agents need standardized communication for task delegation, collaboration, capability sharing, interoperability, and independent execution.`,concept:``,code:``},{id:`a2a-vs-mcp`,category:`Agentic AI Protocols`,title:`How is A2A different from MCP?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural differences between A2A and MCP, including agent-to-agent collaboration versus agent-to-tool, resource, and context integration.`,concept:``,code:``},{id:`how-agents-communicate`,category:`Agentic AI Protocols`,title:`How do two agents communicate?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how two independent agents exchange tasks, messages, context, status, and results using agent communication protocols and structured message formats.`,concept:``,code:``},{id:`what-is-agent-card`,category:`Agentic AI Protocols`,title:`What is an Agent Card?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the purpose of an Agent Card, how it describes an agent's identity, capabilities, skills, supported communication methods, and endpoint information.`,concept:``,code:``},{id:`agent-discovery-a2a`,category:`Agentic AI Protocols`,title:`How does an agent discover another agent?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand agent discovery mechanisms using Agent Cards, registries, service discovery, capability metadata, and endpoint information in distributed A2A systems.`,concept:``,code:``},{id:`a2a-agent-authentication`,category:`Agentic AI Security`,title:`How do you authenticate agents?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand authentication mechanisms for agent-to-agent communication, including identity verification, OAuth, tokens, certificates, workload identity, and enterprise security controls.`,concept:``,code:``},{id:`a2a-asynchronous-communication`,category:`Agentic AI Protocols`,title:`How do you handle asynchronous agent communication?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to design asynchronous A2A interactions for long-running tasks using task identifiers, callbacks, event notifications, message queues, polling, and status tracking.`,concept:``,code:``},{id:`a2a-agent-failures`,category:`Multi-Agent Reliability`,title:`How do you handle agent failures?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand failure-handling strategies for A2A systems, including retries, timeouts, circuit breakers, fallback agents, task recovery, idempotency, dead-letter handling, and graceful degradation.`,concept:``,code:``},{id:`a2a-agent-capabilities`,category:`Agentic AI Architecture`,title:`How do you manage agent capabilities?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how agent capabilities and skills are defined, advertised, discovered, versioned, governed, and matched against incoming tasks in an enterprise multi-agent ecosystem.`,concept:``,code:``},{id:`enterprise-a2a-architecture`,category:`Agentic AI Architecture`,title:`How would you design an enterprise A2A architecture?`,difficulty:`Advanced`,time:`~20 min`,description:`Design an enterprise-grade A2A architecture covering agent discovery, Agent Cards, authentication, authorization, communication, orchestration, asynchronous tasks, observability, security, scalability, and failure handling.`,concept:``,code:``},{id:`mcp-and-a2a-together`,category:`Agentic AI Protocols`,title:`Can MCP and A2A be used together?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how MCP and A2A can coexist in an enterprise Agentic AI architecture, where A2A enables agent-to-agent collaboration and MCP enables agents to access tools, resources, and external systems.`,concept:``,code:``}],yp=[`All`,`Advanced`],bp={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},xp={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Sp({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Cp({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function wp({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:xp[e.difficulty]||`#E6F1FB`,color:bp[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Tp({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:xp[e.difficulty]||`#E6F1FB`,color:bp[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Sp,{content:e.concept}),t===`code`&&(0,j.jsx)(Cp,{code:e.code})]})}function Ep({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:yp.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(wp,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Dp(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:vp.length},{label:`Patterns`,value:yp.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function Op(){let[e,t]=(0,v.useState)(vp[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Dp,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Ep,{recipes:vp,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Tp,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var kp=[{id:`why-agentic-ai-with-rag`,category:`Agentic RAG`,title:`Why combine Agentic AI with RAG?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand why combining agents with Retrieval-Augmented Generation enables dynamic retrieval, tool selection, iterative research, multi-source reasoning, and context-aware knowledge access.`,concept:``,code:``},{id:`agentic-rag-vs-traditional-rag`,category:`Agentic RAG`,title:`Agentic RAG vs traditional RAG?`,difficulty:`Advanced`,time:`~15 min`,description:`Compare traditional RAG with Agentic RAG across query planning, retrieval decisions, tool selection, iterative retrieval, source selection, reasoning, validation, and workflow control.`,concept:``,code:``},{id:`what-is-agentic-rag`,category:`Agentic RAG`,title:`What is Agentic RAG?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand Agentic RAG as a retrieval architecture where an AI agent dynamically plans, selects knowledge sources, performs retrieval, evaluates results, and iteratively gathers information before generating an answer.`,concept:``,code:``},{id:`agent-decides-when-to-retrieve`,category:`Agentic RAG`,title:`How does an agent decide when to retrieve?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how an agent determines whether retrieval is necessary based on user intent, available context, confidence, knowledge requirements, freshness requirements, and task complexity.`,concept:``,code:``},{id:`agent-knowledge-source-selection`,category:`Agentic RAG`,title:`How does an agent decide which knowledge source to query?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand knowledge-source routing based on query intent, metadata, source capabilities, domain ownership, data freshness, access permissions, and retrieval strategy.`,concept:``,code:``},{id:`multiple-vector-databases`,category:`Agentic RAG`,title:`Can an agent use multiple vector databases?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how an agent can work with multiple vector databases or knowledge stores and how routing, federation, metadata, security, and result aggregation can be implemented.`,concept:``,code:``},{id:`agentic-query-routing`,category:`Agentic RAG`,title:`How do you implement query routing?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand query-routing architectures that classify incoming questions and route them to the appropriate vector store, SQL database, API, knowledge source, or specialized retrieval agent.`,concept:``,code:``},{id:`irrelevant-retrieval`,category:`Agentic RAG`,title:`How do you handle irrelevant retrieval?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to detect and recover from irrelevant retrieved documents using relevance scoring, reranking, filtering, query rewriting, alternative retrieval strategies, and iterative search.`,concept:``,code:``},{id:`evaluate-agentic-rag`,category:`Agentic RAG Evaluation`,title:`How do you evaluate Agentic RAG?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand how to evaluate Agentic RAG across retrieval relevance, context precision, context recall, groundedness, answer correctness, citation quality, tool selection, task success, latency, and cost.`,concept:``,code:``},{id:`agentic-rag-hallucination-prevention`,category:`Agentic RAG Reliability`,title:`How do you prevent hallucinations?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand techniques for reducing hallucinations in Agentic RAG using grounded generation, retrieval validation, source attribution, confidence thresholds, answer verification, guardrails, and refusal strategies.`,concept:``,code:``},{id:`conflicting-documents`,category:`Agentic RAG`,title:`How do you handle conflicting documents?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to identify and resolve conflicting information using source authority, document versioning, timestamps, metadata, confidence scoring, cross-source verification, and human escalation.`,concept:``,code:``},{id:`rag-metadata-filtering`,category:`Agentic RAG`,title:`How do you implement metadata filtering?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how metadata such as tenant, department, document type, date, access level, product, geography, and version can be used to restrict and improve retrieval.`,concept:``,code:``},{id:`rag-hybrid-search`,category:`Agentic RAG`,title:`How do you implement hybrid search?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how lexical and semantic retrieval can be combined using keyword search and vector search, followed by result fusion or reranking to improve retrieval quality.`,concept:``,code:``},{id:`sql-vs-vector-search`,category:`Agentic RAG`,title:`When would you use SQL instead of vector search?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand when structured SQL queries are preferable to vector search for exact filtering, aggregations, joins, transactional data, numerical analysis, reporting, and deterministic business queries.`,concept:``,code:``}],Ap=[`All`,`Advanced`],jp={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},Mp={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Np({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Pp({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Fp({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:Mp[e.difficulty]||`#E6F1FB`,color:jp[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Ip({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:Mp[e.difficulty]||`#E6F1FB`,color:jp[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Np,{content:e.concept}),t===`code`&&(0,j.jsx)(Pp,{code:e.code})]})}function Lp({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:Ap.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Fp,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Rp(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:kp.length},{label:`Patterns`,value:Ap.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function zp(){let[e,t]=(0,v.useState)(kp[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Rp,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Lp,{recipes:kp,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Ip,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var Bp=[{id:`task-decomposition`,category:`Agentic AI Planning`,title:`What is task decomposition?`,difficulty:`Advanced`,time:`~10 min`,description:`Understand task decomposition as the process of breaking a complex goal into smaller, manageable subtasks that can be executed independently or in a defined sequence.`,concept:``,code:``},{id:`agent-complex-task-decomposition`,category:`Agentic AI Planning`,title:`How does an agent break a complex task into subtasks?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how an agent analyzes the goal, identifies dependencies, determines required capabilities and tools, creates subtasks, and establishes an execution strategy.`,concept:``,code:``},{id:`planning-vs-execution`,category:`Agentic AI Planning`,title:`What is planning vs execution?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the distinction between planning, which determines what should be done and in what order, and execution, which performs the planned actions and processes their results.`,concept:``,code:``},{id:`dynamic-planning`,category:`Agentic AI Planning`,title:`What is dynamic planning?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand dynamic planning where an agent continuously adapts or regenerates its plan based on new information, tool results, failures, changing conditions, or intermediate observations.`,concept:``,code:``},{id:`react`,category:`Agentic AI Reasoning`,title:`What is ReAct?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the ReAct pattern, where an agent combines reasoning and action iteratively by selecting actions or tools, observing their results, and using those observations to determine the next step.`,concept:``,code:``},{id:`plan-and-execute`,category:`Agentic AI Planning`,title:`What is Plan-and-Execute?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the Plan-and-Execute architecture where an agent first creates a structured plan and then executes the plan through one or more agents, tools, or workflow steps.`,concept:``,code:``},{id:`agent-reflection`,category:`Agentic AI Reasoning`,title:`What is reflection?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand reflection as a mechanism where an agent evaluates intermediate or final results, identifies weaknesses or errors, and uses the evaluation to improve its subsequent actions or output.`,concept:``,code:``},{id:`agent-self-correction`,category:`Agentic AI Reasoning`,title:`What is self-correction?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how an agent detects mistakes in its reasoning, tool usage, retrieved information, or generated output and modifies its approach to produce a better result.`,concept:``,code:``},{id:`evaluator-optimizer`,category:`Agentic AI Architecture`,title:`What is evaluator-optimizer architecture?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the evaluator-optimizer pattern where one component generates an output and another evaluates it against defined criteria, with feedback used to iteratively improve the result.`,concept:``,code:``},{id:`prevent-excessive-reasoning`,category:`Agentic AI Optimization`,title:`How do you prevent excessive reasoning?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to control unnecessary planning, repeated tool calls, excessive agent iterations, and over-complex reasoning using task boundaries, iteration limits, routing rules, model selection, and termination criteria.`,concept:``,code:``},{id:`control-agent-autonomy`,category:`Agentic AI Governance`,title:`How do you control agent autonomy?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand how to control agent autonomy using permissions, tool restrictions, policy enforcement, human approval, risk-based controls, execution limits, budgets, sandboxing, and predefined autonomy levels.`,concept:``,code:``},{id:`planning-vs-react-vs-plan-execute`,category:`Agentic AI Planning`,title:`How do ReAct, Plan-and-Execute, and dynamic planning differ?`,difficulty:`Advanced`,time:`~20 min`,description:`Compare ReAct, Plan-and-Execute, and dynamic planning in terms of planning strategy, adaptability, latency, tool usage, execution control, reliability, and appropriate enterprise use cases.`,concept:``,code:``}],Vp=[`All`,`Advanced`],Hp={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},Up={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Wp({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Gp({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Kp({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:Up[e.difficulty]||`#E6F1FB`,color:Hp[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function qp({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:Up[e.difficulty]||`#E6F1FB`,color:Hp[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Wp,{content:e.concept}),t===`code`&&(0,j.jsx)(Gp,{code:e.code})]})}function Jp({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:Vp.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Kp,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Yp(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:Bp.length},{label:`Patterns`,value:Vp.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function Xp(){let[e,t]=(0,v.useState)(Bp[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Yp,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Jp,{recipes:Bp,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(qp,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var Zp=[{id:`agent-memory`,category:`Agent Memory`,title:`What is agent memory?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand agent memory as the mechanism used to retain and retrieve relevant information across interactions, tasks, or sessions so an agent can maintain context and continuity.`,concept:``,code:``},{id:`short-term-vs-long-term-memory`,category:`Agent Memory`,title:`Short-term vs long-term memory?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand the difference between short-term memory used during an active conversation or workflow and long-term memory persisted across sessions or tasks.`,concept:``,code:``},{id:`conversation-vs-semantic-memory`,category:`Agent Memory`,title:`Conversation memory vs semantic memory?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the difference between conversational history used to preserve interaction context and semantic memory used to store and retrieve meaningful facts, knowledge, or learned information.`,concept:``,code:``},{id:`persistent-agent-memory`,category:`Agent Memory`,title:`How would you implement persistent memory?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to design persistent agent memory using databases, vector stores, structured storage, embeddings, metadata, retrieval mechanisms, retention policies, and memory lifecycle management.`,concept:``,code:``},{id:`agent-memory-storage`,category:`Agent Memory`,title:`Where would you store agent memory?`,difficulty:`Advanced`,time:`~15 min`,description:`Evaluate relational databases, document stores, vector databases, caches, object storage, and specialized memory systems for storing different types of agent memory.`,concept:``,code:``},{id:`relevant-memory-retrieval`,category:`Agent Memory`,title:`How do you retrieve relevant memories?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand memory retrieval using semantic similarity, embeddings, metadata filtering, recency, relevance scoring, hybrid search, reranking, and contextual retrieval.`,concept:``,code:``},{id:`stale-memory-prevention`,category:`Agent Memory`,title:`How do you prevent stale memories?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand memory freshness strategies including timestamps, expiration policies, confidence scores, versioning, revalidation, recency weighting, memory updates, and deletion.`,concept:``,code:``},{id:`memory-security`,category:`Agent Memory Security`,title:`How do you handle memory security?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to protect agent memory using encryption, authentication, authorization, tenant isolation, access policies, data classification, masking, auditing, retention controls, and secure deletion.`,concept:``,code:``},{id:`cross-user-memory-leakage`,category:`Agent Memory Security`,title:`How do you prevent cross-user memory leakage?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand how to enforce strict user and tenant isolation using identity-aware memory keys, access control, metadata filters, namespace isolation, authorization checks, encryption boundaries, and retrieval validation.`,concept:``,code:``}],Qp=[`All`,`Advanced`],$p={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},em={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function tm({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function nm({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function rm({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:em[e.difficulty]||`#E6F1FB`,color:$p[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function im({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:em[e.difficulty]||`#E6F1FB`,color:$p[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(tm,{content:e.concept}),t===`code`&&(0,j.jsx)(nm,{code:e.code})]})}function am({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:Qp.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(rm,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function om(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:Zp.length},{label:`Patterns`,value:Qp.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function sm(){let[e,t]=(0,v.useState)(Zp[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(om,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(am,{recipes:Zp,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(im,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var cm=[{id:`evaluate-ai-agent`,category:`Agent Evaluation`,title:`How do you evaluate an AI agent?`,difficulty:`Expert`,time:`~20 min`,description:`Understand a comprehensive agent evaluation framework covering task success, reasoning quality, tool usage, groundedness, safety, reliability, latency, cost, and business outcomes.`,concept:``,code:``},{id:`evaluate-tool-selection`,category:`Agent Evaluation`,title:`How do you evaluate tool selection?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to measure whether an agent selected the correct tool, including tool-selection accuracy, precision, recall, argument correctness, unnecessary tool calls, and execution outcomes.`,concept:``,code:``},{id:`evaluate-task-completion`,category:`Agent Evaluation`,title:`How do you evaluate task completion?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to determine whether an agent successfully completed a task using predefined success criteria, expected outcomes, business rules, validators, and human or automated evaluation.`,concept:``,code:``},{id:`measure-hallucination`,category:`Agent Evaluation`,title:`How do you measure hallucination?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand methods for detecting and measuring hallucinations by comparing generated claims against trusted sources, retrieved context, structured ground truth, and evaluation criteria.`,concept:``,code:``},{id:`groundedness`,category:`Agent Evaluation`,title:`What is groundedness?`,difficulty:`Advanced`,time:`~10 min`,description:`Understand groundedness as the degree to which an agent's generated response is supported by the provided context, retrieved information, tool results, or authoritative sources.`,concept:``,code:``},{id:`faithfulness`,category:`Agent Evaluation`,title:`What is faithfulness?`,difficulty:`Advanced`,time:`~10 min`,description:`Understand faithfulness as whether the claims made in a generated response are consistent with and supported by the information available to the model.`,concept:``,code:``},{id:`relevance`,category:`Agent Evaluation`,title:`What is relevance?`,difficulty:`Intermediate`,time:`~10 min`,description:`Understand relevance as the degree to which retrieved information, tool outputs, and final responses directly address the user's task or question.`,concept:``,code:``},{id:`tool-call-accuracy`,category:`Agent Evaluation`,title:`What is tool-call accuracy?`,difficulty:`Advanced`,time:`~10 min`,description:`Understand tool-call accuracy as the degree to which an agent selects the correct tool and provides valid, complete, and appropriate arguments for the intended operation.`,concept:``,code:``},{id:`task-success-rate`,category:`Agent Evaluation`,title:`What is task success rate?`,difficulty:`Advanced`,time:`~10 min`,description:`Understand task success rate as the percentage of agent tasks that satisfy predefined completion criteria and produce the expected business or functional outcome.`,concept:``,code:``},{id:`evaluate-multi-agent-systems`,category:`Multi-Agent Evaluation`,title:`How do you evaluate multi-agent systems?`,difficulty:`Expert`,time:`~20 min`,description:`Evaluate multi-agent systems across individual agent performance, routing accuracy, delegation quality, inter-agent communication, collaboration efficiency, duplicate work, failure recovery, end-to-end task success, latency, and cost.`,concept:``,code:``},{id:`evaluation-dataset`,category:`Agent Evaluation`,title:`How do you create an evaluation dataset?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand how to build representative evaluation datasets containing real-world scenarios, expected outcomes, edge cases, adversarial inputs, tool-use cases, ground-truth answers, and evaluation criteria.`,concept:``,code:``},{id:`offline-vs-online-evaluation`,category:`Agent Evaluation`,title:`Offline vs online evaluation?`,difficulty:`Advanced`,time:`~15 min`,description:`Compare offline evaluation using curated datasets and repeatable test runs with online evaluation using production traffic, real user interactions, monitoring signals, feedback, and live quality metrics.`,concept:``,code:``},{id:`agent-regression-testing`,category:`Agent Evaluation`,title:`How do you perform regression testing for agents?`,difficulty:`Expert`,time:`~20 min`,description:`Understand agent regression testing using golden datasets, deterministic test cases where possible, tool mocks, prompt and model version comparisons, automated evaluation, threshold checks, and CI/CD quality gates.`,concept:``,code:``},{id:`agent-cost-evaluation`,category:`Agent Evaluation`,title:`How do you evaluate agent cost?`,difficulty:`Advanced`,time:`~15 min`,description:`Measure agent cost across input and output tokens, model calls, tool invocations, retrieval operations, infrastructure, retries, agent iterations, and end-to-end cost per successful task.`,concept:``,code:``},{id:`agent-latency-evaluation`,category:`Agent Evaluation`,title:`How do you evaluate latency?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand latency measurement across request processing, first-token latency, model inference, tool execution, retrieval, agent orchestration, inter-agent communication, and total task completion time.`,concept:``,code:``}],lm=[`All`,`Advanced`],um={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},dm={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function fm({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function pm({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function mm({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:dm[e.difficulty]||`#E6F1FB`,color:um[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function hm({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:dm[e.difficulty]||`#E6F1FB`,color:um[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(fm,{content:e.concept}),t===`code`&&(0,j.jsx)(pm,{code:e.code})]})}function gm({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:lm.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(mm,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function _m(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:cm.length},{label:`Patterns`,value:lm.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function vm(){let[e,t]=(0,v.useState)(cm[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(_m,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(gm,{recipes:cm,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(hm,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var ym=[{id:`deploy-agents-production`,category:`Agentic AI Production`,title:`How do you deploy agents into production?`,difficulty:`Expert`,time:`~20 min`,description:`Understand production deployment of AI agents using containerization, APIs, orchestration, CI/CD, configuration management, security, observability, autoscaling, persistence, and reliability controls.`,concept:``,code:``},{id:`version-prompts`,category:`LLMOps`,title:`How do you version prompts?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand enterprise prompt versioning using source control, prompt registries, metadata, version identifiers, evaluation results, approval workflows, environment promotion, and rollback.`,concept:``,code:``},{id:`version-agent-workflows`,category:`Agentic AI Production`,title:`How do you version agent workflows?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to version agent graphs, nodes, routing logic, tools, prompts, policies, dependencies, and configuration so workflow changes are traceable, testable, deployable, and reversible.`,concept:``,code:``},{id:`monitor-agents`,category:`Agentic AI Observability`,title:`How do you monitor agents?`,difficulty:`Expert`,time:`~20 min`,description:`Design agent monitoring across availability, task success, failures, tool usage, model performance, token consumption, latency, retries, loops, safety events, and business KPIs.`,concept:``,code:``},{id:`trace-agent-execution`,category:`Agentic AI Observability`,title:`How do you trace agent execution?`,difficulty:`Expert`,time:`~20 min`,description:`Understand distributed tracing for agent workflows, including user requests, agent transitions, LLM calls, tool calls, retrieval operations, MCP calls, A2A communication, retries, and final responses.`,concept:``,code:``},{id:`monitor-token-usage`,category:`LLMOps`,title:`How do you monitor token usage?`,difficulty:`Advanced`,time:`~15 min`,description:`Track input and output tokens by user, tenant, agent, workflow, model, request, and tool execution to identify unexpected consumption and support cost optimization.`,concept:``,code:``},{id:`monitor-agent-latency`,category:`Agentic AI Observability`,title:`How do you monitor latency?`,difficulty:`Advanced`,time:`~15 min`,description:`Measure end-to-end agent latency and break it down across LLM inference, first-token latency, retrieval, tool execution, MCP calls, A2A communication, orchestration, and downstream services.`,concept:``,code:``},{id:`prompt-regression-testing`,category:`LLMOps`,title:`How do you perform prompt regression testing?`,difficulty:`Expert`,time:`~20 min`,description:`Understand how to compare prompt versions against golden datasets using automated quality, groundedness, safety, task-success, latency, and cost thresholds before promoting changes to production.`,concept:``,code:``},{id:`rollback-agent`,category:`Agentic AI Production`,title:`How do you roll back an agent?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand safe rollback strategies for agent versions, prompts, workflows, models, tools, and configurations using immutable artifacts, deployment versioning, feature flags, canary releases, and automated rollback.`,concept:``,code:``},{id:`production-model-fallback`,category:`LLMOps`,title:`How do you implement model fallback?`,difficulty:`Advanced`,time:`~15 min`,description:`Design model fallback using primary and secondary LLM providers, health checks, timeout detection, rate-limit handling, quality policies, routing logic, and graceful degradation.`,concept:``,code:``},{id:`multiple-llm-providers`,category:`LLMOps`,title:`How do you manage multiple LLM providers?`,difficulty:`Expert`,time:`~20 min`,description:`Understand multi-provider LLM architecture using abstraction layers, model registries, routing policies, provider-specific adapters, credentials, observability, cost controls, evaluation, and fallback strategies.`,concept:``,code:``},{id:`reduce-llm-cost`,category:`LLMOps and FinOps`,title:`How do you reduce LLM cost?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand LLM cost optimization through model routing, smaller models, prompt optimization, caching, context reduction, batching, token controls, retrieval optimization, reduced iterations, and avoiding unnecessary tool calls.`,concept:``,code:``},{id:`reduce-agent-latency`,category:`Agentic AI Performance`,title:`How do you reduce latency?`,difficulty:`Advanced`,time:`~20 min`,description:`Understand latency optimization through parallel execution, streaming, model selection, caching, prompt reduction, retrieval optimization, connection reuse, asynchronous processing, and minimizing unnecessary agent iterations.`,concept:``,code:``},{id:`model-outages`,category:`LLMOps Reliability`,title:`How do you handle model outages?`,difficulty:`Expert`,time:`~20 min`,description:`Design resilient LLM infrastructure using provider health checks, automatic failover, circuit breakers, retries with backoff, alternate models, queueing, degraded modes, observability, and incident recovery.`,concept:``,code:``}],bm=[`All`,`Advanced`],xm={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},Sm={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Cm({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function wm({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Tm({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:Sm[e.difficulty]||`#E6F1FB`,color:xm[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Em({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:Sm[e.difficulty]||`#E6F1FB`,color:xm[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Cm,{content:e.concept}),t===`code`&&(0,j.jsx)(wm,{code:e.code})]})}function Dm({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:bm.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Tm,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Om(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:ym.length},{label:`Patterns`,value:bm.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function km(){let[e,t]=(0,v.useState)(ym[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Om,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Dm,{recipes:ym,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Em,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var Am=[{id:`agentic-ai-security-risks`,category:`Agentic AI Security`,title:`What security risks exist in Agentic AI?`,difficulty:`Expert`,time:`~20 min`,description:`Understand major Agentic AI security risks including prompt injection, indirect prompt injection, tool abuse, excessive agency, data leakage, data exfiltration, identity compromise, insecure integrations, memory poisoning, and unauthorized actions.`,concept:``,code:``},{id:`prompt-injection`,category:`Agentic AI Security`,title:`What is prompt injection?`,difficulty:`Advanced`,time:`~10 min`,description:`Understand prompt injection attacks where malicious or conflicting instructions attempt to manipulate an LLM or agent into ignoring intended instructions or performing unintended actions.`,concept:``,code:``},{id:`indirect-prompt-injection`,category:`Agentic AI Security`,title:`What is indirect prompt injection?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand indirect prompt injection attacks where malicious instructions are embedded in external content such as documents, websites, emails, databases, or retrieved knowledge that an agent processes.`,concept:``,code:``},{id:`prevent-prompt-injection`,category:`Agentic AI Security`,title:`How do you prevent prompt injection?`,difficulty:`Expert`,time:`~20 min`,description:`Understand layered defenses against prompt injection using input validation, content isolation, instruction hierarchy, tool permissions, least privilege, output validation, sandboxing, monitoring, and human approval.`,concept:``,code:``},{id:`tool-poisoning`,category:`Agentic AI Security`,title:`What is tool poisoning?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand tool poisoning attacks where malicious or compromised tool metadata, descriptions, schemas, or implementations influence an agent into making unsafe or unintended tool calls.`,concept:``,code:``},{id:`data-exfiltration`,category:`Agentic AI Security`,title:`What is data exfiltration?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand data exfiltration in Agentic AI systems, including unauthorized transfer of sensitive enterprise information through tools, APIs, prompts, outputs, memory, logs, or external services.`,concept:``,code:``},{id:`protect-sensitive-enterprise-data`,category:`Agentic AI Security`,title:`How do you protect sensitive enterprise data?`,difficulty:`Expert`,time:`~20 min`,description:`Design enterprise data protection using classification, encryption, access control, tenant isolation, data masking, tokenization, DLP, least privilege, secure retrieval, network controls, and audit logging.`,concept:``,code:``},{id:`agent-level-authorization`,category:`Agentic AI Security`,title:`How do you implement authorization at the agent level?`,difficulty:`Expert`,time:`~15 min`,description:`Understand how to control which users, applications, or other agents can invoke specific agents using identity, RBAC, ABAC, scopes, policies, tenant context, and least-privilege access.`,concept:``,code:``},{id:`tool-level-authorization`,category:`Agentic AI Security`,title:`How do you implement authorization at the tool level?`,difficulty:`Expert`,time:`~15 min`,description:`Understand how to enforce permissions for individual tools using identity-aware policies, RBAC, ABAC, scopes, allowlists, resource-level permissions, approval requirements, and least privilege.`,concept:``,code:``},{id:`prevent-unauthorized-agent-actions`,category:`Agentic AI Security`,title:`How do you prevent an agent from executing unauthorized actions?`,difficulty:`Expert`,time:`~20 min`,description:`Design controls to prevent unauthorized agent actions using policy enforcement points, tool authorization, identity propagation, input validation, action allowlists, sandboxing, human approval, and runtime monitoring.`,concept:``,code:``},{id:`pii-protection-agentic-ai`,category:`Agentic AI Security`,title:`How do you implement PII protection?`,difficulty:`Expert`,time:`~20 min`,description:`Understand PII protection throughout the Agentic AI lifecycle using detection, masking, redaction, tokenization, encryption, access control, secure logging, retention policies, and output filtering.`,concept:``,code:``},{id:`agentic-content-filtering`,category:`Agentic AI Security`,title:`How do you implement content filtering?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand input and output content filtering for detecting unsafe, malicious, sensitive, or policy-violating content using classifiers, rules, moderation services, guardrails, and policy engines.`,concept:``,code:``},{id:`human-approval-high-risk`,category:`Agentic AI Governance`,title:`How do you implement human approval for high-risk actions?`,difficulty:`Expert`,time:`~20 min`,description:`Design human-in-the-loop controls where high-risk actions are paused for explicit approval based on risk classification, business policies, financial impact, data sensitivity, and reversibility.`,concept:``,code:``},{id:`audit-agent-decisions`,category:`Agentic AI Governance`,title:`How do you audit agent decisions?`,difficulty:`Expert`,time:`~20 min`,description:`Design an auditable trail for agent decisions including user identity, agent identity, prompts, model version, retrieved context, tool calls, decisions, approvals, outputs, timestamps, correlation IDs, and policy events.`,concept:``,code:``}],jm=[`All`,`Advanced`],Mm={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},Nm={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Pm({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Fm({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Im({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:Nm[e.difficulty]||`#E6F1FB`,color:Mm[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Lm({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:Nm[e.difficulty]||`#E6F1FB`,color:Mm[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Pm,{content:e.concept}),t===`code`&&(0,j.jsx)(Fm,{code:e.code})]})}function Rm({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:jm.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Im,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function zm(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:Am.length},{label:`Patterns`,value:jm.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function Bm(){let[e,t]=(0,v.useState)(Am[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(zm,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Rm,{recipes:Am,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Lm,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var Vm=[{id:`deploy-agentic-ai-azure`,category:`Cloud Agentic AI`,title:`How would you deploy Agentic AI on Azure?`,difficulty:`Expert`,time:`~25 min`,description:`Design an enterprise Agentic AI deployment on Azure covering Azure OpenAI, Azure AI Foundry, Azure AI Search, agent orchestration, MCP, A2A, Azure Kubernetes Service, identity, networking, monitoring, security, and CI/CD.`,concept:``,code:``},{id:`deploy-agentic-ai-aws`,category:`Cloud Agentic AI`,title:`How would you deploy it on AWS?`,difficulty:`Expert`,time:`~25 min`,description:`Design an enterprise Agentic AI deployment on AWS using Amazon Bedrock, knowledge and retrieval services, agent orchestration, EKS, IAM, VPC networking, observability, security, persistence, and CI/CD.`,concept:``,code:``},{id:`azure-openai-vs-bedrock`,category:`Cloud AI Platforms`,title:`Azure OpenAI vs Amazon Bedrock?`,difficulty:`Expert`,time:`~20 min`,description:`Compare Azure OpenAI and Amazon Bedrock across model ecosystem, enterprise integration, security, networking, identity, RAG, agent capabilities, observability, governance, pricing, and multi-model architecture.`,concept:``,code:``},{id:`azure-ai-foundry-vs-bedrock`,category:`Cloud AI Platforms`,title:`Azure AI Foundry vs Bedrock?`,difficulty:`Expert`,time:`~20 min`,description:`Compare Azure AI Foundry and Amazon Bedrock as enterprise AI platforms across model access, agent development, evaluation, RAG, orchestration, governance, monitoring, deployment, and cloud ecosystem integration.`,concept:``,code:``},{id:`secure-llm-apis`,category:`Cloud AI Security`,title:`How would you secure LLM APIs?`,difficulty:`Expert`,time:`~20 min`,description:`Design secure LLM API access using identity and access management, API gateways, managed identities, OAuth, private endpoints, network controls, secret management, rate limiting, encryption, logging, and policy enforcement.`,concept:``,code:``},{id:`private-networking-agentic-ai`,category:`Cloud Security`,title:`How would you implement private networking?`,difficulty:`Expert`,time:`~20 min`,description:`Design private enterprise connectivity for LLMs, agents, databases, vector stores, APIs, and tools using private endpoints, VPC/VNet isolation, DNS, firewalls, service endpoints, ingress/egress controls, and zero-trust principles.`,concept:``,code:``},{id:`enterprise-rag-cloud`,category:`Enterprise RAG`,title:`How would you implement enterprise RAG?`,difficulty:`Expert`,time:`~25 min`,description:`Design enterprise RAG covering data ingestion, document processing, chunking, embeddings, vector and keyword search, hybrid retrieval, metadata filtering, security trimming, reranking, query routing, evaluation, monitoring, and governance.`,concept:``,code:``},{id:`agents-kubernetes`,category:`Cloud Native Agentic AI`,title:`How would you integrate agents with Kubernetes?`,difficulty:`Expert`,time:`~20 min`,description:`Design Kubernetes-based agent deployment using containers, services, ingress, configuration, secrets, workload identity, horizontal scaling, job processing, queues, health checks, observability, and resilient agent execution.`,concept:``,code:``},{id:`agentic-autoscaling`,category:`Cloud Native Agentic AI`,title:`How would you implement autoscaling?`,difficulty:`Expert`,time:`~20 min`,description:`Design autoscaling for agent workloads using CPU and memory metrics, request rates, queue depth, concurrency, latency, custom metrics, horizontal pod autoscaling, cluster scaling, and workload-specific scaling policies.`,concept:``,code:``},{id:`cross-cloud-agentic-ai`,category:`Cloud Architecture`,title:`How would you design cross-cloud Agentic AI?`,difficulty:`Expert`,time:`~25 min`,description:`Design a cloud-agnostic Agentic AI architecture spanning Azure and AWS using abstraction layers, multiple LLM providers, unified agent orchestration, MCP, A2A, federated RAG, identity, networking, observability, cost controls, disaster recovery, and model fallback.`,concept:``,code:``}],Hm=[`All`,`Advanced`],Um={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},Wm={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Gm({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Km({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function qm({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:Wm[e.difficulty]||`#E6F1FB`,color:Um[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Jm({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:Wm[e.difficulty]||`#E6F1FB`,color:Um[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Gm,{content:e.concept}),t===`code`&&(0,j.jsx)(Km,{code:e.code})]})}function Ym({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:Hm.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(qm,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Xm(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:Vm.length},{label:`Patterns`,value:Hm.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function Zm(){let[e,t]=(0,v.useState)(Vm[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Xm,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Ym,{recipes:Vm,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Jm,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var Qm=[{id:`enterprise-agentic-ai-platform`,category:`Enterprise Agentic AI Architecture`,title:`Design an enterprise Agentic AI platform.`,difficulty:`Expert`,time:`~25 min`,description:`Design an end-to-end enterprise Agentic AI platform covering agent orchestration, LLMs, RAG, tools, MCP, A2A, memory, security, governance, observability, evaluation, deployment, scalability, and cost management.`,concept:``,code:``},{id:`cloud-scalable-agentic-platform`,category:`Cloud Architecture`,title:`How would you make it cloud scalable?`,difficulty:`Expert`,time:`~20 min`,description:`Understand how to horizontally scale agent services, model inference, retrieval, tool execution, queues, databases, and supporting infrastructure across cloud environments.`,concept:``,code:``},{id:`secure-agentic-platform`,category:`Agentic AI Security`,title:`How would you secure it?`,difficulty:`Expert`,time:`~20 min`,description:`Design security across identity, authentication, authorization, network isolation, data protection, prompt injection defense, tool security, secrets, encryption, governance, and auditing.`,concept:``,code:``},{id:`agentic-multi-tenancy`,category:`Enterprise Architecture`,title:`How would you implement multi-tenancy?`,difficulty:`Expert`,time:`~20 min`,description:`Design tenant isolation across agents, data, vector stores, memory, databases, tools, APIs, configuration, identity, usage limits, and observability while supporting secure resource sharing.`,concept:``,code:``},{id:`agentic-rbac`,category:`Security and Governance`,title:`How would you implement RBAC?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how role-based access control can restrict users, agents, tools, APIs, data sources, and administrative operations according to enterprise roles and permissions.`,concept:``,code:``},{id:`agentic-secrets-management`,category:`Security and Governance`,title:`How would you manage secrets?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand enterprise secrets management for API keys, database credentials, tokens, certificates, and service identities using centralized secret stores, rotation, access policies, and workload identity.`,concept:``,code:``},{id:`agentic-observability`,category:`Agentic AI Operations`,title:`How would you implement observability?`,difficulty:`Expert`,time:`~20 min`,description:`Design end-to-end observability for agents, LLMs, tools, RAG, MCP, A2A, workflows, infrastructure, and business outcomes using logs, metrics, traces, correlation IDs, and agent execution telemetry.`,concept:``,code:``},{id:`agentic-audit-logging`,category:`Security and Governance`,title:`How would you implement audit logging?`,difficulty:`Advanced`,time:`~15 min`,description:`Design immutable audit trails for user requests, agent decisions, tool invocations, API calls, data access, approvals, model usage, failures, and security events.`,concept:``,code:``},{id:`agentic-cost-tracking`,category:`Agentic AI FinOps`,title:`How would you implement cost tracking?`,difficulty:`Advanced`,time:`~15 min`,description:`Track and attribute costs across users, tenants, agents, models, tokens, tools, retrieval, infrastructure, and workflows to support budgeting, optimization, and chargeback.`,concept:``,code:``},{id:`agentic-rate-limiting`,category:`Enterprise Architecture`,title:`How would you implement rate limiting?`,difficulty:`Advanced`,time:`~15 min`,description:`Design rate limiting across users, tenants, agents, APIs, models, and tools using quotas, token budgets, request limits, concurrency controls, throttling, and distributed rate-limit mechanisms.`,concept:``,code:``},{id:`agentic-model-fallback`,category:`LLM Architecture`,title:`How would you implement model fallback?`,difficulty:`Advanced`,time:`~15 min`,description:`Design model fallback strategies for outages, rate limits, latency, capacity constraints, or quality issues using primary and secondary models, routing policies, health checks, and graceful degradation.`,concept:``,code:``},{id:`agentic-disaster-recovery`,category:`Enterprise Architecture`,title:`How would you implement disaster recovery?`,difficulty:`Expert`,time:`~20 min`,description:`Design disaster recovery for an Agentic AI platform covering state, databases, vector stores, memory, configurations, model dependencies, infrastructure, backups, failover, RPO, RTO, and regional recovery.`,concept:``,code:``},{id:`100k-agent-requests`,category:`Scalability`,title:`How would you handle 100,000 agent requests/day?`,difficulty:`Expert`,time:`~25 min`,description:`Design a scalable architecture capable of handling approximately 100,000 daily agent requests using horizontal scaling, asynchronous processing, queues, caching, model routing, database scaling, rate limiting, and observability.`,concept:``,code:``},{id:`agentic-high-availability`,category:`Enterprise Architecture`,title:`How would you design for high availability?`,difficulty:`Expert`,time:`~20 min`,description:`Design highly available Agentic AI infrastructure using multiple instances, availability zones, load balancing, health checks, redundancy, failover, resilient dependencies, model fallback, and disaster recovery.`,concept:``,code:``},{id:`long-running-agent-platform`,category:`Agentic AI Architecture`,title:`How would you handle long-running agents?`,difficulty:`Expert`,time:`~20 min`,description:`Design durable execution for long-running agent tasks using asynchronous workflows, queues, workers, checkpoints, persistent state, task IDs, status tracking, retries, timeouts, callbacks, and recovery mechanisms.`,concept:``,code:``}],$m=[`All`,`Advanced`],eh={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},th={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function nh({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function rh({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function ih({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:th[e.difficulty]||`#E6F1FB`,color:eh[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function ah({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:th[e.difficulty]||`#E6F1FB`,color:eh[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(nh,{content:e.concept}),t===`code`&&(0,j.jsx)(rh,{code:e.code})]})}function oh({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:$m.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(ih,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function sh(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:Qm.length},{label:`Patterns`,value:$m.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function ch(){let[e,t]=(0,v.useState)(Qm[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(sh,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(oh,{recipes:Qm,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(ah,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var lh=[`All`,`Advanced`],uh={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},dh={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function fh({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function ph({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function mh({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:dh[e.difficulty]||`#E6F1FB`,color:uh[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function hh({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:dh[e.difficulty]||`#E6F1FB`,color:uh[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(fh,{content:e.concept}),t===`code`&&(0,j.jsx)(ph,{code:e.code})]})}function gh({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:lh.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(mh,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function _h(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:AgenticSystemDesignQuestions.length},{label:`Patterns`,value:lh.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function vh(){let[e,t]=(0,v.useState)(AgenticSystemDesignQuestions[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(_h,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(gh,{recipes:AgenticSystemDesignQuestions,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(hh,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var yh=[{id:`scenario-repeated-tool-calls`,category:`Agentic AI Troubleshooting`,title:`Your agent keeps calling the same tool repeatedly. How would you fix it?`,difficulty:`Expert`,time:`~20 min`,description:`Diagnose repeated tool execution using loop detection, state tracking, iteration limits, tool-result validation, termination conditions, idempotency, retry policies, prompt improvements, and workflow-level controls.`,concept:``,code:``},{id:`scenario-agent-incorrect-information`,category:`Multi-Agent Reliability`,title:`Agent A gives incorrect information to Agent B. How do you detect and prevent this?`,difficulty:`Expert`,time:`~20 min`,description:`Design mechanisms for validating inter-agent information using source attribution, schema validation, confidence scoring, groundedness checks, evaluator agents, independent verification, provenance tracking, and trust policies.`,concept:``,code:``},{id:`scenario-50-tools-selection`,category:`Agent Tool Management`,title:`Your agent has access to 50 tools. Tool selection accuracy is poor. What would you do?`,difficulty:`Expert`,time:`~20 min`,description:`Improve tool selection using tool categorization, hierarchical routing, tool metadata, capability-based discovery, semantic tool retrieval, tool descriptions, constrained tool lists, specialized agents, and tool-selection evaluation.`,concept:``,code:``},{id:`scenario-agent-cost-optimization`,category:`Agentic AI FinOps`,title:`Your agent costs $2 per request. Business wants it below $0.20. How do you optimize it?`,difficulty:`Expert`,time:`~25 min`,description:`Reduce agent cost through model routing, smaller models, prompt optimization, context reduction, caching, retrieval optimization, fewer agent iterations, reduced tool calls, batching, token limits, and cost-aware execution policies.`,concept:``,code:``},{id:`scenario-agent-latency`,category:`Agentic AI Performance`,title:`Agent latency is 20 seconds. Business requires less than 5 seconds. What would you change?`,difficulty:`Expert`,time:`~25 min`,description:`Troubleshoot end-to-end latency by tracing LLM calls, retrieval, tool execution, agent loops, network calls, and orchestration, then optimize through parallel execution, streaming, caching, faster models, reduced context, and asynchronous processing.`,concept:``,code:``},{id:`scenario-rag-incorrect-documents`,category:`Agentic RAG Troubleshooting`,title:`Your RAG agent retrieves incorrect documents. How do you troubleshoot?`,difficulty:`Expert`,time:`~25 min`,description:`Troubleshoot retrieval quality across ingestion, document parsing, chunking, embeddings, metadata, indexing, query transformation, vector search, hybrid search, filtering, reranking, and retrieval evaluation.`,concept:``,code:``},{id:`scenario-confidential-hr-information`,category:`Agentic AI Security`,title:`An employee tries to get confidential HR information through an agent. How do you prevent it?`,difficulty:`Expert`,time:`~25 min`,description:`Design authorization and data protection controls using identity-aware access, RBAC or ABAC, document-level security, metadata filtering, tenant isolation, data classification, retrieval authorization, DLP, output filtering, and audit logging.`,concept:``,code:``},{id:`scenario-dangerous-mcp-delete-tool`,category:`MCP Security`,title:`An MCP tool can delete records. How do you safely expose it to an agent?`,difficulty:`Expert`,time:`~25 min`,description:`Secure destructive MCP operations using least privilege, explicit authorization, scoped permissions, allowlists, input validation, dry-run mode, confirmation workflows, human approval, idempotency, audit logging, and rollback or recovery mechanisms.`,concept:``,code:``},{id:`scenario-worker-agent-down`,category:`Multi-Agent Reliability`,title:`One worker agent goes down in a multi-agent system. What happens?`,difficulty:`Expert`,time:`~20 min`,description:`Design failure handling using health checks, timeouts, retries, circuit breakers, task reassignment, fallback agents, queues, checkpointing, state recovery, graceful degradation, and coordinator-level failure management.`,concept:``,code:``},{id:`scenario-conflicting-agent-answers`,category:`Multi-Agent Decision Making`,title:`Two agents produce conflicting answers. Which answer should the coordinator choose?`,difficulty:`Expert`,time:`~20 min`,description:`Design conflict-resolution strategies using source authority, confidence scores, evidence quality, agent specialization, independent verification, evaluator agents, voting, deterministic business rules, recency, and human escalation for high-risk decisions.`,concept:``,code:``}],bh=[`All`,`Advanced`],xh={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},Sh={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Ch({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function wh({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Th({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:Sh[e.difficulty]||`#E6F1FB`,color:xh[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Eh({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:Sh[e.difficulty]||`#E6F1FB`,color:xh[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Ch,{content:e.concept}),t===`code`&&(0,j.jsx)(wh,{code:e.code})]})}function Dh({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:bh.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Th,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Oh(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:yh.length},{label:`Patterns`,value:bh.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function kh(){let[e,t]=(0,v.useState)(yh[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Oh,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Dh,{recipes:yh,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Eh,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var Ah=[{id:`project-architecture-end-to-end`,category:`Project Deep Dive`,title:`Explain your architecture end-to-end.`,difficulty:`Expert`,time:`~25 min`,description:`Explain the complete enterprise Agentic AI architecture from user request and API gateway through authentication, coordinator, delegators, worker agents, LangGraph orchestration, RAG, MCP, A2A, enterprise systems, state management, observability, security, and final response.`,concept:``,code:``},{id:`project-why-langgraph`,category:`Project Deep Dive`,title:`Why did you choose LangGraph?`,difficulty:`Expert`,time:`~20 min`,description:`Explain why LangGraph was selected for the project, including explicit workflow control, state management, conditional routing, loops, checkpointing, human-in-the-loop, retries, persistence, and hierarchical multi-agent orchestration.`,concept:``,code:``},{id:`project-why-hierarchical-agents`,category:`Project Architecture`,title:`Why hierarchical agents?`,difficulty:`Expert`,time:`~20 min`,description:`Explain why hierarchical multi-agent architecture was preferred for complex enterprise workloads, including separation of responsibilities, scalability, specialization, controlled autonomy, routing, maintainability, and fault isolation.`,concept:``,code:``},{id:`project-coordinator-delegator-worker`,category:`Project Architecture`,title:`Why coordinator + delegator + worker architecture?`,difficulty:`Expert`,time:`~20 min`,description:`Explain the responsibilities and architectural benefits of Coordinator, Delegator, and Worker layers, including task decomposition, domain routing, specialization, execution isolation, scalability, and governance.`,concept:``,code:``},{id:`project-single-agent-vs-multi-agent`,category:`Project Architecture`,title:`Why not use a single agent?`,difficulty:`Expert`,time:`~20 min`,description:`Compare a single-agent architecture with the hierarchical multi-agent design in terms of complexity, specialization, tool management, scalability, reliability, observability, security boundaries, and maintenance.`,concept:``,code:``},{id:`project-coordinator-delegator-selection`,category:`Project Orchestration`,title:`How does the coordinator select a delegator?`,difficulty:`Expert`,time:`~20 min`,description:`Explain how the coordinator analyzes user intent, task type, required capabilities, metadata, policies, and routing rules to select the appropriate domain delegator.`,concept:``,code:``},{id:`project-delegator-worker-selection`,category:`Project Orchestration`,title:`How do delegators select workers?`,difficulty:`Expert`,time:`~20 min`,description:`Explain how delegators select specialized workers based on capabilities, task requirements, tool access, workload, policies, confidence, and execution context.`,concept:``,code:``},{id:`project-worker-results`,category:`Multi-Agent Communication`,title:`How do workers communicate results?`,difficulty:`Advanced`,time:`~15 min`,description:`Explain how worker agents return structured results, status, evidence, errors, metadata, and artifacts to delegators and coordinators using shared state or agent-to-agent communication patterns.`,concept:``,code:``},{id:`project-state-management`,category:`Agent State`,title:`Where is state maintained?`,difficulty:`Expert`,time:`~20 min`,description:`Explain where conversational state, workflow state, intermediate results, tool outputs, memory, checkpoints, and execution metadata are maintained and how state persistence supports recovery and resumability.`,concept:``,code:``},{id:`project-rag-implementation`,category:`RAG Architecture`,title:`How is RAG implemented?`,difficulty:`Expert`,time:`~25 min`,description:`Explain the end-to-end RAG pipeline including ingestion, parsing, chunking, embeddings, indexing, metadata, access control, query transformation, retrieval, reranking, context construction, grounded generation, and evaluation.`,concept:``,code:``},{id:`project-mcp-usage`,category:`MCP`,title:`Where did you use MCP?`,difficulty:`Expert`,time:`~20 min`,description:`Explain where MCP was used to standardize agent access to enterprise tools, APIs, databases, applications, or resources and how MCP servers were integrated into the agent architecture.`,concept:``,code:``},{id:`project-a2a-usage`,category:`A2A`,title:`Where did you use A2A?`,difficulty:`Expert`,time:`~20 min`,description:`Explain where A2A was used for agent-to-agent collaboration, task delegation, capability discovery, communication, result exchange, and distributed agent execution.`,concept:``,code:``},{id:`project-mcp-and-a2a`,category:`Agentic Architecture`,title:`Why use both MCP and A2A?`,difficulty:`Expert`,time:`~20 min`,description:`Explain why MCP and A2A solve different integration problems and how they complement each other: MCP for agent-to-tool and resource access, and A2A for agent-to-agent collaboration.`,concept:``,code:``},{id:`project-failure-handling`,category:`Reliability`,title:`How do you handle failures?`,difficulty:`Expert`,time:`~20 min`,description:`Explain failure handling across agents, tools, MCP servers, A2A communication, databases, vector stores, and LLM providers using retries, timeouts, circuit breakers, fallbacks, checkpoints, recovery, and graceful degradation.`,concept:``,code:``},{id:`project-hallucination-handling`,category:`AI Reliability`,title:`How do you handle hallucination?`,difficulty:`Expert`,time:`~20 min`,description:`Explain hallucination prevention using grounded RAG, source validation, structured outputs, confidence thresholds, tool verification, evaluator mechanisms, guardrails, citations, and refusal or escalation strategies.`,concept:``,code:``},{id:`project-security`,category:`Security`,title:`How do you secure the system?`,difficulty:`Expert`,time:`~25 min`,description:`Explain enterprise security across authentication, authorization, RBAC, identity propagation, data protection, prompt injection defense, tool permissions, secrets management, network isolation, encryption, PII protection, and auditing.`,concept:``,code:``},{id:`project-agent-evaluation`,category:`Evaluation`,title:`How do you evaluate agents?`,difficulty:`Expert`,time:`~20 min`,description:`Explain agent evaluation using task success, tool-call accuracy, groundedness, faithfulness, relevance, hallucination rate, latency, cost, safety, regression testing, and business-specific evaluation metrics.`,concept:``,code:``},{id:`project-monitoring`,category:`Observability`,title:`How do you monitor the system?`,difficulty:`Expert`,time:`~20 min`,description:`Explain end-to-end observability across agent execution, LangGraph nodes, LLM calls, tokens, tool calls, RAG retrieval, MCP, A2A, latency, failures, cost, user activity, and business KPIs.`,concept:``,code:``},{id:`project-cost-control`,category:`FinOps`,title:`How do you control cost?`,difficulty:`Expert`,time:`~20 min`,description:`Explain cost controls including model routing, smaller models, prompt optimization, context reduction, caching, token limits, reduced agent iterations, tool optimization, quotas, and per-tenant cost tracking.`,concept:``,code:``},{id:`project-llm-unavailable`,category:`Reliability`,title:`What happens if the LLM is unavailable?`,difficulty:`Expert`,time:`~15 min`,description:`Explain resilience to LLM outages using health checks, timeouts, retries, circuit breakers, alternate models or providers, fallback routing, queues, degraded modes, and recovery mechanisms.`,concept:``,code:``},{id:`project-mcp-server-failure`,category:`MCP Reliability`,title:`What happens if an MCP server fails?`,difficulty:`Expert`,time:`~15 min`,description:`Explain how the agent detects MCP server failure and handles it using health checks, timeouts, retries, circuit breakers, fallback tools, alternative MCP servers, task reassignment, and graceful degradation.`,concept:``,code:``},{id:`project-scale-architecture`,category:`Scalability`,title:`How would you scale this architecture?`,difficulty:`Expert`,time:`~25 min`,description:`Explain how to horizontally scale coordinators, delegators, workers, RAG services, MCP servers, A2A communication, databases, queues, and model access using autoscaling, caching, asynchronous execution, and load balancing.`,concept:``,code:``},{id:`project-hardest-technical-problem`,category:`Project Deep Dive`,title:`What was the hardest technical problem?`,difficulty:`Expert`,time:`~15 min`,description:`Prepare to explain the most challenging technical problem encountered during implementation, including the root cause, investigation, architectural trade-offs, solution, implementation details, measurable outcome, and lessons learned.`,concept:``,code:``},{id:`project-redesign`,category:`Project Deep Dive`,title:`What would you change if you redesigned it?`,difficulty:`Expert`,time:`~15 min`,description:`Evaluate the existing architecture critically and identify improvements in agent orchestration, model routing, RAG, MCP, A2A, security, scalability, observability, evaluation, cost, and operational maturity.`,concept:``,code:``},{id:`project-business-value`,category:`Project Deep Dive`,title:`What business value did the solution provide?`,difficulty:`Expert`,time:`~15 min`,description:`Explain the measurable business impact of the Agentic AI solution, including productivity improvement, automation, reduced resolution time, knowledge accessibility, operational efficiency, cost savings, accuracy, and user experience.`,concept:``,code:``}],jh=[`All`,`Advanced`],Mh={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},Nh={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function Ph({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Fh({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Ih({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:Nh[e.difficulty]||`#E6F1FB`,color:Mh[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Lh({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:Nh[e.difficulty]||`#E6F1FB`,color:Mh[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(Ph,{content:e.concept}),t===`code`&&(0,j.jsx)(Fh,{code:e.code})]})}function Rh({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:jh.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Ih,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function zh(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:Ah.length},{label:`Patterns`,value:jh.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function Bh(){let[e,t]=(0,v.useState)(Ah[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(zh,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Rh,{recipes:Ah,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Lh,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var Vh=`# Why did you choose LangGraph for your project?\r
\r
## Interview Answer\r
\r
I chose **LangGraph** because my project required a **stateful, hierarchical multi-agent architecture** where a coordinator agent delegates tasks to multiple specialized agents and each specialized agent can further invoke its own worker agents.\r
\r
A simple agent framework was not sufficient because I needed **controlled orchestration, shared state, conditional routing, retries, human-in-the-loop capabilities, persistence, and observability**.\r
\r
LangGraph provides these capabilities by representing the agent workflow as a **graph of nodes and edges**, where each node performs a specific function and the graph maintains the state throughout the execution.\r
\r
In my project, I implemented a hierarchical architecture:\r
\r
\`\`\`text\r
                    User Request\r
                         |\r
                         v\r
                +----------------+\r
                | Coordinator    |\r
                |     Agent      |\r
                +----------------+\r
                         |\r
              +----------+----------+\r
              |          |          |\r
              v          v          v\r
        Delegator 1  Delegator 2  Delegator 3\r
              |          |          |\r
           +--+--+    +--+--+    +--+--+\r
           |     |    |     |    |     |\r
           v     v    v     v    v     v\r
        Worker Worker Worker Worker Worker Worker\r
\`\`\`\r
\r
LangGraph was a good fit because I could explicitly model this architecture instead of allowing the LLM to make uncontrolled decisions about the entire workflow.\r
\r
---\r
\r
# 1. Why not use a simple LLM chain?\r
\r
A traditional LLM chain generally follows a linear pattern:\r
\r
\`\`\`text\r
Input\r
  |\r
  v\r
Prompt\r
  |\r
  v\r
LLM\r
  |\r
  v\r
Output\r
\`\`\`\r
\r
That works well for simple use cases such as:\r
\r
* Text generation\r
* Summarization\r
* Classification\r
* Simple RAG\r
* Question answering\r
\r
But my enterprise use case required:\r
\r
\`\`\`text\r
User\r
  |\r
  v\r
Coordinator\r
  |\r
  +----> Delegator\r
  |          |\r
  |          +----> Worker\r
  |          |\r
  |          +----> Worker\r
  |\r
  +----> Delegator\r
             |\r
             +----> Worker\r
             |\r
             +----> Worker\r
\`\`\`\r
\r
The workflow was therefore **non-linear, stateful and conditional**.\r
\r
This is where LangGraph provided a significant advantage.\r
\r
---\r
\r
# 2. LangGraph's core technical model\r
\r
LangGraph models an agent system as:\r
\r
\`\`\`text\r
State + Nodes + Edges\r
\`\`\`\r
\r
### State\r
\r
State contains the information shared between different agents.\r
\r
For example:\r
\r
\`\`\`python\r
from typing import TypedDict, List\r
\r
class AgentState(TypedDict):\r
    user_query: str\r
    intent: str\r
    selected_agent: str\r
    messages: List\r
    context: List[str]\r
    tool_results: List\r
    final_response: str\r
\`\`\`\r
\r
The state travels through the graph.\r
\r
---\r
\r
# 3. Nodes\r
\r
Each node represents a specific piece of business logic.\r
\r
For example:\r
\r
\`\`\`python\r
def coordinator_node(state: AgentState):\r
\r
    query = state["user_query"]\r
\r
    intent = classify_intent(query)\r
\r
    return {\r
        "intent": intent\r
    }\r
\`\`\`\r
\r
Another node can perform retrieval:\r
\r
\`\`\`python\r
def retrieval_worker(state: AgentState):\r
\r
    query = state["user_query"]\r
\r
    documents = vector_search(query)\r
\r
    return {\r
        "context": documents\r
    }\r
\`\`\`\r
\r
Another node can generate the final response:\r
\r
\`\`\`python\r
def response_worker(state: AgentState):\r
\r
    context = state["context"]\r
    query = state["user_query"]\r
\r
    response = llm.invoke(\r
        f"""\r
        Answer the question using the following context.\r
\r
        Question:\r
        {query}\r
\r
        Context:\r
        {context}\r
        """\r
    )\r
\r
    return {\r
        "final_response": response.content\r
    }\r
\`\`\`\r
\r
This separation allowed me to keep each agent responsible for a specific capability.\r
\r
---\r
\r
# 4. Conditional routing\r
\r
One of the biggest reasons I selected LangGraph was **conditional routing**.\r
\r
The coordinator can determine which specialized agent should process the request.\r
\r
For example:\r
\r
\`\`\`python\r
def route_request(state: AgentState):\r
\r
    intent = state["intent"]\r
\r
    if intent == "knowledge":\r
        return "knowledge_delegator"\r
\r
    elif intent == "incident":\r
        return "incident_delegator"\r
\r
    elif intent == "analytics":\r
        return "analytics_delegator"\r
\r
    return "general_agent"\r
\`\`\`\r
\r
Then LangGraph can route execution dynamically:\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "coordinator",\r
    route_request,\r
    {\r
        "knowledge_delegator": "knowledge_delegator",\r
        "incident_delegator": "incident_delegator",\r
        "analytics_delegator": "analytics_delegator",\r
        "general_agent": "general_agent"\r
    }\r
)\r
\`\`\`\r
\r
This was important because the workflow wasn't always:\r
\r
\`\`\`text\r
A -> B -> C\r
\`\`\`\r
\r
Instead, it could be:\r
\r
\`\`\`text\r
A -> B -> D\r
\`\`\`\r
\r
or:\r
\r
\`\`\`text\r
A -> C -> E -> F\r
\`\`\`\r
\r
depending on the request.\r
\r
---\r
\r
# 5. Hierarchical multi-agent orchestration\r
\r
My architecture was hierarchical.\r
\r
The coordinator does not perform every task itself.\r
\r
Instead:\r
\r
\`\`\`text\r
Coordinator\r
      |\r
      v\r
Delegator\r
      |\r
      v\r
Specialized Worker\r
\`\`\`\r
\r
For example:\r
\r
\`\`\`python\r
def knowledge_delegator(state):\r
\r
    query = state["user_query"]\r
\r
    if "documentation" in query.lower():\r
        return {\r
            "selected_agent": "documentation_worker"\r
        }\r
\r
    elif "incident" in query.lower():\r
        return {\r
            "selected_agent": "incident_worker"\r
        }\r
\r
    return {\r
        "selected_agent": "general_worker"\r
    }\r
\`\`\`\r
\r
This provides **separation of concerns**.\r
\r
The coordinator focuses on orchestration.\r
\r
The delegator focuses on task decomposition.\r
\r
The worker focuses on execution.\r
\r
---\r
\r
# 6. Stateful execution\r
\r
Another major reason for using LangGraph was state management.\r
\r
For example, suppose a user asks:\r
\r
\`\`\`text\r
Why did service X fail yesterday?\r
\`\`\`\r
\r
The workflow may become:\r
\r
\`\`\`text\r
User Query\r
    |\r
    v\r
Coordinator\r
    |\r
    v\r
Incident Agent\r
    |\r
    +----> Retrieve logs\r
    |\r
    +----> Retrieve incident history\r
    |\r
    +----> Analyze logs\r
    |\r
    v\r
Root Cause Analysis\r
    |\r
    v\r
Final Response\r
\`\`\`\r
\r
Each step can update the state.\r
\r
\`\`\`python\r
state = {\r
    "user_query": "...",\r
    "context": [],\r
    "tool_results": [],\r
    "analysis": None,\r
    "final_response": None\r
}\r
\`\`\`\r
\r
A worker can add information:\r
\r
\`\`\`python\r
def log_worker(state):\r
\r
    logs = get_logs(state["user_query"])\r
\r
    return {\r
        "tool_results": logs\r
    }\r
\`\`\`\r
\r
The next worker receives the updated state.\r
\r
This makes the workflow much easier to control and debug.\r
\r
---\r
\r
# 7. Tool calling\r
\r
My agents also needed to interact with enterprise tools and services.\r
\r
For example:\r
\r
\`\`\`text\r
Agent\r
  |\r
  +----> Vector Database\r
  |\r
  +----> Knowledge Base\r
  |\r
  +----> REST API\r
  |\r
  +----> Monitoring System\r
  |\r
  +----> Database\r
\`\`\`\r
\r
A worker can invoke a tool:\r
\r
\`\`\`python\r
def knowledge_worker(state):\r
\r
    query = state["user_query"]\r
\r
    documents = knowledge_search_tool.invoke({\r
        "query": query\r
    })\r
\r
    return {\r
        "context": documents\r
    }\r
\`\`\`\r
\r
This allows the agent to combine:\r
\r
\`\`\`text\r
LLM reasoning\r
+\r
Tools\r
+\r
Enterprise data\r
\`\`\`\r
\r
instead of relying only on the LLM's knowledge.\r
\r
---\r
\r
# 8. RAG integration\r
\r
LangGraph also worked well with my RAG architecture.\r
\r
The workflow could be:\r
\r
\`\`\`text\r
User Query\r
     |\r
     v\r
Coordinator\r
     |\r
     v\r
Knowledge Agent\r
     |\r
     v\r
Query Transformation\r
     |\r
     v\r
Retriever\r
     |\r
     v\r
Vector Database\r
     |\r
     v\r
Reranker\r
     |\r
     v\r
Context\r
     |\r
     v\r
LLM\r
     |\r
     v\r
Response\r
\`\`\`\r
\r
For example:\r
\r
\`\`\`python\r
def retrieve_documents(state):\r
\r
    query = state["user_query"]\r
\r
    documents = retriever.invoke(query)\r
\r
    return {\r
        "context": documents\r
    }\r
\`\`\`\r
\r
Then:\r
\r
\`\`\`python\r
def generate_answer(state):\r
\r
    context = state["context"]\r
\r
    response = llm.invoke(\r
        f"""\r
        Answer using the retrieved enterprise context.\r
\r
        Context:\r
        {context}\r
\r
        Question:\r
        {state["user_query"]}\r
        """\r
    )\r
\r
    return {\r
        "final_response": response.content\r
    }\r
\`\`\`\r
\r
---\r
\r
# 9. Retry and failure handling\r
\r
Enterprise AI systems need resilience.\r
\r
An agent may fail because of:\r
\r
* LLM timeout\r
* API failure\r
* Tool failure\r
* Invalid response\r
* Retrieval failure\r
* Rate limiting\r
\r
LangGraph allows me to model recovery paths.\r
\r
For example:\r
\r
\`\`\`text\r
Worker\r
  |\r
  v\r
Validate Result\r
  |\r
  +---- Success ----> Next Agent\r
  |\r
  +---- Failure ----> Retry\r
                         |\r
                         v\r
                      Worker\r
\`\`\`\r
\r
Conceptually:\r
\r
\`\`\`python\r
def validate_result(state):\r
\r
    if state.get("tool_results"):\r
        return "success"\r
\r
    return "retry"\r
\`\`\`\r
\r
Then:\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "validate_result",\r
    validate_result,\r
    {\r
        "success": "response_worker",\r
        "retry": "retry_worker"\r
    }\r
)\r
\`\`\`\r
\r
This makes the workflow deterministic and resilient.\r
\r
---\r
\r
# 10. Human-in-the-loop\r
\r
For enterprise applications, some actions should not happen completely autonomously.\r
\r
For example:\r
\r
\`\`\`text\r
Agent recommends production change\r
             |\r
             v\r
       Human Approval\r
          /       \\\r
         /         \\\r
     Approved     Rejected\r
       |             |\r
       v             v\r
   Execute       End Workflow\r
\`\`\`\r
\r
LangGraph supports interrupt/resume style workflows, which makes this architecture possible.\r
\r
This is particularly useful for:\r
\r
* Production changes\r
* Security actions\r
* Financial operations\r
* Customer-impacting operations\r
* High-risk automation\r
\r
---\r
\r
# 11. Persistence and long-running workflows\r
\r
Another reason I selected LangGraph was the ability to support persistent workflows.\r
\r
An enterprise agent may not finish in a single LLM call.\r
\r
For example:\r
\r
\`\`\`text\r
Start\r
 |\r
 v\r
Agent 1\r
 |\r
 v\r
Agent 2\r
 |\r
 X\r
Temporary failure\r
 |\r
 v\r
Resume\r
 |\r
 v\r
Agent 3\r
 |\r
 v\r
Final Response\r
\`\`\`\r
\r
With checkpointing/persistence, the workflow can maintain its state and continue execution.\r
\r
This is much more suitable for enterprise workflows than a simple stateless chain.\r
\r
---\r
\r
# 12. Observability\r
\r
For production deployments, I need to understand:\r
\r
* Which agent executed?\r
* Which tool was called?\r
* How long did it take?\r
* What was the LLM latency?\r
* Which node failed?\r
* How many tokens were consumed?\r
* Where did the workflow spend most of its time?\r
\r
LangGraph's execution model gives me a clear node-level workflow that can be integrated with observability platforms such as LangSmith or enterprise observability systems.\r
\r
For example:\r
\r
\`\`\`text\r
Request\r
  |\r
  +-- Coordinator       250 ms\r
  |\r
  +-- Knowledge Agent   420 ms\r
  |\r
  +-- Retrieval         180 ms\r
  |\r
  +-- LLM               1.8 sec\r
  |\r
  +-- Response          100 ms\r
\`\`\`\r
\r
This makes performance optimization much easier.\r
\r
---\r
\r
# 13. Why LangGraph instead of a simple agent framework?\r
\r
I would explain the comparison this way in an interview:\r
\r
| Requirement               | Simple Chain |   LangGraph |\r
| ------------------------- | -----------: | ----------: |\r
| Linear workflow           |          Yes |         Yes |\r
| Stateful workflow         |      Limited |         Yes |\r
| Conditional routing       |      Limited |         Yes |\r
| Multi-agent orchestration |      Limited |      Strong |\r
| Hierarchical agents       |    Difficult |     Natural |\r
| Shared state              |      Limited |         Yes |\r
| Retry paths               |       Manual | Graph-based |\r
| Human approval            |    Difficult |   Supported |\r
| Long-running workflow     |    Difficult |   Supported |\r
| Tool integration          |          Yes |         Yes |\r
| RAG integration           |          Yes |         Yes |\r
| Workflow visualization    |      Limited |      Strong |\r
| Production orchestration  |      Limited |      Strong |\r
\r
---\r
\r
# 14. Technical architecture used in my project\r
\r
My architecture can be represented as:\r
\r
\`\`\`text\r
                    User\r
                     |\r
                     v\r
              API / Gateway\r
                     |\r
                     v\r
             Coordinator Agent\r
                     |\r
          +----------+----------+\r
          |          |          |\r
          v          v          v\r
     Knowledge    Incident    Analytics\r
     Delegator    Delegator   Delegator\r
          |          |          |\r
       +--+--+    +--+--+    +--+--+\r
       |     |    |     |    |     |\r
       v     v    v     v    v     v\r
      RAG   MCP  Logs   API  SQL  ML Worker\r
       |     |    |     |    |     |\r
       +-----+----+-----+----+-----+\r
                     |\r
                     v\r
                Shared State\r
                     |\r
                     v\r
                 Validator\r
                     |\r
              +------+------+\r
              |             |\r
              v             v\r
           Success        Retry\r
              |\r
              v\r
             LLM\r
              |\r
              v\r
          Final Response\r
\`\`\`\r
\r
---\r
\r
# 15. Example LangGraph implementation\r
\r
A simplified implementation looks like this:\r
\r
\`\`\`python\r
from typing import TypedDict\r
from langgraph.graph import StateGraph, END\r
\r
\r
class AgentState(TypedDict):\r
    user_query: str\r
    intent: str\r
    context: list\r
    result: str\r
\r
\r
def coordinator(state: AgentState):\r
\r
    query = state["user_query"]\r
\r
    if "incident" in query.lower():\r
        intent = "incident"\r
\r
    elif "documentation" in query.lower():\r
        intent = "knowledge"\r
\r
    else:\r
        intent = "general"\r
\r
    return {\r
        "intent": intent\r
    }\r
\r
\r
def knowledge_agent(state: AgentState):\r
\r
    documents = retriever.invoke(\r
        state["user_query"]\r
    )\r
\r
    return {\r
        "context": documents\r
    }\r
\r
\r
def incident_agent(state: AgentState):\r
\r
    logs = log_tool.invoke(\r
        state["user_query"]\r
    )\r
\r
    return {\r
        "context": logs\r
    }\r
\r
\r
def generate_response(state: AgentState):\r
\r
    response = llm.invoke(\r
        f"""\r
        Question:\r
        {state["user_query"]}\r
\r
        Context:\r
        {state["context"]}\r
        """\r
    )\r
\r
    return {\r
        "result": response.content\r
    }\r
\r
\r
def route_agent(state: AgentState):\r
\r
    if state["intent"] == "knowledge":\r
        return "knowledge"\r
\r
    elif state["intent"] == "incident":\r
        return "incident"\r
\r
    return "knowledge"\r
\r
\r
graph = StateGraph(AgentState)\r
\r
graph.add_node(\r
    "coordinator",\r
    coordinator\r
)\r
\r
graph.add_node(\r
    "knowledge",\r
    knowledge_agent\r
)\r
\r
graph.add_node(\r
    "incident",\r
    incident_agent\r
)\r
\r
graph.add_node(\r
    "response",\r
    generate_response\r
)\r
\r
\r
graph.set_entry_point("coordinator")\r
\r
\r
graph.add_conditional_edges(\r
    "coordinator",\r
    route_agent,\r
    {\r
        "knowledge": "knowledge",\r
        "incident": "incident"\r
    }\r
)\r
\r
\r
graph.add_edge(\r
    "knowledge",\r
    "response"\r
)\r
\r
graph.add_edge(\r
    "incident",\r
    "response"\r
)\r
\r
graph.add_edge(\r
    "response",\r
    END\r
)\r
\r
\r
app = graph.compile()\r
\`\`\`\r
\r
The important point is that the LLM is not responsible for controlling the entire application.\r
\r
**The graph controls the workflow, while the LLM provides reasoning within the workflow.**\r
\r
---\r
\r
# 16. Most important architectural point\r
\r
This is the key statement I would emphasize during an interview:\r
\r
> **"I chose LangGraph because I wanted deterministic orchestration around probabilistic LLM reasoning."**\r
\r
The LLM is probabilistic.\r
\r
Enterprise workflows need predictable behavior.\r
\r
Therefore:\r
\r
\`\`\`text\r
LLM\r
 ↓\r
Reasoning\r
 ↓\r
LangGraph\r
 ↓\r
Controlled Workflow\r
 ↓\r
Tools / Agents / RAG\r
 ↓\r
Validation\r
 ↓\r
Response\r
\`\`\`\r
\r
LangGraph gives me the orchestration layer around the LLM.\r
\r
---\r
\r
# 17. 60-second interview answer\r
\r
If the interviewer asks:\r
\r
**"Why did you choose LangGraph?"**\r
\r
I would answer:\r
\r
> "I chose LangGraph because my project required a stateful, hierarchical multi-agent architecture rather than a simple sequential LLM chain. I had a coordinator agent that decomposed the request and delegated it to specialized agents, and those agents could invoke multiple workers and enterprise tools.\r
>\r
> LangGraph allowed me to model this as a graph using state, nodes and conditional edges. The shared state carried the user request, retrieved context, tool outputs and intermediate results between agents. Conditional routing allowed the coordinator to dynamically select the appropriate agent, while retry and validation nodes provided resilience.\r
>\r
> It also gave us capabilities such as persistence, human-in-the-loop workflows, long-running execution and better observability. I integrated it with RAG, enterprise tools and LLMs, so the LLM handled reasoning while LangGraph controlled the deterministic workflow.\r
>\r
> The main reason was that I wanted **controlled orchestration around probabilistic LLM reasoning**, which is important for an enterprise-grade multi-agent system."\r
\r
---\r
\r
# 18. One-line answer\r
\r
If the interviewer wants a very short answer:\r
\r
> **"I chose LangGraph because my enterprise use case required stateful hierarchical multi-agent orchestration with conditional routing, shared state, tool calling, retries, persistence and human-in-the-loop capabilities, which are difficult to implement reliably with a simple LLM chain."**\r
\r
---\r
\r
# 19. Keywords to remember for the interview\r
\r
Remember these **10 keywords**:\r
\r
\`\`\`text\r
1. Stateful\r
2. Graph-based orchestration\r
3. Coordinator\r
4. Delegator\r
5. Worker\r
6. Conditional routing\r
7. Shared state\r
8. Tool calling\r
9. Persistence / Checkpointing\r
10. Human-in-the-loop\r
\`\`\`\r
\r
And remember this architecture:\r
\r
\`\`\`text\r
User\r
 ↓\r
Coordinator\r
 ↓\r
Delegator\r
 ↓\r
Worker\r
 ↓\r
Tools / RAG / APIs\r
 ↓\r
Validation\r
 ↓\r
Response\r
\`\`\`\r
# Why Can't We Use Other Frameworks Instead of LangGraph?\r
\r
## Interview Question\r
\r
**"Why did you choose LangGraph? Couldn't you use AutoGen, CrewAI, Semantic Kernel, LangChain, or another framework?"**\r
\r
---\r
\r
## Interview Answer\r
\r
> **"We could use other frameworks. I wouldn't say LangGraph is the only framework capable of building a multi-agent system. Frameworks such as LangChain Agents, AutoGen, CrewAI, Semantic Kernel, or even custom orchestration can implement agent workflows.**\r
>\r
> **The reason I selected LangGraph was the level of control I needed over the execution flow. My architecture had a coordinator, multiple delegators, and multiple workers. I needed explicit state management, conditional routing, retries, parallel execution, persistence, and human-in-the-loop capabilities.**\r
>\r
> **With LangGraph, I could represent that architecture explicitly as a state graph. Each agent or business function became a node, and the transitions between them were represented as edges. This gave us deterministic control over the workflow while allowing the LLM to perform reasoning inside individual nodes.**\r
>\r
> **So the decision was not 'other frameworks cannot do it'; it was that LangGraph provided the right abstraction and control for our hierarchical enterprise multi-agent use case."**\r
\r
---\r
\r
# How I Would Compare the Alternatives\r
\r
| Framework                       | Strength                                       | Why I Didn't Primarily Choose It                                                |\r
| ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |\r
| **LangGraph**                   | Stateful graph-based orchestration             | **Best fit for our architecture**                                               |\r
| **LangChain Agents**            | Quick agent/tool development                   | Less explicit workflow control for complex hierarchical flows                   |\r
| **AutoGen**                     | Multi-agent conversations                      | More conversation-oriented; our requirement was more workflow/state-centric     |\r
| **CrewAI**                      | Role-based multi-agent collaboration           | Good for agent teams; our requirement needed more detailed workflow control     |\r
| **Semantic Kernel**             | Enterprise integration and Microsoft ecosystem | Strong option, but our primary requirement was graph-based orchestration        |\r
| **Custom Python orchestration** | Maximum flexibility                            | More code and maintenance for state, persistence, retries, routing, etc.        |\r
| **LlamaIndex**                  | Excellent RAG/data framework                   | Primarily focused on RAG and data; not selected as the main orchestration layer |\r
\r
> **Important:** The comparison is not about saying that other frameworks cannot implement these capabilities. The decision should be based on architectural fit, requirements, team expertise, ecosystem, and operational needs.\r
\r
---\r
\r
# 1. Why Not Plain LangChain Agents?\r
\r
LangChain is excellent for building LLM applications and tool-using agents.\r
\r
A simple architecture could look like:\r
\r
\`\`\`text\r
User\r
  |\r
  v\r
Agent\r
  |\r
  +---- Tool 1\r
  |\r
  +---- Tool 2\r
  |\r
  +---- Tool 3\r
  |\r
  v\r
Response\r
\`\`\`\r
\r
This works very well for many applications.\r
\r
However, my enterprise workflow was more complex:\r
\r
\`\`\`text\r
                    Coordinator\r
                         |\r
              +----------+----------+\r
              |          |          |\r
          Delegator  Delegator  Delegator\r
              |          |          |\r
          +---+---+   +--+--+    +--+--+\r
          |       |   |     |    |     |\r
        Worker  Worker Worker Worker Worker\r
\`\`\`\r
\r
I wanted the **workflow itself to be explicitly represented and controlled**.\r
\r
LangGraph provides a model based on:\r
\r
\`\`\`text\r
State\r
  +\r
Nodes\r
  +\r
Edges\r
  +\r
Conditional Edges\r
  +\r
Persistence\r
\`\`\`\r
\r
That was a better match for our architecture.\r
\r
### Key Interview Point\r
\r
> **"LangChain gave us excellent LLM and tool abstractions, while LangGraph gave us the explicit workflow orchestration layer we needed."**\r
\r
---\r
\r
# 2. Why Not AutoGen?\r
\r
AutoGen is a strong framework for multi-agent systems, particularly when agents need to communicate and collaborate with each other.\r
\r
A conversational multi-agent architecture might look like:\r
\r
\`\`\`text\r
Agent A\r
   ↕\r
Agent B\r
   ↕\r
Agent C\r
\`\`\`\r
\r
This is useful when the primary requirement is **agent-to-agent collaboration**.\r
\r
Our architecture was primarily:\r
\r
\`\`\`text\r
Coordinator\r
     |\r
     v\r
Delegator\r
     |\r
     v\r
Worker\r
     |\r
     v\r
Tool / RAG / API\r
\`\`\`\r
\r
Our requirement was to control:\r
\r
* Which agent executes next\r
* What state is passed\r
* Which tools are available\r
* What happens if an agent fails\r
* Whether the workflow should retry\r
* Whether execution should stop\r
* Whether human approval is required\r
\r
Therefore, LangGraph's graph abstraction was a better fit.\r
\r
### Key Interview Point\r
\r
> **"AutoGen was a viable option, but our requirement was more workflow-centric than conversation-centric. We needed explicit control over state transitions and execution paths."**\r
\r
---\r
\r
# 3. Why Not CrewAI?\r
\r
CrewAI is very good for role-based multi-agent collaboration.\r
\r
For example:\r
\r
\`\`\`text\r
Manager\r
   |\r
   +--- Researcher\r
   |\r
   +--- Writer\r
   |\r
   +--- Reviewer\r
\`\`\`\r
\r
This works well for tasks where agents have clearly defined roles.\r
\r
For example:\r
\r
* Research\r
* Writing\r
* Analysis\r
* Review\r
* Planning\r
\r
However, my enterprise architecture required more detailed control over:\r
\r
* State\r
* Transitions\r
* Conditional routing\r
* Retries\r
* Checkpoints\r
* Failure recovery\r
* Human approval\r
* Tool execution\r
* Long-running workflows\r
\r
Our architecture was closer to:\r
\r
\`\`\`text\r
Coordinator\r
     |\r
     v\r
Delegator\r
     |\r
     v\r
Worker\r
     |\r
     v\r
Tool\r
     |\r
     v\r
Validation\r
     |\r
     +------ Failure ------> Retry\r
     |\r
     v\r
Response\r
\`\`\`\r
\r
Therefore, LangGraph provided a better fit.\r
\r
### Key Interview Point\r
\r
> **"CrewAI is a good choice for role-based agent teams, but our requirement needed more granular control over the workflow and state transitions."**\r
\r
---\r
\r
# 4. Why Not Semantic Kernel?\r
\r
Semantic Kernel is a strong enterprise framework, especially in Microsoft/Azure environments.\r
\r
It provides capabilities around:\r
\r
\`\`\`text\r
Plugins\r
Functions\r
AI Services\r
Memory\r
Agents\r
Enterprise Integration\r
\`\`\`\r
\r
It would definitely be a framework I would evaluate for an enterprise solution.\r
\r
However, our primary architectural challenge was **workflow orchestration**.\r
\r
Our workflow naturally looked like:\r
\r
\`\`\`text\r
State\r
  |\r
  v\r
Coordinator\r
  |\r
  +----> Agent A\r
  |\r
  +----> Agent B\r
  |\r
  +----> Agent C\r
  |\r
  v\r
Validation\r
  |\r
  v\r
Response\r
\`\`\`\r
\r
LangGraph's graph abstraction mapped directly to this architecture.\r
\r
### Key Interview Point\r
\r
> **"Semantic Kernel was a viable alternative. The deciding factor wasn't capability; it was architectural fit. Our workflow was naturally represented as a state machine, and LangGraph provided that abstraction directly."**\r
\r
---\r
\r
# 5. Why Not LlamaIndex?\r
\r
LlamaIndex is particularly strong for:\r
\r
* RAG\r
* Document ingestion\r
* Data connectors\r
* Retrieval\r
* Indexing\r
* Knowledge systems\r
\r
A typical RAG-focused architecture could look like:\r
\r
\`\`\`text\r
Documents\r
    |\r
    v\r
Index\r
    |\r
    v\r
Retriever\r
    |\r
    v\r
Context\r
    |\r
    v\r
LLM\r
\`\`\`\r
\r
LlamaIndex would be a strong choice for this problem.\r
\r
However, RAG was only one component of our system.\r
\r
Our broader architecture was:\r
\r
\`\`\`text\r
Multi-Agent Orchestration\r
        +\r
RAG\r
        +\r
Enterprise Tools\r
        +\r
APIs\r
        +\r
State Management\r
        +\r
Workflow Control\r
\`\`\`\r
\r
Therefore, we used the appropriate orchestration framework and integrated RAG as a capability inside the workflow.\r
\r
### Key Interview Point\r
\r
> **"LlamaIndex is excellent for the knowledge and RAG layer, but our primary challenge was multi-agent workflow orchestration."**\r
\r
---\r
\r
# 6. Why Not Build Our Own Orchestration?\r
\r
We could build our own orchestration layer using Python.\r
\r
For example:\r
\r
\`\`\`python\r
def execute_workflow(request):\r
\r
    state = {}\r
\r
    state = coordinator(request)\r
\r
    if state["intent"] == "knowledge":\r
        state = knowledge_agent(state)\r
\r
    elif state["intent"] == "incident":\r
        state = incident_agent(state)\r
\r
    if not validate(state):\r
        state = retry(state)\r
\r
    return generate_response(state)\r
\`\`\`\r
\r
This gives us complete control.\r
\r
However, as the system grows, we would need to develop and maintain:\r
\r
\`\`\`text\r
State Management\r
Routing\r
Persistence\r
Checkpointing\r
Retry Mechanisms\r
Error Handling\r
Human Interruption\r
Workflow Recovery\r
Execution Tracking\r
Observability\r
\`\`\`\r
\r
That creates significant engineering overhead.\r
\r
Instead, LangGraph provides the orchestration abstraction and allows the engineering team to focus on the **business capabilities of the agents**.\r
\r
### Key Interview Point\r
\r
> **"We could build it ourselves, but that would mean maintaining an orchestration engine. LangGraph allowed us to leverage an existing workflow abstraction while retaining control over the architecture."**\r
\r
---\r
\r
# The Most Important Distinction\r
\r
This is the statement I would remember for the interview:\r
\r
> **"Framework selection should be driven by the architecture, not by which framework has the most agent features."**\r
\r
For our architecture:\r
\r
\`\`\`text\r
                    User\r
                      |\r
                      v\r
                Coordinator\r
                      |\r
          +-----------+-----------+\r
          |           |           |\r
          v           v           v\r
      Delegator   Delegator   Delegator\r
          |           |           |\r
       Workers      Workers      Workers\r
          |           |           |\r
          +-----------+-----------+\r
                      |\r
                      v\r
                Enterprise Tools\r
                      |\r
                      v\r
                     RAG\r
                      |\r
                      v\r
                     LLM\r
                      |\r
                      v\r
                  Validator\r
                      |\r
                      v\r
                   Response\r
\`\`\`\r
\r
The **graph/state-machine nature** of LangGraph maps naturally to this architecture.\r
\r
---\r
\r
# Deterministic Orchestration Around Probabilistic Reasoning\r
\r
This is one of the strongest statements to use in a Solution Architect interview:\r
\r
> **"I wanted deterministic orchestration around probabilistic LLM reasoning."**\r
\r
An LLM is probabilistic.\r
\r
An enterprise workflow often needs predictable execution.\r
\r
The separation is:\r
\r
\`\`\`text\r
                 LLM\r
                  |\r
             Reasoning\r
                  |\r
                  v\r
        +-------------------+\r
        |    LangGraph      |\r
        |   Orchestration   |\r
        +-------------------+\r
                  |\r
       +----------+----------+\r
       |          |          |\r
       v          v          v\r
     Agent      Agent      Agent\r
       |          |          |\r
       v          v          v\r
     Tools       RAG        APIs\r
\`\`\`\r
\r
### LLM\r
\r
Responsible for:\r
\r
* Reasoning\r
* Understanding intent\r
* Planning\r
* Generating responses\r
* Selecting actions within defined boundaries\r
\r
### LangGraph\r
\r
Responsible for:\r
\r
* Workflow orchestration\r
* State transitions\r
* Routing\r
* Node execution\r
* Retry paths\r
* Persistence/checkpointing\r
* Human-in-the-loop workflow control\r
\r
This separation provides better control for enterprise applications.\r
\r
---\r
\r
# Example: Conditional Routing\r
\r
Suppose the user asks:\r
\r
\`\`\`text\r
"Why did the production service fail?"\r
\`\`\`\r
\r
The coordinator determines:\r
\r
\`\`\`text\r
intent = incident\r
\`\`\`\r
\r
Then the workflow routes to the incident delegator.\r
\r
\`\`\`python\r
def route_request(state):\r
\r
    if state["intent"] == "incident":\r
        return "incident_delegator"\r
\r
    elif state["intent"] == "knowledge":\r
        return "knowledge_delegator"\r
\r
    elif state["intent"] == "analytics":\r
        return "analytics_delegator"\r
\r
    return "general_agent"\r
\`\`\`\r
\r
The graph can then define the routing:\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "coordinator",\r
    route_request,\r
    {\r
        "incident_delegator": "incident_delegator",\r
        "knowledge_delegator": "knowledge_delegator",\r
        "analytics_delegator": "analytics_delegator",\r
        "general_agent": "general_agent"\r
    }\r
)\r
\`\`\`\r
\r
This makes the workflow explicit instead of allowing the entire workflow to be controlled implicitly by the LLM.\r
\r
---\r
\r
# Example: Shared State\r
\r
The workflow can maintain a shared state:\r
\r
\`\`\`python\r
from typing import TypedDict\r
\r
\r
class AgentState(TypedDict):\r
    user_query: str\r
    intent: str\r
    context: list\r
    tool_results: list\r
    analysis: str\r
    final_response: str\r
\`\`\`\r
\r
The coordinator can update the intent:\r
\r
\`\`\`python\r
def coordinator(state):\r
\r
    intent = classify_intent(\r
        state["user_query"]\r
    )\r
\r
    return {\r
        "intent": intent\r
    }\r
\`\`\`\r
\r
A retrieval worker can update the context:\r
\r
\`\`\`python\r
def retrieval_worker(state):\r
\r
    documents = retriever.invoke(\r
        state["user_query"]\r
    )\r
\r
    return {\r
        "context": documents\r
    }\r
\`\`\`\r
\r
A response worker can consume the state:\r
\r
\`\`\`python\r
def response_worker(state):\r
\r
    response = llm.invoke(\r
        f"""\r
        Question:\r
        {state["user_query"]}\r
\r
        Context:\r
        {state["context"]}\r
        """\r
    )\r
\r
    return {\r
        "final_response": response.content\r
    }\r
\`\`\`\r
\r
This shared state model is useful for complex multi-step workflows.\r
\r
---\r
\r
# Example: Failure Handling\r
\r
Enterprise systems cannot assume every tool call will succeed.\r
\r
The workflow can be:\r
\r
\`\`\`text\r
Worker\r
  |\r
  v\r
Tool Call\r
  |\r
  +---- Success ----> Validator\r
  |\r
  +---- Failure ----> Retry\r
                         |\r
                         v\r
                      Worker\r
\`\`\`\r
\r
A validation function could determine the next path:\r
\r
\`\`\`python\r
def validate_result(state):\r
\r
    if state.get("tool_results"):\r
        return "success"\r
\r
    return "retry"\r
\`\`\`\r
\r
Then the workflow can route accordingly:\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "validate",\r
    validate_result,\r
    {\r
        "success": "response",\r
        "retry": "worker"\r
    }\r
)\r
\`\`\`\r
\r
This makes recovery part of the workflow design.\r
\r
---\r
\r
# Example: Human-in-the-Loop\r
\r
For sensitive enterprise operations:\r
\r
\`\`\`text\r
Agent\r
 |\r
 v\r
Recommendation\r
 |\r
 v\r
Human Approval\r
 |\r
 +---- Approved ----> Execute\r
 |\r
 +---- Rejected ----> Stop\r
\`\`\`\r
\r
This can be useful for:\r
\r
* Production changes\r
* Security actions\r
* Financial operations\r
* Customer-impacting actions\r
* High-risk automation\r
\r
The workflow can pause and resume around the human decision.\r
\r
---\r
\r
# Example: Persistence and Checkpointing\r
\r
Consider a long-running workflow:\r
\r
\`\`\`text\r
Request\r
   |\r
Coordinator\r
   |\r
Delegator\r
   |\r
Worker\r
   |\r
Tool\r
   X\r
Failure\r
\`\`\`\r
\r
With checkpointing:\r
\r
\`\`\`text\r
Workflow State\r
      |\r
      v\r
   Checkpoint\r
      |\r
      v\r
     Resume\r
      |\r
      v\r
Continue Workflow\r
\`\`\`\r
\r
This is valuable when the workflow contains:\r
\r
* Multiple agents\r
* External API calls\r
* Long-running processing\r
* Human approval\r
* Expensive LLM calls\r
\r
---\r
\r
# Why LangGraph Was the Best Fit\r
\r
The decision can be summarized as:\r
\r
\`\`\`text\r
Project Requirements\r
        |\r
        v\r
Hierarchical Multi-Agent System\r
        |\r
        v\r
Stateful Workflow\r
        |\r
        v\r
Conditional Routing\r
        |\r
        v\r
Tool + RAG Integration\r
        |\r
        v\r
Retries + Recovery\r
        |\r
        v\r
Persistence\r
        |\r
        v\r
Human-in-the-Loop\r
        |\r
        v\r
     LangGraph\r
\`\`\`\r
\r
It wasn't selected simply because:\r
\r
> **"LangGraph supports agents."**\r
\r
It was selected because:\r
\r
> **"LangGraph provided the orchestration abstraction that matched our enterprise architecture."**\r
\r
---\r
\r
# Framework Selection Decision Matrix\r
\r
A Solution Architect should evaluate frameworks based on requirements rather than popularity.\r
\r
| Requirement             | LangChain | AutoGen | CrewAI | Semantic Kernel | LangGraph |\r
| ----------------------- | --------: | ------: | -----: | --------------: | --------: |\r
| LLM Integration         |     ⭐⭐⭐⭐⭐ |   ⭐⭐⭐⭐⭐ |   ⭐⭐⭐⭐ |           ⭐⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| Tool Calling            |     ⭐⭐⭐⭐⭐ |    ⭐⭐⭐⭐ |   ⭐⭐⭐⭐ |           ⭐⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| RAG                     |     ⭐⭐⭐⭐⭐ |    ⭐⭐⭐⭐ |   ⭐⭐⭐⭐ |            ⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| Multi-Agent             |      ⭐⭐⭐⭐ |   ⭐⭐⭐⭐⭐ |  ⭐⭐⭐⭐⭐ |            ⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| Stateful Workflows      |       ⭐⭐⭐ |    ⭐⭐⭐⭐ |    ⭐⭐⭐ |            ⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| Conditional Routing     |       ⭐⭐⭐ |    ⭐⭐⭐⭐ |    ⭐⭐⭐ |            ⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| Shared State            |       ⭐⭐⭐ |    ⭐⭐⭐⭐ |    ⭐⭐⭐ |            ⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| Hierarchical Agents     |      ⭐⭐⭐⭐ |    ⭐⭐⭐⭐ |  ⭐⭐⭐⭐⭐ |            ⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| Retry/Recovery          |       ⭐⭐⭐ |    ⭐⭐⭐⭐ |    ⭐⭐⭐ |            ⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| Human-in-the-Loop       |       ⭐⭐⭐ |    ⭐⭐⭐⭐ |    ⭐⭐⭐ |            ⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
| Custom Workflow Control |      ⭐⭐⭐⭐ |    ⭐⭐⭐⭐ |    ⭐⭐⭐ |            ⭐⭐⭐⭐ |     ⭐⭐⭐⭐⭐ |\r
\r
> Ratings are architectural guidance rather than absolute product benchmarks. Framework capabilities change over time.\r
\r
---\r
\r
# What NOT to Say in an Interview\r
\r
### Don't say:\r
\r
> ❌ "LangGraph is better than all other frameworks."\r
\r
### Say:\r
\r
> ✅ "LangGraph was the best fit for our requirements."\r
\r
---\r
\r
### Don't say:\r
\r
> ❌ "Other frameworks cannot handle multi-agent systems."\r
\r
### Say:\r
\r
> ✅ "Other frameworks can handle multi-agent systems, but they have different orchestration models and trade-offs."\r
\r
---\r
\r
### Don't say:\r
\r
> ❌ "We selected LangGraph because it is popular."\r
\r
### Say:\r
\r
> ✅ "We selected LangGraph because our architecture required explicit stateful graph-based orchestration."\r
\r
---\r
\r
### Don't say:\r
\r
> ❌ "LangGraph makes agents intelligent."\r
\r
### Say:\r
\r
> ✅ "The LLM provides reasoning, while LangGraph provides workflow orchestration."\r
\r
---\r
\r
# Strong 30-Second Interview Answer\r
\r
> **"Other frameworks absolutely could have been used. AutoGen, CrewAI, Semantic Kernel and custom orchestration are all capable options. We selected LangGraph because our architecture was a hierarchical, stateful workflow with a coordinator, delegators and workers. We needed explicit state management, conditional routing, retries, persistence and controlled execution. LangGraph allowed us to model those requirements directly as nodes, edges and state transitions. So it wasn't about other frameworks being incapable; it was about LangGraph being the best architectural fit for our enterprise requirements."**\r
\r
---\r
\r
# Strong 60-Second Interview Answer\r
\r
> **"We evaluated the framework based on our architecture rather than simply choosing a framework because it supported agents. Our application had a coordinator agent, multiple delegators and specialized workers, and we needed shared state, conditional routing, tool calling, RAG integration, retries, persistence and human-in-the-loop controls.**\r
>\r
> **AutoGen and CrewAI were viable options for multi-agent collaboration, Semantic Kernel was a strong enterprise alternative, and LangChain provided excellent LLM and tool abstractions. However, our workflow was fundamentally state-machine oriented. LangGraph allowed us to model that directly using state, nodes and edges.**\r
>\r
> **The other important factor was separation of concerns. The LLM handled reasoning, while LangGraph controlled the workflow, state transitions, routing and recovery. So I wouldn't say other frameworks couldn't solve the problem. They could. LangGraph was selected because it provided the right architectural abstraction and level of control for our enterprise multi-agent use case."**\r
\r
---\r
\r
# Architect-Level Final Answer\r
\r
If the interviewer is a **Senior Architect / Principal Architect**, use this answer:\r
\r
> **"I would not position LangGraph as the only solution. Framework selection should be driven by architecture and non-functional requirements.**\r
>\r
> **We evaluated the problem as a stateful hierarchical workflow rather than simply as a multi-agent problem. Our architecture had a coordinator, delegators and specialized workers, with conditional routing, shared state, tool execution, RAG, retry and recovery paths, persistence and human-in-the-loop requirements.**\r
>\r
> **AutoGen, CrewAI, Semantic Kernel and custom orchestration could all implement portions of this architecture. However, LangGraph provided a graph-based state model that mapped naturally to our workflow. It allowed us to explicitly define nodes, edges, conditional transitions and state updates.**\r
>\r
> **The architectural benefit was that we could keep the LLM responsible for probabilistic reasoning while keeping workflow execution deterministic and controlled. That separation improved maintainability, testability and operational control.**\r
>\r
> **So the decision wasn't that other frameworks were incapable. The decision was that LangGraph provided the best architectural fit for our enterprise requirements and allowed us to implement the workflow without building our own orchestration engine."**\r
\r
---\r
\r
# Final Key Sentence to Memorize\r
\r
> **"I didn't choose LangGraph because other frameworks couldn't build the solution; I chose it because its stateful, graph-based orchestration was the best architectural fit for our hierarchical enterprise multi-agent workflow."**\r
\r
---\r
\r
# Interview Keywords\r
\r
Remember these keywords:\r
\r
\`\`\`text\r
1. Architectural Fit\r
2. Stateful Workflow\r
3. Graph-Based Orchestration\r
4. Coordinator\r
5. Delegator\r
6. Worker\r
7. Conditional Routing\r
8. Shared State\r
9. Tool Calling\r
10. RAG\r
11. Retry / Recovery\r
12. Persistence\r
13. Checkpointing\r
14. Human-in-the-Loop\r
15. Deterministic Orchestration\r
16. Probabilistic LLM Reasoning\r
17. Enterprise Governance\r
18. Maintainability\r
\`\`\`\r
\r
## The Core Message\r
\r
\`\`\`text\r
Other Frameworks\r
       |\r
       |---- Can build agents\r
       |\r
       |---- Can build multi-agent systems\r
       |\r
       |---- Can integrate tools/RAG\r
       |\r
       v\r
Different Trade-offs\r
\r
                 ↓\r
\r
Our Requirements\r
       |\r
       v\r
Hierarchical + Stateful + Conditional Workflow\r
       |\r
       v\r
Explicit Orchestration\r
       |\r
       v\r
LangGraph\r
\`\`\`\r
\r
**Bottom line:**\r
\r
> **Framework capability was not the deciding factor. Architectural fit was.**\r
\r
\r
\r
### Strong closing statement\r
\r
> **"LangGraph was not selected simply because it supports agents. I selected it because it gave me an orchestration framework where I could explicitly control state transitions, agent routing, execution, recovery and governance while still using LLMs for reasoning."**\r
`,Hh=`# Why Did You Choose LangGraph Instead of CrewAI?\r
\r
## Interview Question\r
\r
**"Why did you choose LangGraph instead of CrewAI for your multi-agent system?"**\r
\r
## Strong Interview Answer\r
\r
> **"CrewAI was definitely a viable option, and I wouldn't say CrewAI cannot implement our architecture. The decision was based on the type of control we needed over the workflow.**\r
>\r
> **CrewAI is very good for role-based multi-agent collaboration, where you define agents with roles, goals, tasks, and let them collaborate as a crew. Our requirement was slightly different. We had a hierarchical enterprise architecture with one coordinator, multiple delegators, and specialized workers, and we needed explicit control over state, routing, retries, parallel execution, persistence, and failure recovery.**\r
>\r
> **LangGraph models the workflow as a state graph where nodes represent agents or business functions, edges represent transitions, and conditional edges control routing. This allowed us to make the execution path explicit rather than relying primarily on agent-level delegation.**\r
>\r
> **So I didn't choose LangGraph because CrewAI was incapable. I chose LangGraph because our architecture was more workflow-centric and state-centric, whereas CrewAI's agent-and-task abstraction was better suited to role-based collaboration. For our enterprise use case, LangGraph gave us the level of orchestration control we needed."**\r
\r
---\r
\r
# The Core Difference\r
\r
The easiest way to explain it is:\r
\r
\`\`\`text\r
CrewAI\r
========\r
\r
Think:\r
"WHO should do the work?"\r
\r
Agent\r
  |\r
  +-- Role\r
  +-- Goal\r
  +-- Backstory\r
  +-- Tools\r
       |\r
       v\r
      Task\r
       |\r
       v\r
      Crew\r
\`\`\`\r
\r
Whereas:\r
\r
\`\`\`text\r
LangGraph\r
===========\r
\r
Think:\r
"WHAT SHOULD HAPPEN NEXT?"\r
\r
              State\r
                |\r
                v\r
           Coordinator\r
                |\r
          Conditional Route\r
          /       |       \\\r
         v        v        v\r
    Delegator  Delegator  Delegator\r
        |          |          |\r
        v          v          v\r
     Worker      Worker      Worker\r
        \\          |          /\r
         \\         |         /\r
          +--------+--------+\r
                   |\r
                   v\r
               Validator\r
                   |\r
             +-----+-----+\r
             |           |\r
          Success      Retry\r
             |           |\r
             v           |\r
          Response <-----+\r
\`\`\`\r
\r
That difference is the **heart of your answer**.\r
\r
CrewAI's current architecture also provides **Flows** for event-driven orchestration, conditional routing and shared state, so don't claim that CrewAI cannot do these things.\r
\r
---\r
\r
# 1. Our Architecture Was Workflow-Centric\r
\r
Our architecture was:\r
\r
\`\`\`text\r
                         User\r
                          |\r
                          v\r
                    Coordinator\r
                          |\r
             +------------+------------+\r
             |            |            |\r
             v            v            v\r
        Delegator A  Delegator B  Delegator C\r
             |            |            |\r
             v            v            v\r
          Workers      Workers      Workers\r
             |            |            |\r
             +------------+------------+\r
                          |\r
                          v\r
                    Enterprise Tools\r
                          |\r
                          v\r
                         RAG\r
                          |\r
                          v\r
                       Validator\r
                          |\r
                          v\r
                       Response\r
\`\`\`\r
\r
This is naturally represented as a **stateful graph**.\r
\r
LangGraph is specifically designed for long-running, stateful agents and workflows with explicit orchestration, persistence, human-in-the-loop, and deterministic/agentic combinations.\r
\r
---\r
\r
# 2. Explicit State Management\r
\r
This was one of the important reasons.\r
\r
I could define a shared state:\r
\r
\`\`\`python\r
class AgentState(TypedDict):\r
    user_query: str\r
    intent: str\r
    context: list\r
    tool_results: list\r
    analysis: str\r
    final_response: str\r
    retry_count: int\r
\`\`\`\r
\r
Then every node can read the state and return updates.\r
\r
\`\`\`text\r
                    AgentState\r
                        |\r
        +---------------+---------------+\r
        |               |               |\r
        v               v               v\r
   Coordinator      Delegator        Worker\r
        |               |               |\r
        +---------------+---------------+\r
                        |\r
                        v\r
                  Updated State\r
\`\`\`\r
\r
This is particularly useful when multiple agents participate in the same workflow.\r
\r
LangGraph's \`StateGraph\` explicitly supports nodes, edges and conditional edges around a shared state model.\r
\r
---\r
\r
# 3. Explicit Conditional Routing\r
\r
Suppose the coordinator determines:\r
\r
\`\`\`python\r
if intent == "incident":\r
    return "incident_delegator"\r
\r
elif intent == "knowledge":\r
    return "knowledge_delegator"\r
\r
elif intent == "analytics":\r
    return "analytics_delegator"\r
\`\`\`\r
\r
Then:\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "coordinator",\r
    route_request,\r
    {\r
        "incident_delegator": "incident_delegator",\r
        "knowledge_delegator": "knowledge_delegator",\r
        "analytics_delegator": "analytics_delegator"\r
    }\r
)\r
\`\`\`\r
\r
So the routing is explicitly defined.\r
\r
\`\`\`text\r
                    Coordinator\r
                         |\r
                  Conditional Edge\r
                  /       |       \\\r
                 /        |        \\\r
                v         v         v\r
          Incident    Knowledge   Analytics\r
          Delegator   Delegator   Delegator\r
\`\`\`\r
\r
This is important for enterprise workflows because I can **test and reason about the routing independently of the LLM**.\r
\r
LangGraph explicitly supports conditional edges and cyclic workflows.\r
\r
---\r
\r
# 4. Deterministic Orchestration + Probabilistic Reasoning\r
\r
This is one of my favorite architect-level explanations.\r
\r
> **"I wanted deterministic orchestration around probabilistic LLM reasoning."**\r
\r
The LLM is responsible for:\r
\r
\`\`\`text\r
Understanding\r
Reasoning\r
Planning\r
Classification\r
Generation\r
\`\`\`\r
\r
LangGraph is responsible for:\r
\r
\`\`\`text\r
State\r
Routing\r
Workflow\r
Retries\r
Transitions\r
Persistence\r
Execution control\r
\`\`\`\r
\r
So:\r
\r
\`\`\`text\r
             LLM\r
              |\r
       Probabilistic Reasoning\r
              |\r
              v\r
     +-------------------+\r
     |    LangGraph      |\r
     |   Orchestration   |\r
     +-------------------+\r
              |\r
       Deterministic Flow\r
              |\r
      +-------+-------+\r
      |       |       |\r
      v       v       v\r
    Agent   Agent   Agent\r
\`\`\`\r
\r
That separation was important for an enterprise system.\r
\r
---\r
\r
# 5. Retry and Failure Recovery\r
\r
Suppose a worker calls an enterprise API.\r
\r
\`\`\`text\r
Worker\r
  |\r
  v\r
Enterprise API\r
  |\r
  +---- Success ----> Validator\r
  |\r
  +---- Failure ----> Retry\r
                         |\r
                         v\r
                       Worker\r
\`\`\`\r
\r
We can explicitly model this:\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "validator",\r
    validate_result,\r
    {\r
        "success": "response",\r
        "retry": "worker"\r
    }\r
)\r
\`\`\`\r
\r
So the failure path becomes part of the architecture.\r
\r
This is much easier to reason about when the workflow itself is represented explicitly as a graph.\r
\r
---\r
\r
# 6. Human-in-the-Loop\r
\r
For an enterprise system, some actions may require approval:\r
\r
\`\`\`text\r
Agent Recommendation\r
        |\r
        v\r
Human Approval\r
     /      \\\r
    /        \\\r
Approved    Rejected\r
   |           |\r
   v           v\r
Execute       Stop\r
\`\`\`\r
\r
LangGraph provides persistence and interrupt/resume capabilities for these types of workflows.\r
\r
This is useful for:\r
\r
* Production changes\r
* Security operations\r
* Financial operations\r
* Customer-impacting actions\r
* High-risk automation\r
\r
---\r
\r
# 7. Why Not CrewAI?\r
\r
I would **not** say:\r
\r
> ❌ "CrewAI doesn't support hierarchical agents."\r
\r
That's too strong and potentially incorrect.\r
\r
CrewAI explicitly supports agents, tasks, crews, hierarchical processes, and its newer Flows provide conditional routing and state management.\r
\r
Instead, say:\r
\r
> **"CrewAI was a valid alternative. Its agent/task/crew abstraction is excellent when the problem naturally maps to role-based collaboration. Our problem was more about controlling a complex stateful workflow than simply coordinating a team of agents."**\r
\r
That's a much stronger architect answer.\r
\r
---\r
\r
# 8. CrewAI Would Be a Good Choice For This\r
\r
For example:\r
\r
\`\`\`text\r
Research Crew\r
\r
Manager\r
   |\r
   +--- Research Agent\r
   |\r
   +--- Data Agent\r
   |\r
   +--- Writer Agent\r
   |\r
   +--- Reviewer Agent\r
\`\`\`\r
\r
The primary question is:\r
\r
> **"Which agent should perform which task?"**\r
\r
CrewAI is very natural for this type of problem.\r
\r
---\r
\r
# 9. LangGraph Was Better For This\r
\r
Our problem was:\r
\r
\`\`\`text\r
User\r
 |\r
 v\r
Coordinator\r
 |\r
 +---- Intent = Incident\r
 |           |\r
 |           v\r
 |      Incident Delegator\r
 |           |\r
 |           v\r
 |      Incident Worker\r
 |           |\r
 |           v\r
 |       Tool Call\r
 |           |\r
 |           v\r
 |       Validator\r
 |          / \\\r
 |         /   \\\r
 |      Pass   Fail\r
 |       |       |\r
 |       v       v\r
 |    Response  Retry\r
 |\r
 +---- Intent = Knowledge\r
 |           |\r
 |           v\r
 |       RAG Worker\r
 |\r
 +---- Intent = Analytics\r
             |\r
             v\r
        Analytics Worker\r
\`\`\`\r
\r
The primary question is:\r
\r
> **"What should happen next based on the current state?"**\r
\r
That's where the graph abstraction becomes valuable.\r
\r
---\r
\r
# 10. Technical Comparison\r
\r
| Requirement                    | CrewAI                                    | LangGraph                     | Our Decision     |\r
| ------------------------------ | ----------------------------------------- | ----------------------------- | ---------------- |\r
| Role-based agents              | Excellent                                 | Possible                      | Both             |\r
| Agent/task abstraction         | Excellent                                 | Lower-level                   | CrewAI advantage |\r
| Explicit state graph           | Available through Flows, but higher-level | Core abstraction              | **LangGraph**    |\r
| Conditional routing            | Supported                                 | Explicit graph edges          | **LangGraph**    |\r
| Complex branching              | Supported                                 | Strong fit                    | **LangGraph**    |\r
| Cyclic workflows               | Supported through workflow constructs     | Natural graph pattern         | **LangGraph**    |\r
| Fine-grained execution control | Good                                      | Excellent                     | **LangGraph**    |\r
| Stateful workflows             | Supported                                 | Core capability               | **LangGraph**    |\r
| Retry/recovery paths           | Supported                                 | Explicitly modeled            | **LangGraph**    |\r
| Human-in-the-loop              | Supported                                 | Strong interrupt/resume model | **LangGraph**    |\r
| Quick multi-agent prototype    | Excellent                                 | More engineering              | **CrewAI**       |\r
| Complex enterprise workflow    | Good                                      | Strong fit                    | **LangGraph**    |\r
\r
The important point is that **CrewAI is not "less capable"; it provides a different abstraction**. CrewAI's own documentation now describes Flows as supporting event-driven orchestration, conditional routing and shared state.\r
\r
---\r
\r
# 11. The Trade-Off\r
\r
Be honest about the trade-off.\r
\r
### LangGraph\r
\r
\`\`\`text\r
More Control\r
     |\r
     v\r
More Code\r
     |\r
     v\r
More Design Responsibility\r
\`\`\`\r
\r
### CrewAI\r
\r
\`\`\`text\r
Higher-Level Abstraction\r
     |\r
     v\r
Less Boilerplate\r
     |\r
     v\r
Faster Agent Development\r
\`\`\`\r
\r
CrewAI itself describes the difference as a shift from LangGraph's **nodes/edges/state** mental model toward Flows based on **events/listeners/routers**.\r
\r
So if I needed to build a quick role-based agent team, I would absolutely consider CrewAI.\r
\r
But for my project:\r
\r
\`\`\`text\r
Enterprise\r
   +\r
Stateful\r
   +\r
Hierarchical\r
   +\r
Conditional\r
   +\r
Long-running\r
   +\r
Retry/Recovery\r
   +\r
Human Approval\r
   =\r
LangGraph\r
\`\`\`\r
\r
---\r
\r
# 12. Best 30-Second Answer\r
\r
> **"CrewAI was definitely a viable alternative. I wouldn't say CrewAI couldn't implement our solution. The main difference was architectural fit. CrewAI is very natural for role-based multi-agent collaboration using agents, tasks and crews. Our system was more workflow-centric: we had a coordinator, multiple delegators and specialized workers, with shared state, conditional routing, retries, persistence and human-in-the-loop requirements. LangGraph allowed us to model that explicitly as a state graph using nodes, edges and conditional edges. So I selected LangGraph not because it was more capable than CrewAI, but because its stateful graph-based orchestration matched our enterprise architecture better."**\r
\r
---\r
\r
# 13. If the Interviewer Pushes Further\r
\r
### Interviewer:\r
\r
**"But CrewAI Flows can also do conditional routing and state. Why LangGraph?"**\r
\r
### Answer:\r
\r
> **"Absolutely. With the newer CrewAI Flows, many of those capabilities are available. My decision would therefore come down to the level of control and the mental model I wanted for the application. In our system, the workflow itself was a first-class architectural component. I wanted every state transition, routing decision, retry path and agent invocation to be explicitly represented and testable. LangGraph's graph and state model gave me that low-level control directly. If the priority were faster development of role-based agent teams, I would lean more toward CrewAI."**\r
\r
That is a **much stronger answer** than simply saying LangGraph is better.\r
\r
---\r
\r
# Final Sentence to Memorize\r
\r
> **"CrewAI is agent-centric; LangGraph is workflow-centric. Our enterprise system required more explicit control over state and workflow transitions, so LangGraph was the better architectural fit."**\r
\r
### One-line version\r
\r
\`\`\`text\r
CrewAI → "Who should do the task?"\r
\r
LangGraph → "What should happen next?"\r
\`\`\`\r
\r
**For your CWD architecture, the second question is the more important one.**\r
`,Uh=[{id:`why-langgraph`,category:`Agentic AI Frameworks`,title:`Why did you choose LangGraph for your project?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural reasons for selecting LangGraph for stateful, multi-step, and hierarchical agent orchestration in an enterprise Agentic AI system.`,tags:[`langgraph`,`agentic ai`,`agent orchestration`,`multi-agent`,`state management`,`workflow`,`architecture`,`enterprise ai`],concept:Vh,code:``},{id:`langgraph-vs-langchain-agents`,category:`Agentic AI Frameworks`,title:`Why did you choose LangGraph instead of LangChain Agents?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural differences between LangGraph and LangChain Agents and the factors involved in selecting LangGraph for complex enterprise agent orchestration.`,concept:Hh,code:``},{id:`langgraph-vs-crewai`,category:`Agentic AI Frameworks`,title:`Why did you choose LangGraph instead of CrewAI?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural differences between LangGraph and CrewAI and how to select the appropriate framework based on orchestration, state management, multi-agent coordination, flexibility, and enterprise requirements.`,concept:Hh,code:``},{id:`langgraph-vs-autogen`,category:`Agentic AI Frameworks`,title:`Why did you choose LangGraph instead of AutoGen?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural differences between LangGraph and AutoGen and how to evaluate them for multi-agent communication, orchestration, state management, workflow control, and enterprise production requirements.`,concept:`# Why Did You Choose LangGraph Instead of AutoGen?\r
\r
## Interview Question\r
\r
**"Why did you choose LangGraph instead of AutoGen for your multi-agent architecture?"**\r
\r
---\r
\r
## Strong Interview Answer\r
\r
> **"AutoGen was definitely a strong alternative, especially for multi-agent collaboration and agent-to-agent communication. I wouldn't say AutoGen was incapable of building our solution. The main reason we selected LangGraph was architectural fit.**\r
>\r
> **Our system had a hierarchical architecture with one coordinator, multiple delegators, and specialized workers. The important requirement was not just getting agents to communicate; we needed explicit control over the workflow, shared state, conditional routing, retries, persistence, and recovery.**\r
>\r
> **AutoGen's model is strongly centered around agents communicating through messages and conversations. LangGraph allowed us to model the workflow explicitly as a state graph, where agents or business functions are nodes, transitions are edges, and routing decisions are conditional edges.**\r
>\r
> **That gave us more deterministic control over how the workflow executed while the LLM remained responsible for reasoning. So the decision was not that AutoGen couldn't solve the problem. It was that LangGraph's state-and-graph orchestration model was a better fit for our enterprise workflow."**\r
\r
---\r
\r
# The Core Difference\r
\r
The easiest way to remember the difference:\r
\r
\`\`\`text\r
AutoGen\r
========\r
\r
Agent A\r
   |\r
   | message\r
   v\r
Agent B\r
   |\r
   | message\r
   v\r
Agent C\r
\`\`\`\r
\r
The mental model is primarily:\r
\r
> **"How do these agents communicate and collaborate?"**\r
\r
AutoGen's AgentChat API is designed around conversational multi-agent applications, while its Core layer provides event-driven messaging and routing.\r
\r
---\r
\r
LangGraph:\r
\r
\`\`\`text\r
                    State\r
                      |\r
                      v\r
                 Coordinator\r
                      |\r
              Conditional Route\r
               /       |       \\\r
              v        v        v\r
        Delegator A Delegator B Delegator C\r
              |        |        |\r
              v        v        v\r
           Worker    Worker    Worker\r
              \\        |        /\r
               \\       |       /\r
                +------+------+\r
                       |\r
                       v\r
                   Validator\r
                    /     \\\r
                   v       v\r
               Success   Retry\r
                   |\r
                   v\r
                Response\r
\`\`\`\r
\r
The mental model is:\r
\r
> **"What should happen next based on the current state?"**\r
\r
LangGraph is specifically positioned as a low-level orchestration runtime for long-running, stateful agents, with capabilities such as persistence, durable execution, human-in-the-loop, and explicit workflow control.\r
\r
---\r
\r
# 1. Our Architecture Was State-Centric\r
\r
My architecture was:\r
\r
\`\`\`text\r
                         User\r
                          |\r
                          v\r
                    Coordinator\r
                          |\r
             +------------+------------+\r
             |            |            |\r
             v            v            v\r
        Delegator A  Delegator B  Delegator C\r
             |            |            |\r
             v            v            v\r
          Workers      Workers      Workers\r
             |            |            |\r
             +------------+------------+\r
                          |\r
                          v\r
                  Enterprise Tools\r
                          |\r
                          v\r
                         RAG\r
                          |\r
                          v\r
                      Validator\r
                          |\r
                          v\r
                       Response\r
\`\`\`\r
\r
This is naturally represented as a graph.\r
\r
LangGraph's own multi-agent guidance describes this model as representing agents as nodes, connections as edges, and communication/state through the graph.\r
\r
---\r
\r
# 2. Explicit Shared State\r
\r
I could define a common state object:\r
\r
\`\`\`python\r
class AgentState(TypedDict):\r
    user_query: str\r
    intent: str\r
    context: list\r
    tool_results: list\r
    analysis: str\r
    final_response: str\r
    retry_count: int\r
\`\`\`\r
\r
Then:\r
\r
\`\`\`text\r
                  AgentState\r
                      |\r
       +--------------+--------------+\r
       |              |              |\r
       v              v              v\r
  Coordinator     Delegator       Worker\r
       |              |              |\r
       +--------------+--------------+\r
                      |\r
                      v\r
                Updated State\r
\`\`\`\r
\r
The important point is that **the state becomes a first-class part of the workflow**.\r
\r
This was valuable because different workers could contribute information without forcing the entire architecture to depend on an ongoing agent-to-agent conversation.\r
\r
---\r
\r
# 3. Explicit Routing\r
\r
For example:\r
\r
\`\`\`python\r
def route_request(state):\r
\r
    if state["intent"] == "incident":\r
        return "incident_delegator"\r
\r
    elif state["intent"] == "knowledge":\r
        return "knowledge_delegator"\r
\r
    elif state["intent"] == "analytics":\r
        return "analytics_delegator"\r
\`\`\`\r
\r
Then:\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "coordinator",\r
    route_request,\r
    {\r
        "incident_delegator": "incident_delegator",\r
        "knowledge_delegator": "knowledge_delegator",\r
        "analytics_delegator": "analytics_delegator"\r
    }\r
)\r
\`\`\`\r
\r
The execution path is explicit:\r
\r
\`\`\`text\r
Coordinator\r
     |\r
     +---- incident ----> Incident Delegator\r
     |\r
     +---- knowledge ---> Knowledge Delegator\r
     |\r
     +---- analytics ---> Analytics Delegator\r
\`\`\`\r
\r
This makes the workflow easier to reason about, test and govern.\r
\r
---\r
\r
# 4. AutoGen Is More Communication-Oriented\r
\r
AutoGen's AgentChat abstraction is built around agents that communicate through messages. Its Core API goes lower-level into message passing and event-driven agents.\r
\r
For example:\r
\r
\`\`\`text\r
Agent A\r
   |\r
   | "I need information"\r
   v\r
Agent B\r
   |\r
   | "Here is the information"\r
   v\r
Agent A\r
   |\r
   | "Let's ask Agent C"\r
   v\r
Agent C\r
\`\`\`\r
\r
This is excellent for:\r
\r
* Agent collaboration\r
* Agent conversations\r
* Group chat\r
* Dynamic agent interactions\r
* Research-style multi-agent systems\r
\r
But our architecture was more:\r
\r
\`\`\`text\r
Coordinator\r
     |\r
     v\r
Delegator\r
     |\r
     v\r
Worker\r
     |\r
     v\r
Tool\r
     |\r
     v\r
Validator\r
     |\r
     +---- Retry\r
     |\r
     v\r
Response\r
\`\`\`\r
\r
So our primary concern was **workflow control**, not just agent communication.\r
\r
---\r
\r
# 5. Deterministic Workflow Around Probabilistic Reasoning\r
\r
This is the architect-level point I would emphasize.\r
\r
> **"I wanted deterministic orchestration around probabilistic LLM reasoning."**\r
\r
The LLM is responsible for:\r
\r
\`\`\`text\r
Reasoning\r
Intent understanding\r
Planning\r
Classification\r
Generation\r
\`\`\`\r
\r
LangGraph controls:\r
\r
\`\`\`text\r
State\r
Routing\r
Transitions\r
Retries\r
Persistence\r
Workflow execution\r
\`\`\`\r
\r
So:\r
\r
\`\`\`text\r
                  LLM\r
                   |\r
           Probabilistic Reasoning\r
                   |\r
                   v\r
          +----------------+\r
          |   LangGraph    |\r
          | Orchestration  |\r
          +----------------+\r
                   |\r
          Deterministic Flow\r
                   |\r
       +-----------+-----------+\r
       |           |           |\r
       v           v           v\r
     Agent       Agent       Agent\r
\`\`\`\r
\r
That separation was important for an enterprise application.\r
\r
---\r
\r
# 6. Retry and Recovery\r
\r
Suppose an enterprise API fails:\r
\r
\`\`\`text\r
Worker\r
  |\r
  v\r
Enterprise API\r
  |\r
  +------ Success ------> Validator\r
  |\r
  +------ Failure ------> Retry\r
                              |\r
                              v\r
                            Worker\r
\`\`\`\r
\r
The retry path becomes part of the graph.\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "validator",\r
    validate_result,\r
    {\r
        "success": "response",\r
        "retry": "worker"\r
    }\r
)\r
\`\`\`\r
\r
Instead of relying on an agent conversation to eventually recover, the workflow explicitly defines the recovery path.\r
\r
---\r
\r
# 7. Human-in-the-Loop\r
\r
For sensitive enterprise actions:\r
\r
\`\`\`text\r
Agent Recommendation\r
        |\r
        v\r
Human Approval\r
      /   \\\r
     /     \\\r
Approved  Rejected\r
   |          |\r
   v          v\r
Execute      Stop\r
\`\`\`\r
\r
This is important for:\r
\r
* Production operations\r
* Security actions\r
* Financial operations\r
* Customer-impacting actions\r
* High-risk automation\r
\r
LangGraph has first-class persistence and interrupt/resume patterns for human-in-the-loop workflows.\r
\r
---\r
\r
# 8. Why Not AutoGen?\r
\r
Don't say:\r
\r
> ❌ **"AutoGen can't do state management."**\r
\r
That's not accurate.\r
\r
Don't say:\r
\r
> ❌ **"AutoGen can't implement hierarchical agents."**\r
\r
Also too strong.\r
\r
Instead say:\r
\r
> **"AutoGen could implement the architecture, but its agent/message-oriented abstraction wasn't the primary mental model we wanted for our workflow."**\r
\r
AutoGen Core is actually quite flexible and supports event-driven agents, messaging, routing, and distributed runtimes.\r
\r
Your answer should therefore focus on **architectural fit**, not capability claims.\r
\r
---\r
\r
# 9. Current 2026 Consideration\r
\r
There is also a current framework-selection consideration.\r
\r
As of 2026, Microsoft's AutoGen repository states that **AutoGen is in maintenance mode and will not receive new features**, and Microsoft recommends **Microsoft Agent Framework** for new projects.\r
\r
Therefore, if an interviewer asks:\r
\r
**"Would you choose AutoGen for a new project today?"**\r
\r
A strong answer is:\r
\r
> **"For a new Microsoft-oriented project today, I would evaluate Microsoft Agent Framework rather than starting a new implementation on AutoGen because Microsoft now positions it as the successor to AutoGen. But when we made our original framework decision, the important comparison was the orchestration model and our application requirements."**\r
\r
That demonstrates that you understand **both the historical architecture decision and the current ecosystem**.\r
\r
---\r
\r
# 10. LangGraph vs AutoGen\r
\r
| Requirement                  | AutoGen    | LangGraph                              | Our Choice        |\r
| ---------------------------- | ---------- | -------------------------------------- | ----------------- |\r
| Multi-agent collaboration    | Excellent  | Excellent                              | Both              |\r
| Agent-to-agent communication | Excellent  | Supported                              | AutoGen advantage |\r
| Message-based architecture   | Strong     | Possible                               | AutoGen advantage |\r
| Explicit graph workflow      | Possible   | **Core abstraction**                   | **LangGraph**     |\r
| Shared workflow state        | Supported  | **Core abstraction**                   | **LangGraph**     |\r
| Conditional routing          | Supported  | **Explicit graph edges**               | **LangGraph**     |\r
| Complex branching            | Strong     | **Strong fit**                         | **LangGraph**     |\r
| Cyclic workflows             | Supported  | **Natural graph pattern**              | **LangGraph**     |\r
| Retry/recovery paths         | Possible   | **Easy to model explicitly**           | **LangGraph**     |\r
| Human-in-the-loop            | Supported  | **Strong persistence/interrupt model** | **LangGraph**     |\r
| Rapid conversational agents  | **Strong** | More implementation control            | AutoGen           |\r
| Fine-grained orchestration   | Strong     | **Very strong**                        | **LangGraph**     |\r
\r
---\r
\r
# 11. When Would I Choose AutoGen?\r
\r
This is important because an architect should not sound biased.\r
\r
I would consider AutoGen when the primary requirement is:\r
\r
\`\`\`text\r
Multiple autonomous agents\r
        +\r
Agent-to-agent communication\r
        +\r
Conversation\r
        +\r
Dynamic collaboration\r
\`\`\`\r
\r
For example:\r
\r
\`\`\`text\r
Research Agent\r
       ↕\r
Data Agent\r
       ↕\r
Critic Agent\r
       ↕\r
Writer Agent\r
\`\`\`\r
\r
That is a natural multi-agent conversation problem.\r
\r
AutoGen was specifically designed around conversational multi-agent applications and agent messaging.\r
\r
---\r
\r
# 12. When Would I Choose LangGraph?\r
\r
I would choose LangGraph when the architecture looks like:\r
\r
\`\`\`text\r
State\r
  |\r
  v\r
Coordinator\r
  |\r
  v\r
Conditional Routing\r
  |\r
  +------> Agent A\r
  |\r
  +------> Agent B\r
  |\r
  +------> Agent C\r
  |\r
  v\r
Validation\r
  |\r
  +---- Retry\r
  |\r
  v\r
Response\r
\`\`\`\r
\r
Especially when I need:\r
\r
* Explicit state\r
* Complex branching\r
* Conditional routing\r
* Loops\r
* Retry paths\r
* Persistence\r
* Long-running workflows\r
* Human approval\r
* Fine-grained orchestration\r
\r
LangGraph is explicitly positioned for low-level control over stateful, long-running agent workflows.\r
\r
---\r
\r
# 13. The Best 30-Second Answer\r
\r
> **"AutoGen was a strong alternative, especially for multi-agent communication and collaboration. But our architecture was more workflow-centric than conversation-centric. We had a coordinator, multiple delegators and specialized workers, and we needed explicit state management, conditional routing, retries, persistence and controlled execution. LangGraph allowed us to represent those directly as nodes, edges and state transitions. So I didn't choose LangGraph because AutoGen couldn't solve the problem. I chose it because its graph-based orchestration model gave us better control over our enterprise workflow."**\r
\r
---\r
\r
# 14. If the Interviewer Challenges You\r
\r
### Interviewer:\r
\r
**"But AutoGen also supports workflows. Why couldn't you use it?"**\r
\r
### Answer:\r
\r
> **"We absolutely could have. Framework selection isn't about whether a framework can technically implement the requirement; several frameworks can. The question is which abstraction gives the team the right control and maintainability. For our architecture, the workflow itself was a first-class component. I wanted the routing, state transitions, retry paths and agent execution boundaries to be explicit and testable. LangGraph's state graph model aligned directly with that requirement."**\r
\r
---\r
\r
### Interviewer:\r
\r
**"So are you saying AutoGen is inferior?"**\r
\r
### Answer:\r
\r
> **"No. I would not make that claim. AutoGen is very strong for conversational and message-driven multi-agent systems. LangGraph is strong when you need fine-grained workflow orchestration. The correct choice depends on the architecture and non-functional requirements."**\r
\r
---\r
\r
### Interviewer:\r
\r
**"Would you use AutoGen today?"**\r
\r
### Answer:\r
\r
> **"For an existing AutoGen system, absolutely, depending on its requirements. For a new project in 2026, I would evaluate Microsoft Agent Framework because Microsoft now recommends it as the successor to AutoGen. I would still compare it against LangGraph based on our workflow, state, persistence, deployment and ecosystem requirements."**\r
\r
---\r
\r
# Final Sentence to Memorize\r
\r
> **"AutoGen is a strong choice for agent communication and collaboration; LangGraph was a better fit for our explicit, stateful workflow orchestration. We needed to control what happens next, not just which agent talks to which agent."**\r
\r
## One-Line Memory Trick\r
\r
\`\`\`text\r
AutoGen  →  "How do agents communicate?"\r
\r
LangGraph → "What happens next based on state?"\r
\`\`\`\r
\r
**For your Coordinator → Delegator → Worker architecture, that distinction is the key reason to choose LangGraph.**\r
`,code:``},{id:`langgraph-vs-semantic-kernel`,category:`Agentic AI Frameworks`,title:`Why did you choose LangGraph instead of Semantic Kernel?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural differences between LangGraph and Semantic Kernel and how to select between them based on agent orchestration, workflow control, state management, enterprise integration, and cloud ecosystem requirements.`,concept:`# Why Did You Choose LangGraph Instead of Semantic Kernel?\r
\r
## Interview Question\r
\r
**"Why did you choose LangGraph instead of Semantic Kernel?"**\r
\r
## Strong Interview Answer\r
\r
> **"Semantic Kernel was a strong alternative, especially because it provides good enterprise integration, plugins, AI services, and Microsoft ecosystem support. We evaluated it as a viable option. The main reason we selected LangGraph was the nature of our orchestration requirement.**\r
>\r
> **Our architecture was hierarchical, with one coordinator, multiple delegators, and specialized worker agents. We needed explicit control over state, conditional routing, loops, retries, persistence, and the execution path between agents.**\r
>\r
> **LangGraph allowed us to represent the workflow directly as a state graph. Each agent or business capability could be represented as a node, transitions as edges, and dynamic routing as conditional edges. That gave us fine-grained control over the execution lifecycle.**\r
>\r
> **Semantic Kernel could also implement many of these capabilities, but its core abstraction was more centered around AI services, plugins/functions, memory, and agent orchestration. For our particular use case, LangGraph's graph-based state orchestration was a more natural fit.**\r
>\r
> **So the decision was not that Semantic Kernel couldn't solve the problem. It was that LangGraph matched our workflow-centric architecture better."**\r
\r
---\r
\r
# The Core Difference\r
\r
The easiest way to remember it:\r
\r
\`\`\`text\r
Semantic Kernel\r
================\r
\r
AI Application\r
      |\r
      +--- Plugins\r
      |\r
      +--- Functions\r
      |\r
      +--- AI Services\r
      |\r
      +--- Memory\r
      |\r
      +--- Agents\r
      |\r
      v\r
   Application\r
\`\`\`\r
\r
Think:\r
\r
> **"How do I integrate AI capabilities, plugins, functions and services into my enterprise application?"**\r
\r
Whereas LangGraph:\r
\r
\`\`\`text\r
LangGraph\r
==========\r
\r
                  State\r
                    |\r
                    v\r
               Coordinator\r
                    |\r
             Conditional Route\r
             /       |       \\\r
            v        v        v\r
       Delegator  Delegator  Delegator\r
           |          |          |\r
           v          v          v\r
        Worker      Worker      Worker\r
           \\          |          /\r
            \\         |         /\r
             +--------+--------+\r
                      |\r
                      v\r
                  Validator\r
                   /     \\\r
                  v       v\r
              Success    Retry\r
                  |\r
                  v\r
               Response\r
\`\`\`\r
\r
Think:\r
\r
> **"What should happen next based on the current state?"**\r
\r
That was the key reason for our selection.\r
\r
---\r
\r
# 1. Our Architecture Was Workflow-Centric\r
\r
Our CWD architecture looked like:\r
\r
\`\`\`text\r
                         User\r
                          |\r
                          v\r
                    Coordinator\r
                          |\r
             +------------+------------+\r
             |            |            |\r
             v            v            v\r
        Delegator A  Delegator B  Delegator C\r
             |            |            |\r
             v            v            v\r
          Workers      Workers      Workers\r
             |            |            |\r
             +------------+------------+\r
                          |\r
                          v\r
                   Enterprise Tools\r
                          |\r
                          v\r
                         RAG\r
                          |\r
                          v\r
                      Validator\r
                          |\r
                          v\r
                       Response\r
\`\`\`\r
\r
The important thing was that the **workflow itself was a first-class architectural component**.\r
\r
I needed to define:\r
\r
\`\`\`text\r
Who executes?\r
      +\r
What state is available?\r
      +\r
Where does execution go next?\r
      +\r
What happens when something fails?\r
      +\r
When do we retry?\r
      +\r
When do we stop?\r
\`\`\`\r
\r
LangGraph's graph/state model mapped naturally to that architecture.\r
\r
---\r
\r
# 2. Explicit State Management\r
\r
For example:\r
\r
\`\`\`python\r
class AgentState(TypedDict):\r
\r
    user_query: str\r
    intent: str\r
\r
    context: list\r
    tool_results: list\r
\r
    analysis: str\r
    final_response: str\r
\r
    retry_count: int\r
    validation_status: str\r
\`\`\`\r
\r
Then the state flows through the graph:\r
\r
\`\`\`text\r
                  AgentState\r
                      |\r
                      v\r
                Coordinator\r
                      |\r
                      v\r
                 Delegator\r
                      |\r
                      v\r
                   Worker\r
                      |\r
                      v\r
                  Validator\r
                      |\r
                      v\r
                Updated State\r
\`\`\`\r
\r
This gave us a clear contract between different parts of the workflow.\r
\r
---\r
\r
# 3. Explicit Conditional Routing\r
\r
Suppose the coordinator determines:\r
\r
\`\`\`python\r
if intent == "incident":\r
    return "incident_delegator"\r
\r
elif intent == "knowledge":\r
    return "knowledge_delegator"\r
\r
elif intent == "analytics":\r
    return "analytics_delegator"\r
\`\`\`\r
\r
Then LangGraph can represent that explicitly:\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "coordinator",\r
    route_request,\r
    {\r
        "incident_delegator": "incident_delegator",\r
        "knowledge_delegator": "knowledge_delegator",\r
        "analytics_delegator": "analytics_delegator"\r
    }\r
)\r
\`\`\`\r
\r
So the architecture becomes:\r
\r
\`\`\`text\r
                    Coordinator\r
                         |\r
                Conditional Routing\r
                /        |        \\\r
               v         v         v\r
          Incident    Knowledge   Analytics\r
          Delegator   Delegator   Delegator\r
\`\`\`\r
\r
This was valuable because routing became **explicit, observable and testable**.\r
\r
---\r
\r
# 4. Why This Matters in Enterprise Systems\r
\r
In a simple chatbot, this might not matter much.\r
\r
But in an enterprise system, we may have:\r
\r
\`\`\`text\r
User\r
 ↓\r
Authentication\r
 ↓\r
Intent Classification\r
 ↓\r
Coordinator\r
 ↓\r
Delegator\r
 ↓\r
Worker\r
 ↓\r
Enterprise API\r
 ↓\r
RAG\r
 ↓\r
Validation\r
 ↓\r
Policy Check\r
 ↓\r
Human Approval\r
 ↓\r
Response\r
\`\`\`\r
\r
There can be many failure points.\r
\r
For example:\r
\r
\`\`\`text\r
Worker\r
  |\r
  v\r
API\r
  |\r
  +---- Success ----> Validator\r
  |\r
  +---- Failure ----> Retry\r
                         |\r
                         v\r
                       Worker\r
\`\`\`\r
\r
I wanted these transitions to be part of the **workflow definition**, rather than hidden inside agent logic.\r
\r
---\r
\r
# 5. Deterministic Orchestration + Probabilistic Reasoning\r
\r
This is the architect-level statement I would use:\r
\r
> **"I wanted deterministic orchestration around probabilistic LLM reasoning."**\r
\r
The LLM handles:\r
\r
\`\`\`text\r
Intent understanding\r
Reasoning\r
Planning\r
Classification\r
Generation\r
\`\`\`\r
\r
LangGraph handles:\r
\r
\`\`\`text\r
State\r
Routing\r
Transitions\r
Retries\r
Persistence\r
Execution control\r
\`\`\`\r
\r
So:\r
\r
\`\`\`text\r
                LLM\r
                 |\r
        Probabilistic Reasoning\r
                 |\r
                 v\r
        +------------------+\r
        |    LangGraph     |\r
        |   Orchestration  |\r
        +------------------+\r
                 |\r
        Deterministic Flow\r
                 |\r
        +--------+--------+\r
        |        |        |\r
        v        v        v\r
      Agent    Agent    Agent\r
\`\`\`\r
\r
That separation was very important for our enterprise architecture.\r
\r
---\r
\r
# 6. Why Semantic Kernel Was Still a Strong Option\r
\r
Do **not** tell the interviewer:\r
\r
> ❌ "Semantic Kernel cannot build multi-agent systems."\r
\r
That is incorrect.\r
\r
Semantic Kernel provides capabilities around:\r
\r
* AI services\r
* Plugins\r
* Functions\r
* Memory\r
* Agent capabilities\r
* Process/workflow orchestration\r
* Enterprise application integration\r
\r
So I would say:\r
\r
> **"Semantic Kernel was absolutely capable of implementing the solution. The selection came down to the abstraction that best matched our architecture."**\r
\r
That sounds much more like a Solution Architect.\r
\r
---\r
\r
# 7. Semantic Kernel Would Be Particularly Attractive in a Microsoft Environment\r
\r
For example, imagine the architecture is heavily centered around:\r
\r
\`\`\`text\r
Azure\r
  |\r
  +--- Azure OpenAI\r
  |\r
  +--- Microsoft Graph\r
  |\r
  +--- Azure Functions\r
  |\r
  +--- Microsoft 365\r
  |\r
  +--- Teams\r
  |\r
  +--- .NET\r
\`\`\`\r
\r
In that situation, Semantic Kernel becomes a very strong candidate.\r
\r
You could build:\r
\r
\`\`\`text\r
Semantic Kernel\r
      |\r
      +--- Kernel\r
      |\r
      +--- AI Service\r
      |\r
      +--- Plugin\r
      |\r
      +--- Function\r
      |\r
      +--- Agent\r
\`\`\`\r
\r
If the organization's development ecosystem is heavily **C#/.NET + Microsoft**, I would seriously evaluate Semantic Kernel.\r
\r
---\r
\r
# 8. Why LangGraph Fit Our Team Better\r
\r
Our application was heavily oriented toward:\r
\r
\`\`\`text\r
Python\r
 +\r
LLM workflows\r
 +\r
RAG\r
 +\r
Agent orchestration\r
 +\r
Stateful execution\r
 +\r
Complex routing\r
\`\`\`\r
\r
LangGraph fit that development model very naturally.\r
\r
For example:\r
\r
\`\`\`python\r
graph.add_node(\r
    "coordinator",\r
    coordinator_node\r
)\r
\r
graph.add_node(\r
    "knowledge_worker",\r
    knowledge_worker_node\r
)\r
\r
graph.add_node(\r
    "incident_worker",\r
    incident_worker_node\r
)\r
\r
graph.add_conditional_edges(\r
    "coordinator",\r
    route_request\r
)\r
\`\`\`\r
\r
The architecture is visible directly in the code.\r
\r
That was a major advantage for our team.\r
\r
---\r
\r
# 9. LangGraph vs Semantic Kernel\r
\r
| Requirement                      | Semantic Kernel                                 | LangGraph                  | Our Decision  |\r
| -------------------------------- | ----------------------------------------------- | -------------------------- | ------------- |\r
| AI service integration           | **Excellent**                                   | Excellent                  | Both          |\r
| Plugins/functions                | **Excellent**                                   | Excellent through tools    | Both          |\r
| Microsoft ecosystem              | **Excellent**                                   | Good                       | SK advantage  |\r
| .NET integration                 | **Excellent**                                   | Less natural               | SK advantage  |\r
| Python support                   | Excellent                                       | **Excellent**              | LangGraph     |\r
| RAG integration                  | Excellent                                       | **Excellent**              | Both          |\r
| Agent orchestration              | Strong                                          | **Strong**                 | Both          |\r
| Explicit state graph             | Available through workflow/process capabilities | **Core abstraction**       | **LangGraph** |\r
| Conditional routing              | Supported                                       | **Natural graph pattern**  | **LangGraph** |\r
| Complex branching                | Strong                                          | **Strong fit**             | **LangGraph** |\r
| Retry loops                      | Supported                                       | **Explicit graph pattern** | **LangGraph** |\r
| Stateful workflows               | Strong                                          | **Core capability**        | **LangGraph** |\r
| Fine-grained workflow control    | Strong                                          | **Very strong**            | **LangGraph** |\r
| Enterprise Microsoft integration | **Excellent**                                   | Good                       | SK advantage  |\r
| Our hierarchical workflow        | Good fit                                        | **Very strong fit**        | **LangGraph** |\r
\r
---\r
\r
# 10. The Important Trade-Off\r
\r
I would explain it this way:\r
\r
\`\`\`text\r
Semantic Kernel\r
      |\r
      v\r
Enterprise AI Application\r
      |\r
      +--- Plugins\r
      +--- Functions\r
      +--- AI Services\r
      +--- Agents\r
\`\`\`\r
\r
Whereas:\r
\r
\`\`\`text\r
LangGraph\r
      |\r
      v\r
Workflow Orchestration\r
      |\r
      +--- State\r
      +--- Nodes\r
      +--- Edges\r
      +--- Conditional Routing\r
      +--- Loops\r
      +--- Persistence\r
\`\`\`\r
\r
There is overlap, but the **center of gravity is different**.\r
\r
---\r
\r
# 11. When Would I Choose Semantic Kernel?\r
\r
If the interviewer asks:\r
\r
**"When would you use Semantic Kernel instead?"**\r
\r
Say:\r
\r
> **"If I were building a Microsoft-centric enterprise application, particularly with .NET, Azure OpenAI, Microsoft 365, Graph APIs and a strong plugin/function architecture, I would strongly consider Semantic Kernel. It provides a very good enterprise abstraction for integrating AI capabilities into existing applications."**\r
\r
For example:\r
\r
\`\`\`text\r
                    Enterprise App\r
                          |\r
                    Semantic Kernel\r
                          |\r
          +---------------+---------------+\r
          |               |               |\r
      Azure OpenAI   Microsoft Graph   Plugins\r
          |               |               |\r
          +---------------+---------------+\r
                          |\r
                       Response\r
\`\`\`\r
\r
That's a legitimate use case for Semantic Kernel.\r
\r
---\r
\r
# 12. When Would I Choose LangGraph?\r
\r
For:\r
\r
\`\`\`text\r
Complex workflow\r
      +\r
Multiple agents\r
      +\r
Shared state\r
      +\r
Conditional routing\r
      +\r
Loops\r
      +\r
Retries\r
      +\r
Persistence\r
      +\r
Human approval\r
\`\`\`\r
\r
I would strongly consider LangGraph.\r
\r
For our architecture:\r
\r
\`\`\`text\r
Coordinator\r
     |\r
     v\r
Delegator\r
     |\r
     v\r
Worker\r
     |\r
     +---- RAG\r
     |\r
     +---- Tool\r
     |\r
     v\r
Validator\r
     |\r
   +---+---+\r
   |       |\r
Retry    Success\r
   |       |\r
   +--> Worker\r
           |\r
           v\r
        Response\r
\`\`\`\r
\r
That is where LangGraph's graph abstraction becomes very useful.\r
\r
---\r
\r
# 13. If the Interviewer Says: "But Semantic Kernel Also Has Workflows"\r
\r
This is the **best follow-up response**:\r
\r
> **"Yes, absolutely. Semantic Kernel has evolved beyond just plugins and functions, and it provides process and orchestration capabilities. So I wouldn't claim LangGraph is the only framework that can implement this workflow. My decision was based on the programming model we wanted. Our architecture was naturally represented as a state graph, and LangGraph gave us a very direct model of nodes, edges, state and conditional transitions. That made the execution path easier for our team to visualize, test and control."**\r
\r
This prevents the interviewer from catching you on an inaccurate comparison.\r
\r
---\r
\r
# 14. If They Ask: "Was LangGraph the Best Framework?"\r
\r
Don't say:\r
\r
> ❌ "Yes, LangGraph is the best."\r
\r
Say:\r
\r
> **"There is no universally best agent framework. The right framework depends on the architecture, team skills, cloud ecosystem, operational requirements and level of orchestration control required. For our specific requirements, LangGraph was the best fit."**\r
\r
That's the **Solution Architect answer**.\r
\r
---\r
\r
# 15. Best 30-Second Interview Answer\r
\r
> **"Semantic Kernel was a strong alternative, particularly because of its enterprise capabilities and Microsoft ecosystem integration. We selected LangGraph because our architecture was workflow-centric and stateful. We had a coordinator, multiple delegators and specialized workers, and needed explicit state management, conditional routing, retries, persistence and controlled execution. LangGraph allowed us to model those directly as nodes, edges and state transitions. So I wouldn't say Semantic Kernel couldn't solve the problem. The decision was primarily about architectural fit—Semantic Kernel was very attractive for Microsoft-centric application integration, while LangGraph was a better fit for our complex stateful agent workflow."**\r
\r
---\r
\r
# Final Sentence to Memorize\r
\r
> **"Semantic Kernel is a strong enterprise AI integration framework; LangGraph was a better fit for our stateful, graph-based agent orchestration. We chose based on architectural fit, not framework superiority."**\r
\r
### Memory Trick\r
\r
\`\`\`text\r
Semantic Kernel\r
→ "How do I integrate AI capabilities into my enterprise application?"\r
\r
LangGraph\r
→ "How do I control the execution of my stateful AI workflow?"\r
\`\`\`\r
\r
For your **Coordinator → Delegator → Worker → RAG/Tools → Validator** architecture, that distinction is the key.\r
`,code:``},{id:`langgraph-vs-openai-agents-sdk`,category:`Agentic AI Frameworks`,title:`Why did you choose LangGraph instead of OpenAI Agents SDK?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural differences between LangGraph and OpenAI Agents SDK and how to evaluate them for agent orchestration, stateful workflows, tool usage, handoffs, observability, flexibility, and enterprise production requirements.`,concept:`# Why Did You Choose LangGraph Instead of OpenAI Agents SDK?\r
\r
## Interview Question\r
\r
**"Why did you choose LangGraph instead of the OpenAI Agents SDK?"**\r
\r
## Strong Interview Answer\r
\r
> **"OpenAI Agents SDK was a strong option, especially for building production agent applications with tools, handoffs, guardrails, sessions, human-in-the-loop capabilities and built-in tracing. We could have implemented our multi-agent solution using it.**\r
>\r
> **The reason we selected LangGraph was primarily the orchestration model and the level of control we wanted over our enterprise workflow. Our architecture had one coordinator, multiple delegators and specialized workers, and the workflow involved explicit state transitions, conditional routing, retries, validation and potentially long-running execution.**\r
>\r
> **With LangGraph, the workflow itself is represented as a state graph. Agents and business functions become nodes, transitions become edges, and routing decisions become conditional edges. That made the execution path explicit and easier for us to reason about, test and govern.**\r
>\r
> **The OpenAI Agents SDK provides a higher-level agent runtime where agents can use tools and delegate through handoffs or agents-as-tools. That's excellent for many agentic applications. But our primary requirement was not simply agent delegation; it was explicit workflow orchestration around multiple enterprise capabilities.**\r
>\r
> **So I wouldn't say LangGraph is universally better than the OpenAI Agents SDK. The decision was based on architectural fit. LangGraph gave us the graph-based orchestration model we wanted for our hierarchical enterprise workflow."**\r
\r
---\r
\r
# The Core Difference\r
\r
The easiest way to remember it:\r
\r
\`\`\`text\r
OpenAI Agents SDK\r
=================\r
\r
                 Agent\r
                   |\r
          +--------+--------+\r
          |        |        |\r
        Tools   Handoffs  Guardrails\r
                   |\r
                   v\r
             Specialist Agent\r
\`\`\`\r
\r
The primary abstraction is:\r
\r
> **Agent + Tools + Handoffs + Guardrails + Runtime**\r
\r
OpenAI's current Agents SDK documentation describes agents as LLMs configured with instructions, tools and optional runtime behavior such as handoffs, guardrails and structured outputs. It also provides sessions, human-in-the-loop mechanisms and tracing.\r
\r
---\r
\r
LangGraph:\r
\r
\`\`\`text\r
LangGraph\r
=========\r
\r
                    State\r
                      |\r
                      v\r
                 Coordinator\r
                      |\r
               Conditional Edge\r
                /      |      \\\r
               v       v       v\r
          Delegator Delegator Delegator\r
              |         |         |\r
              v         v         v\r
           Worker     Worker     Worker\r
              \\         |         /\r
               \\        |        /\r
                +-------+-------+\r
                        |\r
                        v\r
                    Validator\r
                     /     \\\r
                    v       v\r
                Success    Retry\r
                    |\r
                    v\r
                 Response\r
\`\`\`\r
\r
The primary abstraction is:\r
\r
> **State + Nodes + Edges + Conditional Routing**\r
\r
That was a better match for your CWD architecture.\r
\r
---\r
\r
# 1. Our Architecture Was Workflow-Centric\r
\r
Your architecture was:\r
\r
\`\`\`text\r
                         User\r
                          |\r
                          v\r
                    Coordinator\r
                          |\r
             +------------+------------+\r
             |            |            |\r
             v            v            v\r
        Delegator A  Delegator B  Delegator C\r
             |            |            |\r
             v            v            v\r
          Workers      Workers      Workers\r
             |            |            |\r
             +------------+------------+\r
                          |\r
                          v\r
                   Enterprise Tools\r
                          |\r
                          v\r
                         RAG\r
                          |\r
                          v\r
                      Validator\r
                          |\r
                          v\r
                       Response\r
\`\`\`\r
\r
The important question was:\r
\r
> **"What should happen next based on the current workflow state?"**\r
\r
That is where LangGraph fit particularly well.\r
\r
---\r
\r
# 2. Explicit State\r
\r
For example:\r
\r
\`\`\`python\r
class AgentState(TypedDict):\r
\r
    user_query: str\r
    intent: str\r
\r
    context: list\r
    tool_results: list\r
\r
    analysis: str\r
    final_response: str\r
\r
    retry_count: int\r
    validation_status: str\r
\`\`\`\r
\r
Then the state flows through the system:\r
\r
\`\`\`text\r
                  AgentState\r
                      |\r
                      v\r
                Coordinator\r
                      |\r
                      v\r
                 Delegator\r
                      |\r
                      v\r
                   Worker\r
                      |\r
                      v\r
                  Validator\r
                      |\r
                      v\r
                Updated State\r
\`\`\`\r
\r
This makes the workflow state a first-class architectural object.\r
\r
---\r
\r
# 3. Explicit Conditional Routing\r
\r
For example:\r
\r
\`\`\`python\r
def route_request(state):\r
\r
    if state["intent"] == "incident":\r
        return "incident_delegator"\r
\r
    elif state["intent"] == "knowledge":\r
        return "knowledge_delegator"\r
\r
    elif state["intent"] == "analytics":\r
        return "analytics_delegator"\r
\`\`\`\r
\r
And:\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "coordinator",\r
    route_request,\r
    {\r
        "incident_delegator": "incident_delegator",\r
        "knowledge_delegator": "knowledge_delegator",\r
        "analytics_delegator": "analytics_delegator"\r
    }\r
)\r
\`\`\`\r
\r
This creates:\r
\r
\`\`\`text\r
                    Coordinator\r
                         |\r
                Conditional Routing\r
                /        |        \\\r
               v         v         v\r
          Incident    Knowledge   Analytics\r
          Delegator   Delegator   Delegator\r
\`\`\`\r
\r
The execution path is explicitly represented in the application.\r
\r
---\r
\r
# 4. OpenAI Agents SDK Can Also Do Multi-Agent Routing\r
\r
This is important.\r
\r
Don't tell the interviewer:\r
\r
> ❌ "OpenAI Agents SDK cannot do multi-agent routing."\r
\r
That's incorrect.\r
\r
The SDK supports:\r
\r
* Agents\r
* Tools\r
* Handoffs\r
* Agents as tools\r
* Guardrails\r
* Sessions\r
* Human-in-the-loop\r
* Tracing\r
\r
OpenAI documents two important multi-agent patterns: **manager-style orchestration using agents as tools**, and **handoffs**, where control transfers to a specialist.\r
\r
For example:\r
\r
\`\`\`text\r
                 Triage Agent\r
                 /          \\\r
                /            \\\r
               v              v\r
       Billing Agent      Support Agent\r
\`\`\`\r
\r
A handoff is effectively represented to the model as a tool for transferring control to the specialist.\r
\r
That's very useful.\r
\r
---\r
\r
# 5. But Our Requirement Was More Than Agent Delegation\r
\r
Our workflow was:\r
\r
\`\`\`text\r
User\r
 |\r
 v\r
Coordinator\r
 |\r
 v\r
Intent\r
 |\r
 +------ Incident ------> Incident Delegator\r
 |\r
 +------ Knowledge -----> Knowledge Delegator\r
 |\r
 +------ Analytics -----> Analytics Delegator\r
                              |\r
                              v\r
                           Worker\r
                              |\r
                         +----+----+\r
                         |         |\r
                        RAG       Tool\r
                         |         |\r
                         +----+----+\r
                              |\r
                              v\r
                          Validator\r
                           /     \\\r
                          /       \\\r
                      Retry      Success\r
                        |           |\r
                        +---->      v\r
                              Response\r
\`\`\`\r
\r
We wanted the **workflow topology itself** to be explicit.\r
\r
That was the main reason for choosing LangGraph.\r
\r
---\r
\r
# 6. Deterministic Orchestration Around LLM Reasoning\r
\r
This is the strongest architect-level statement:\r
\r
> **"I wanted deterministic orchestration around probabilistic LLM reasoning."**\r
\r
The LLM handles:\r
\r
\`\`\`text\r
Reasoning\r
Intent understanding\r
Planning\r
Classification\r
Generation\r
\`\`\`\r
\r
LangGraph controls:\r
\r
\`\`\`text\r
State\r
Routing\r
Transitions\r
Retry\r
Workflow execution\r
Persistence\r
\`\`\`\r
\r
Conceptually:\r
\r
\`\`\`text\r
                 LLM\r
                  |\r
          Probabilistic Reasoning\r
                  |\r
                  v\r
        +------------------+\r
        |    LangGraph     |\r
        |   Orchestration  |\r
        +------------------+\r
                  |\r
          Deterministic Flow\r
                  |\r
       +----------+----------+\r
       |          |          |\r
       v          v          v\r
     Agent      Agent      Agent\r
\`\`\`\r
\r
That separation was valuable for an enterprise system.\r
\r
---\r
\r
# 7. Retry and Recovery\r
\r
Suppose an enterprise API fails:\r
\r
\`\`\`text\r
Worker\r
  |\r
  v\r
Enterprise API\r
  |\r
  +---- Success ----> Validator\r
  |\r
  +---- Failure ----> Retry\r
                         |\r
                         v\r
                       Worker\r
\`\`\`\r
\r
The retry path can be explicitly represented in the graph.\r
\r
\`\`\`python\r
graph.add_conditional_edges(\r
    "validator",\r
    validate_result,\r
    {\r
        "success": "response",\r
        "retry": "worker"\r
    }\r
)\r
\`\`\`\r
\r
This is one of the strongest reasons to explain your LangGraph choice.\r
\r
---\r
\r
# 8. OpenAI Agents SDK Has Strong Features Too\r
\r
Don't undersell it.\r
\r
The current OpenAI Agents SDK provides:\r
\r
\`\`\`text\r
Agents\r
Tools\r
Handoffs\r
Agents-as-tools\r
Guardrails\r
Sessions\r
Human-in-the-loop\r
Tracing\r
MCP tool integration\r
\`\`\`\r
\r
The SDK documentation explicitly describes built-in tracing, sessions, guardrails, handoffs and human-in-the-loop support.\r
\r
It also supports MCP server tools directly.\r
\r
So for a new project that is heavily OpenAI-centric, I would absolutely evaluate it.\r
\r
---\r
\r
# 9. One Important Advantage of OpenAI Agents SDK\r
\r
If the interviewer asks:\r
\r
**"What would make you choose OpenAI Agents SDK instead?"**\r
\r
Answer:\r
\r
> **"If the application were primarily OpenAI-centric and the workflow was relatively agent-driven rather than requiring a complex explicit state graph, I would strongly consider the OpenAI Agents SDK. Its built-in agent runtime, handoffs, tools, guardrails, sessions and tracing provide a very clean developer experience."**\r
\r
For example:\r
\r
\`\`\`text\r
                  Triage Agent\r
                       |\r
                +------+------+\r
                |             |\r
                v             v\r
          Billing Agent   Support Agent\r
                |             |\r
              Tools          Tools\r
                |             |\r
                +------+------+\r
                       |\r
                    Response\r
\`\`\`\r
\r
That's a very natural fit for the SDK.\r
\r
---\r
\r
# 10. Why LangGraph for Our CWD System?\r
\r
Our requirement was closer to:\r
\r
\`\`\`text\r
                 Coordinator\r
                      |\r
               State / Intent\r
                      |\r
              Conditional Route\r
                      |\r
              +-------+-------+\r
              |               |\r
         Delegator         Delegator\r
              |               |\r
           Workers          Workers\r
              |               |\r
              +-------+-------+\r
                      |\r
                  Validation\r
                      |\r
                +-----+-----+\r
                |           |\r
              Retry       Success\r
                |           |\r
                +           v\r
                         Response\r
\`\`\`\r
\r
The workflow had:\r
\r
* Multiple branches\r
* Multiple workers\r
* Shared state\r
* Tool execution\r
* RAG\r
* Validation\r
* Retry paths\r
* Potential human approval\r
* Long-running execution\r
* Enterprise governance requirements\r
\r
That made a graph-based orchestration model attractive.\r
\r
---\r
\r
# 11. Model and Provider Consideration\r
\r
Another consideration is **architectural portability**.\r
\r
Your enterprise architecture was intended to be cloud-agnostic:\r
\r
\`\`\`text\r
                Agentic Layer\r
                     |\r
          +----------+----------+\r
          |          |          |\r
       Azure       AWS        Other\r
          |          |          |\r
    Azure OpenAI  Bedrock    Other LLMs\r
\`\`\`\r
\r
If the orchestration layer is intentionally separated from the model provider, LangGraph gives us a framework-level orchestration layer rather than making the architecture primarily centered around one model provider.\r
\r
The OpenAI Agents SDK can work with non-OpenAI providers as well, but the SDK is naturally centered around the OpenAI agent runtime and Responses API ecosystem. The official docs note that the SDK uses the Responses API by default for OpenAI models and also documents model/provider configuration.\r
\r
So I would describe this as an **architectural consideration**, not a limitation.\r
\r
---\r
\r
# 12. Technical Comparison\r
\r
| Requirement                    | OpenAI Agents SDK                 | LangGraph                                     | Our Decision  |\r
| ------------------------------ | --------------------------------- | --------------------------------------------- | ------------- |\r
| Agent creation                 | **Excellent**                     | Excellent                                     | Both          |\r
| Tools                          | **Excellent**                     | Excellent                                     | Both          |\r
| Agent-to-agent handoffs        | **Excellent**                     | Supported                                     | Both          |\r
| Agents as tools                | **Excellent**                     | Supported patterns                            | Both          |\r
| Guardrails                     | **Excellent**                     | Supported                                     | Both          |\r
| Sessions                       | **Built-in**                      | Persistence/checkpointing                     | Both          |\r
| Tracing                        | **Built-in OpenAI tracing**       | Integrates with LangSmith/other observability | SDK advantage |\r
| MCP                            | **Built-in support**              | Supported through integrations                | Both          |\r
| Explicit state graph           | Possible through application code | **Core abstraction**                          | **LangGraph** |\r
| Conditional graph routing      | Possible                          | **Core abstraction**                          | **LangGraph** |\r
| Complex branching              | Good                              | **Very strong fit**                           | **LangGraph** |\r
| Cyclic workflows               | Possible                          | **Natural graph pattern**                     | **LangGraph** |\r
| Explicit retry paths           | Possible                          | **Natural graph pattern**                     | **LangGraph** |\r
| Long-running stateful workflow | Strong                            | **Strong fit**                                | **LangGraph** |\r
| Provider-neutral orchestration | Good                              | **Strong fit**                                | **LangGraph** |\r
| OpenAI-first development       | **Excellent**                     | Excellent                                     | SDK advantage |\r
| Our hierarchical workflow      | Good                              | **Very strong fit**                           | **LangGraph** |\r
\r
---\r
\r
# 13. The Trade-Off\r
\r
I would explain the trade-off honestly:\r
\r
\`\`\`text\r
OpenAI Agents SDK\r
        |\r
        v\r
Higher-level Agent Runtime\r
        |\r
        +--- Tools\r
        +--- Handoffs\r
        +--- Guardrails\r
        +--- Sessions\r
        +--- Tracing\r
\`\`\`\r
\r
Versus:\r
\r
\`\`\`text\r
LangGraph\r
        |\r
        v\r
Lower-level Workflow Orchestration\r
        |\r
        +--- State\r
        +--- Nodes\r
        +--- Edges\r
        +--- Conditional Edges\r
        +--- Loops\r
        +--- Persistence\r
\`\`\`\r
\r
So:\r
\r
> **OpenAI Agents SDK gives you a very productive agent runtime. LangGraph gives you more direct control over the workflow topology.**\r
\r
That's the distinction I would emphasize.\r
\r
---\r
\r
# 14. When Would I Choose OpenAI Agents SDK?\r
\r
I would choose it when:\r
\r
\`\`\`text\r
OpenAI-centric\r
      +\r
Agent-based\r
      +\r
Tools\r
      +\r
Handoffs\r
      +\r
Guardrails\r
      +\r
Simple/moderate workflow\r
\`\`\`\r
\r
Example:\r
\r
\`\`\`text\r
User\r
 |\r
 v\r
Triage Agent\r
 |\r
 +---- Billing Agent\r
 |\r
 +---- Support Agent\r
 |\r
 +---- Technical Agent\r
\`\`\`\r
\r
That's a very good OpenAI Agents SDK use case.\r
\r
---\r
\r
# 15. When Would I Choose LangGraph?\r
\r
I would choose it when:\r
\r
\`\`\`text\r
Complex Workflow\r
       +\r
Shared State\r
       +\r
Multiple Branches\r
       +\r
Loops\r
       +\r
Retries\r
       +\r
Persistence\r
       +\r
Human Approval\r
       +\r
Long-running Execution\r
\`\`\`\r
\r
Example:\r
\r
\`\`\`text\r
Coordinator\r
     |\r
     v\r
Delegator\r
     |\r
     v\r
Worker\r
     |\r
   Tool/RAG\r
     |\r
     v\r
Validator\r
   /     \\\r
Retry   Success\r
  |        |\r
  +------> Response\r
\`\`\`\r
\r
That matches your CWD architecture.\r
\r
---\r
\r
# 16. If the Interviewer Says: "But OpenAI Agents SDK Can Do All That"\r
\r
This is the response you should give:\r
\r
> **"Yes, that's fair. The OpenAI Agents SDK has evolved significantly and provides many of the capabilities required for production agentic systems, including handoffs, agents-as-tools, guardrails, sessions, human-in-the-loop and tracing. So I wouldn't claim that LangGraph is the only framework capable of implementing our architecture. My decision was about the abstraction and level of control. Our workflow was naturally represented as a state machine with explicit transitions, branches and retry paths, so LangGraph gave us a more direct representation of the architecture."**\r
\r
This is the **safe and technically mature answer**.\r
\r
---\r
\r
# 17. If They Ask: "Would You Use OpenAI Agents SDK Today?"\r
\r
Say:\r
\r
> **"Yes, I would definitely evaluate it for a new project. The SDK has become a strong production option, especially if the application is OpenAI-centric and benefits from its built-in tools, handoffs, guardrails, sessions and tracing. But I would still choose the framework based on workflow complexity, state-management requirements, model-provider strategy, observability, deployment and enterprise integration requirements."**\r
\r
---\r
\r
# Best 30-Second Interview Answer\r
\r
> **"OpenAI Agents SDK was a strong alternative, and we could have implemented the solution with it. Its agents, tools, handoffs, guardrails, sessions and tracing make it very good for production agent applications. We chose LangGraph because our architecture was more workflow-centric. We had a coordinator, multiple delegators and workers, with shared state, conditional routing, validation, retry paths and long-running execution. LangGraph allowed us to model those explicitly as state, nodes and edges. So it wasn't that OpenAI Agents SDK couldn't solve the problem; LangGraph gave us better control over the workflow topology and matched our enterprise architecture better."**\r
\r
---\r
\r
# One-Line Memory Trick\r
\r
\`\`\`text\r
OpenAI Agents SDK\r
→ "How do I build and run agents with tools and handoffs?"\r
\r
LangGraph\r
→ "How do I explicitly control a complex stateful agent workflow?"\r
\`\`\`\r
\r
### Final architect-level statement\r
\r
> **"I selected LangGraph because I wanted the orchestration layer to be explicit and provider-independent, while the LLM remained responsible for reasoning. The framework decision was driven by workflow complexity and enterprise control requirements, not by claiming that one framework was universally better than another."**\r
`,code:``},{id:`why-agentic-framework`,category:`Agentic AI Frameworks`,title:`What criteria did you use to select an Agentic AI framework?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the key technical, architectural, operational, and business criteria used to evaluate and select an Agentic AI framework for enterprise applications, including orchestration, state management, scalability, observability, security, ecosystem, and maintainability.`,concept:`# What Criteria Did You Use to Select an Agentic AI Framework?\r
\r
## Interview Question\r
\r
**"What criteria did you use to select an Agentic AI framework?"**\r
\r
## Strong Solution Architect Answer\r
\r
> **"I didn't select the framework based on popularity or because it had the most agent features. I evaluated it against our business requirements, architecture, and production requirements.**\r
>\r
> **The main criteria were orchestration capability, state management, multi-agent support, model flexibility, tool and protocol integration, reliability and recovery, observability, security and governance, scalability, cloud compatibility, developer experience, and long-term maintainability.**\r
>\r
> **For our CWD enterprise assistant, the most important criteria were explicit workflow orchestration, state management, conditional routing, retries, persistence, and the ability to model our coordinator–delegator–worker architecture. LangGraph scored strongly on those dimensions, so it became our preferred orchestration framework.**\r
>\r
> **I also compared alternatives such as CrewAI, AutoGen, Semantic Kernel, and OpenAI Agents SDK. Each had strengths, but LangGraph provided the best architectural fit for our specific requirements."**\r
\r
---\r
\r
# 1. Orchestration Model\r
\r
This was my **first and most important criterion**.\r
\r
I asked:\r
\r
> **"How much control do we need over the execution flow?"**\r
\r
Our architecture was:\r
\r
\`\`\`text\r
User\r
 |\r
 v\r
Coordinator\r
 |\r
 +---- Delegator A\r
 |         |\r
 |       Workers\r
 |\r
 +---- Delegator B\r
 |         |\r
 |       Workers\r
 |\r
 +---- Delegator C\r
           |\r
         Workers\r
\`\`\`\r
\r
I needed:\r
\r
* Conditional routing\r
* Branching\r
* Loops\r
* Retry paths\r
* Sequential execution\r
* Parallel execution\r
* Explicit transitions\r
* Failure recovery\r
\r
For this requirement, a state-graph approach was a strong fit.\r
\r
LangGraph's core abstraction is a graph with state, nodes and edges, making it particularly suitable for stateful workflows.\r
\r
---\r
\r
# 2. State Management\r
\r
I evaluated:\r
\r
> **"Can the framework maintain and persist the state of a complex workflow?"**\r
\r
For example:\r
\r
\`\`\`python\r
class AgentState(TypedDict):\r
\r
    user_query: str\r
    intent: str\r
    context: list\r
    tool_results: list\r
    analysis: str\r
    retry_count: int\r
    validation_status: str\r
    final_response: str\r
\`\`\`\r
\r
The state moves through:\r
\r
\`\`\`text\r
Coordinator\r
     |\r
     v\r
Delegator\r
     |\r
     v\r
Worker\r
     |\r
     v\r
Validator\r
     |\r
     v\r
Updated State\r
\`\`\`\r
\r
This becomes important for long-running workflows, retries, human approval, and recovery.\r
\r
---\r
\r
# 3. Multi-Agent Architecture\r
\r
I asked:\r
\r
> **"Can the framework support our coordinator → delegator → worker architecture cleanly?"**\r
\r
Our architecture:\r
\r
\`\`\`text\r
                    Coordinator\r
                         |\r
          +--------------+--------------+\r
          |              |              |\r
          v              v              v\r
      Delegator A    Delegator B    Delegator C\r
          |              |              |\r
          v              v              v\r
       Workers        Workers        Workers\r
\`\`\`\r
\r
I didn't want agents simply communicating in a conversation.\r
\r
I wanted the **architecture itself to define the execution flow**.\r
\r
This is why LangGraph's graph abstraction was attractive.\r
\r
---\r
\r
# 4. Conditional Routing\r
\r
I evaluated whether I could implement routing explicitly.\r
\r
For example:\r
\r
\`\`\`python\r
if intent == "incident":\r
    route_to_incident()\r
\r
elif intent == "knowledge":\r
    route_to_knowledge()\r
\r
elif intent == "analytics":\r
    route_to_analytics()\r
\`\`\`\r
\r
Conceptually:\r
\r
\`\`\`text\r
                 Coordinator\r
                      |\r
                Conditional\r
                  Routing\r
                /    |    \\\r
               /     |     \\\r
              v      v      v\r
         Incident Knowledge Analytics\r
\`\`\`\r
\r
This is important because enterprise workflows often aren't simply:\r
\r
\`\`\`text\r
A → B → C\r
\`\`\`\r
\r
They are:\r
\r
\`\`\`text\r
             A\r
          /  |  \\\r
         B   C   D\r
        / \\      |\r
       E   F     G\r
        \\  |    /\r
           H\r
           |\r
         Retry\r
           |\r
           B\r
\`\`\`\r
\r
The framework must handle that complexity cleanly.\r
\r
---\r
\r
# 5. Reliability and Recovery\r
\r
I evaluated:\r
\r
> **"What happens when an agent, tool, API, or model call fails?"**\r
\r
For example:\r
\r
\`\`\`text\r
Worker\r
  |\r
  v\r
Enterprise API\r
  |\r
  +---- Success ---> Validator\r
  |\r
  +---- Failure ---> Retry\r
                         |\r
                         v\r
                       Worker\r
\`\`\`\r
\r
I wanted the framework to support:\r
\r
* Retries\r
* Checkpointing\r
* Recovery\r
* Timeouts\r
* Error handling\r
* Resuming interrupted workflows\r
\r
This becomes especially important when workflows are long-running or interact with enterprise systems. Current framework comparisons also identify state/recovery and durable execution as key differentiators for production agent systems.\r
\r
---\r
\r
# 6. Human-in-the-Loop\r
\r
For enterprise AI, I asked:\r
\r
> **"Can a human intervene before a high-impact action?"**\r
\r
For example:\r
\r
\`\`\`text\r
Agent\r
 |\r
 v\r
Recommendation\r
 |\r
 v\r
Human Approval\r
   /     \\\r
  /       \\\r
Approve   Reject\r
  |         |\r
  v         v\r
Execute     Stop\r
\`\`\`\r
\r
This matters for:\r
\r
* Production changes\r
* Security operations\r
* Financial actions\r
* Customer-impacting operations\r
* Compliance-sensitive decisions\r
\r
Human-in-the-loop is therefore not just a feature; it is part of the **enterprise control model**.\r
\r
---\r
\r
# 7. Model / Provider Flexibility\r
\r
I also asked:\r
\r
> **"Are we locking our orchestration architecture to one LLM provider?"**\r
\r
Our target architecture could use:\r
\r
\`\`\`text\r
             Agentic Layer\r
                  |\r
       +----------+----------+\r
       |          |          |\r
     Azure       AWS       Other\r
       |          |          |\r
 Azure OpenAI  Bedrock    Other LLM\r
\`\`\`\r
\r
So I preferred an orchestration layer that could remain relatively independent from the underlying model.\r
\r
This was particularly important because framework choices differ in model/provider orientation. Current comparisons identify LangGraph as multi-provider while OpenAI Agents SDK is naturally optimized around the OpenAI ecosystem.\r
\r
---\r
\r
# 8. Tool and Protocol Integration\r
\r
For enterprise Agentic AI, the framework needs to work with:\r
\r
\`\`\`text\r
Tools\r
 APIs\r
 Databases\r
 RAG\r
 MCP\r
 A2A\r
 Enterprise Services\r
\`\`\`\r
\r
For our architecture:\r
\r
\`\`\`text\r
Worker\r
  |\r
  +---- RAG\r
  |\r
  +---- MCP Tool\r
  |\r
  +---- REST API\r
  |\r
  +---- Database\r
  |\r
  +---- Enterprise Service\r
\`\`\`\r
\r
I therefore evaluated:\r
\r
* MCP support\r
* Tool calling\r
* API integration\r
* Database integration\r
* RAG integration\r
* Agent-to-agent communication\r
\r
Enterprise framework-selection guidance specifically calls out MCP/A2A support as an important evaluation dimension.\r
\r
---\r
\r
# 9. Observability\r
\r
This is a **very important interview point**.\r
\r
I asked:\r
\r
> **"When the agent makes a wrong decision in production, can we understand why?"**\r
\r
I wanted visibility into:\r
\r
\`\`\`text\r
User Request\r
     |\r
     v\r
Coordinator\r
     |\r
     v\r
Routing Decision\r
     |\r
     v\r
Worker\r
     |\r
     v\r
Tool Call\r
     |\r
     v\r
LLM Call\r
     |\r
     v\r
Validation\r
\`\`\`\r
\r
We need to know:\r
\r
* Which agent ran?\r
* Which tool was selected?\r
* What was the input?\r
* What was the output?\r
* How many LLM calls occurred?\r
* How many tokens were consumed?\r
* Where did latency occur?\r
* Why did the workflow fail?\r
\r
Production observability and debugging are specifically highlighted as major framework-selection criteria.\r
\r
---\r
\r
# 10. Security and Governance\r
\r
For enterprise deployment, I evaluated:\r
\r
\`\`\`text\r
Authentication\r
Authorization\r
RBAC\r
Secrets Management\r
PII Protection\r
Data Access\r
Tool Permissions\r
Audit Logs\r
Guardrails\r
\`\`\`\r
\r
For example:\r
\r
\`\`\`text\r
User\r
 |\r
 v\r
Agent\r
 |\r
 +---- Allowed Tool\r
 |\r
 +---- Restricted Tool → DENIED\r
 |\r
 +---- Sensitive API → Approval Required\r
\`\`\`\r
\r
An agent should not automatically have unrestricted access to enterprise systems.\r
\r
So framework selection must consider how well it fits our **security and governance architecture**, not just how easily it creates an agent.\r
\r
---\r
\r
# 11. Scalability and Production Readiness\r
\r
I asked:\r
\r
> **"Can this move from a prototype to production?"**\r
\r
I evaluated:\r
\r
\`\`\`text\r
Prototype\r
   ↓\r
Development\r
   ↓\r
Testing\r
   ↓\r
Production\r
   ↓\r
Scale\r
\`\`\`\r
\r
Specifically:\r
\r
* Long-running workflows\r
* Concurrent execution\r
* Persistence\r
* Failure recovery\r
* Deployment model\r
* Containerization\r
* Kubernetes compatibility\r
* Cloud deployment\r
* Monitoring\r
\r
A framework that is excellent for a 100-line demo isn't necessarily the right choice for an enterprise platform.\r
\r
---\r
\r
# 12. Developer Experience\r
\r
I evaluated:\r
\r
* Python/.NET/Java support\r
* Learning curve\r
* Documentation\r
* Testing\r
* Debugging\r
* Community\r
* Integration ecosystem\r
* Maintainability\r
\r
This matters because:\r
\r
\`\`\`text\r
Great Framework\r
       +\r
Wrong Team Skillset\r
       =\r
Poor Production Outcome\r
\`\`\`\r
\r
Framework selection should therefore consider the engineering team's existing skills.\r
\r
---\r
\r
# 13. Ecosystem and Community\r
\r
I also looked at:\r
\r
\`\`\`text\r
GitHub activity\r
Documentation\r
Community\r
Integrations\r
Examples\r
Enterprise adoption\r
Release cadence\r
Support\r
\`\`\`\r
\r
But I would **not make GitHub stars the primary criterion**.\r
\r
Popularity tells me something about ecosystem maturity, but it doesn't tell me whether the framework fits my architecture.\r
\r
---\r
\r
# 14. Cost and Operational Efficiency\r
\r
Agentic systems can become expensive quickly.\r
\r
I evaluated:\r
\r
\`\`\`text\r
LLM calls\r
Token consumption\r
Agent loops\r
Tool calls\r
Infrastructure\r
Observability\r
Storage\r
Vector DB\r
\`\`\`\r
\r
For example:\r
\r
\`\`\`text\r
Bad Architecture\r
\r
Agent A\r
  ↓\r
Agent B\r
  ↓\r
Agent C\r
  ↓\r
Agent A\r
  ↓\r
Agent B\r
  ↓\r
Agent C\r
  ↓\r
$$$$$$$$\r
\`\`\`\r
\r
So I wanted to understand whether the framework gave me enough control to prevent unnecessary agent loops and tool calls.\r
\r
---\r
\r
# 15. Framework Lock-In\r
\r
I asked:\r
\r
> **"How difficult will it be to replace this framework later?"**\r
\r
For example:\r
\r
\`\`\`text\r
Application\r
     |\r
     v\r
Business Logic\r
     |\r
     v\r
Agent Abstraction\r
     |\r
     v\r
Framework\r
\`\`\`\r
\r
I wanted business logic to remain separate from framework-specific code wherever practical.\r
\r
That makes future migration easier.\r
\r
---\r
\r
# 16. My Evaluation Scorecard\r
\r
For your interview, you can show this:\r
\r
| Criteria                 | Weight | LangGraph |\r
| ------------------------ | -----: | --------: |\r
| Workflow orchestration   |    20% |     ⭐⭐⭐⭐⭐ |\r
| State management         |    15% |     ⭐⭐⭐⭐⭐ |\r
| Multi-agent architecture |    10% |     ⭐⭐⭐⭐⭐ |\r
| Reliability / recovery   |    10% |     ⭐⭐⭐⭐⭐ |\r
| Model flexibility        |    10% |     ⭐⭐⭐⭐⭐ |\r
| Tool / MCP integration   |    10% |      ⭐⭐⭐⭐ |\r
| Observability            |    10% |     ⭐⭐⭐⭐⭐ |\r
| Security / governance    |     5% |      ⭐⭐⭐⭐ |\r
| Scalability / production |     5% |     ⭐⭐⭐⭐⭐ |\r
| Developer experience     |     5% |      ⭐⭐⭐⭐ |\r
\r
**Important:** These are an example of how I would structure the decision—not an objective industry benchmark.\r
\r
---\r
\r
# 17. Then I Compared the Frameworks\r
\r
My shortlist would be:\r
\r
\`\`\`text\r
                Agentic AI Framework\r
                        |\r
        +---------------+---------------+\r
        |       |       |       |       |\r
        v       v       v       v       v\r
    LangGraph CrewAI AutoGen  SK   OpenAI SDK\r
\`\`\`\r
\r
I evaluated each against the same criteria.\r
\r
### CrewAI\r
\r
Strong for:\r
\r
\`\`\`text\r
Role-based agents\r
Tasks\r
Teams\r
Fast prototyping\r
\`\`\`\r
\r
But our architecture needed more explicit workflow/state control.\r
\r
### AutoGen\r
\r
Strong for:\r
\r
\`\`\`text\r
Agent communication\r
Multi-agent collaboration\r
Message-driven systems\r
\`\`\`\r
\r
But our requirement was more workflow-centric.\r
\r
### Semantic Kernel\r
\r
Strong for:\r
\r
\`\`\`text\r
Enterprise integration\r
Microsoft ecosystem\r
Plugins\r
Functions\r
.NET\r
\`\`\`\r
\r
Very attractive for Microsoft-heavy environments.\r
\r
### OpenAI Agents SDK\r
\r
Strong for:\r
\r
\`\`\`text\r
OpenAI-native applications\r
Tools\r
Handoffs\r
Guardrails\r
Sessions\r
Tracing\r
\`\`\`\r
\r
Very attractive if the architecture is strongly OpenAI-centric.\r
\r
### LangGraph\r
\r
Strong for:\r
\r
\`\`\`text\r
Stateful workflows\r
Graph orchestration\r
Conditional routing\r
Loops\r
Retries\r
Persistence\r
Human-in-the-loop\r
\`\`\`\r
\r
That aligned closely with our architecture. Current framework comparisons similarly position LangGraph around stateful graph orchestration, CrewAI around role-based collaboration, and OpenAI Agents SDK around lightweight agent delegation.\r
\r
---\r
\r
# 18. The Decision Process\r
\r
I would explain the process as:\r
\r
\`\`\`text\r
Business Requirements\r
        |\r
        v\r
Architecture Requirements\r
        |\r
        v\r
Define Evaluation Criteria\r
        |\r
        v\r
Shortlist 2–4 Frameworks\r
        |\r
        v\r
Build Proof of Concept\r
        |\r
        v\r
Evaluate Real Workflow\r
        |\r
        v\r
Security + Performance Testing\r
        |\r
        v\r
Production Readiness\r
        |\r
        v\r
Framework Selection\r
\`\`\`\r
\r
I would **not** select a framework simply by reading feature lists.\r
\r
I would build a small POC using the **actual enterprise workflow**.\r
\r
---\r
\r
# 19. My Final Decision\r
\r
For our CWD system:\r
\r
\`\`\`text\r
Requirement\r
     |\r
     v\r
Hierarchical Multi-Agent\r
     |\r
     v\r
Coordinator\r
     |\r
     v\r
Delegators\r
     |\r
     v\r
Workers\r
     |\r
     v\r
RAG + Tools\r
     |\r
     v\r
Validation\r
     |\r
     v\r
Retry / Recovery\r
\`\`\`\r
\r
The dominant requirement was:\r
\r
> **Explicit, stateful workflow orchestration.**\r
\r
Therefore:\r
\r
\`\`\`text\r
                 Framework Selection\r
                        |\r
                        v\r
                 Dominant Constraint\r
                        |\r
                        v\r
             Stateful Workflow Control\r
                        |\r
                        v\r
                    LangGraph\r
\`\`\`\r
\r
---\r
\r
# Best 45-Second Interview Answer\r
\r
> **"I used a weighted evaluation rather than choosing a framework based on popularity. My criteria were orchestration model, state management, multi-agent support, conditional routing, reliability and recovery, model-provider flexibility, tool and MCP integration, observability, security and governance, scalability, developer experience, and long-term maintainability.**\r
>\r
> **For our CWD enterprise assistant, the highest-weight criteria were workflow orchestration and state management because we had a coordinator, multiple delegators and specialized workers with branching, retries, validation and persistence requirements.**\r
>\r
> **I compared LangGraph with CrewAI, AutoGen, Semantic Kernel and OpenAI Agents SDK using the same criteria and validated the decision with a proof of concept. LangGraph provided the best fit because its state-graph model gave us explicit control over nodes, transitions, conditional routing and recovery while remaining relatively model-provider agnostic.**\r
>\r
> **So the decision was not 'LangGraph is the best framework.' The decision was 'LangGraph best matched our dominant architectural constraint.' That is how I approach framework selection as a Solution Architect."**\r
\r
---\r
\r
# The One Sentence to Memorize\r
\r
> **"I don't choose an Agentic AI framework based on features; I choose it based on the dominant architectural constraint, then validate that choice against production, security, observability, scalability, and maintainability requirements."**\r
\r
### Your 10 criteria to remember\r
\r
\`\`\`text\r
1. Orchestration\r
2. State Management\r
3. Multi-Agent Support\r
4. Reliability & Recovery\r
5. Model Flexibility\r
6. Tool / MCP / A2A Integration\r
7. Observability\r
8. Security & Governance\r
9. Scalability / Production Readiness\r
10. Developer Experience & Maintainability\r
\`\`\`\r
`,code:``},{id:`langgraph-limitations`,category:`Agentic AI Frameworks`,title:`What are the limitations of LangGraph?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the limitations and trade-offs of LangGraph for enterprise Agentic AI systems, including workflow complexity, state management, debugging, scalability, framework dependency, operational overhead, and when a simpler approach may be more appropriate.`,concept:`# What Are the Limitations of LangGraph?\r
\r
## Interview Question\r
\r
**"What are the limitations of LangGraph?"**\r
\r
## Strong Interview Answer\r
\r
> **"LangGraph is very powerful for complex, stateful agent workflows, but it is not the best choice for every use case. Its biggest limitation is that it is a relatively low-level orchestration framework. That gives us a lot of control, but it also means more design and implementation responsibility for the development team.**\r
>\r
> **For simple agent applications, LangGraph can introduce unnecessary complexity. We have to explicitly think about state schemas, nodes, edges, routing, persistence, checkpoints, retries and failure handling.**\r
>\r
> **Another consideration is that the more complex the graph becomes, the harder it can be to reason about and test. There can also be operational overhead around persistence, state management, observability and long-running workflows.**\r
>\r
> **So I wouldn't use LangGraph just because it's popular. I would use it when the application actually requires explicit stateful orchestration, branching, retries, persistence or human-in-the-loop workflows. For simpler agent-tool workflows, a higher-level framework or SDK can provide a better developer experience."**\r
\r
---\r
\r
# 1. It Is Low-Level\r
\r
This is the **most important limitation**.\r
\r
LangGraph itself describes its architecture as a **low-level orchestration framework and runtime** focused on agent orchestration. It intentionally does not abstract away your prompts or overall agent architecture.\r
\r
That gives you control:\r
\r
\`\`\`text\r
State\r
  ↓\r
Node\r
  ↓\r
Edge\r
  ↓\r
Conditional Edge\r
  ↓\r
Node\r
  ↓\r
Checkpoint\r
\`\`\`\r
\r
But you have to design those pieces yourself.\r
\r
For example:\r
\r
\`\`\`python\r
graph.add_node("coordinator", coordinator)\r
graph.add_node("worker", worker)\r
\r
graph.add_edge(START, "coordinator")\r
\r
graph.add_conditional_edges(\r
    "coordinator",\r
    route_request\r
)\r
\r
graph.add_edge("worker", END)\r
\`\`\`\r
\r
For a small application, this can feel like **too much ceremony**.\r
\r
### Interview statement\r
\r
> **"The biggest trade-off is that LangGraph gives us control at the cost of abstraction."**\r
\r
---\r
\r
# 2. More Boilerplate for Simple Use Cases\r
\r
Suppose your requirement is simply:\r
\r
\`\`\`text\r
User\r
 ↓\r
LLM\r
 ↓\r
Tool\r
 ↓\r
Response\r
\`\`\`\r
\r
You don't necessarily need a complex graph.\r
\r
A higher-level agent framework can make that much simpler.\r
\r
LangChain's own documentation recommends higher-level agents when you want straightforward agent applications without complex orchestration needs.\r
\r
So:\r
\r
\`\`\`text\r
Simple Agent\r
     ↓\r
Higher-level Agent Framework\r
\`\`\`\r
\r
can be preferable to:\r
\r
\`\`\`text\r
Simple Agent\r
     ↓\r
StateGraph\r
     ↓\r
Nodes\r
     ↓\r
Edges\r
     ↓\r
Checkpointing\r
\`\`\`\r
\r
---\r
\r
# 3. Complex Graphs Can Become Difficult to Maintain\r
\r
This is particularly important for your **Coordinator → Delegator → Worker** architecture.\r
\r
Initially:\r
\r
\`\`\`text\r
Coordinator\r
    |\r
    v\r
Delegator\r
    |\r
    v\r
Worker\r
\`\`\`\r
\r
is easy.\r
\r
But imagine:\r
\r
\`\`\`text\r
                         Coordinator\r
                       /      |       \\\r
                      /       |        \\\r
               Delegator A  Delegator B  Delegator C\r
                  /  \\         /  \\         /  \\\r
                 W1   W2      W3   W4      W5   W6\r
                  \\    |       |    /        \\   |\r
                   \\   |       |   /          \\  |\r
                    +--+-------+--+-------------+\r
                              |\r
                          Validator\r
                         /        \\\r
                        /          \\\r
                     Retry       Success\r
                      |\r
                      +----------> Worker\r
\`\`\`\r
\r
As the graph grows:\r
\r
* More states\r
* More transitions\r
* More conditional routing\r
* More failure paths\r
* More testing combinations\r
\r
become necessary.\r
\r
The architecture can become difficult to understand if the graph is not carefully modularized.\r
\r
### Interview statement\r
\r
> **"LangGraph scales well in capability, but graph complexity itself becomes an architectural concern."**\r
\r
---\r
\r
# 4. State Management Requires Careful Design\r
\r
LangGraph's power comes partly from state.\r
\r
A typical state might look like:\r
\r
\`\`\`python\r
class AgentState(TypedDict):\r
    query: str\r
    intent: str\r
    context: list\r
    tool_results: list\r
    retry_count: int\r
    final_response: str\r
\`\`\`\r
\r
But in a large enterprise application, you need to decide:\r
\r
\`\`\`text\r
What belongs in state?\r
What should not be stored?\r
How large can the state become?\r
Who can modify each field?\r
How is state versioned?\r
How is sensitive information protected?\r
\`\`\`\r
\r
LangGraph's persistence system checkpoints graph state and uses thread identifiers to manage persisted executions.\r
\r
That is powerful, but it introduces another architectural responsibility.\r
\r
---\r
\r
# 5. Persistence Adds Operational Complexity\r
\r
Persistence is one of LangGraph's strengths:\r
\r
\`\`\`text\r
Graph\r
  |\r
  v\r
Checkpoint\r
  |\r
  v\r
Database\r
\`\`\`\r
\r
It enables:\r
\r
* Fault recovery\r
* Human-in-the-loop\r
* Memory\r
* Time travel/debugging\r
* Resume after interruption\r
\r
But production systems now need to think about:\r
\r
\`\`\`text\r
Checkpoint Storage\r
       |\r
       +--- Database\r
       |\r
       +--- Retention\r
       |\r
       +--- Encryption\r
       |\r
       +--- Backup\r
       |\r
       +--- Cleanup\r
       |\r
       +--- Access Control\r
\`\`\`\r
\r
LangGraph documents checkpoint-based persistence as a foundation for human-in-the-loop, memory, time travel and fault tolerance.\r
\r
### Architect-level point\r
\r
> **"Persistence solves reliability problems, but persistence itself becomes an operational responsibility."**\r
\r
---\r
\r
# 6. Observability Often Requires Additional Infrastructure\r
\r
When your graph becomes complex, you need to understand:\r
\r
\`\`\`text\r
User\r
 ↓\r
Coordinator\r
 ↓\r
Delegator\r
 ↓\r
Worker\r
 ↓\r
RAG\r
 ↓\r
LLM\r
 ↓\r
Validator\r
\`\`\`\r
\r
You need visibility into:\r
\r
* Node execution\r
* State changes\r
* LLM calls\r
* Token usage\r
* Latency\r
* Tool calls\r
* Errors\r
* Retries\r
\r
LangGraph integrates with LangSmith for tracing and evaluation, but that means your enterprise observability architecture may include an additional platform. LangGraph's documentation explicitly positions LangSmith as its observability/evaluation companion.\r
\r
So the limitation isn't:\r
\r
> "LangGraph has no observability."\r
\r
Rather:\r
\r
> **"Advanced observability may require additional tooling and architecture."**\r
\r
---\r
\r
# 7. Framework-Specific Code Can Increase Coupling\r
\r
Suppose you write:\r
\r
\`\`\`python\r
from langgraph.graph import StateGraph\r
\`\`\`\r
\r
and build most of your business logic directly around:\r
\r
\`\`\`text\r
StateGraph\r
Node\r
Edge\r
Command\r
Checkpoint\r
Interrupt\r
\`\`\`\r
\r
Your application can become tightly coupled to LangGraph.\r
\r
Later, if you want to migrate:\r
\r
\`\`\`text\r
LangGraph\r
    ↓\r
OpenAI Agents SDK\r
\`\`\`\r
\r
or:\r
\r
\`\`\`text\r
LangGraph\r
    ↓\r
Semantic Kernel\r
\`\`\`\r
\r
you may need to rewrite portions of the orchestration layer.\r
\r
### Better architecture\r
\r
Keep:\r
\r
\`\`\`text\r
Business Logic\r
      |\r
      v\r
Agent Interface\r
      |\r
      v\r
LangGraph\r
\`\`\`\r
\r
rather than putting all business logic directly inside graph-specific code.\r
\r
---\r
\r
# 8. Not Every Workflow Needs an LLM Agent\r
\r
This is a very important architecture point.\r
\r
Sometimes developers create:\r
\r
\`\`\`text\r
LLM Agent\r
   ↓\r
Decision\r
   ↓\r
Tool\r
\`\`\`\r
\r
when a normal deterministic function would be better:\r
\r
\`\`\`python\r
if request_type == "invoice":\r
    call_invoice_service()\r
\`\`\`\r
\r
You don't need an LLM for every decision.\r
\r
A good enterprise architecture uses:\r
\r
\`\`\`text\r
Deterministic Logic\r
        +\r
LLM Reasoning\r
        +\r
Agent Orchestration\r
\`\`\`\r
\r
not:\r
\r
\`\`\`text\r
LLM Everywhere\r
\`\`\`\r
\r
LangGraph supports deterministic and agentic workflows, but it doesn't automatically determine which logic should be deterministic. That remains the architect's responsibility.\r
\r
---\r
\r
# 9. Performance and Latency Can Become a Concern\r
\r
Agentic workflows can involve:\r
\r
\`\`\`text\r
Coordinator\r
 ↓\r
Delegator\r
 ↓\r
Worker\r
 ↓\r
LLM\r
 ↓\r
Tool\r
 ↓\r
LLM\r
 ↓\r
Validator\r
 ↓\r
LLM\r
\`\`\`\r
\r
Every additional step can add latency.\r
\r
For example:\r
\r
\`\`\`text\r
Coordinator      500 ms\r
     +\r
Delegator        500 ms\r
     +\r
Worker           800 ms\r
     +\r
RAG              300 ms\r
     +\r
LLM             1500 ms\r
     +\r
Validator        700 ms\r
-----------------------\r
Total            ~4.3 sec\r
\`\`\`\r
\r
If you add multiple sequential agents, latency can grow quickly.\r
\r
Therefore, I would optimize with:\r
\r
\`\`\`text\r
Parallel Execution\r
Caching\r
Smaller Models\r
Deterministic Routing\r
Reduced Agent Calls\r
Streaming\r
\`\`\`\r
\r
LangGraph itself provides low-level orchestration rather than automatically optimizing your entire agent architecture.\r
\r
---\r
\r
# 10. Error Handling Still Requires Engineering\r
\r
LangGraph provides retries, timeouts and error-handling mechanisms, but you still need to design the correct policies.\r
\r
For example:\r
\r
\`\`\`text\r
API Failure\r
    |\r
    v\r
Retry\r
    |\r
    +--- Attempt 1\r
    |\r
    +--- Attempt 2\r
    |\r
    +--- Attempt 3\r
    |\r
    v\r
Fallback\r
\`\`\`\r
\r
You need to decide:\r
\r
\`\`\`text\r
What should retry?\r
How many times?\r
Which exceptions?\r
What is idempotent?\r
When should we fallback?\r
When should we stop?\r
\`\`\`\r
\r
Those are application-level decisions.\r
\r
---\r
\r
# 11. Persistence and Durability Have Trade-Offs\r
\r
Checkpointing is not free.\r
\r
You have to balance:\r
\r
\`\`\`text\r
Durability\r
    ↕\r
Performance\r
\`\`\`\r
\r
LangGraph provides different durability modes, including exit, async and sync approaches, with different consistency/performance trade-offs.\r
\r
So you need to decide:\r
\r
\`\`\`text\r
Do we need every intermediate state persisted?\r
       OR\r
Can we tolerate losing some intermediate progress?\r
\`\`\`\r
\r
For a high-throughput workflow, blindly checkpointing everything may not be the optimal architecture.\r
\r
---\r
\r
# 12. Subgraph Design Can Become Complex\r
\r
For your hierarchical architecture, you may create:\r
\r
\`\`\`text\r
Parent Graph\r
     |\r
     +--- Coordinator Subgraph\r
     |\r
     +--- Knowledge Subgraph\r
     |\r
     +--- Incident Subgraph\r
     |\r
     +--- Analytics Subgraph\r
\`\`\`\r
\r
This improves modularity, but introduces additional considerations around:\r
\r
* State boundaries\r
* Persistence\r
* Memory\r
* Checkpoint namespaces\r
* Reusing subgraphs\r
\r
LangGraph's documentation explicitly notes different persistence behaviors for per-invocation, per-thread and stateless subgraphs.\r
\r
### Interview statement\r
\r
> **"Subgraphs help modularize large systems, but state and persistence boundaries need to be designed carefully."**\r
\r
---\r
\r
# 13. It Has a Learning Curve\r
\r
A developer has to understand:\r
\r
\`\`\`text\r
State\r
Nodes\r
Edges\r
Conditional Edges\r
Reducers\r
Commands\r
Interrupts\r
Checkpoints\r
Threads\r
Subgraphs\r
Persistence\r
\`\`\`\r
\r
before they can comfortably build sophisticated workflows.\r
\r
That's more complex than:\r
\r
\`\`\`python\r
agent.run()\r
\`\`\`\r
\r
This is why I wouldn't introduce LangGraph to every simple GenAI project.\r
\r
---\r
\r
# 14. Some Features Have Runtime/Language-Specific Constraints\r
\r
The current documentation, for example, notes that certain fault-tolerance capabilities such as node timeouts and error handlers are available in Python but not in the JavaScript/TypeScript SDK, while retry policies work in both.\r
\r
So if your organization has:\r
\r
\`\`\`text\r
Python Team\r
+\r
TypeScript Team\r
\`\`\`\r
\r
you need to verify feature parity before standardizing on a particular implementation.\r
\r
---\r
\r
# 15. LangGraph Doesn't Solve LLM Problems\r
\r
This is probably the most important conceptual limitation.\r
\r
LangGraph can control:\r
\r
\`\`\`text\r
Workflow\r
State\r
Routing\r
Persistence\r
Retries\r
\`\`\`\r
\r
But it doesn't automatically solve:\r
\r
\`\`\`text\r
Hallucination\r
Poor prompts\r
Bad model selection\r
Incorrect tool selection\r
Low-quality RAG\r
Prompt injection\r
Incorrect reasoning\r
Bad evaluation\r
\`\`\`\r
\r
For example:\r
\r
\`\`\`text\r
LangGraph\r
    ↓\r
LLM\r
    ↓\r
Hallucinated Answer\r
\`\`\`\r
\r
The graph doesn't magically make the LLM correct.\r
\r
You still need:\r
\r
\`\`\`text\r
RAG\r
+\r
Guardrails\r
+\r
Evaluation\r
+\r
Validation\r
+\r
Prompt Engineering\r
+\r
Model Selection\r
+\r
Security\r
\`\`\`\r
\r
---\r
\r
# 16. LangGraph Is Not the Entire Enterprise Platform\r
\r
This is an excellent Solution Architect distinction.\r
\r
Don't think:\r
\r
\`\`\`text\r
LangGraph\r
   =\r
Complete Agentic AI Platform\r
\`\`\`\r
\r
Instead:\r
\r
\`\`\`text\r
                  Enterprise AI Platform\r
\r
       +--------------------------------------+\r
       |             Application              |\r
       +--------------------------------------+\r
                       |\r
       +--------------------------------------+\r
       |        Agent Orchestration           |\r
       |             LangGraph                |\r
       +--------------------------------------+\r
                       |\r
       +----------+----------+----------+\r
       |          |          |          |\r
      LLM        RAG       Tools      MCP\r
       |          |          |          |\r
     Azure      Vector     APIs      Servers\r
     OpenAI      DBs\r
\`\`\`\r
\r
LangGraph is primarily the **orchestration/runtime layer**, not your entire enterprise architecture.\r
\r
---\r
\r
# How I Would Explain the Limitations in Your Interview\r
\r
### Don't say:\r
\r
> ❌ "LangGraph is difficult."\r
\r
### Say:\r
\r
> **"LangGraph intentionally operates at a lower level. That gives us fine-grained control, but the trade-off is that the development team has more responsibility for workflow design, state management, persistence and operational concerns."**\r
\r
---\r
\r
# LangGraph Limitations vs Benefits\r
\r
| Limitation                   | Why It Happens                   | How I Address It                       |\r
| ---------------------------- | -------------------------------- | -------------------------------------- |\r
| Low-level                    | Gives fine-grained control       | Create reusable patterns               |\r
| More boilerplate             | Explicit graph definition        | Build framework templates              |\r
| Graph complexity             | Many nodes/edges                 | Modular subgraphs                      |\r
| State complexity             | Stateful architecture            | Define strict state contracts          |\r
| Persistence overhead         | Checkpointing                    | Choose appropriate durability          |\r
| Observability                | Complex execution                | LangSmith + enterprise monitoring      |\r
| Latency                      | Multiple agent/LLM calls         | Parallelism + routing + caching        |\r
| Framework coupling           | Graph-specific APIs              | Separate business logic                |\r
| Learning curve               | Many concepts                    | Team standards + reusable templates    |\r
| Migration effort             | Framework-specific orchestration | Abstraction layer                      |\r
| Doesn't solve hallucination  | Orchestration ≠ reasoning        | RAG + validation + evaluation          |\r
| Not needed for simple agents | Powerful abstraction             | Use simpler framework when appropriate |\r
\r
---\r
\r
# Best 30-Second Interview Answer\r
\r
> **"The main limitation of LangGraph is that it's a relatively low-level framework. That gives us excellent control over state, routing and workflow execution, but it also means more development and operational responsibility. For simple agent-tool workflows, it can be overkill. As the graph becomes more complex, state management, testing, persistence and observability also become more challenging.**\r
>\r
> **Another limitation is that LangGraph doesn't solve the underlying LLM problems such as hallucination, model quality or prompt injection; those require separate guardrails, RAG, evaluation and security controls.**\r
>\r
> **So I see LangGraph as a strong orchestration runtime for complex stateful workflows, but not as a universal solution for every Agentic AI application."**\r
\r
---\r
\r
# The Architect-Level Answer\r
\r
If the interviewer pushes further:\r
\r
> **"Every strength of LangGraph has a corresponding trade-off. Its fine-grained control creates more implementation complexity. Its persistence enables durability but introduces storage and operational concerns. Its flexible graph model supports complex workflows but can become difficult to maintain if the graph isn't modularized. Therefore, I would introduce LangGraph only when the business actually benefits from stateful, long-running, controlled orchestration."**\r
\r
### One sentence to memorize\r
\r
> **"LangGraph trades simplicity for control — and for complex enterprise workflows, I was willing to make that trade because control was more important than minimal code."**\r
`,code:``},{id:`when-not-langgraph`,category:`Agentic AI Frameworks`,title:`When would you not use LangGraph?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand scenarios where LangGraph may be unnecessary or introduce excessive complexity, and how to determine when a simpler LLM chain, deterministic workflow, traditional orchestration framework, or another Agentic AI framework is a better architectural choice.`,concept:``,code:``},{id:`build-own-agent-framework`,category:`Agentic AI Frameworks`,title:`Would you build your own Agentic AI orchestration framework? Why or why not?`,difficulty:`Advanced`,time:`~15 min`,description:`Evaluate the architectural, engineering, operational, and business trade-offs between adopting an existing Agentic AI framework and building a custom orchestration framework for enterprise applications.`,concept:``,code:``},{id:`why-a2a`,category:`Agentic AI Protocols`,title:`Why did you use A2A in your project?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural reasons for using Agent-to-Agent (A2A) communication to enable interoperability, capability discovery, task delegation, and communication between independently deployed AI agents in an enterprise multi-agent system.`,concept:``,code:``},{id:`a2a-vs-rest`,category:`Agentic AI Protocols`,title:`Why did you choose A2A instead of REST APIs for agent communication?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural differences between A2A and traditional REST APIs and the factors involved in choosing A2A for interoperable agent-to-agent communication, including agent capabilities, discovery, task delegation, asynchronous interactions, and loose coupling.`,concept:``,code:``},{id:`a2a-problem-solved`,category:`Agentic AI Protocols`,title:`What problem specifically did A2A solve in your architecture?`,difficulty:`Advanced`,time:`~15 min`,description:`Explain the specific architectural problem A2A addressed in a multi-agent enterprise system, including agent interoperability, capability discovery, task delegation, loose coupling, and communication between independently developed and deployed agents.`,concept:``,code:``},{id:`langgraph-a2a-combination`,category:`Agentic AI Architecture`,title:`Why did you use both LangGraph and A2A?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand why LangGraph and A2A can serve different architectural responsibilities, with LangGraph handling agent orchestration and workflow control while A2A enables communication and interoperability between agents.`,concept:``,code:``},{id:`langgraph-without-a2a`,category:`Agentic AI Architecture`,title:`Can LangGraph work without A2A?`,difficulty:`Advanced`,time:`~10 min`,description:`Understand whether LangGraph can independently orchestrate agents and workflows without using A2A, and identify scenarios where A2A may or may not be required.`,concept:``,code:``},{id:`a2a-without-langgraph`,category:`Agentic AI Architecture`,title:`Can A2A work without LangGraph?`,difficulty:`Advanced`,time:`~10 min`,description:`Understand whether A2A is independent of a specific agent orchestration framework and how agents can communicate through A2A while using different internal frameworks or implementations.`,concept:``,code:``},{id:`mcp-a2a-together`,category:`Agentic AI Protocols`,title:`Why did you use MCP and A2A together?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how MCP and A2A solve different integration problems and how they can work together in an enterprise multi-agent architecture.`,concept:``,code:``},{id:`when-not-a2a`,category:`Agentic AI Protocols`,title:`When would you not use A2A?`,difficulty:`Advanced`,time:`~15 min`,description:`Identify scenarios where A2A introduces unnecessary complexity and where direct function calls, REST APIs, messaging systems, or internal orchestration may be more appropriate.`,concept:``,code:``},{id:`multi-agent-vs-single-agent`,category:`Agentic AI Architecture`,title:`Why did you choose multi-agent instead of a single-agent architecture?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the architectural, functional, scalability, governance, and maintainability reasons for selecting a multi-agent architecture over a single general-purpose agent.`,concept:``,code:``},{id:`coordinator-delegator-worker`,category:`Multi-Agent Architecture`,title:`Why did you choose a Coordinator → Delegator → Worker architecture?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the reasons for using hierarchical agent orchestration with Coordinator, Delegator, and Worker layers and how this structure supports separation of responsibilities, routing, scalability, and governance.`,concept:``,code:``},{id:`coordinator-worker-direct`,category:`Multi-Agent Architecture`,title:`Why not use a Coordinator → Worker architecture directly?`,difficulty:`Advanced`,time:`~15 min`,description:`Evaluate the trade-offs between direct Coordinator-to-Worker routing and introducing Delegator agents for domain-level decomposition and specialized orchestration.`,concept:``,code:``},{id:`multiple-agent-layers`,category:`Multi-Agent Architecture`,title:`Why do you need multiple layers of agents?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand when multiple layers of agent orchestration are justified and how hierarchical decomposition can improve scalability, specialization, governance, and maintainability.`,concept:``,code:``},{id:`agent-count-decision`,category:`Multi-Agent Architecture`,title:`How did you decide the number of agents in your architecture?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to determine the appropriate number of agents based on business domains, responsibilities, tools, autonomy boundaries, complexity, latency, cost, and maintainability.`,concept:``,code:``},{id:`agent-boundaries`,category:`Multi-Agent Architecture`,title:`How did you define the responsibility and boundary of each agent?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to establish clear agent responsibilities, capabilities, tool ownership, permissions, input/output contracts, and boundaries in an enterprise multi-agent system.`,concept:``,code:``},{id:`why-hierarchical-agents`,category:`Multi-Agent Architecture`,title:`Why did you choose hierarchical agents?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand why hierarchical orchestration can be preferred for complex enterprise workloads requiring centralized coordination, domain-level delegation, specialized workers, and controlled execution.`,concept:``,code:``},{id:`hierarchical-vs-supervisor`,category:`Multi-Agent Architecture`,title:`Why not use a supervisor pattern?`,difficulty:`Advanced`,time:`~15 min`,description:`Compare hierarchical Coordinator → Delegator → Worker architecture with supervisor-based agent orchestration and evaluate their differences in routing, responsibility, scalability, and control.`,concept:``,code:``},{id:`hierarchical-vs-peer-to-peer`,category:`Multi-Agent Architecture`,title:`Why not use peer-to-peer agents?`,difficulty:`Advanced`,time:`~15 min`,description:`Compare hierarchical orchestration with decentralized peer-to-peer agent communication and evaluate the trade-offs in control, coordination, routing, observability, and scalability.`,concept:``,code:``},{id:`multi-agent-tradeoffs`,category:`Multi-Agent Architecture`,title:`What are the trade-offs of your multi-agent architecture?`,difficulty:`Advanced`,time:`~15 min`,description:`Evaluate the benefits and drawbacks of multi-agent architecture across latency, cost, complexity, reliability, observability, scalability, communication overhead, and maintenance.`,concept:``,code:``},{id:`agentic-overengineering`,category:`Agentic AI Architecture`,title:`Isn't your Agentic AI architecture over-engineered?`,difficulty:`Advanced`,time:`~15 min`,description:`Evaluate whether the selected agentic architecture is justified by business and technical requirements and how to defend architectural complexity with measurable value.`,concept:``,code:``},{id:`single-llm-vs-multi-agent`,category:`Agentic AI Architecture`,title:`Why can't a single powerful LLM perform all these tasks?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the limitations of using a single general-purpose LLM for complex enterprise workloads and when specialized agents provide advantages in responsibility isolation, permissions, tools, scalability, and governance.`,concept:``,code:``},{id:`framework-alternatives`,category:`Agentic AI Frameworks`,title:`What alternatives did you evaluate before selecting LangGraph?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to evaluate alternative Agentic AI frameworks such as LangChain, CrewAI, AutoGen, Semantic Kernel, and OpenAI Agents SDK before making an architectural decision.`,concept:``,code:``},{id:`langgraph-tradeoffs`,category:`Agentic AI Frameworks`,title:`What trade-offs did you accept by choosing LangGraph?`,difficulty:`Advanced`,time:`~15 min`,description:`Evaluate the trade-offs introduced by LangGraph, including workflow flexibility, state management, development complexity, observability, framework dependency, and operational overhead.`,concept:``,code:``},{id:`redesign-agentic-architecture`,category:`Agentic AI Architecture`,title:`What would you change if you redesigned the architecture today?`,difficulty:`Advanced`,time:`~15 min`,description:`Evaluate an existing Agentic AI architecture retrospectively and identify improvements in orchestration, communication, state management, security, scalability, observability, cost, and reliability.`,concept:``,code:``},{id:`simplify-agentic-architecture`,category:`Agentic AI Architecture`,title:`What component of your architecture would you remove if you had to simplify it?`,difficulty:`Advanced`,time:`~15 min`,description:`Assess which components of an enterprise Agentic AI architecture are essential versus optional and determine how to simplify the system while preserving core business capabilities.`,concept:``,code:``},{id:`biggest-agentic-limitation`,category:`Agentic AI Architecture`,title:`What is the biggest limitation of your current Agentic AI architecture?`,difficulty:`Advanced`,time:`~10 min`,description:`Identify and explain the most significant technical or operational limitation in a production multi-agent architecture and describe how it could be mitigated.`,concept:``,code:``},{id:`agentic-latency`,category:`Agentic AI Architecture`,title:`How does your architecture impact latency?`,difficulty:`Advanced`,time:`~15 min`,description:`Analyze how multiple agents, LLM calls, tool calls, retrieval, and inter-agent communication affect end-to-end latency and how the architecture can be optimized.`,concept:``,code:``},{id:`agentic-cost`,category:`Agentic AI Architecture`,title:`How does your architecture impact cost?`,difficulty:`Advanced`,time:`~15 min`,description:`Analyze the cost implications of multi-agent execution, model calls, tool calls, retrieval, communication, and infrastructure and identify strategies for controlling cost.`,concept:``,code:``},{id:`justify-agentic-complexity`,category:`Agentic AI Architecture`,title:`How do you justify the additional complexity of a multi-agent architecture?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to justify multi-agent architectural complexity through measurable business value, specialization, scalability, governance, reliability, and operational benefits.`,concept:``,code:``},{id:`coordinator-routing`,category:`Multi-Agent Architecture`,title:`How does your Coordinator decide which Delegator to invoke?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the routing mechanisms used by a Coordinator to identify the appropriate Delegator based on user intent, agent capabilities, context, policies, and task requirements.`,concept:``,code:``},{id:`delegator-worker-selection`,category:`Multi-Agent Architecture`,title:`How does the Delegator select the appropriate Worker?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how Delegator agents select Workers based on capabilities, task requirements, availability, policies, and execution context.`,concept:``,code:``},{id:`agent-discovery`,category:`Agentic AI Protocols`,title:`How does an agent discover another agent?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand agent discovery mechanisms, capability advertisement, agent registries, Agent Cards, service discovery, and dynamic selection of agents in distributed multi-agent systems.`,concept:``,code:``},{id:`agent-communication`,category:`Multi-Agent Architecture`,title:`How do your agents communicate with each other?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand the communication mechanisms between agents, including protocols, message formats, synchronous and asynchronous communication, task delegation, and result exchange.`,concept:``,code:``},{id:`cross-agent-state`,category:`Multi-Agent Architecture`,title:`How do you maintain state across agents?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how shared context, execution state, conversation state, checkpoints, and persistent state are managed across Coordinator, Delegator, and Worker agents.`,concept:``,code:``},{id:`worker-failure`,category:`Multi-Agent Reliability`,title:`How do you handle failure of a Worker agent?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand failure-handling strategies for Worker agents, including retries, timeouts, fallback agents, circuit breakers, task reassignment, compensation, and graceful degradation.`,concept:``,code:``},{id:`coordinator-wrong-routing`,category:`Multi-Agent Reliability`,title:`What happens if the Coordinator makes the wrong routing decision?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand how to detect, prevent, recover from, and monitor incorrect routing decisions made by a Coordinator in a multi-agent architecture.`,concept:``,code:``},{id:`conflicting-agent-results`,category:`Multi-Agent Reliability`,title:`What happens if two agents return conflicting answers?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand strategies for resolving conflicting outputs from multiple agents using validation, confidence scoring, evaluator agents, source verification, consensus, and human escalation.`,concept:``,code:``},{id:`agent-circular-dependency`,category:`Multi-Agent Reliability`,title:`How do you prevent agents from repeatedly calling each other?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand techniques for preventing circular delegation and infinite communication loops using execution limits, state tracking, correlation IDs, routing policies, and termination conditions.`,concept:``,code:``},{id:`agent-observability`,category:`Agentic AI Operations`,title:`How do you monitor and trace the complete multi-agent execution?`,difficulty:`Advanced`,time:`~15 min`,description:`Understand end-to-end observability for multi-agent systems, including distributed tracing, agent execution logs, tool calls, LLM calls, latency, token usage, failures, and business-level outcomes.`,concept:``,code:``}],Wh=[`All`,`Advanced`],Gh={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},Kh={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function qh({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function Jh({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function Yh({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:Kh[e.difficulty]||`#E6F1FB`,color:Gh[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function Xh({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:Kh[e.difficulty]||`#E6F1FB`,color:Gh[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(qh,{content:e.concept}),t===`code`&&(0,j.jsx)(Jh,{code:e.code})]})}function Zh({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:Wh.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(Yh,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function Qh(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:Uh.length},{label:`Patterns`,value:Wh.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function $h(){let[e,t]=(0,v.useState)(Uh[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(Qh,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(Zh,{recipes:Uh,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(Xh,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var eg=[{id:`websockets`,category:`Communication Protocols`,title:`WebSockets`,difficulty:`Intermediate`,time:`~20 min`,description:`Learn how WebSockets enable persistent, full-duplex communication between AI agents, applications, and servers for real-time data exchange and low-latency interactions.`,tags:[`websockets`,`real-time`,`communication`,`streaming`,`full duplex`,`networking`],concept:``,steps:[{label:`Establish Connection`,icon:`🤝`,detail:`The client initiates a WebSocket handshake to establish a persistent connection with the server.`},{label:`Maintain Connection`,icon:`🔗`,detail:`A continuous bidirectional communication channel remains open between the client and server.`},{label:`Exchange Messages`,icon:`💬`,detail:`Both the client and server can send and receive messages independently in real time.`},{label:`Process Events`,icon:`⚡`,detail:`Incoming messages are processed immediately, enabling live updates and event-driven communication.`},{label:`Close Connection`,icon:`✅`,detail:`The connection is gracefully closed after communication is complete or when either side disconnects.`}],code:``},{id:`event-streaming`,category:`Communication Protocols`,title:`Event Streaming`,difficulty:`Intermediate`,time:`~20 min`,description:`Learn how Event Streaming enables AI agents and distributed systems to process continuous streams of events in real time using event-driven architectures and message brokers.`,tags:[`event streaming`,`events`,`kafka`,`real-time`,`communication`,`pub-sub`],concept:``,steps:[{label:`Generate Event`,icon:`📢`,detail:`A producer creates an event whenever an important business action or system activity occurs.`},{label:`Publish Event`,icon:`📤`,detail:`The event is published to an event broker such as Kafka, Pulsar, or Event Hubs.`},{label:`Distribute Events`,icon:`📡`,detail:`The broker distributes the event to all subscribed consumers in real time.`},{label:`Process Event`,icon:`⚙️`,detail:`Consumers independently process the event and perform their respective tasks.`},{label:`Trigger Workflows`,icon:`✅`,detail:`Processed events initiate downstream actions, analytics, notifications, or AI workflows.`}],code:``},{id:`message-queues`,category:`Communication Protocols`,title:`Message Queues`,difficulty:`Intermediate`,time:`~20 min`,description:`Learn how Message Queues enable reliable asynchronous communication between AI agents, applications, and distributed services by decoupling message producers from consumers.`,tags:[`message queue`,`rabbitmq`,`sqs`,`asynchronous`,`messaging`,`communication`],concept:``,steps:[{label:`Produce Message`,icon:`📤`,detail:`A producer creates a task or event and places it into the message queue.`},{label:`Store Message`,icon:`📦`,detail:`The message queue safely stores the message until a consumer is ready to process it.`},{label:`Consume Message`,icon:`📥`,detail:`A consumer retrieves the message from the queue and begins processing the assigned task.`},{label:`Acknowledge Processing`,icon:`✔️`,detail:`After successful execution, the consumer sends an acknowledgment to remove the message from the queue.`},{label:`Complete Workflow`,icon:`✅`,detail:`The processed result is delivered to downstream services or returned to the AI agent for further actions.`}],code:``}],tg=[`All`,`Advanced`],ng={Beginner:`#0F6E56`,Intermediate:`#185FA5`,Advanced:`#993C1D`},rg={Beginner:`#E1F5EE`,Intermediate:`#E6F1FB`,Advanced:`#FAECE7`};function ig({content:e}){return(0,j.jsx)(`div`,{className:`prose max-w-none h-[75vh] overflow-y-auto p-6`,children:(0,j.jsx)(yl,{remarkPlugins:[gf],children:e||`No concept available for this recipe.`})})}function ag({code:e}){let[t,n]=(0,v.useState)(!1);return(0,j.jsxs)(`div`,{style:{position:`relative`,marginTop:16},children:[(0,j.jsx)(`button`,{onClick:async()=>{try{await navigator.clipboard.writeText(e||``),n(!0),setTimeout(()=>{n(!1)},1800)}catch(e){console.error(`Failed to copy code:`,e)}},style:{position:`absolute`,top:8,right:8,padding:`4px 10px`,borderRadius:6,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,cursor:`pointer`,fontSize:12,color:`var(--color-text-secondary)`,zIndex:1},children:t?`✓ Copied`:`Copy`}),(0,j.jsx)(`pre`,{style:{margin:0,padding:`14px 16px`,borderRadius:10,overflowX:`auto`,background:`var(--color-background-secondary)`,border:`0.5px solid var(--color-border-tertiary)`,fontSize:12,lineHeight:1.65,fontFamily:`var(--font-mono)`,color:`var(--color-text-primary)`,whiteSpace:`pre`},children:(0,j.jsx)(`code`,{children:e||`// No code available.`})})]})}function og({recipe:e,onSelect:t,selected:n}){return(0,j.jsxs)(`div`,{onClick:()=>t(e),style:{padding:`16px 18px`,borderRadius:12,cursor:`pointer`,border:n?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:n?`#061320`:`var(--color-background-primary)`,transition:`all 0.15s`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:6},children:[(0,j.jsx)(`span`,{style:{fontSize:13,color:`var(--color-text-secondary)`,fontWeight:400},children:e.category}),(0,j.jsx)(`span`,{style:{fontSize:11,padding:`2px 8px`,borderRadius:20,fontWeight:500,background:rg[e.difficulty]||`#E6F1FB`,color:ng[e.difficulty]||`#185FA5`},children:e.difficulty})]}),(0,j.jsx)(`div`,{style:{fontWeight:500,fontSize:15,marginBottom:4,color:`var(--color-text-primary)`},children:e.title}),(0,j.jsx)(`div`,{style:{fontSize:13,color:`var(--color-text-secondary)`,lineHeight:1.5},children:e.description})]})}function sg({recipe:e}){let[t,n]=(0,v.useState)(`concept`);return(0,j.jsxs)(`div`,{style:{padding:`24px`,borderRadius:14,background:`var(--color-background-primary)`,border:`0.5px solid var(--color-border-tertiary)`},children:[(0,j.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:4},children:[(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:e.category}),(0,j.jsx)(`h2`,{style:{margin:`4px 0 6px`,fontSize:22,fontWeight:500},children:e.title})]}),(0,j.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`,paddingTop:4},children:[(0,j.jsx)(`span`,{style:{fontSize:12,padding:`3px 10px`,borderRadius:20,fontWeight:500,background:rg[e.difficulty]||`#E6F1FB`,color:ng[e.difficulty]||`#185FA5`},children:e.difficulty}),e.time&&(0,j.jsxs)(`span`,{style:{fontSize:12,color:`var(--color-text-tertiary)`},children:[`⏱ `,e.time]})]})]}),(0,j.jsx)(`p`,{style:{margin:`0 0 20px`,color:`var(--color-text-secondary)`,fontSize:14,lineHeight:1.6},children:e.description}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:4,marginBottom:18,borderBottom:`0.5px solid var(--color-border-tertiary)`,paddingBottom:0},children:[`concept`,`code`].map(e=>(0,j.jsx)(`button`,{onClick:()=>n(e),style:{padding:`8px 16px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:14,fontWeight:t===e?500:400,color:t===e?`var(--color-text-primary)`:`var(--color-text-secondary)`,borderBottom:t===e?`2px solid #185FA5`:`2px solid transparent`,marginBottom:-1,transition:`all 0.12s`},children:e===`concept`?`Concept`:`Code`},e))}),t===`concept`&&(0,j.jsx)(ig,{content:e.concept}),t===`code`&&(0,j.jsx)(ag,{code:e.code})]})}function cg({recipes:e,selected:t,onSelect:n,category:r,setCategory:i,search:a,setSearch:o}){let s=e.filter(e=>{let t=r===`All`||e.category===r,n=a.toLowerCase(),i=e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.category?.toLowerCase().includes(n);return t&&i});return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100%`,gap:0},children:[(0,j.jsx)(`div`,{style:{padding:`0 0 16px`},children:(0,j.jsx)(`input`,{type:`text`,placeholder:`Search questions…`,value:a,onChange:e=>o(e.target.value),style:{width:`100%`,boxSizing:`border-box`,padding:`8px 12px`,borderRadius:8,border:`0.5px solid var(--color-border-secondary)`,background:`var(--color-background-secondary)`,color:`var(--color-text-primary)`,fontSize:13}})}),(0,j.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`,marginBottom:16},children:tg.map(e=>(0,j.jsx)(`button`,{onClick:()=>i(e),style:{padding:`4px 12px`,borderRadius:20,fontSize:12,cursor:`pointer`,border:r===e?`1.5px solid #185FA5`:`0.5px solid var(--color-border-tertiary)`,background:r===e?`#E6F1FB`:`var(--color-background-primary)`,color:r===e?`#185FA5`:`var(--color-text-secondary)`,fontWeight:r===e?500:400},children:e},e))}),(0,j.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,overflowY:`auto`,flex:1},children:s.length===0?(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,fontSize:13,padding:`12px 0`},children:`No questions found.`}):s.map(e=>(0,j.jsx)(og,{recipe:e,onSelect:n,selected:t?.id===e.id},e.id))})]})}function lg(){return(0,j.jsxs)(`div`,{style:{padding:`20px 32px 16px`,borderBottom:`0.5px solid var(--color-border-tertiary)`,display:`flex`,alignItems:`center`,gap:16},children:[(0,j.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,background:`#E6F1FB`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:20},children:`📚`}),(0,j.jsxs)(`div`,{children:[(0,j.jsx)(`h1`,{style:{margin:0,fontSize:20,fontWeight:500,letterSpacing:`-0.3px`},children:`AgenticAI Cookbook`}),(0,j.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--color-text-secondary)`},children:`End-to-end Agentic AI`})]}),(0,j.jsx)(`div`,{style:{marginLeft:`auto`,display:`flex`,gap:20},children:[{label:`Questions`,value:eg.length},{label:`Patterns`,value:tg.length-1}].map(({label:e,value:t})=>(0,j.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,j.jsx)(`div`,{style:{fontSize:18,fontWeight:500},children:t}),(0,j.jsx)(`div`,{style:{fontSize:11,color:`var(--color-text-tertiary)`},children:e})]},e))})]})}function ug(){let[e,t]=(0,v.useState)(eg[0]),[n,r]=(0,v.useState)(`All`),[i,a]=(0,v.useState)(``);return(0,j.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,height:`100vh`,fontFamily:`var(--font-sans, system-ui, sans-serif)`,background:`var(--color-background-tertiary, radial-gradient(circle at top, #0f172a, #020617))`,color:`var(--color-text-primary)`},children:[(0,j.jsx)(lg,{}),(0,j.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,j.jsx)(`div`,{style:{width:320,minWidth:260,padding:`20px 20px`,borderRight:`0.5px solid var(--color-border-tertiary)`,background:`var(--color-background-primary)`,overflowY:`auto`},children:(0,j.jsx)(cg,{recipes:eg,selected:e,onSelect:t,category:n,setCategory:r,search:i,setSearch:a})}),(0,j.jsx)(`div`,{style:{flex:1,overflowY:`auto`,padding:`24px 28px`},children:e?(0,j.jsx)(sg,{recipe:e}):(0,j.jsx)(`div`,{style:{color:`var(--color-text-tertiary)`,padding:40,textAlign:`center`},children:`Select a question to get started`})})]})]})}var dg=`/GenAI-Architect-Playbook/assets/logo-DfeCIHVX.png`;function fg(){let[e,t]=(0,v.useState)(!1),n=(0,v.useRef)(null),r=yt(),i=[{name:`Agentic AI Fundamentals`,path:`/agentic-ai-fundamentals`},{name:`Single Agent Architecture`,path:`/single-agent-architecture`},{name:`Multi-Agent Systems`,path:`/multi-agent-systems`},{name:`LangGraph`,path:`/langgraph`},{name:`MCP`,path:`/mcp`},{name:`A2A`,path:`/a2a`},{name:`Agentic RAG`,path:`/agent-rag`},{name:`Planning & Reasoning`,path:`/planning-reasoning`},{name:`Memory`,path:`/memory`},{name:`Agent Evaluation`,path:`/agent-evaluation`},{name:`Production LLMOps`,path:`/production-llmops`},{name:`Security & Responsible AI`,path:`/security-responsible-ai`},{name:`Cloud Architecture`,path:`/cloud-architecture`},{name:`Enterprise Agent Architecture`,path:`/enterprise-agent-architecture`},{name:`Agentic System Design`,path:`/agentic-system-design`},{name:`Agentic Scenario Based`,path:`/agentic-scenario-based`},{name:`Agentic Project Questions`,path:`/agentic-own-project`},{name:`Top Questions`,path:`/top-questions`},{name:`GenAI Questions`,path:`/genai-questions`}];(0,v.useEffect)(()=>{let e=e=>{n.current&&!n.current.contains(e.target)&&t(!1)};return document.addEventListener(`mousedown`,e),()=>{document.removeEventListener(`mousedown`,e)}},[]),(0,v.useEffect)(()=>{let e=e=>{e.key===`Escape`&&t(!1)};return document.addEventListener(`keydown`,e),()=>{document.removeEventListener(`keydown`,e)}},[]),(0,v.useEffect)(()=>{t(!1)},[r.pathname]);let a=()=>{t(!1)};return(0,j.jsxs)(`nav`,{className:`navbar`,children:[(0,j.jsx)(`div`,{className:`logo`,children:(0,j.jsxs)(Nn,{to:`/`,className:`logo-link`,children:[(0,j.jsx)(`img`,{src:dg,alt:`IntelliCatalyst AI Labs`,className:`logo-icon`}),(0,j.jsxs)(`div`,{className:`logo-text`,children:[(0,j.jsx)(`span`,{className:`logo-white`,children:`IntelliCatalyst`}),(0,j.jsx)(`span`,{className:`logo-blue`,children:`AI Labs`})]})]})}),(0,j.jsxs)(`div`,{className:`menu`,children:[(0,j.jsx)(Nn,{to:`/`,onClick:()=>t(!1),children:`Home`}),(0,j.jsxs)(`div`,{className:`dropdown`,ref:n,children:[(0,j.jsxs)(`button`,{type:`button`,className:`dropdown-btn ${e?`open`:``}`,onClick:()=>t(e=>!e),"aria-expanded":e,"aria-haspopup":`true`,children:[`AgenticAI`,(0,j.jsx)(`span`,{className:`arrow`,children:`▼`})]}),e&&(0,j.jsx)(`div`,{className:`dropdown-content`,children:i.map(e=>(0,j.jsx)(Nn,{to:e.path,onClick:a,children:e.name},e.path))})]}),(0,j.jsx)(Nn,{to:`/books`,onClick:()=>t(!1),children:`Books`}),(0,j.jsx)(Nn,{to:`/about`,onClick:()=>t(!1),children:`About`})]})]})}function pg(){return(0,j.jsxs)(Mn,{basename:`/GenAI-Architect-Playbook`,children:[(0,j.jsx)(fg,{}),(0,j.jsxs)(qt,{children:[(0,j.jsx)(Gt,{path:`/`,element:(0,j.jsx)(Kn,{})}),(0,j.jsx)(Gt,{path:`/agentic-ai-fundamentals`,element:(0,j.jsx)(Df,{})}),(0,j.jsx)(Gt,{path:`/single-agent-architecture`,element:(0,j.jsx)(Rf,{})}),(0,j.jsx)(Gt,{path:`/multi-agent-systems`,element:(0,j.jsx)(Yf,{})}),(0,j.jsx)(Gt,{path:`/langgraph`,element:(0,j.jsx)(op,{})}),(0,j.jsx)(Gt,{path:`/mcp`,element:(0,j.jsx)(_p,{})}),(0,j.jsx)(Gt,{path:`/a2a`,element:(0,j.jsx)(Op,{})}),(0,j.jsx)(Gt,{path:`/agent-rag`,element:(0,j.jsx)(zp,{})}),(0,j.jsx)(Gt,{path:`/planning-reasoning`,element:(0,j.jsx)(Xp,{})}),(0,j.jsx)(Gt,{path:`/memory`,element:(0,j.jsx)(sm,{})}),(0,j.jsx)(Gt,{path:`/agent-evaluation`,element:(0,j.jsx)(vm,{})}),(0,j.jsx)(Gt,{path:`/production-llmops`,element:(0,j.jsx)(km,{})}),(0,j.jsx)(Gt,{path:`/security-responsible-ai`,element:(0,j.jsx)(Bm,{})}),(0,j.jsx)(Gt,{path:`/cloud-architecture`,element:(0,j.jsx)(Zm,{})}),(0,j.jsx)(Gt,{path:`/enterprise-agent-architecture`,element:(0,j.jsx)(ch,{})}),(0,j.jsx)(Gt,{path:`/agentic-system-design-questions`,element:(0,j.jsx)(vh,{})}),(0,j.jsx)(Gt,{path:`/agentic-scenario-based`,element:(0,j.jsx)(kh,{})}),(0,j.jsx)(Gt,{path:`/agentic-own-project`,element:(0,j.jsx)(Bh,{})}),(0,j.jsx)(Gt,{path:`/top-questions`,element:(0,j.jsx)($h,{})}),(0,j.jsx)(Gt,{path:`/genai-questions`,element:(0,j.jsx)(ug,{})})]})]})}(0,y.createRoot)(document.getElementById(`root`)).render((0,j.jsx)(v.StrictMode,{children:(0,j.jsx)(pg,{})}));