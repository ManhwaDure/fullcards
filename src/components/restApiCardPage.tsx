import { Component } from "react";
import socket from "socket.io-client";
import { Card, CardWithDetails, FullcardsApiClient } from "../apiClient";
import { getApiClientLoginToken } from "../GetApiClient";
import ImageUploader from "../imageUploader";
import RestApiDataCardPage from "./restApiDataCardPage";

type propType = {
  imageUploader: ImageUploader;
  fallbackText?: string;
  once?: boolean;
  apiClient: FullcardsApiClient;
};

type stateType = {
  cards: CardWithDetails[];
  cardPageKey: number;
};

export default class RestApiCardPage extends Component<propType, stateType> {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      cardPageKey: Date.now()
    };
    this.attachEvents = this.attachEvents.bind(this);
    this.onCardInfoReceived = this.onCardInfoReceived.bind(this);
    this.loadCards = this.loadCards.bind(this);
  }

  componentDidMount() {
    this.loadCards();
    if (!this.props.once) this.attachEvents();
  }

  loadCards() {
    this.props.apiClient.default.getCards().then(this.onCardInfoReceived);
  }

  attachEvents() {
    const io = socket({
      auth: {
        jwt: getApiClientLoginToken()
      }
    });
    io.on("cards_changed", () => {
      this.loadCards();
    });
  }

  async onCardInfoReceived(data: Card[]) {
    const cards = await Promise.all(
      data.map(i => this.props.apiClient.default.getCard(i.id))
    );
    this.setState({
      cards,
      cardPageKey: Date.now()
    });
  }

  render() {
    return (
      <RestApiDataCardPage
        imageUploader={this.props.imageUploader}
        fallbackText={this.props.fallbackText}
        cards={this.state.cards}
        /* Re-renders RestApiDataCardPage when card data changes */
        key={this.state.cardPageKey}
      ></RestApiDataCardPage>
    );
  }
}
