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
import ListConstants from '../constants/ListConstants';
import assign from 'object-assign';
import BaseStore from './BaseStore';

let _lists = [];


/**
 * 初始化list
 * @param arr
 */
const createList = (arr) => {
    if (arr) {
        _lists = arr;
    }
};

/**
 * Delete a List item.
 * @param  {string} id
 */
const destroyItem = (id) => {
    for (var i = 0, _i = _lists.length; i < _i; i++) {
        if (_lists[i]._id == id) {
            _lists.splice(i, 1);
        }
    }
};

// Register callback to handle all updates
AppDispatcher.register((action) => {
    switch (action.actionType) {
        case ListConstants.ITEM_DESTROY:
            destroyItem(action.id);
            ListStore.emitChange();
            break;
        case ListConstants.LIST_CREATE:
            createList(action.list);
            ListStore.emitChange();
    }
});

const ListStore = assign({}, BaseStore, {
    getList(){
        return _lists;
    }
});

export default ListStore;

