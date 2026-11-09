import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { createDeepLinkingPageEvent } from '../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../analytics/functions';
import { IReduxState } from '../../app/types';
import { IDeeplinkingConfig } from '../../base/config/configType';
import { translate } from '../../base/i18n/functions';


/**
 * The type of the React {@code Component} props of
 * {@link NoMobileApp}.
 */
interface IProps extends WithTranslation {

    /**
     * The deeplinking config.
     */
    _deeplinkingCfg: IDeeplinkingConfig;
}

/**
 * React component representing no mobile app page.
 *
 * @class NoMobileApp
 */
class NoMobileApp extends Component<IProps> {
    /**
     * Implements the Component's componentDidMount method.
     *
     * @inheritdoc
     */
    override componentDidMount() {
        sendAnalytics(
            createDeepLinkingPageEvent(
                'displayed', 'noMobileApp', { isMobileBrowser: true }));
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement}
     */
    override render() {
        const ns = 'no-mobile-app';
        const { _deeplinkingCfg: { desktop }, t } = this.props;
        const { appName } = desktop ?? {};

        return (
            <div className = { ns }>
                <h2 className = { `${ns}__title` }>
                    { t('deepLinking.noMobileAppTitle') }
                </h2>
                <p className = { `${ns}__description` }>
                    { t('deepLinking.noMobileAppDescription', { app: appName }) }
                </p>
            </div>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code NoMobileApp} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState) {
    return {
        _deeplinkingCfg: state['features/base/config'].deeplinking || {}
    };
}

export default translate(connect(_mapStateToProps)(NoMobileApp));
