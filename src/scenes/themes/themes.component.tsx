import React from 'react';
import { ListRenderItemInfo, StyleSheet } from 'react-native';
import {
    Divider,
    List,
    ThemeProvider,
    Toggle,
    TopNavigation,
    TopNavigationAction,
} from '@ui-kitten/components';
import { ThemeCard } from './theme-card.component';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import {
    MappingContextValue,
    ThemeContextValue,
    Theming,
} from '../../services/theme.service';
import { ThemesService } from './themes.service';
import { ThemeItem } from './type';
import { appThemes } from '../../app/app-theming';
import { ArrowIosBackIcon } from '../../components/icons';

export const ThemesScreen = ({ navigation }): React.ReactElement => {
    const mappingContext: MappingContextValue = React.useContext(
        Theming.MappingContext,
    );
    const themeContext: ThemeContextValue = React.useContext(
        Theming.ThemeContext,
    );

    const themes: ThemeItem[] = ThemesService.createThemeListItems(
        appThemes,
        mappingContext.currentMapping,
    );

    const onItemPress = (info: ListRenderItemInfo<ThemeItem>): void => {
        themeContext.setCurrentTheme(info.item.name);
    };

    const isActiveTheme = (theme: ThemeItem): boolean => {
        return (
            mappingContext.currentMapping === theme.mapping &&
            themeContext.currentTheme === theme.name
        );
    };

    const shouldDisableItem = (theme: ThemeItem): boolean => {
        return themeContext.currentTheme === theme.name;
    };

    const createThemeNameForItem = (theme: ThemeItem): string => {
        return `${theme.mapping} ${theme.name}`.toUpperCase();
    };

    const renderItem = (
        info: ListRenderItemInfo<ThemeItem>,
    ): React.ReactElement => (
        <ThemeProvider theme={info.item.theme}>
            <ThemeCard
                style={styles.item}
                title={createThemeNameForItem(info.item)}
                isActive={isActiveTheme(info.item)}
                disabled={shouldDisableItem(info.item)}
                onPress={() => onItemPress(info)}
            />
        </ThemeProvider>
    );

    const renderBackAction = (): React.ReactElement => (
        <TopNavigationAction
            icon={ArrowIosBackIcon}
            onPress={navigation.goBack}
        />
    );

    return (
        <SafeAreaLayout style={styles.safeArea} insets='top'>
            <TopNavigation title='Cài đặt' leftControl={renderBackAction()} />
            <Divider />
            <List
                contentContainerStyle={styles.container}
                data={themes}
                renderItem={renderItem}
            />
        </SafeAreaLayout>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 8,
    },
    item: {
        margin: 8,
    },
    evaToggle: {
        margin: 8,
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
});
