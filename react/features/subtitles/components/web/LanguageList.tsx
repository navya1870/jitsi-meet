import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';

import LanguageListItem from './LanguageListItem';

interface ILanguageListProps {
    items: Array<ILanguageItem>;
    onLanguageSelected: (lang: string) => void;
    selectedLanguage: string;
}

const useStyles = makeStyles()(() => {
    return {
        itemsContainer: {
            display: 'flex',
            flexFlow: 'column'
        }
    };
});


interface ILanguageItem {
    id: string;
    lang: string;
    selected: boolean;
}

/**
 * Component that renders the security options dialog.
 *
 * @returns {React$Element<any>}
 */
const LanguageList = ({
    items,
    onLanguageSelected
}: ILanguageListProps) => {
    const { classes: styles } = useStyles();
    const { t } = useTranslation();
    const listItems = items.map(item => (
        <LanguageListItem
            key = { item.id }
            lang = { item.lang }
            onLanguageSelected = { onLanguageSelected }
            selected = { item.selected } />
    ));

    return (
        <div
            aria-label = { t('transcribing.subtitles') }
            className = { styles.itemsContainer }
            role = 'radiogroup'>
            {listItems}
        </div>
    );
};

export default LanguageList;
