import React from 'react';
import { View, State } from '../store/state';
import { connect } from 'react-redux';
import { AuctionView } from './AuctionVIew';
import { SetupView } from './SetupView';

const mapStateToProps = (state: State) => ({
  view: state.view
});

type Props = ReturnType<typeof mapStateToProps>;

const _MainView: React.FC<Props> = ({ view }) => {
  switch (view) {
    case View.SetupView:
      return <SetupView />;
    case View.AuctionView:
      return <AuctionView />;
  }
};

export const MainView = connect(mapStateToProps)(_MainView);
