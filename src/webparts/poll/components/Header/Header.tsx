import * as React from 'react';
import Aux from '../../hoc/Auxilliary';
import styles from './Header.module.scss';

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
            <p className={styles.description}>{props.PollDescription}</p>
        </Aux>
    );
};

export default header;