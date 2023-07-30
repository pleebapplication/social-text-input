import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Platform, StatusBar, TextInput, TouchableHighlight, View } from "react-native";
import { initialWindowMetrics } from 'react-native-safe-area-context';

const MODAL_HEIGHT = Dimensions.get('screen').height - (Platform.OS === 'ios' ? StatusBar.currentHeight : 0);
const DEFAULT_MODAL_BACKGROUND_COLOR = '#FFFFFF'
const DEFAULT_MODAL_INDICATOR_COLOR = '#000000'

export default function SearchResultModal({
  show, onDismiss, onSelect, searchApiMethod, renderSearchResults, style, placeholder, placeholderColor, textInputStyle, pressUnderlayColor, usernameExtractor
}) {
    const modalRef = useRef();
    const textRef = useRef();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (show) {
            setTimeout(() => textRef.current?.focus(), 200);
            modalRef.current?.present();
        } else {
            modalRef.current?.dismiss();
        }
    }, [show]);

    useEffect(() => {
        if (searchText.length > 0) {
            return searchApiMethod(searchText)
                .then((searchResultArray) => setSearchResults(searchResultArray))
                .catch(console.error);
        }
        return setSearchResults([]);
    }, [searchText])

    const onDismissModal = () => {
        setSearchText('');
        onDismiss();
    };

    const bottomSheetDrop = (props) => {
        return <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
        />
    }

    return (
        <BottomSheetModal
            ref={modalRef}
            backgroundStyle={{ backgroundColor: style.backgroundColor || DEFAULT_MODAL_BACKGROUND_COLOR }}
            handleIndicatorStyle={{ backgroundColor: style.indicatorColor || DEFAULT_MODAL_INDICATOR_COLOR }}
            snapPoints={[MODAL_HEIGHT]}
            onDismiss={onDismissModal}
            enablePanDownToClose
            backdropComponent={bottomSheetDrop}
        >
            <View style={{
                flex: 1,
                alignItems: 'center',
                paddingBottom: initialWindowMetrics.insets.bottom,
            }}
            >
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: 'transparent',
                    borderWidth: 0.6,
                }}
                >
                    <TextInput
                        ref={textRef}
                        autoComplete="name"
                        placeholder={placeholder}
                        placeholderTextColor={placeholderColor}
                        onChangeText={setSearchText}
                        maxLength={50}
                        blurOnSubmit={false}
                        defaultValue={searchText}
                        style={{ ...textInputStyle, height: 46 }}
                    />
                </View>
                <View style={{ width: '100%', flex: 1 }}>
                    <FlatList
                        data={searchResults}
                        renderItem={({ item }) => (
                            <TouchableHighlight
                                underlayColor={pressUnderlayColor}
                                onPress={() => onSelect(usernameExtractor(item))}
                            >
                                {renderSearchResults()}
                            </TouchableHighlight>
                        )}
                    />
                </View>
            </View>
        </BottomSheetModal>
    );
}
