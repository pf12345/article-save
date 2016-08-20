import assign from 'object-assign';
import {EventEmitter} from 'events';

let CHANGE_EVENT = 'change';

const BaseStore = assign({}, EventEmitter.prototype, {

    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

export default BaseStore;