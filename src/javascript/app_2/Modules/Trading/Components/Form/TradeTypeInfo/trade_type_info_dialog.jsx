import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import FullScreenDialog  from '../../Elements/full_screen_dialog.jsx';

const TradeTypeInfoDialog = ({
    children,
    is_mobile,
    open,
    onClose,
    title,
}) => (
    is_mobile ?
        <FullScreenDialog
            visible={open}
            onClose={onClose}
            title={title}
            wrapperClassName='trade-type-info-modal'
        >
            {children}
        </FullScreenDialog>
        :
        <CSSTransition
            classNames='trade-type-info-popup'
            in={open}
            timeout={100}
            unmountOnExit
        >
            <div className='trade-type-info-popup'>
                <div className='trade-type-info'>
                    {children}
                </div>
            </div>
        </CSSTransition>
);

TradeTypeInfoDialog.propTypes = {
    children : PropTypes.element,
    is_mobile: PropTypes.bool,
    onClose  : PropTypes.func,
    open     : PropTypes.bool,
    title    : PropTypes.string,
};

export default TradeTypeInfoDialog;