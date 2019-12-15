import { State, OptionInputs, auctionTypes } from '../store/state';
import { Dispatch } from 'react';
import { RootAction } from '../store/reducer';
import {
  changeSetupField,
  switchViewAuction,
  changeSetupAuction,
  startNewAuction
} from '../store/actions';
import React from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { validateOptionInputs } from '../logic/game';

const mapStateToProps = (state: State) => ({ state });

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  changeSetupField: (t: { field: keyof OptionInputs; value: string }) =>
    dispatch(changeSetupField(t)),
  switchViewToAuction: () => dispatch(switchViewAuction()),
  changeSetupAuction: (i: number) => dispatch(changeSetupAuction(i)),
  newAuction: () => dispatch(startNewAuction())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const _SetupView: React.FC<Props> = props => {
  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Number of Players</th>
            <th>
              <input
                type="number"
                value={props.state.optionInputs.numPlayers}
                onChange={e =>
                  props.changeSetupField({
                    field: 'numPlayers',
                    value: e.target.value
                  })
                }
              />
            </th>
          </tr>
          <tr>
            <th>Number of Rounds</th>
            <th>
              <input
                type="number"
                value={props.state.optionInputs.numRounds}
                onChange={e =>
                  props.changeSetupField({
                    field: 'numRounds',
                    value: e.target.value
                  })
                }
              />
            </th>
          </tr>
          <tr>
            <th>Max Points per Round</th>
            <th>
              <input
                type="number"
                value={props.state.optionInputs.maxPointsPerRound}
                onChange={e =>
                  props.changeSetupField({
                    field: 'maxPointsPerRound',
                    value: e.target.value
                  })
                }
              />
            </th>
          </tr>
          <tr>
            <th>Total Points</th>
            <th>
              <input
                type="number"
                value={props.state.optionInputs.sumPoints}
                onChange={e =>
                  props.changeSetupField({
                    field: 'sumPoints',
                    value: e.target.value
                  })
                }
              />
            </th>
          </tr>
          <tr>
            <th>Starting Balance</th>
            <th>
              <input
                type="number"
                value={props.state.optionInputs.startingBalance}
                onChange={e =>
                  props.changeSetupField({
                    field: 'startingBalance',
                    value: e.target.value
                  })
                }
              />
            </th>
          </tr>
          <tr>
            <th>Auction Type</th>
            <th>
              <DropdownButton
                id="auction-type-selector"
                title={props.state.optionInputs.auctionType}
                onSelect={(e: string) => props.changeSetupAuction(parseInt(e))}
              >
                {auctionTypes.map((t, i) => (
                  <Dropdown.Item
                    eventKey={i.toString()}
                    active={t === props.state.optionInputs.auctionType}
                    key={i}
                  >
                    {t}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </th>
          </tr>
        </tbody>
      </Table>
      <Row>
        <Button
          variant="success"
          disabled={!validateOptionInputs(props.state.optionInputs)}
          onClick={props.newAuction}
        >
          New Auction
        </Button>
        <Button variant="info" onClick={props.switchViewToAuction}>
          Back to Auction
        </Button>
      </Row>
    </Container>
  );
};

export const SetupView = connect(
  mapStateToProps,
  mapDispatchToProps
)(_SetupView);
