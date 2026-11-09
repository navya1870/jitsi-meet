import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';

import { IconCloseLarge } from '../../../icons/svg';
import { MultiSelectItem } from '../types';

import ClickableIcon from './ClickableIcon';
import Input from './Input';

interface IProps {
    autoFocus?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorDialog?: JSX.Element | null;
    filterValue?: string;
    id: string;
    isOpen?: boolean;
    items: MultiSelectItem[];
    noMatchesText?: string;
    onFilterChange?: (value: string) => void;
    onRemoved: (item: any) => void;
    onSelected: (item: any) => void;
    placeholder?: string;
    selectedItems?: MultiSelectItem[];
}

const MULTI_SELECT_HEIGHT = 200;

const useStyles = makeStyles()(theme => {
    return {
        container: {
            position: 'relative'
        },
        items: {
            '&.found': {
                position: 'absolute',
                boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.75)'
            },
            marginTop: theme.spacing(2),
            width: '100%',
            backgroundColor: theme.palette.multiSelectBackground,
            border: `1px solid ${theme.palette.multiSelectBorder}`,
            borderRadius: `${Number(theme.shape.borderRadius)}px`,
            ...theme.typography.bodyShortRegular,
            zIndex: 2,
            maxHeight: `${MULTI_SELECT_HEIGHT}px`,
            overflowY: 'auto',
            padding: '0'
        },
        listItem: {
            boxSizing: 'border-box',
            display: 'flex',
            padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
            alignItems: 'center',
            '& .content': {
                // 38px because of the icon before the content
                inlineSize: 'calc(100% - 38px)',
                overflowWrap: 'break-word',
                marginLeft: theme.spacing(2),
                color: theme.palette.multiSelectItemText,
                '&.with-remove': {
                    // 60px because of the icon before the content and the remove button
                    inlineSize: 'calc(100% - 60px)',
                    marginRight: theme.spacing(2),
                    '&.without-before': {
                        marginLeft: 0,
                        inlineSize: 'calc(100% - 38px)'
                    }
                },
                '&.without-before': {
                    marginLeft: 0,
                    inlineSize: '100%'
                }
            },
            '&.found': {
                cursor: 'pointer',
                padding: `10px ${theme.spacing(3)}`,
                '&:hover, &:focus-visible': {
                    backgroundColor: theme.palette.multiSelectItemHover
                }
            },
            '&.disabled': {
                cursor: 'not-allowed',
                '&:hover': {
                    backgroundColor: theme.palette.multiSelectBackground
                },
                color: theme.palette.multiSelectItemDisabled
            }
        },
        errorMessage: {
            position: 'absolute',
            marginTop: theme.spacing(2),
            width: '100%'
        }
    };
});

const MultiSelect = ({
    autoFocus,
    disabled,
    error,
    errorDialog,
    placeholder,
    id,
    items,
    filterValue,
    onFilterChange,
    isOpen,
    noMatchesText,
    onSelected,
    selectedItems,
    onRemoved
}: IProps) => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const inputRef = useRef();
    const listRef = useRef<HTMLDivElement>(null);
    const selectItem = useCallback(item => () => onSelected(item), [ onSelected ]);
    const removeItem = useCallback(item => () => onRemoved(item), [ onRemoved ]);

    // The list of suggestions is not part of the tab order of the input, so the keyboard needs a way in: ArrowDown
    // from the input moves to the first suggestion.
    const onInputKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown' && isOpen) {
            const firstItem = listRef.current?.querySelector<HTMLElement>('[role="option"]:not([aria-disabled="true"])');

            if (firstItem) {
                e.preventDefault();
                firstItem.focus();
            }
        }
    }, [ isOpen ]);

    const onItemKeyDown = useCallback((item: MultiSelectItem) => (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelected(item);

            // The list closes when something is selected, so give the focus back to the field.
            document.getElementById(id)?.focus();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();

            const sibling = e.key === 'ArrowDown' ? e.currentTarget.nextElementSibling : e.currentTarget.previousElementSibling;

            if (sibling instanceof HTMLElement && sibling.getAttribute('role') === 'option') {
                sibling.focus();
            } else if (e.key === 'ArrowUp') {
                document.getElementById(id)?.focus();
            }
        }
    }, [ id, onSelected ]);

    const foundItems = useMemo(() => (
        <div
            className = { `${classes.items} found` }
            ref = { listRef }
            role = 'listbox'>
            {
                items.length > 0
                    ? items.map(item => (
                        <div
                            aria-disabled = { item.isDisabled ? true : undefined }
                            className = { `${classes.listItem} ${item.isDisabled ? 'disabled' : ''} found` }
                            key = { item.value }
                            onClick = { item.isDisabled ? undefined : selectItem(item) }
                            onKeyDown = { item.isDisabled ? undefined : onItemKeyDown(item) }
                            role = 'option'
                            tabIndex = { item.isDisabled ? undefined : 0 }>
                            {item.elemBefore}
                            <div className = { `content ${item.elemBefore ? '' : 'without-before'}` }>
                                {item.content}
                                {item.description && <p>{item.description}</p>}
                            </div>
                        </div>
                    ))
                    : <div className = { classes.listItem }>{noMatchesText}</div>
            }
        </div>
    ), [ items, onItemKeyDown ]);

    const errorMessageDialog = useMemo(() =>
        error && <div className = { classes.errorMessage }>
            { errorDialog }
        </div>, [ error ]);

    return (
        <div className = { classes.container }>
            <Input
                autoFocus = { autoFocus }
                disabled = { disabled }
                id = { id }
                onChange = { onFilterChange }
                onKeyDown = { onInputKeyDown }
                placeholder = { placeholder }
                ref = { inputRef }
                value = { filterValue ?? '' } />
            {isOpen && foundItems}
            { errorMessageDialog }
            { selectedItems && selectedItems?.length > 0 && (
                <div className = { classes.items }>
                    { selectedItems.map(item => (
                        <div
                            className = { `${classes.listItem} ${item.isDisabled ? 'disabled' : ''}` }
                            key = { item.value }>
                            {item.elemBefore}
                            <div className = { `content with-remove ${item.elemBefore ? '' : 'without-before'}` }>
                                <p>{item.content}</p>
                            </div>
                            <ClickableIcon
                                accessibilityLabel = { t('dialog.Remove') }
                                icon = { IconCloseLarge }
                                onClick = { removeItem(item) } />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
