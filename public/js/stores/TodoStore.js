/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import TodoConstants from '../constants/TodoConstants';
import assign from 'object-assign';

let CHANGE_EVENT = 'change';

let _todos = [];


/**
 * Delete a TODO item.
 * @param  {string} id
 */
const destroy = (id) => {
    for (var i = 0, _i = _todos.length; i < _i; i++) {
        if (_todos[i]._id == id) {
            _todos.splice(i, 1);
        }
    }
};


var TodoStore = assign({}, EventEmitter.prototype, {

    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
    getAll(arr){
        if (arr) _todos = arr;
        return _todos;
    },

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

// Register callback to handle all updates
AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case TodoConstants.TODO_DESTROY:
            destroy(action.id);
            TodoStore.emitChange();
            break;
        default:
        // no op
    }
});

module.exports = TodoStore;
