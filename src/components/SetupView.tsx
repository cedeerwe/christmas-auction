import { State, OptionInputs, auctionTypes } from '../store/state';
import { Dispatch } from 'react';
import { RootAction } from '../store/reducer';
import {
  changeSetupField,
  switchViewAuction,
  changeSetupAuction,
  startNewAuction,
  changeSetupShowPoints
} from '../store/actions';
import React from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { validateOptionInputs, auctionInfo } from '../logic/game';

const mapStateToProps = (state: State) => ({ state });

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  changeSetupField: (t: { field: keyof OptionInputs; value: string }) =>
    dispatch(changeSetupField(t)),
  switchViewToAuction: () => dispatch(switchViewAuction()),
  changeSetupAuction: (i: number) => dispatch(changeSetupAuction(i)),
  newAuction: () => dispatch(startNewAuction()),
  changeSetupShowPoints: (checked: boolean) =>
    dispatch(changeSetupShowPoints(checked))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const _SetupView: React.FC<Props> = props => {
  return (
    <Container>
      <Row>
        <h1>Welcome to the Christmas Auction!</h1>
        <p>
          There is no better time for some crazy bidding than the most festive
          season of the year. Enjoy a competitive evening with your friends and
          let us see, who will be the master at the auction table. Prepare your
          coins, my dear friends. The Christmas auction shall begin soon!
        </p>
      </Row>
      <Table>
        <thead>
          <tr>
            <th>Auction Attribute</th>
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
                  <OverlayTrigger
                    key={i}
                    placement="right"
                    overlay={
                      <Popover
                        id={'popover-' + t}
                        style={{
                          fontFamily: 'Mountains of Christmas',
                          fontSize: 20
                        }}
                      >
                        <Popover.Title as="h3" style={{ fontSize: 20 }}>
                          {t} auction
                        </Popover.Title>
                        <Popover.Content>{auctionInfo[i]}</Popover.Content>
                      </Popover>
                    }
                  >
                    <Dropdown.Item
                      eventKey={i.toString()}
                      active={t === props.state.optionInputs.auctionType}
                      key={i}
                    >
                      {t}
                    </Dropdown.Item>
                  </OverlayTrigger>
                ))}
              </DropdownButton>
            </th>
          </tr>
          <tr>
            <th>Show Points</th>
            <th>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Popover id="popover-show-points">
                    <Popover.Content
                      style={{
                        fontFamily: 'Mountains of Christmas',
                        fontSize: 20
                      }}
                    >
                      Controls whether the points are seen by everyone or all
                      the participants have secretly generated points on their
                      own devices.
                    </Popover.Content>
                  </Popover>
                }
              >
                <input
                  type="checkbox"
                  checked={props.state.optionInputs.showPoints}
                  onChange={e => props.changeSetupShowPoints(e.target.checked)}
                  style={{ width: '30px', height: '30px' }}
                />
              </OverlayTrigger>
            </th>
          </tr>
        </tbody>
      </Table>
      <hr />
      <Row className="justify-content-between">
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
