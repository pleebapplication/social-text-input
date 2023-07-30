import { Text } from 'react-native';
import { useEffect, useState } from "react";

export default function SocialText({
    style, children, highlights
}) {
    const [text, setText] = useState(children || '');

    useEffect(() => {
        setText(prepareText(children, style, highlights, 0));
    }, [children]);

    return <Text style={style}>{text}</Text>;
}

function prepareText(text, style, highlights, index) {
    const texts = [];
    const { regex, color, onPress } = highlights[index];
    const matches = text.match(regex);
    if (!matches) {
        if (index < highlights.length - 1) {
            texts.push(...prepareText(text, style, highlights, index + 1));
        } else {
            texts.push(<Text key={`${Math.random()}`} style={style}>{text}</Text>);
        }
        return texts;
    }
    matches.forEach((match) => {
        const indexOfMatch = text.indexOf(match);
        const beforeText = text.substring(0, indexOfMatch);
        text = text.substring(indexOfMatch + match.length, text.length);
        if (index < highlights.length - 1) {
            texts.push(...prepareText(beforeText, style, highlights, index + 1));
        } else {
            texts.push(<Text key={`${Math.random()}`} style={style}>{beforeText}</Text>);
        }
        texts.push(
            <Text
                style={[style, { color }]}
                key={`${Math.random()}`}
                onPress={() => onPress(match.trim())}
            >
                {match}
            </Text>
        );
    });
    if (text.length > 0) {
        if (index < highlights.length - 1) {
            texts.push(...prepareText(text, style, highlights, index + 1));
        } else {
            texts.push(<Text key={`${Math.random()}`} style={style}>{text}</Text>);
        }
    }
    return texts;
}
