import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'styles.css';


class Computes extends Component {
    render() {
        const { computes } = this.props

        const actions = {
            0: '+',
            1: '-',
            2: '*',
            3: '/'
        }

        const allComputes = computes.map((c, i) =>
            <div className="compute_item" key={i}>{c.arg1 + ' ' + actions[c.action] + ' ' + c.arg2}&nbsp;=&nbsp;<span className={typeof c.result == 'string' ? 'error' : ''}>{c.result}</span></div>
        );

        return (
            <div style={{ padding: 0 }} className="container">
                <div className="all-users-computes">{allComputes}</div>
            </div>
        )
    };
}


const mapStateToProps = state => ({
    computes: state.computes.computes
})

export default connect(mapStateToProps, null)(Computes)
