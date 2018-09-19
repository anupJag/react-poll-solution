import * as React from 'react';
import styles from './Poll.module.scss';
import { IPollProps, IPollOption } from './IPollProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Header from './Header/Header';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Doughnut } from 'react-chartjs-2';

export interface IPollState {
  options: string[];
  results: {};
  selectedVote: string;
  isVotingDone: boolean;
  chartData: {};
}

export default class Poll extends React.Component<IPollProps, IPollState> {
  constructor(props: IPollProps) {
    super(props);
    this.state = {
      options: (props.pollDataCollection && props.pollDataCollection.length > 0) ? props.pollDataCollection.map((el: IPollOption) => el.option) : undefined,
      results: undefined,
      selectedVote: undefined,
      isVotingDone: false,
      chartData: undefined
    };
  }

  // tslint:disable-next-line:member-access
  componentWillReceiveProps(nextProps: IPollProps) {
    if (nextProps.pollDataCollection != this.state.options) {
      this.setState({
        options: nextProps.pollDataCollection && nextProps.pollDataCollection.length > 0 ? nextProps.pollDataCollection.map((el: IPollOption) => el.option) : undefined
      }, this.updateResultSetAfterPropsUpdate);
    }
  }

  protected updateResultSetAfterPropsUpdate = () => {
    const options = [...this.state.options];
    let createResultObject = {};
    options.map(el => createResultObject[el] = 0);
    this.setState({
      results: createResultObject
    });
  }

  // tslint:disable-next-line:member-access
  componentDidMount() {
    if (this.state.options) {
      let createResultObject = {};
      if (this.props.content) {
        createResultObject = JSON.parse(this.props.content);
      }
      else {
        const options = [...this.state.options];
        options.map(el => createResultObject[el] = 0);
      }
      this.setState({
        results: createResultObject
      });
    }
  }

  protected getChoiceGroupOptions = (): IChoiceGroupOption[] => {
    let tempChoiceCollection: IChoiceGroupOption[] = [];
    let resultsObject = this.state.results;
    Object.keys(resultsObject).map((el: string) => {
      tempChoiceCollection.push({
        key: el.trim().toString(),
        text: el.toString().trim()
      });
    });

    return tempChoiceCollection;
  }

  protected _onChange = (option: IChoiceGroupOption, ev: React.FormEvent<HTMLInputElement>): void => {
    this.setState({
      selectedVote: option.key
    });
  }

  protected _onVoteClicked = (): void => {
    let currentVoteStatus = this.state.results;
    const voteSelection = this.state.selectedVote;
    currentVoteStatus[voteSelection] = currentVoteStatus[voteSelection] + 1;

    this.setState({
      results: currentVoteStatus,
      isVotingDone: true,
    }, () => { this.props.updateContent(JSON.stringify(this.state.results)); }
    );
  }

  protected createChartData = (): {} => {
    const data: {} = {
      labels: [...Object.keys(this.state.results)],
      datasets: [
        {
          label: "# of votes",
          data: [...Object.keys(this.state.results).map(el => this.state.results[el])],
          backgroundColor : [
            'red',
            'purple',
            'blue',
            'maroon',
            'green'
          ]
        }
      ]
    };

    return data;
  }

  public render(): React.ReactElement<IPollProps> {

    const choiceGroups: JSX.Element = this.state.results ?
      <ChoiceGroup options={this.getChoiceGroupOptions()} onChanged={this._onChange}></ChoiceGroup> : <div />;

    const voteButton: JSX.Element = this.state.selectedVote && !this.state.isVotingDone ? <DefaultButton primary={true} text={"Vote"} onClick={this._onVoteClicked} /> : <DefaultButton primary={false} text={"Vote"} disabled={true} />;

    const getGraph: JSX.Element = this.state.results ? <Doughnut data={this.createChartData()} /> : <div />;

    return (
      <div className={styles.poll}>
        <Header PollTitle={this.props.pollTitle} PollDescription={this.props.pollDescription} />
        {choiceGroups}
        {voteButton}
        {getGraph}
        <p>Lets See the Content: {this.props.content}</p>
      </div>
    );
  }
}
