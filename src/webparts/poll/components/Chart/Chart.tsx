import * as React from 'react';
import { Bar, HorizontalBar, Line, Doughnut, Pie } from 'react-chartjs-2';
import Aux from '../../hoc/Auxilliary';

export interface IChartProps {
    chartType: string;
    chartData: {};
}

export interface IChartState {
    chartType: string;
    chartData: {};
}


export default class Chart extends React.Component<IChartProps, IChartState> {

    constructor(props: IChartProps) {
        
        super(props);
        this.state = {
            chartType: props.chartType,
            chartData: props.chartData
        }
    }

    componentWillReceiveProps(nextProps : IChartProps){
        if(this.state.chartType != nextProps.chartType){
            this.setState({
                chartType : nextProps.chartType
            })
        }
    }

    protected chartToBeRendered = (): JSX.Element => {
        let chartToReturn: JSX.Element = null;
        const { chartType, chartData } = this.state;

        switch (chartType) {
            case 'bar':
                chartToReturn = <Bar data={chartData} />;
                break;
            case 'horizontalbar':
                chartToReturn = <HorizontalBar data={chartData} />;
                break;
            case 'doughnut':
                chartToReturn = <Doughnut data={chartData} />;
                break;
            case 'line':
                chartToReturn = <Line data={chartData} />;
                break;
            case 'pie':
                chartToReturn = <Pie data={chartData} />;
                break;
            default:
                chartToReturn = <HorizontalBar data={chartData} />;
        }

        return chartToReturn;

    }


    render(): React.ReactElement<IChartProps> {
        const chart : JSX.Element = this.state.chartType && this.state.chartData ? this.chartToBeRendered() : <div />


        return (
            <Aux>
                {chart}
            </Aux>
        );
    }
}
