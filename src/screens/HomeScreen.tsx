import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import ShopButton from '@components/ui/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import Typography from '@components/ui/Typography';

import {
  BANNER_IMAGE_ID,
  examStamp,
  FLASH_SECONDS,
  STUDENT,
  VARIANT,
} from '@constants/student';

import {
  COLORS,
  SIZES,
} from '@constants/theme';

import {
  useTheme,
} from '@contexts/ThemeContext';

import useCountdown from '@hooks/useCountdown';

import {
  CategoryId,
  fetchProducts,
  Product,
} from '@services/productApi';


type CategoryItem = {
  id: CategoryId;
  label: string;
};


const BASE_CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    label: 'Tất cả',
  },
  {
    id: 'food',
    label: 'Đồ ăn',
  },
  {
    id: 'drink',
    label: 'Nước',
  },
  {
    id: 'study',
    label: 'Học tập',
  },
];


type QuantityAction =
  | {type: 'ADD'}
  | {type: 'REMOVE'}
  | {type: 'RESET'};


function quantityReducer(
  state: number,
  action: QuantityAction,
): number {
  switch (action.type) {
    case 'ADD':
      return state + 1;

    case 'REMOVE':
      return Math.max(
        1,
        state - 1,
      );

    case 'RESET':
      return 1;

    default:
      return state;
  }
}


type ProductCardProps = {
  item: Product;
  onOrder: (
    item: Product,
  ) => void;
  disabled: boolean;
};


const ProductCard = memo(
  function ProductCard({
    item,
    onOrder,
    disabled,
  }: ProductCardProps) {
    const {colors} =
      useTheme();

    return (
      <Pressable
        disabled={disabled}
        onPress={() =>
          onOrder(item)
        }
        style={[
          styles.productCard,
          {
            backgroundColor:
              colors.surface,
          },
        ]}>

        <View
          style={[
            styles.imageBox,
            {
              backgroundColor:
                colors.background,
            },
          ]}>

          <Image
            source={{
              uri: item.image,
            }}
            resizeMode="contain"
            style={
              styles.productImage
            }
          />
        </View>


        <View
          style={
            styles.productInfo
          }>

          <Typography
            variant="subtitle"
            numberOfLines={1}>
            {item.title}
          </Typography>

          <Typography
            variant="subtitle"
            color={
              colors.primary
            }
            style={
              styles.price
            }>
            {item.price.toLocaleString(
              'vi-VN',
            )}{' '}
            đ
          </Typography>

          <Typography
            variant="caption"
            color={
              colors.textLight
            }>
            {item.categoryLabel}
          </Typography>

        </View>


        <View
          style={
            styles.orderButton
          }>
          <ShopButton
            title="Đặt"
            disabled={
              disabled
            }
            onPress={() =>
              onOrder(item)
            }
          />
        </View>

      </Pressable>
    );
  },
);


export default function HomeScreen() {
  const {
    colors,
    isDark,
    toggleTheme,
  } = useTheme();


  const [
    search,
    setSearch,
  ] = useState('');


  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<CategoryId>(
      'study',
    );


  const [
    products,
    setProducts,
  ] = useState<Product[]>(
    [],
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );


  const [
    reloadKey,
    setReloadKey,
  ] = useState(0);


  const [
    selectedProduct,
    setSelectedProduct,
  ] =
    useState<Product | null>(
      null,
    );


  const [
    quantity,
    dispatchQuantity,
  ] = useReducer(
    quantityReducer,
    1,
  );


  const stamp =
    useMemo(
      () => examStamp(),
      [],
    );


  const {
    formattedTime,
    isFinished,
  } =
    useCountdown(
      FLASH_SECONDS,
    );


  const studentLine =
    `TH1 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${stamp}`;


  const bannerUrl =
    `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320`;


  const categories =
    useMemo(() => {
      if (
        VARIANT.chipsReversed
      ) {
        return [
          ...BASE_CATEGORIES,
        ].reverse();
      }

      return BASE_CATEGORIES;
    }, []);


  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await fetchProducts();

        if (alive) {
          setProducts(
            data,
          );
        }
      } catch {
        if (alive) {
          setError(
            `${STUDENT.mssv} — Không tải được dữ liệu món.`,
          );
        }
      } finally {
        if (alive) {
          setLoading(
            false,
          );
        }
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [reloadKey]);


  const filteredProducts =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        item => {
          const matchName =
            item.title
              .toLowerCase()
              .includes(
                keyword,
              );

          const matchCategory =
            selectedCategory ===
              'all' ||
            item.categoryId ===
              selectedCategory;

          return (
            matchName &&
            matchCategory
          );
        },
      );
    }, [
      products,
      search,
      selectedCategory,
    ]);


  const handleOrder =
    useCallback(
      (item: Product) => {
        if (isFinished) {
          return;
        }

        dispatchQuantity({
          type: 'RESET',
        });

        setSelectedProduct(
          item,
        );
      },
      [isFinished],
    );


  const handleCloseModal =
    useCallback(() => {
      setSelectedProduct(
        null,
      );

      dispatchQuantity({
        type: 'RESET',
      });
    }, []);


  const handleConfirm =
    useCallback(() => {
      if (
        !selectedProduct ||
        isFinished
      ) {
        return;
      }

      Alert.alert(
        `CampusMart · ${STUDENT.mssv}`,

        `${STUDENT.hoTen} (#${stamp}) đã ghi nhận: ${selectedProduct.title} × ${quantity}. Nhận tại quầy KTX.`,

        [
          {
            text: 'OK',

            onPress: () => {
              setSelectedProduct(
                null,
              );

              dispatchQuantity({
                type: 'RESET',
              });
            },
          },
        ],
      );
    }, [
      selectedProduct,
      isFinished,
      quantity,
      stamp,
    ]);


  const handleRetry =
    useCallback(() => {
      setReloadKey(
        current =>
          current + 1,
      );
    }, []);


  const renderProduct =
    useCallback(
      ({
        item,
      }: {
        item: Product;
      }) => (
        <ProductCard
          item={item}
          disabled={
            isFinished
          }
          onOrder={
            handleOrder
          }
        />
      ),
      [
        handleOrder,
        isFinished,
      ],
    );


  const keyExtractor =
    useCallback(
      (item: Product) =>
        `${STUDENT.mssv}-${item.id}`,
      [],
    );


  const watermark = (
    <Typography
      variant="caption"
      color={
        colors.textLight
      }>
      {studentLine}
    </Typography>
  );


  const renderContent =
    () => {
      if (loading) {
        return (
          <View
            style={
              styles.stateContainer
            }>

            <ActivityIndicator
              size="large"
              color={
                colors.primary
              }
            />

            <Typography
              style={
                styles.stateText
              }>
              Đang tải món…
            </Typography>

          </View>
        );
      }


      if (error) {
        return (
          <View
            style={
              styles.stateContainer
            }>

            <Typography
              color={
                colors.error
              }
              style={
                styles.errorText
              }>
              {error}
            </Typography>

            <View
              style={
                styles.retryButton
              }>

              <ShopButton
                title="Thử lại"
                onPress={
                  handleRetry
                }
              />

            </View>
          </View>
        );
      }


      return (
        <FlatList
          data={
            filteredProducts
          }

          keyExtractor={
            keyExtractor
          }

          renderItem={
            renderProduct
          }

          showsVerticalScrollIndicator={
            false
          }

          contentContainerStyle={
            filteredProducts.length ===
            0
              ? styles.emptyList
              : styles.listContent
          }

          ListEmptyComponent={
            <Typography
              color={
                colors.textLight
              }>
              Không có món phù hợp
            </Typography>
          }
        />
      );
    };


  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            colors.background,
        },
      ]}>

      <StatusBar
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
      />


      <View
        style={
          styles.container
        }>

        {VARIANT.watermarkAtTop ? (
          <View
            style={
              styles.watermarkTop
            }>
            {watermark}
          </View>
        ) : null}


        <View
          style={
            styles.header
          }>

          <View>
            <Typography
              variant="title"
              color={
                colors.primary
              }>
              CAMPUSMART
            </Typography>

            <Typography
              variant="body"
              color={
                colors.textLight
              }>
              Tiện lợi KTX · Mở 24/7
            </Typography>
          </View>


          <View
            style={
              styles.headerRight
            }>

            {VARIANT.themeControl ===
            'switch' ? (
              <Switch
                value={isDark}
                onValueChange={
                  toggleTheme
                }
                trackColor={{
                  true:
                    colors.primary,
                }}
              />
            ) : (
              <Pressable
                onPress={
                  toggleTheme
                }
                style={[
                  styles.themeButton,
                  {
                    borderColor:
                      colors.primary,
                  },
                ]}>

                <Typography
                  variant="button"
                  color={
                    colors.primary
                  }>
                  Sáng/Tối
                </Typography>

              </Pressable>
            )}


            <Typography
              variant="body"
              color={
                colors.secondary
              }
              style={
                styles.flashText
              }>
              Flash{' '}
              {formattedTime}
            </Typography>

          </View>
        </View>


        <ShopInput
          value={search}

          onChangeText={
            setSearch
          }

          placeholder={
            `Tìm món, nước, đồ dùng — ${STUDENT.mssv}`
          }
        />


        <View
          style={
            styles.banner
          }>

          <Image
            source={{
              uri: bannerUrl,
            }}

            resizeMode="cover"

            style={
              styles.bannerPhoto
            }

            onError={
              event =>
                console.log(
                  'Banner error:',
                  event.nativeEvent,
                )
            }
          />


          <View
            style={
              styles.bannerOverlay
            }>

            <Typography
              variant="subtitle"
              color={
                COLORS.surface
              }>
              Đặt nhanh · Nhận tại quầy
            </Typography>

            <Typography
              variant="caption"
              color={
                COLORS.surface
              }
              style={
                styles.bannerCaption
              }>
              Cửa hàng tiện lợi ký túc xá 24/7
            </Typography>

          </View>
        </View>


        <View
          style={
            styles.categories
          }>

          {categories.map(
            category => {
              const active =
                selectedCategory ===
                category.id;

              return (
                <Pressable
                  key={
                    category.id
                  }

                  onPress={() =>
                    setSelectedCategory(
                      category.id,
                    )
                  }

                  style={[
                    styles.chip,

                    {
                      backgroundColor:
                        active
                          ? colors.primary
                          : colors.surface,

                      borderColor:
                        colors.primary,
                    },
                  ]}>

                  <Typography
                    variant="button"
                    color={
                      active
                        ? COLORS.surface
                        : colors.primary
                    }>
                    {category.label}
                  </Typography>

                </Pressable>
              );
            },
          )}

        </View>


        <View
          style={
            styles.listArea
          }>
          {renderContent()}
        </View>


        {!VARIANT.watermarkAtTop ? (
          <View
            style={
              styles.watermarkBottom
            }>
            {watermark}
          </View>
        ) : null}

      </View>


      <Modal
        visible={
          selectedProduct !==
          null
        }

        transparent

        animationType={
          VARIANT.modalAnimation
        }

        onRequestClose={
          handleCloseModal
        }>

        <View
          style={
            styles.modalBackdrop
          }>

          <View
            style={[
              styles.modalCard,

              {
                backgroundColor:
                  colors.surface,
              },
            ]}>

            <Typography
              variant="caption"
              color={
                colors.textLight
              }
              style={
                styles.modalStudent
              }>
              {studentLine}
            </Typography>


            {selectedProduct ? (
              <>
                <Image
                  source={{
                    uri:
                      selectedProduct.image,
                  }}
                  resizeMode="contain"
                  style={
                    styles.modalImage
                  }
                />


                <Typography
                  variant="subtitle"
                  numberOfLines={2}
                  style={
                    styles.modalTitle
                  }>
                  {selectedProduct.title}
                </Typography>


                <Typography
                  variant="subtitle"
                  color={
                    colors.primary
                  }>
                  {selectedProduct.price.toLocaleString(
                    'vi-VN',
                  )}{' '}
                  đ
                </Typography>


                <Typography
                  variant="caption"
                  color={
                    colors.textLight
                  }
                  style={
                    styles.modalCategory
                  }>
                  Danh mục:{' '}
                  {
                    selectedProduct.categoryLabel
                  }
                </Typography>


                <Typography
                  variant="body"
                  color={
                    colors.textLight
                  }
                  numberOfLines={2}
                  style={
                    styles.modalDescription
                  }>
                  {
                    selectedProduct.description
                  }
                </Typography>


                <View
                  style={
                    styles.quantityRow
                  }>

                  <Pressable
                    onPress={() =>
                      dispatchQuantity({
                        type: 'REMOVE',
                      })
                    }
                    style={[
                      styles.quantityButton,
                      {
                        borderColor:
                          colors.primary,
                      },
                    ]}>

                    <Typography
                      variant="subtitle"
                      color={
                        colors.primary
                      }>
                      −
                    </Typography>

                  </Pressable>


                  <Typography
                    variant="subtitle"
                    style={
                      styles.quantityText
                    }>
                    {quantity}
                  </Typography>


                  <Pressable
                    onPress={() =>
                      dispatchQuantity({
                        type: 'ADD',
                      })
                    }
                    style={[
                      styles.quantityButton,
                      styles.quantityAdd,

                      {
                        backgroundColor:
                          colors.primary,

                        borderColor:
                          colors.primary,
                      },
                    ]}>

                    <Typography
                      variant="subtitle"
                      color={
                        COLORS.surface
                      }>
                      +
                    </Typography>

                  </Pressable>

                </View>


                {isFinished ? (
                  <Typography
                    variant="caption"
                    color={
                      colors.error
                    }
                    style={
                      styles.expiredText
                    }>
                    Hết giờ flash-sale
                  </Typography>
                ) : null}


                <View
                  style={
                    styles.modalActions
                  }>

                  <ShopButton
                    title="Xác nhận đặt"
                    onPress={
                      handleConfirm
                    }
                    disabled={
                      isFinished
                    }
                  />


                  <View
                    style={
                      styles.closeButton
                    }>

                    <ShopButton
                      title="Đóng"
                      variant="outline"
                      onPress={
                        handleCloseModal
                      }
                    />

                  </View>
                </View>
              </>
            ) : null}

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}


const styles =
  StyleSheet.create({

    safeArea: {
      flex: 1,
    },


    container: {
      flex: 1,

      paddingHorizontal:
        SIZES.lg,

      paddingTop:
        SIZES.sm,
    },


    watermarkTop: {
      alignItems:
        'center',

      marginBottom:
        SIZES.sm,
    },


    header: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'flex-start',

      marginBottom:
        SIZES.lg,
    },


    headerRight: {
      alignItems:
        'flex-end',
    },


    themeButton: {
      minHeight: 40,

      borderWidth: 1,

      borderRadius:
        SIZES.radiusLg,

      justifyContent:
        'center',

      paddingHorizontal:
        SIZES.md,
    },


    flashText: {
      marginTop:
        SIZES.sm,
    },


    banner: {
      width: '100%',
      height: 130,

      marginTop:
        SIZES.md,

      borderRadius:
        SIZES.radiusLg,

      overflow: 'hidden',

      position:
        'relative',

      backgroundColor:
        COLORS.primary,
    },


    bannerPhoto: {
      position:
        'absolute',

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      width: '100%',
      height: '100%',
    },


    bannerOverlay: {
      position:
        'absolute',

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal:
        SIZES.lg,

      backgroundColor:
        'rgba(0, 0, 0, 0.12)',
    },


    bannerCaption: {
      marginTop:
        SIZES.xs,
    },


    categories: {
      flexDirection:
        'row',

      marginTop:
        SIZES.md,

      gap:
        SIZES.xs,
    },


    chip: {
      flex: 1,

      minHeight: 44,

      borderWidth: 1,

      borderRadius:
        SIZES.radiusMd,

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal:
        SIZES.xs,
    },


    listArea: {
      flex: 1,

      marginTop:
        SIZES.md,
    },


    listContent: {
      paddingBottom:
        SIZES.md,
    },


    productCard: {
      flexDirection:
        'row',

      alignItems:
        'center',

      borderRadius:
        SIZES.radiusLg,

      padding:
        SIZES.md,

      marginBottom:
        SIZES.sm,
    },


    imageBox: {
      width: 72,
      height: 72,

      borderRadius:
        SIZES.radiusMd,

      overflow:
        'hidden',

      alignItems:
        'center',

      justifyContent:
        'center',
    },


    productImage: {
      width: '88%',
      height: '88%',
    },


    productInfo: {
      flex: 1,

      marginLeft:
        SIZES.md,
    },


    price: {
      marginTop:
        SIZES.xs,

      marginBottom:
        SIZES.xs,
    },


    orderButton: {
      width: 62,

      marginLeft:
        SIZES.sm,
    },


    stateContainer: {
      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      padding:
        SIZES.xl,
    },


    stateText: {
      marginTop:
        SIZES.md,
    },


    errorText: {
      textAlign:
        'center',
    },


    retryButton: {
      marginTop:
        SIZES.md,

      minWidth: 120,
    },


    emptyList: {
      flexGrow: 1,

      alignItems:
        'center',

      justifyContent:
        'center',
    },


    watermarkBottom: {
      alignItems:
        'center',

      paddingVertical:
        SIZES.sm,
    },


    modalBackdrop: {
      flex: 1,

      backgroundColor:
        'rgba(0,0,0,0.45)',

      justifyContent:
        'center',

      alignItems:
        'center',

      padding:
        SIZES.xl,
    },


    modalCard: {
      width: '100%',

      maxWidth: 390,

      borderRadius:
        SIZES.radiusLg,

      padding:
        SIZES.xl,

      alignItems:
        'center',
    },


    modalStudent: {
      alignSelf:
        'stretch',

      textAlign:
        'center',

      marginBottom:
        SIZES.md,
    },


    modalImage: {
      width: 160,
      height: 160,
    },


    modalTitle: {
      marginTop:
        SIZES.md,

      textAlign:
        'center',
    },


    modalCategory: {
      marginTop:
        SIZES.sm,
    },


    modalDescription: {
      textAlign:
        'center',

      marginTop:
        SIZES.sm,
    },


    quantityRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop:
        SIZES.xl,
    },


    quantityButton: {
      width: 38,
      height: 38,

      borderWidth: 1,

      borderRadius:
        SIZES.radiusSm,

      alignItems:
        'center',

      justifyContent:
        'center',
    },


    quantityAdd: {
      marginLeft:
        SIZES.sm,
    },


    quantityText: {
      minWidth: 44,

      textAlign:
        'center',
    },


    expiredText: {
      marginTop:
        SIZES.md,

      textAlign:
        'center',
    },


    modalActions: {
      width: '100%',

      marginTop:
        SIZES.xl,
    },


    closeButton: {
      marginTop:
        SIZES.sm,
    },

  });