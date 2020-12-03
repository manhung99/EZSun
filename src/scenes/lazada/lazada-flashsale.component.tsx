import React from 'react';
import { List, StyleService, useStyleSheet } from '@ui-kitten/components';
import { FlashSaleItem } from '../../model/flashsale-item.model';
import { FlashSaleItemComponent } from '../../components/flashsale-item.component';

import LazadaApi from '../../api/lazada.api';

export const FlashSaleScreen = ({ navigation }): React.ReactElement => {
    const styles = useStyleSheet(themedStyles);

    const [products, setProducts] = React.useState<FlashSaleItem[]>();

    const onLikeItem = (info): void => {
        console.log(info);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            const data: any = await LazadaApi.getFlashSale();

            let temp: FlashSaleItem[] = [];

            if (data.data.data.results) {
                data.data.data.results.forEach((item: any) =>
                    temp.push(
                        new FlashSaleItem(
                            item._id,
                            item.sale_title,
                            { uri: item.image },
                            item.sale_price,
                            item.origin_price,
                            item.link,
                        ),
                    ),
                );
            }

            setProducts(temp);
        };
        fetchData();
    }, []);

    return (
        <List
            contentContainerStyle={styles.productList}
            data={products}
            numColumns={2}
            renderItem={(info) => (
                <FlashSaleItemComponent info={info} onLikeItem={onLikeItem} />
            )}
        />
    );
};

const themedStyles = StyleService.create({
    container: {
        flex: 1,
        backgroundColor: 'background-basic-color-2',
    },
    productList: {
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
});
