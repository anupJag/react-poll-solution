import * as React from 'react';
import styles from './Poll.module.scss';
import { IPollProps, IPollOption } from './IPollProps';
import { escape, isEqual } from '@microsoft/sp-lodash-subset';
import Header from './Header/Header';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import Chart from './Chart/Chart';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import Aux from '../hoc/Auxilliary';

export interface IPollState {
  options: string[];
  results: {};
  selectedVote: string;
  isVotingDone: boolean;
  chartData: {};
  showResults: boolean;
}

export default class Poll extends React.Component<IPollProps, IPollState> {
  constructor(props: IPollProps) {
    super(props);
    this.state = {
      options: (props.pollDataCollection && props.pollDataCollection.length > 0) ? props.pollDataCollection.map((el: IPollOption) => el.option) : undefined,
      results: undefined,
      selectedVote: undefined,
      isVotingDone: false,
      chartData: undefined,
      showResults: false,
    };
  }

  // tslint:disable-next-line:member-access
  componentWillReceiveProps(nextProps: IPollProps) {
    let pollData = nextProps.pollDataCollection.map((el: IPollOption) => el.option);

    if (!(isEqual(pollData, this.state.options)) || (this.props.pollTitle !== nextProps.pollTitle)) {
      debugger;
      this.setState({
        options: nextProps.pollDataCollection && nextProps.pollDataCollection.length > 0 ? nextProps.pollDataCollection.map((el: IPollOption) => el.option) : undefined
      }, () => {
        this.updateResultSetAfterPropsUpdate();
        this.props.updateContent(null);
      });
    }
  }

  protected updateResultSetAfterPropsUpdate = () => {
    if (this.state.options && this.state.options.length > 0) {
      const options = [...this.state.options];
      let createResultObject = {};
      options.map(el => createResultObject[el] = 0);
      this.setState({
        results: createResultObject
      });
    }
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

  protected _onVoteClicked = async () => {
    let currentVoteStatus = this.state.results;
    const voteSelection = this.state.selectedVote;
    currentVoteStatus[voteSelection] = currentVoteStatus[voteSelection] + 1;

    this.setState({
      results: currentVoteStatus,
      isVotingDone: true,
    }, () => { this.props.updateContent(JSON.stringify(this.state.results)); }
    );

    setTimeout(() => {
      this.setState((prevState: IPollState) => {
        return {
          showResults: !prevState.showResults
        }
      })
    }, 3000);
  }

  protected createChartData = (): {} => {
    const data: {} = {
      labels: [...Object.keys(this.state.results)],
      datasets: [
        {
          label: "# of votes - " + this.props.pollTitle,
          data: [...Object.keys(this.state.results).map(el => this.state.results[el])],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }
      ]
    };
    return data;
  }

  protected _onShowResultsClicked = (): void => {
    this.setState((prevState: IPollState) => {
      return {
        showResults: !prevState.showResults
      }
    })
  }

  public render(): React.ReactElement<IPollProps> {

    const choiceGroups: JSX.Element = this.state.results ?
      <ChoiceGroup options={this.getChoiceGroupOptions()} onChanged={this._onChange} disabled={this.state.isVotingDone}></ChoiceGroup> : <div />;

    const getGraph: JSX.Element = this.state.results ? <Chart chartData={this.createChartData()} chartType={this.props.pollResultType} /> : <div />;

    const renderPoll: JSX.Element = (this.props.pollTitle && (this.props.pollDataCollection && this.props.pollDataCollection.length > 0)) ?
      <Aux>
        <Header PollTitle={this.props.pollTitle} PollDescription={this.props.pollDescription} />
        {choiceGroups}
        <div>
          <DefaultButton 
          primary={true} text={"Vote"} 
          onClick={this._onVoteClicked} 
          disabled={this.state.selectedVote && this.state.isVotingDone} 
          className={styles.voteNow} />
        </div>
      </Aux>
      :
      <Placeholder
        iconName='CheckboxComposite'
        iconText='Poll'
        description='Find out what others think'
        buttonLabel='Configure'
        onConfigure={this.props._onConfigure} />;

    return (
      <div className={styles.poll}>
        {
          this.state.showResults ? getGraph : renderPoll
        }
      </div>
    );
  }
}
