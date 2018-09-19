import * as React from 'react';
import Aux from '../../hoc/Auxilliary';

export interface IHeaderProps {
    PollTitle: string;
    PollDescription?: string;
}

const header = (props: IHeaderProps) => {
    return (
        <Aux>
            <header>
                {props.PollTitle}
            </header>
            {props.PollDescription}
        </Aux>
    );
};

export default header;