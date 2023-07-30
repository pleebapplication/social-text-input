import SearchResultModal from "./SearchResultModal";
import SocialText from "./SocialText";
import {TextInput, View} from "react-native";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";

const SocialTextInput = forwardRef(({
    showSearchModal, ...props
}, ref) => {
    const [searchModalVisibility, setSearchModalVisibility] = useState(false);
    const [text, setText] = useState('');
    const textInputRef = useRef();
    const textRef = useRef('');
    const positionRef = useRef(0);
    const previousPositionRef = useRef(-1);

    const setCurrentText = (currentText) => {
        textRef.current = currentText;
        setText(currentText);
    };

    const setCurrentPosition = ({ nativeEvent: { selection: { start } } }) => {
        previousPositionRef.current = positionRef.current;
        positionRef.current = start;
        setSearchModalVisibility(checkMention());
    };

    const checkMention = () => {
        if (!showSearchModal) return false;
        if (textRef.current?.length === 0 || positionRef.current === 0) return false;
        return positionRef.current === textRef.current?.length
            && (textRef.current?.length > 1
                    ? textRef.current?.substring(positionRef.current - 2, positionRef.current) === ' @'
                    : textRef.current?.substring(positionRef.current - 1, positionRef.current) === '@'
            ) && previousPositionRef.current < positionRef.current;
    };

    const onDismissModal = () => {
        setSearchModalVisibility(false);
        textInputRef?.current?.focus();
    };

    const onSelect = (username) => {
        const startsWithAt = username.startsWith('@');
        const newText = `${textRef.current?.substring(0, positionRef.current - (startsWithAt ? 1 : 0))}${username} ${textRef.current?.substring(positionRef.current, textRef.current?.length)}`;
        setCurrentText(newText);

    };
    useImperativeHandle(ref, () => ({
        getText() {
            return text;
        },
    }));

    return (
        <View style={style}>
            <SearchResultModal
                show={searchModalVisibility}
                onDismissModal={onDismissModal}
                onSelect={onSelect}
            />
            <TextInput
                onChangeText={setCurrentText}
                ref={textInputRef}
                onSelectionChange={setCurrentPosition}
                {...props}
            >
                <SocialText>{text}</SocialText>
            </TextInput>
        </View>
    );
});

export default SocialTextInput;
