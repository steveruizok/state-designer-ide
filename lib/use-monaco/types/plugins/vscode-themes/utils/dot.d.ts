/**
 * Version of 'object' from 'dot-object' that doesn't mutate the existing variable.
 * It converts eg.
 *
 * ```js
 * { 'activityBar.background': '#ddd' }
 * to
 * { activityBar: {background: '#ddd' } }
 */
export declare function object(obj: any): any;
