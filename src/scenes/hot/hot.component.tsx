import React from 'react';
import { ScrollView, StyleSheet, View, Image, Dimensions } from 'react-native';
import { List, StyleService, useStyleSheet } from '@ui-kitten/components';
import { FlashSaleItem } from '../../model/flashsale-item.model';
import { FlashSaleItemComponent } from '../../components/flashsale-item.component';
import Swiper from 'react-native-swiper';

import { Divider } from '@ui-kitten/components';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import TopNavigationDefault from '../../components/top-navigation-default.component';

import HotApi from '../../api/hot.api';
import useAuth from '../../hooks/useAuth';

export const HotScreen = ({ navigation }): React.ReactElement => {
    const styles = useStyleSheet(themedStyles);

    const [products, setProducts] = React.useState<FlashSaleItem[]>([]);
    const [pageIndex, setPageIndex] = React.useState(1);

    const { auth } = useAuth();

    React.useEffect(() => {
        const fetchData = async () => {
            const data: any = await HotApi.getFlashSale(pageIndex);

            let temp: FlashSaleItem[] = [];

            if (data.data.data.results) {
                data.data.data.results.forEach((item: any) =>
                    temp.push(
                        new FlashSaleItem(
                            item._id,
                            item.sale_title,
                            item.image,
                            item.sale_price,
                            item.origin_price,
                            item.link,
                            auth.id,
                        ),
                    ),
                );
            }

            setProducts(products?.concat(temp));
        };
        fetchData();
    }, [pageIndex]);

    return (
        <SafeAreaLayout style={styles.safeArea} insets='top'>
            <TopNavigationDefault navigation={navigation} />
            <Divider />
            <View style={styles.sliderContainer}>
                <Swiper autoplay activeDotColor={'#EE4D2D'}>
                    <View>
                        <Image
                            source={require('../../assets/images/banner-lazada.jpg')}
                            resizeMode='contain'
                            style={styles.sliderImage}
                        />
                    </View>
                    <View>
                        <Image
                            source={require('../../assets/images/banner-lazada.jpg')}
                            resizeMode='contain'
                            style={styles.sliderImage}
                        />
                    </View>
                    <View>
                        <Image
                            source={require('../../assets/images/banner-lazada.jpg')}
                            resizeMode='contain'
                            style={styles.sliderImage}
                        />
                    </View>
                </Swiper>
            </View>
            <List
                onEndReached={() => setPageIndex(pageIndex + 1)}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.productList}
                data={products}
                numColumns={2}
                renderItem={(info) => (
                    <FlashSaleItemComponent info={info} isShowTag={true} />
                )}
            />
        </SafeAreaLayout>
    );
};

const themedStyles = StyleService.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'background-basic-color-2',
    },
    productList: {
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    sliderContainer: {
        height: Dimensions.get('window').height * 0.2,
        width: '95%',
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
    },
    sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
    },
});
