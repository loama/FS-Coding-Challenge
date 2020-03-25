import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as utils from '../utils';

class BalanceOutput extends Component {
  render() {
    if (!this.props.userInput.format) {
      return null;
    }

    return (
      <div className='output'>
        <p>
          Total Debit: {this.props.totalDebit} Total Credit: {this.props.totalCredit}
          <br />
          Balance from account {this.props.userInput.startAccount || '*'}
          {' '}
          to {this.props.userInput.endAccount || '*'}
          {' '}
          from period {utils.dateToString(this.props.userInput.startPeriod)}
          {' '}
          to {utils.dateToString(this.props.userInput.endPeriod)}
        </p>
        {this.props.userInput.format === 'CSV' ? (
          <pre>{utils.toCSV(this.props.balance)}</pre>
        ) : null}
        {this.props.userInput.format === 'HTML' ? (
          <table className="table">
            <thead>
              <tr>
                <th>ACCOUNT</th>
                <th>DESCRIPTION</th>
                <th>DEBIT</th>
                <th>CREDIT</th>
                <th>BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {this.props.balance.map((entry, i) => (
                <tr key={i}>
                  <th scope="row">{entry.ACCOUNT}</th>
                  <td>{entry.DESCRIPTION}</td>
                  <td>{entry.DEBIT}</td>
                  <td>{entry.CREDIT}</td>
                  <td>{entry.BALANCE}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    );
  }
}

BalanceOutput.propTypes = {
  balance: PropTypes.arrayOf(
    PropTypes.shape({
      ACCOUNT: PropTypes.number.isRequired,
      DESCRIPTION: PropTypes.string.isRequired,
      DEBIT: PropTypes.number.isRequired,
      CREDIT: PropTypes.number.isRequired,
      BALANCE: PropTypes.number.isRequired
    })
  ).isRequired,
  totalCredit: PropTypes.number.isRequired,
  totalDebit: PropTypes.number.isRequired,
  userInput: PropTypes.shape({
    startAccount: PropTypes.number,
    endAccount: PropTypes.number,
    startPeriod: PropTypes.date,
    endPeriod: PropTypes.date,
    format: PropTypes.string
  }).isRequired
};

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export default connect(state => {
  let balance = [];

  /* YOUR CODE GOES HERE */

  for (var i = 0; i < state.journalEntries.length; i++) {
    let account = state.journalEntries[i]['ACCOUNT']

    var correspondingAccount =  state.accounts.filter(function(acc) {
      return acc['ACCOUNT'] === account
    });

    // FILTERS
      let accountStartValid = false
      let accountEndValid = false
      let dateStartValid = false
      let dateEndValid = false

      // check that account start is in range
      if (Number.isNaN(state.userInput.startAccount)) {
        accountStartValid = true
      } else {
        if (state.userInput.startAccount <= account) {
          accountStartValid = true
        }
      }

      // check that account end is in range
      if (Number.isNaN(state.userInput.endAccount)) {
        accountEndValid = true
      } else {
        if (state.userInput.startAccount <= account) {
          accountEndValid = true
        }
      }

      if (isValidDate(state.userInput.startPeriod)) {
        if (state.userInput.startPeriod <= state.journalEntries[i]['PERIOD']) {
          dateStartValid = true
        }
      } else {
        dateStartValid = true
      }

      // check that end date is in range
      if (isValidDate(state.userInput.endPeriod)) {
        if (state.userInput.endPeriod >= state.journalEntries[i]['PERIOD']) {
          dateEndValid = true
        }
      } else {
        dateEndValid = true
      }
    // END FILTERING

    // push to resulting array if in filters parameters
    if (accountStartValid && accountEndValid && dateStartValid && dateEndValid) {
      let description
        if (correspondingAccount[0] !== undefined) {
          description = correspondingAccount[0]['LABEL']
        } else {
          description = '-'
        }

      balance.push({
        ACCOUNT: account,
        DESCRIPTION: description,
        DEBIT: state.journalEntries[i]['DEBIT'],
        CREDIT: state.journalEntries[i]['CREDIT'],
        BALANCE: state.journalEntries[i]['DEBIT'] - state.journalEntries[i]['CREDIT']
      })
    }
  }

  const totalCredit = balance.reduce((acc, entry) => acc + entry.CREDIT, 0);
  const totalDebit = balance.reduce((acc, entry) => acc + entry.DEBIT, 0);

  return {
    balance,
    totalCredit,
    totalDebit,
    userInput: state.userInput
  };
})(BalanceOutput);
