import React, {Component, PropTypes} from 'react';
import {iterator,isObject} from '../util';

class Summary extends Component{
    //constructor() {
    //    super(props// );
    //    console.log('super props: ', super(props()));
    //}

    mapFuncs() {
        var self = this
        return ([
            iterator(self.props.funcs, function (item) {
                if (isObject(item)) {
                    return (
                        <div className="item" onClick={item.func.bind(self,item.title)}>
                            <span className="mainFunc">{item.name}uoeue</span>
                        </div>
                    )
                }
            })
        ])
    }
    render () {
        return (
            <div className='summary'>
                <h4>
                    {this.props.name}
                    {this.props.mainFunc ? <span onClick={this.props.mainFunc.func}>{this.props.mainFunc.name}</span> : ''}
                </h4>
                <div className="func">
                    {this.mapFuncs()}
                </div>
            </div>
        )
   //return (<div className="ou">oeuoaehu</div>)

    }
}

export default Summary