import { useEffect, useRef, useState } from "react";
import { FlatList, Platform, StatusBar, TextInput, TouchableHighlight, View, Modal } from "react-native";
import { initialWindowMetrics } from 'react-native-safe-area-context';

export default function SearchResultModal({
  show, onDismiss, onSelect, searchApiMethod, renderSearchResults, style, placeholder, placeholderColor, textInputStyle, pressUnderlayColor, usernameExtractor
}) {
    const textRef = useRef();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

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

    return (
        <Modal
            onDismiss={onDismissModal}
            onRequestClose={onDismissModal}
            style={{ backgroundColor: 'transparent' }}
            visible={show}
            animationType={'slide'}
        >
            <View style={{
                ...style,
                flex: 1,
                alignItems: 'center',
                paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
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
        </Modal>
    );
}
