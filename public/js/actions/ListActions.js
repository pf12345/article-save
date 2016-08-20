/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */
import AppDispatcher from '../dispatcher/AppDispatcher';
import ListConstants from '../constants/ListConstants';

const ListActions = {
    destroyItem(id){
        AppDispatcher.dispatch({
            actionType: ListConstants.ITEM_DESTROY,
            id: id
        });
    },
    createList(arr){
        AppDispatcher.dispatch({
            actionType: ListConstants.LIST_CREATE,
            list: arr
        });
    }
};

export default ListActions;
