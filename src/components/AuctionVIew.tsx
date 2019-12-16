import React, { Dispatch } from 'react';
import { State, playerIcons } from '../store/state';
import { RootAction } from '../store/reducer';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import {
  finishRound,
  startNewRound,
  placeBid,
  changeBidInput,
  switchViewSetup,
  changeHiddenPoints
} from '../store/actions';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { invalidBid, getFee, isDone, canBeFinished } from '../logic/game';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mapStateToProps = (state: State) => ({ state });

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  finishRound: () => dispatch(finishRound()),
  newRound: () => dispatch(startNewRound()),
  placeBid: (bid: { bid: number; playerId: number }) => dispatch(placeBid(bid)),
  changeBidInput: (t: { newInput: string; playerId: number }) =>
    dispatch(changeBidInput(t)),
  backToSetup: () => dispatch(switchViewSetup()),
  changeHiddenPoints: (t: { newPoints: string; playerId: number }) =>
    dispatch(changeHiddenPoints(t))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const _AuctionView: React.FC<Props> = props => {
  return (
    <Container style={{ marginLeft: 'auto', marginRight: 'auto' }}>
      <h1>{props.state.game.auctionType} auction</h1>
      <Row>
        <Table bordered>
          <thead>
            <tr>
              <th>
                Round {props.state.game.round + 1} /{' '}
                {props.state.options.numRounds}
              </th>
              {props.state.players.map((p, i) => (
                <th key={i}>
                  <FontAwesomeIcon icon={playerIcons[i]} size="3x" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Balances</th>
              {props.state.players.map((p, i) => (
                <th key={i}>{p.balance}</th>
              ))}
            </tr>
            <tr>
              <th style={{ backgroundColor: 'PaleGreen' }}>Total points</th>
              {props.state.players.map((p, i) => (
                <th key={i} style={{ backgroundColor: 'PaleGreen' }}>
                  {p.currentPoints}
                </th>
              ))}
            </tr>
            <tr>
              <th>Points to score</th>
              {props.state.players.map((p, i) => (
                <th key={i}>
                  {props.state.options.showPoints ? (
                    <span>{p.allPoints[props.state.game.round]}</span>
                  ) : (
                    <input
                      type="number"
                      style={{ maxWidth: '57px' }}
                      value={p.hiddenPoints}
                      onChange={e =>
                        props.changeHiddenPoints({
                          playerId: i,
                          newPoints: e.target.value
                        })
                      }
                    />
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th>Current bids</th>
              {props.state.game.bids.map((b, i) => (
                <th key={i}>{b}</th>
              ))}
            </tr>
            <tr>
              <th>New Bid</th>
              {props.state.players.map((p, i) => (
                <th key={i}>
                  <div>
                    <input
                      type="number"
                      style={{ maxWidth: '57px' }}
                      value={p.bidInput}
                      onChange={e =>
                        props.changeBidInput({
                          playerId: i,
                          newInput: props.state.game.finishedRound
                            ? ''
                            : e.target.value
                        })
                      }
                    />
                  </div>
                </th>
              ))}
            </tr>
            <tr>
              <th>
                {props.state.game.finishedRound ? (
                  <Button
                    variant="success"
                    onClick={props.newRound}
                    disabled={isDone(props.state.game)}
                  >
                    Next Round
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    disabled={!canBeFinished(props.state)}
                    onClick={() => props.finishRound()}
                  >
                    Finish!
                  </Button>
                )}
              </th>
              {props.state.players.map((p, i) => (
                <th key={i}>
                  <Button
                    disabled={invalidBid(
                      p.bidInput,
                      p.balance,
                      getFee(props.state.game.auctionType),
                      Math.max(...props.state.game.bids)
                    )}
                    onClick={() =>
                      props.placeBid({ playerId: i, bid: parseInt(p.bidInput) })
                    }
                  >
                    BID!
                  </Button>
                </th>
              ))}
            </tr>
          </tbody>
        </Table>
      </Row>
      <Row className="justify-content-between">
        <Button
          variant="secondary"
          onClick={props.newRound}
          disabled={isDone(props.state.game)}
        >
          Skip round
        </Button>
        <Button variant="info" onClick={props.backToSetup}>
          Back to setup
        </Button>
      </Row>
    </Container>
  );
};

export const AuctionView = connect(
  mapStateToProps,
  mapDispatchToProps
)(_AuctionView);
